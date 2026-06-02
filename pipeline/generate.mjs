#!/usr/bin/env node
// Email campaign pipeline orchestrator.
// Drives the LOCAL Claude Code CLI (`claude -p`, headless) to:
//   stage 1 (research)   -> research.json + brand-intake.md   per brand
//   stage 2 (campaigns)  -> campaigns.json                    per brand
//   stage 3 (emails)     -> emails/<campaignId>/<emailId>.html per email
// Then writes clients/manifest.json indexing all brands.
//
// Usage:
//   node pipeline/generate.mjs brands.csv [--stage all|research|campaigns|emails]
//        [--brand <slug>] [--concurrency 3] [--force]
//
// No API key required: auth comes from your local Claude Code session.

import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, ".."); // project root (holds playbook md files)
const CLIENTS_DIR = path.join(ROOT, "clients");
const PLAYBOOK = path.join(ROOT, "non-ecom-email-playbook.md");
const BENCHMARKS = path.join(ROOT, "benchmarks-and-sources.md");
const WORKSHEET = path.join(ROOT, "brand-intake-worksheet.md");

// Per-stage model. Sonnet is plenty for research + HTML; Opus for strategy.
const MODELS = { research: "sonnet", campaigns: "opus", emails: "sonnet" };
// Per-stage timeout (ms).
const TIMEOUTS = { research: 360000, campaigns: 300000, emails: 240000 };

// ---------- args ----------
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    stage: { type: "string", default: "all" },
    brand: { type: "string" },
    concurrency: { type: "string", default: "3" },
    force: { type: "boolean", default: false },
  },
});
const csvPath = positionals[0] || "brands.csv";
const CONCURRENCY = Math.max(1, parseInt(values.concurrency, 10) || 3);

