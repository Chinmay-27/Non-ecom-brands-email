"use client";

import { useState, useRef } from "react";
import type { BrandSummary, CampaignsFile, Campaign, EmailSpec } from "@/lib/data";

type Selected = { campaign: Campaign; email: EmailSpec } | null;

const DEVICE = { desktop: 600, mobile: 375 };

export default function Viewer({
  brands,
  selectedSlug,
  campaigns,
}: {
  brands: BrandSummary[];
  selectedSlug: string | null;
  campaigns: CampaignsFile | null;
}) {
  const firstEmail: Selected =
    campaigns?.campaigns?.[0]?.emails?.[0]
      ? { campaign: campaigns.campaigns[0], email: campaigns.campaigns[0].emails[0] }
      : null;
  const [selected, setSelected] = useState<Selected>(firstEmail);
  const [device, setDevice] = useState<keyof typeof DEVICE>("desktop");
  const [frameH, setFrameH] = useState(900);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fit = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      const h = doc?.body?.scrollHeight;
      if (h) setFrameH(Math.max(400, h));
    } catch { /* cross-origin guard */ }
  };

  const src =
    selected && selectedSlug
      ? `/api/email/${selectedSlug}/${selected.campaign.id}/${selected.email.id}`
      : null;

  return (
    <div className="app">
      {/* Column 1: brands */}
      <div className="col">
        <div className="col-head">
          BRANDS
          <small>{brands.length} in this batch</small>
        </div>
        {brands.length === 0 && (
          <div className="col-pad codeish">
            No brands yet. Run the pipeline:<br />
            <br />node pipeline/generate.mjs brands.csv
          </div>
        )}
        {brands.map((b) => (
          <a
            key={b.slug}
            href={`/?brand=${b.slug}`}
            className={`brand-item ${b.slug === selectedSlug ? "active" : ""}`}
          >
            <div className="name">{b.name}</div>
            <div className="meta">
              {b.vertical ? <span className="pill">{b.vertical}</span> : null}
              {b.campaignCount ?? 0} campaigns · {b.emailCount ?? 0} emails
            </div>
          </a>
        ))}
      </div>

      {/* Column 2: campaigns + emails */}
      <div className="col">
        <div className="col-head">
          CAMPAIGN IDEAS
          <small>{campaigns?.brand?.name ?? "—"}</small>
        </div>
        {!campaigns && <div className="col-pad codeish">No campaigns.json for this brand yet.</div>}
        {campaigns?.campaigns?.map((c) => (
          <div className="campaign" key={c.id}>
            <div className="campaign-head">
              <div className="row">
                <span className="prio">{c.priority}</span>
                <span className="cname">{c.name}</span>
              </div>
              {c.objective && <div className="obj">{c.objective}</div>}
              {c.rationale && <div className="rationale">“{c.rationale}”</div>}
              {c.trigger && <div className="trigger">Trigger: {c.trigger}</div>}
            </div>
            {c.emails?.map((e) => {
              const on = selected?.email === e && selected?.campaign === c;
              return (
                <div
                  key={e.id}
                  className={`email-row ${on ? "active" : ""}`}
                  onClick={() => setSelected({ campaign: c, email: e })}
                >
                  <div className="subject">{e.subject}</div>
                  <div className="preview">{e.preview}</div>
                  <div className="tags">
                    <span className="tag-day">Day {e.day}</span>
                    {e.cta && <span className="tag-cta">→ {e.cta}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Column 3: preview */}
      <div className="preview-pane">
        <div className="preview-bar">
          <span className="subj">{selected ? selected.email.subject : "Select an email"}</span>
          <div className="toggle">
            <button className={device === "desktop" ? "on" : ""} onClick={() => setDevice("desktop")}>
              Desktop
            </button>
            <button className={device === "mobile" ? "on" : ""} onClick={() => setDevice("mobile")}>
              Mobile
            </button>
          </div>
        </div>

        {src ? (
          <>
            <div className="preview-stage">
              <div className="frame-wrap" style={{ width: DEVICE[device], height: frameH }}>
                <iframe
                  key={src}
                  ref={iframeRef}
                  src={src}
                  sandbox="allow-same-origin"
                  title="email preview"
                  onLoad={fit}
                />
              </div>
            </div>
            {selected?.email?.keyPoints?.length ? (
              <div className="keypoints">
                <b>Purpose:</b> {selected.email.purpose} &nbsp;·&nbsp; <b>CTA:</b> {selected.email.cta}
              </div>
            ) : null}
          </>
        ) : (
          <div className="empty">
            <div>
              <h2>No email selected</h2>
              <p className="codeish">Pick a brand and an email from the campaign list.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
