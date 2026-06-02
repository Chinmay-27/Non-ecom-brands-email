"use client";

import { useState, useRef, useEffect } from "react";
import type { BrandSummary, CampaignsFile, Campaign, EmailSpec } from "@/lib/data";

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
  const [activeCampId, setActiveCampId] = useState<string | null>(
    campaigns?.campaigns?.[0]?.id ?? null
  );
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);
  const [device, setDevice] = useState<keyof typeof DEVICE>("desktop");
  const [frameH, setFrameH] = useState(1000);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset active states when brand changes
  useEffect(() => {
    setActiveCampId(campaigns?.campaigns?.[0]?.id ?? null);
    setActiveEmailId(null);
  }, [selectedSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCamp = campaigns?.campaigns.find((c) => c.id === activeCampId) ?? null;
  const activeEmail = activeCamp?.emails.find((e) => e.id === activeEmailId) ?? null;

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
            {/* Company overview note */}
            {campaigns.summary && (
              <div className="overview-card">
                <div className="ov-name">
                  <span
                    className="ov-dot"
                    style={{ background: primaryColor }}
                  />
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

            {/* 5 campaign option cards */}
            <div className="camp-section-head">5 Campaigns</div>
            {campaigns.campaigns.map((c) => {
              const isActive = c.id === activeCampId;
              return (
                <div key={c.id}>
                  <div
                    className={`camp-card ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveCampId(c.id);
                      setActiveEmailId(null);
                    }}
                  >
                    <div className="camp-card-head">
                      <span className="prio">{c.priority}</span>
                      <div className="camp-card-info">
                        <div className="camp-card-name">{c.name}</div>
                        <div className="camp-card-obj">{c.objective}</div>
                        <div className="camp-card-meta">
                          {c.stage && <span className="stage-tag">{c.stage}</span>}
                          <span className="email-count-tag">
                            {c.emails.length} emails
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Email accordion — visible when this campaign is active */}
                    {isActive && c.emails.length > 0 && (
                      <div className="camp-emails">
                        {c.emails.map((e) => (
                          <div
                            key={e.id}
                            className={`camp-email-row ${e.id === activeEmailId ? "active" : ""}`}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setActiveEmailId(e.id === activeEmailId ? null : e.id);
                              setFrameH(1000);
                            }}
                          >
                            <div className="er-subject">{e.subject}</div>
                            <div className="er-preview">{e.preview}</div>
                            <span className="er-day">Day {e.day}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ── Col 3: Campaign idea + emails / preview ─ */}
      <div className="right-pane">
        {!activeCamp ? (
          <div className="empty-pane">
            <div>
              <h3>Select a campaign</h3>
              <p>Pick one of the 5 options on the left to see the idea and emails.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Campaign idea panel — always visible */}
            <div className="idea-panel">
              <div className="ip-label">Campaign Idea</div>
              <div className="ip-name">
                <span className="prio">{activeCamp.priority}</span>
                {activeCamp.name}
              </div>
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

            {/* Email preview or email list */}
            {previewSrc && activeEmail ? (
              <>
                <div className="preview-bar">
                  <button
                    className="back-btn"
                    onClick={() => setActiveEmailId(null)}
                  >
                    ← Emails
                  </button>
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
              <div className="email-list">
                <div className="email-list-head">
                  {activeCamp.emails.length} Emails — click to preview
                </div>
                {activeCamp.emails.map((e) => (
                  <div
                    key={e.id}
                    className="email-list-row"
                    onClick={() => {
                      setActiveEmailId(e.id);
                      setFrameH(1000);
                    }}
                  >
                    <div className="elr-subject">{e.subject}</div>
                    <div className="elr-preview">{e.preview}</div>
                    <div className="elr-tags">
                      <span className="tag-day">Day {e.day}</span>
                      {e.cta && <span className="tag-cta">→ {e.cta}</span>}
                    </div>
                  </div>
                ))}
                {activeCamp.emails.length === 0 && (
                  <div className="col-pad codeish">
                    Emails still generating — re-run:<br />
                    node pipeline/generate.mjs brands.csv --stage emails
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
