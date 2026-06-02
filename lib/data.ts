import { promises as fs } from "fs";
import path from "path";

// clients/ lives at the repo root alongside the Next.js app.
const CLIENTS = path.join(process.cwd(), "clients");

export type EmailSpec = {
  id: string;
  order: number;
  day: string;
  purpose: string;
  subject: string;
  preview: string;
  cta: string;
  keyPoints?: string[];
};

export type Campaign = {
  id: string;
  name: string;
  priority: number;
  stage?: string;
  objective: string;
  trigger?: string;
  segment?: string;
  rationale?: string;
  emails: EmailSpec[];
};

export type BrandColors = {
  primary?: string;
  accent?: string;
  background?: string;
  text?: string;
};

export type CampaignsFile = {
  brand: { name: string; slug: string; url: string; vertical?: string; colors?: BrandColors };
  summary?: string;   // short overview of what the company does — from research.json or campaigns.json
  campaigns: Campaign[];
};

export type BrandSummary = {
  slug: string;
  name: string;
  url?: string;
  vertical?: string;
  campaignCount?: number;
  emailCount?: number;
};

const safe = (s: string) => /^[a-z0-9._-]+$/i.test(s);

export async function listBrands(): Promise<BrandSummary[]> {
  // Prefer manifest, fall back to scanning client folders.
  try {
    const m = JSON.parse(await fs.readFile(path.join(CLIENTS, "manifest.json"), "utf8"));
    if (Array.isArray(m.brands) && m.brands.length) return m.brands;
  } catch { /* fall through */ }

  const out: BrandSummary[] = [];
  let dirs: string[] = [];
  try { dirs = await fs.readdir(CLIENTS); } catch { return out; }
  for (const d of dirs) {
    try {
      const c: CampaignsFile = JSON.parse(await fs.readFile(path.join(CLIENTS, d, "campaigns.json"), "utf8"));
      out.push({
        slug: d,
        name: c.brand?.name || d,
        url: c.brand?.url,
        vertical: c.brand?.vertical,
        campaignCount: c.campaigns?.length || 0,
        emailCount: (c.campaigns || []).reduce((n, x) => n + (x.emails || []).length, 0),
      });
    } catch { /* not a generated brand dir */ }
  }
  return out;
}

export async function getCampaigns(slug: string): Promise<CampaignsFile | null> {
  if (!safe(slug)) return null;
  try {
    const c: CampaignsFile = JSON.parse(await fs.readFile(path.join(CLIENTS, slug, "campaigns.json"), "utf8"));

    // Sort + cap at 5 campaigns; take only 1 email per campaign (the first by order)
    c.campaigns = (c.campaigns || [])
      .sort((a, b) => (a.priority || 99) - (b.priority || 99))
      .slice(0, 5);
    for (const camp of c.campaigns) {
      const sorted = (camp.emails || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      camp.emails = sorted.slice(0, 1);
    }

    // Build summary from research.json if not already in campaigns.json
    if (!c.summary) {
      try {
        const r = JSON.parse(await fs.readFile(path.join(CLIENTS, slug, "research.json"), "utf8"));
        const parts: string[] = [];
        if (r.offer?.what)          parts.push(r.offer.what);
        if (r.offer?.coreOutcome)   parts.push(r.offer.coreOutcome + ".");
        if (r.audience?.icp)        parts.push(`Audience: ${r.audience.icp}.`);
        if (parts.length) c.summary = parts.join(" ");
      } catch { /* research.json not yet generated — summary stays undefined */ }
    }

    return c;
  } catch { return null; }
}

export async function getEmailHtml(slug: string, campaign: string, email: string): Promise<string | null> {
  if (![slug, campaign, email].every(safe)) return null;
  try {
    return await fs.readFile(path.join(CLIENTS, slug, "emails", campaign, `${email}.html`), "utf8");
  } catch { return null; }
}

export async function getIntake(slug: string): Promise<string | null> {
  if (!safe(slug)) return null;
  try { return await fs.readFile(path.join(CLIENTS, slug, "brand-intake.md"), "utf8"); }
  catch { return null; }
}