// ---------- tiny CSV parser (quoted fields, commas, CRLF) ----------
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function slugify(s) {
  return s.toLowerCase().trim()
    .replace(/^https?:\/\//, "").replace(/^www\./, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function readBrands(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error("CSV is empty");
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const urlIdx = header.findIndex((h) => h.includes("url") || h.includes("website") || h.includes("link"));
  const nameIdx = header.findIndex((h) => h.includes("name") || h.includes("brand"));
  const vertIdx = header.findIndex((h) => h.includes("vertical") || h.includes("industry") || h.includes("category"));
  const noteIdx = header.findIndex((h) => h.includes("note") || h.includes("info") || h.includes("context"));
  // If no header row detected (first cell is a URL), treat all rows as data with col 0 = url.
  const hasHeader = urlIdx !== -1 || nameIdx !== -1;
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const ui = urlIdx === -1 ? 0 : urlIdx;
  return dataRows.map((r) => {
    const url = (r[ui] || "").trim();
    const name = (nameIdx !== -1 ? r[nameIdx] : "").trim() || domainOf(url);
    return {
      url,
      name,
      slug: slugify(name || url),
      vertical: (vertIdx !== -1 ? r[vertIdx] : "").trim(),
      notes: (noteIdx !== -1 ? r[noteIdx] : "").trim(),
    };
  }).filter((b) => /^https?:\/\//.test(b.url));
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

// ---------- claude runner ----------
function runClaude(prompt, { cwd, allowedTools, model, timeout }) {
  return new Promise((resolve) => {
    const args = [
      "-p", prompt,
      "--allowedTools", allowedTools,
      "--permission-mode", "acceptEdits",
      "--add-dir", ROOT,
      "--model", model,
      "--output-format", "json",
    ];
    const child = spawn("claude", args, { cwd, env: process.env });
    let out = "", err = "";
    const timer = setTimeout(() => { child.kill("SIGKILL"); }, timeout);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", (code) => {
      clearTimeout(timer);
      let result = null, isError = code !== 0;
      try {
        const json = JSON.parse(out.trim().split("\n").pop());
        result = json.result;
        isError = isError || json.is_error;
      } catch { /* leave as raw */ }
      resolve({ ok: !isError, result, raw: out, err, code });
    });
    child.on("error", (e) => { clearTimeout(timer); resolve({ ok: false, err: String(e), code: -1 }); });
  });
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

// ---------- prompts ----------
const researchPrompt = (b) => `You are researching a brand for an email-marketing engagement.
Brand: ${b.name}
Primary URL: ${b.url}
${b.vertical ? `Vertical (hint): ${b.vertical}` : ""}
${b.notes ? `Known context: ${b.notes}` : ""}

STEPS:
1. Use WebFetch to read the homepage and 3-6 important pages (about, products/services, pricing/plans, booking/contact, blog). If WebFetch is blocked or thin, use WebSearch to fill gaps. Do not invent facts; use "unknown" where you cannot verify.
2. Read the intake worksheet with the Read tool: ${WORKSHEET}

THEN write TWO files in the current working directory:

A) research.json  — valid JSON, EXACTLY this shape:
{
  "brand": {"name": "", "url": "${b.url}", "slug": "${b.slug}", "vertical": "", "tagline": "",
            "colors": {"primary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex"}},
  "offer": {"what": "", "coreOutcome": "", "pricePoint": "", "commitment": "", "leadMagnets": []},
  "audience": {"icp": "", "painPoints": [], "segments": []},
  "salesCycle": {"length": "", "trial": "", "closeMechanism": "", "topObjection": ""},
  "ahaMoment": "",
  "retention": {"recurring": "", "expansion": "", "churnRisk": ""},
  "lifecycleGaps": [],
  "toneVoice": "",
  "compliance": ""
}
Infer the brand's real color palette (hex) from its site; if truly unknown use tasteful defaults that fit the vertical.

B) brand-intake.md — a readable, filled-in intake following the worksheet's sections.

Reply with only DONE when both files exist.`;

const campaignsPrompt = (b) => `You are designing an email campaign program for a NON-ECOMMERCE brand using a fixed playbook.

Read these files first (Read tool):
- ${PLAYBOOK}   (the 7 backbone campaigns, specs, and the priority/"where to start" logic)
- ${BENCHMARKS} (benchmarks to ground choices)
- ./research.json and ./brand-intake.md  (this brand's profile)

Then decide which backbone campaigns to build for THIS brand and in what priority order, and design each email.

Write ONE file: campaigns.json — VALID JSON, no comments, no trailing commas, EXACTLY this schema:
{
  "brand": {"name":"","slug":"${b.slug}","url":"${b.url}","vertical":"",
            "colors":{"primary":"#hex","accent":"#hex","background":"#hex","text":"#hex"}},
  "campaigns": [
    {
      "id": "kebab-case-id",
      "name": "",
      "priority": 1,
      "stage": "",
      "objective": "",
      "trigger": "",
      "segment": "",
      "rationale": "why this campaign matters for THIS brand",
      "emails": [
        {"id":"email-1","order":1,"day":"0","purpose":"","subject":"","preview":"","cta":"","keyPoints":["",""]}
      ]
    }
  ]
}

RULES:
- 4 to 6 campaigns, ordered by priority (1 = build first), using the playbook's "where to start" logic.
- 3 to 6 emails per campaign.
- Subjects and previews must be SPECIFIC to this brand and its audience — never placeholders.
- Pull brand colors from research.json.
Reply with only DONE when campaigns.json is written.`;

const emailPrompt = (b, camp, email, colors) => `Generate ONE responsive HTML marketing email for the brand "${b.name}".

For voice and detail, you may Read ./brand-intake.md and ./campaigns.json.

Brand colors: primary ${colors.primary}, accent ${colors.accent}, background ${colors.background}, text ${colors.text}.

THIS EMAIL:
- Campaign: ${camp.name} — ${camp.objective}
- Subject: ${email.subject}
- Preview/preheader: ${email.preview}
- Purpose: ${email.purpose}
- Primary CTA: ${email.cta}
- Key points: ${(email.keyPoints || []).join(" | ")}

REQUIREMENTS:
- One standalone, email-safe HTML document: table-based layout, INLINE CSS, max-width 600px, web-safe fonts, a bulletproof (table/VML) button for the CTA, hidden preheader text using the preview, dark-mode friendly, responsive via a media query.
- Real copy in the brand's voice. No Lorem ipsum, no [square-bracket placeholders] except a real merge tag like {{first_name}} where natural.
- Use the brand colors above.
- Footer: unsubscribe link + physical-address placeholder. If the brand is regulated (insurance/finance/health), add a one-line compliance disclaimer.

Write the file to: emails/${camp.id}/${email.id}.html
Reply with only DONE when the file is written.`;

// ---------- stages ----------
async function stageResearch(b, dir) {
  const done = existsSync(path.join(dir, "research.json")) && existsSync(path.join(dir, "brand-intake.md"));
  if (done && !values.force) { console.log(`  [research] skip (exists)`); return true; }
  const r = await runClaude(researchPrompt(b), {
    cwd: dir, allowedTools: "WebFetch WebSearch Read Write", model: MODELS.research, timeout: TIMEOUTS.research,
  });
  const ok = existsSync(path.join(dir, "research.json"));
  console.log(`  [research] ${ok ? "ok" : "FAILED"} (${r.result?.slice(0, 40) ?? r.err?.slice(0, 80) ?? "?"})`);
  return ok;
}

async function stageCampaigns(b, dir) {
  const f = path.join(dir, "campaigns.json");
  if (existsSync(f) && !values.force) { console.log(`  [campaigns] skip (exists)`); return true; }
  const r = await runClaude(campaignsPrompt(b), {
    cwd: dir, allowedTools: "Read Write", model: MODELS.campaigns, timeout: TIMEOUTS.campaigns,
  });
  const ok = existsSync(f);
  console.log(`  [campaigns] ${ok ? "ok" : "FAILED"} (${r.result?.slice(0, 40) ?? r.err?.slice(0, 80) ?? "?"})`);
  return ok;
}

async function stageEmails(b, dir) {
  const f = path.join(dir, "campaigns.json");
  if (!existsSync(f)) { console.log(`  [emails] no campaigns.json — run campaigns first`); return false; }
  let data;
  try { data = JSON.parse(await readFile(f, "utf8")); }
  catch (e) { console.log(`  [emails] campaigns.json invalid JSON: ${e.message}`); return false; }
  const colors = data.brand?.colors || { primary: "#1a1a1a", accent: "#0066ff", background: "#f4f4f5", text: "#1a1a1a" };
  const jobs = [];
  for (const camp of data.campaigns || []) {
    for (const email of camp.emails || []) {
      jobs.push({ camp, email });
    }
  }
  console.log(`  [emails] generating ${jobs.length} emails (concurrency ${CONCURRENCY})...`);
  let okCount = 0;
  await mapLimit(jobs, CONCURRENCY, async ({ camp, email }) => {
    const outFile = path.join(dir, "emails", camp.id, `${email.id}.html`);
    if (existsSync(outFile) && !values.force) { okCount++; return; }
    const r = await runClaude(emailPrompt(b, camp, email, colors), {
      cwd: dir, allowedTools: "Read Write", model: MODELS.emails, timeout: TIMEOUTS.emails,
    });
    const ok = existsSync(outFile);
    if (ok) okCount++;
    console.log(`    ${ok ? "✓" : "✗"} ${camp.id}/${email.id}`);
  });
  console.log(`  [emails] ${okCount}/${jobs.length} written`);
  return okCount > 0;
}

async function writeManifest(brands) {
  const entries = [];
  for (const b of brands) {
    const f = path.join(CLIENTS_DIR, b.slug, "campaigns.json");
    if (!existsSync(f)) continue;
    try {
      const data = JSON.parse(await readFile(f, "utf8"));
      entries.push({
        slug: b.slug, name: data.brand?.name || b.name, url: b.url,
        vertical: data.brand?.vertical || b.vertical,
        campaignCount: (data.campaigns || []).length,
        emailCount: (data.campaigns || []).reduce((n, c) => n + (c.emails || []).length, 0),
      });
    } catch { /* skip */ }
  }
  await writeFile(path.join(CLIENTS_DIR, "manifest.json"), JSON.stringify({ brands: entries, generatedAt: new Date().toISOString() }, null, 2));
  console.log(`\nmanifest.json written (${entries.length} brands).`);
}

// ---------- main ----------
async function main() {
  const csvText = await readFile(path.resolve(ROOT, csvPath), "utf8");
  let brands = readBrands(csvText);
  if (values.brand) brands = brands.filter((b) => b.slug === values.brand);
  if (!brands.length) { console.error("No valid brands found in CSV."); process.exit(1); }
  await mkdir(CLIENTS_DIR, { recursive: true });

  console.log(`Pipeline: ${brands.length} brand(s), stage="${values.stage}", concurrency=${CONCURRENCY}\n`);
  const stages = values.stage === "all" ? ["research", "campaigns", "emails"] : [values.stage];

  for (const b of brands) {
    const dir = path.join(CLIENTS_DIR, b.slug);
    await mkdir(dir, { recursive: true });
    console.log(`● ${b.name}  (${b.slug})`);
    if (stages.includes("research")) await stageResearch(b, dir);
    if (stages.includes("campaigns")) await stageCampaigns(b, dir);
    if (stages.includes("emails")) await stageEmails(b, dir);
  }
  await writeManifest(brands);
  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
