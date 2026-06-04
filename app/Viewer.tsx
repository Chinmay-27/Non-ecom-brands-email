"use client";

import { useState, useRef, useEffect } from "react";
import type { BrandSummary, CampaignsFile } from "@/lib/data";

const DEVICE = { desktop: 600, mobile: 375 };

// Map campaign id + name → canonical type tag
const CAMPAIGN_TYPES: { label: string; pattern: RegExp; color: string }[] = [
  { label: "Welcome & Onboarding", pattern: /welcome|onboard/,               color: "#3ecf8e" },
  { label: "Win-Back",             pattern: /win.back|re.engag|reengag/,      color: "#f97316" },
  { label: "Lead Nurture",         pattern: /lead.magnet|nurture|drip/,       color: "#a78bfa" },
  { label: "Newsletter",           pattern: /newsletter|value.news|journal/,  color: "#38bdf8" },
  { label: "Retention",            pattern: /retention|renewal|expansion|anniversary|upgrade|loyalty/, color: "#facc15" },
  { label: "Booking",              pattern: /booking|reminder|no.show|appointment|confirmation/, color: "#fb7185" },
  { label: "Referral",             pattern: /referral|advocacy|review|ugc/,   color: "#e879f9" },
  { label: "Conversion",           pattern: /consult|quote|conversion|trial|free.to.paid|purchase|proposal/, color: "#60a5fa" },
];

function getCampaignType(id: string, name: string) {
  const text = `${id} ${name}`.toLowerCase();
  return CAMPAIGN_TYPES.find((t) => t.pattern.test(text))
    ?? { label: "Campaign", color: "#9aa0ad" };
}

export default function Viewer({
  brands,
  selectedSlug,
  campaigns,
}: {
  brands: BrandSummary[];
  selectedSlug: string | null;
  campaigns: CampaignsFile | null;
}) {
  const [activeCampId, setActiveCampId] = useState<string | null>(
    campaigns?.campaigns?.[0]?.id ?? null
  );
  const [device, setDevice] = useState<keyof typeof DEVICE>("desktop");
  const [frameH, setFrameH] = useState(1000);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setActiveCampId(campaigns?.campaigns?.[0]?.id ?? null);
    setFrameH(1000);
  }, [selectedSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCamp = campaigns?.campaigns.find((c) => c.id === activeCampId) ?? null;
  const activeEmail = activeCamp?.emails?.[0] ?? null;

  const previewSrc =
    activeEmail && activeCamp && selectedSlug
      ? `/api/email/${selectedSlug}/${activeCamp.id}/${activeEmail.id}`
      : null;

  const fit = () => {
    try {
      const h = iframeRef.current?.contentDocument?.body?.scrollHeight;
      if (h) setFrameH(Math.max(500, h));
    } catch { /* sandboxed */ }
  };

  const brand = campaigns?.brand;
  const primaryColor = brand?.colors?.primary ?? "#6d8cff";

  return (
    <div className="app">

      {/* ── Col 1: Brand list ─────────────────────── */}
      <div className="col">
        <div className="col-head">
          Brands
          <small>{brands.length} in batch</small>
        </div>
        {brands.length === 0 && (
          <div className="col-pad codeish">
            No brands yet.<br /><br />
            node pipeline/generate.mjs brands.csv
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
              {b.campaignCount ?? 0} campaigns
            </div>
          </a>
        ))}
      </div>

      {/* ── Col 2: Overview + 5 Campaign Cards ───── */}
      <div className="col">
        <div className="col-head">
          Campaign Ideas
          <small>{brand?.name ?? "Select a brand"}</small>
        </div>

        {!campaigns ? (
          <div className="col-pad codeish">No data for this brand yet.</div>
        ) : (
          <>
            {campaigns.summary && (
              <div className="overview-card">
                <div className="ov-name">
                  <span className="ov-dot" style={{ background: primaryColor }} />
                  {brand?.name}
                </div>
                <div className="ov-text">{campaigns.summary}</div>
                {brand?.vertical && (
                  <div className="ov-tags">
                    <span className="ov-tag">{brand.vertical}</span>
                  </div>
                )}
              </div>
            )}

            <div className="camp-section-head">5 Campaigns</div>
            {campaigns.campaigns.map((c) => {
              const isActive = c.id === activeCampId;
              const email = c.emails?.[0];
              const type = getCampaignType(c.id, c.name);
              return (
                <div
                  key={c.id}
                  className={`camp-card ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setActiveCampId(c.id);
                    setFrameH(1000);
                  }}
                >
                  <div className="camp-card-head">
                    <span className="prio">{c.priority}</span>
                    <div className="camp-card-info">
                      <div className="camp-card-name">{c.name}</div>
                      <div className="camp-card-obj">{c.objective}</div>
                      {email && (
                        <div className="camp-card-subject">{email.subject}</div>
                      )}
                      <div className="camp-card-meta">
                        <span
                          className="type-tag"
                          style={{ color: type.color, borderColor: type.color + "44" }}
                        >
                          {type.label}
                        </span>
                        {c.stage && <span className="stage-tag">{c.stage}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ── Col 3: Campaign idea + email preview ─── */}
      <div className="right-pane">
        {!activeCamp ? (
          <div className="empty-pane">
            <div>
              <h3>Select a campaign</h3>
              <p>Pick one of the 5 options on the left to see the idea and email.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="idea-panel">
              <div className="ip-label">Campaign Idea</div>
              <div className="ip-name">
                <span className="prio">{activeCamp.priority}</span>
                {activeCamp.name}
              </div>
              {(() => {
                const t = getCampaignType(activeCamp.id, activeCamp.name);
                return (
                  <span className="type-tag ip-type-tag" style={{ color: t.color, borderColor: t.color + "44" }}>
                    {t.label}
                  </span>
                );
              })()}
              <div className="ip-obj">{activeCamp.objective}</div>

              <div className="idea-meta-grid">
                {activeCamp.trigger && (
                  <div className="idea-meta-item">
                    <div className="imk">Trigger</div>
                    <div className="imv">{activeCamp.trigger}</div>
                  </div>
                )}
                {activeCamp.segment && (
                  <div className="idea-meta-item">
                    <div className="imk">Segment</div>
                    <div className="imv">{activeCamp.segment}</div>
                  </div>
                )}
              </div>

              {activeCamp.rationale && (
                <div className="idea-rationale">"{activeCamp.rationale}"</div>
              )}
            </div>

            {previewSrc && activeEmail ? (
              <>
                <div className="preview-bar">
                  <span className="subj">{activeEmail.subject}</span>
                  <div className="toggle">
                    <button
                      className={device === "desktop" ? "on" : ""}
                      onClick={() => setDevice("desktop")}
                    >
                      Desktop
                    </button>
                    <button
                      className={device === "mobile" ? "on" : ""}
                      onClick={() => setDevice("mobile")}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
                <div className="preview-stage">
                  <div
                    className="frame-wrap"
                    style={{ width: DEVICE[device], height: frameH }}
                  >
                    <iframe
                      key={previewSrc}
                      ref={iframeRef}
                      src={previewSrc}
                      sandbox="allow-same-origin"
                      title="email preview"
                      onLoad={fit}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-pane">
                <div>
                  <h3>Email not generated yet</h3>
                  <p className="codeish">
                    node pipeline/generate.mjs brands.csv --stage emails
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
