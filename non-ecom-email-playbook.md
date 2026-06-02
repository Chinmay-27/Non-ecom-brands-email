# The Non-Ecom Email Lifecycle Playbook

A reusable system for designing email campaigns for **non-ecommerce brands** — businesses that sell services, subscriptions, bookings, appointments, demos, memberships, and outcomes rather than physical products in a cart.

**Who this is for:** an email agency onboarding a new non-ecom client. You don't yet know exactly who they serve or where the gaps are. Use this playbook to map their lifecycle, pick which campaigns to build first, and ship 7 backbone flows that cover the entire customer journey.

**How to use it:**
1. Run the client through [`brand-intake-worksheet.md`](./brand-intake-worksheet.md) to profile their offer, audience, sales cycle, and lifecycle gaps.
2. Map their gaps onto the **Lifecycle Map** below.
3. Build the **7 backbone campaigns** in priority order (see *Where to start*).
4. Pull numbers and source-backed talking points from [`benchmarks-and-sources.md`](./benchmarks-and-sources.md) for the client pitch.

---

## Why non-ecom is a different game

Ecommerce email is built on **transactional triggers** — browse abandonment, cart abandonment, post-purchase, replenishment. Non-ecom brands have **none of that data**. There is no cart, no SKU, no order history. So the highest-ROI ecom flows simply don't exist here, and you build on different foundations:

| Ecommerce | Non-ecom |
|---|---|
| Cart / browse triggers | **Behavioral product & engagement triggers** (signup, activation event, page visit, inactivity) |
| Purchase history segmentation | **Identity segmentation** — ICP, role/persona, account tier, lead score |
| Discount-driven | **Value/education-driven** — trust is the currency in consulting, finance, legal, healthcare, SaaS |
| Short impulse cycle | **Long relationship cycle** — weeks to months; lead scoring decides readiness |
| "Conversion" = checkout | **"Conversion" = a booked meeting, signed contract, started subscription, kept appointment** |
| Repeat purchase = retention | **Usage, renewals, expansion = retention** |

**Two anchor stages have no ecom equivalent and are where non-ecom email earns its keep:**
- **Onboarding / Activation** — getting a new signup to first value ("aha" moment).
- **Retention / Renewal** — protecting recurring revenue; renewal talks start 60–90 days before expiry.

**Five operating principles:**
1. **Segment on who they are and what they do**, not what they bought. Signup-survey answers, role, usage events, lead score.
2. **Lead, don't discount.** ROI calculators, business reviews, case studies, feature education — not coupons.
3. **Trigger on behavior.** Behavior-triggered emails out-click broadcasts by ~30–50% (conservatively) and often 2–3×. Always-on flows beat one-off blasts.
4. **Ignore open rate as a success metric.** Apple Mail Privacy Protection inflates opens by 18–32 points. Optimize for **clicks, CTOR, replies, meetings booked, activations, conversions.** (See benchmarks doc.)
5. **Match content to journey stage.** Stage-matched nurture lifts conversions ~72%; nurtured leads convert ~23% faster.

---

## The non-ecom lifecycle map

| Stage | Goal | Primary trigger | Backbone campaign |
|---|---|---|---|
| **Awareness / Lead capture** | Get a contact + permission | Lead magnet / gated content download | → feeds Welcome + Nurture |
| **Onboarding / Activation** | Reach first value | Signup / account created | **1. Welcome & Onboarding** |
| **Nurture / Consideration** | Educate over a long cycle | Lead-magnet download; lead score below threshold | **2. Lead-Magnet Nurture** |
| **Conversion / Booking** | Trial→paid, lead→meeting→deal | Trial start, demo booked, consult requested | **3. Trial/Consult Conversion** + **4. Booking & Reminders** |
| **Retention / Engagement** | Drive usage, renewals, expansion | Scheduled cadence; renewal date − 60/90d | **5. Value Newsletter** + **6. Renewal & Expansion** |
| **Re-engagement / Win-back** | Reactivate dormant/churned | Inactivity threshold; cancellation | **7. Win-Back** |
| **Advocacy / Referral** | Turn customers into a channel | Activation milestone / value moment | *(Optional 8th: Referral)* |

---

## The 7 backbone campaigns

Each spec below gives you: **objective · stage · trigger/segment · flow (count + cadence + per-email purpose + subject-line angles + CTA) · personalization · success metrics · vertical tweaks.**

Subject lines are written as **angles** you adapt to the brand's voice, not literal final copy — except Campaign 1, which includes a fully-written sample so you can see the quality bar.

---

### Campaign 1 — Welcome & Onboarding
**Objective:** Drive activation — get the new contact to first value ("aha") fast.
**Stage:** Onboarding / Activation.
**Trigger:** Signup / account created / list join. **Send email 1 within seconds** — open rates drop ~50% if delayed.
**Segment:** New contacts; branch by signup-survey answer (goal, role, or use case).

**Flow — 5 emails over ~14 days, branched on behavior:**

| # | Day | Purpose | Subject-line angle | CTA |
|---|---|---|---|---|
| 1 | 0 (instant) | Warm welcome + set expectations + deliver one quick win | Welcome + "here's your first win" | Do the single most important first action |
| 2 | 1 | Show the core "aha" — the one feature/outcome that proves value | Outcome-led ("See [result] in 5 minutes") | Complete the activation action |
| 3 | 3 | Social proof + handle the #1 objection | Case study / "how [peer] did it" | Book a call / start trial / explore |
| 4 | 7 | Education — deepen use, second feature, best practice | "The mistake most [persona] make" | Adopt next behavior |
| 5 | 12 | Soft nudge to next step + offer help (real human reply) | "Quick question / how's it going?" | Reply, book, or upgrade |

**Behavioral branch:** if the contact completes the activation action early, skip the nudge emails and route them into Campaign 3 (conversion) or the newsletter.

**Personalization:** signup-survey goal/role/use-case decides which "aha" you lead with. Reference their stated objective in email 2.

**Success metrics:** activation rate (% who hit the "aha" event), email CTR, reply rate. *Not* open rate.

**Vertical tweaks:**
- *SaaS:* anchor on a product event (invited a teammate, connected an integration, created first project).
- *Local/service:* anchor on booking the first appointment or claiming a first-visit offer.
- *B2B/professional:* anchor on booking a discovery call or downloading the onboarding kit.
- *Education/nonprofit:* anchor on completing first lesson / first donation / joining the community.

> **Fully-written sample of Email 1** appears at the bottom of this doc (*Appendix: Sample copy*).

---

### Campaign 2 — Lead-Magnet Nurture
**Objective:** Move a cold lead toward sales-readiness over a long cycle.
**Stage:** Nurture / Consideration.
**Trigger:** Gated-content download (guide, checklist, webinar, ROI calculator, free tool).
**Segment:** Leads below the "sales-ready" lead-score threshold; branch by topic of the magnet they downloaded.

**Flow — 5 emails over ~50 days (every ~10 days), mapped to the buyer journey:**

| # | Day | Buyer-journey stage | Purpose | Subject-line angle |
|---|---|---|---|---|
| 1 | 0 | Problem recognition | Deliver the asset + frame the problem it solves | "Your [asset] + the real problem behind it" |
| 2 | 10 | Education | Teach the framework / how-to | "How to [achieve outcome] without [pain]" |
| 3 | 20 | Evaluation | Show proof — case study, data, comparison | "How [peer/segment] solved this" |
| 4 | 35 | Objection handling | Address cost / time / risk / "why now" | "But what about [top objection]?" |
| 5 | 50 | Decision | Clear offer + low-friction next step | "Ready when you are — here's how to start" |

This cadence is modeled on a B2B case that beat the client's newsletter by **+133% opens, +650% CTR, +32.6% conversion** (see benchmarks doc).

**Lead scoring (gate to the offer):** assign points to high-intent actions — pricing-page visits, repeat opens of evaluation content, case-study downloads. When a lead crosses the threshold, route them to Campaign 3 and/or alert sales. (A real B2B example: leads who visited pricing 2× + downloaded a case study were **4× more likely to convert**.)

**Personalization:** branch the middle three emails by the magnet topic and by industry/role if known.

**Success metrics:** lead-score progression, CTR on evaluation emails, % crossing the sales-ready threshold, content-conversion rate.

**Vertical tweaks:**
- *SaaS:* magnet = template/calculator/benchmark report; offer = trial or demo.
- *Local/service:* magnet = "[city] buyer's guide" / pricing guide; offer = free quote or consult.
- *B2B/professional:* magnet = whitepaper/webinar; offer = discovery call.
- *Education/nonprofit:* magnet = free lesson/impact report; offer = enrollment or recurring gift.

---

### Campaign 3 — Trial / Consultation-to-Conversion
**Objective:** Convert a free trial, freemium user, or free consultation into a paying customer.
**Stage:** Conversion.
**Trigger:** Trial start / freemium signup / free-consult booked — **plus behavioral milestones and an expiry countdown** running in parallel.
**Segment:** Active trials; branch by usage depth (activated vs stalled).

**Flow — time-based spine + behavior-based nudges:**

| # | Timing | Type | Purpose | Subject-line angle |
|---|---|---|---|---|
| 1 | Day 0 | Welcome | Set the goal of the trial; first action | "Let's get you to [outcome] before day X" |
| 2 | On activation event | Behavior | Reinforce the win, push to next value | "Nice — you just [did X]. Here's what's next" |
| 3 | Mid-trial | Usage review | Show what they've achieved + what they're missing | "Here's what you've unlocked so far" |
| 4 | If stalled | Behavior | Re-activate a dormant trial with help/use case | "Stuck? Here's the 2-minute fix" |
| 5 | Expiry − 3d | Sales/urgency | Expiry warning + clear upgrade path + offer help | "Your trial ends [day] — keep your [results]" |
| 6 | Expiry − 0/+1d | Last call | Final nudge + human contact / book a call | "Last chance to keep [what they built]" |

**Personalization:** the usage-review email (3) must reference *their* actual activity. Stalled-trial branch references the feature they haven't tried.

**Success metrics:** trial→paid conversion rate, activation-to-conversion correlation, expiry-email CTR, meetings booked.

**Vertical tweaks:**
- *SaaS:* literal free trial / freemium → paid.
- *Local/service:* "first session free" or paid trial → membership/package.
- *B2B/professional:* free audit/consult → proposal accepted (add a "your custom proposal inside" email).
- *Education:* free trial lesson / audit period → enrollment.

---

### Campaign 4 — Booking, Reminders & No-Show Recovery
**Objective:** Maximize attended meetings/appointments and recover the ones that slip.
**Stage:** Conversion / Retention.
**Trigger:** Booking confirmed; upcoming appointment; no-show event.
**Segment:** Anyone with a scheduled meeting, demo, consult, or appointment.

**Flow — three linked mini-sequences:**

**A. Confirmation & prep**
| # | Timing | Purpose | Subject angle |
|---|---|---|---|
| 1 | Instant | Confirm + add-to-calendar + what to bring/expect | "You're booked — here's what to expect" |
| 2 | 24h before | Reminder + prep + reschedule link | "See you tomorrow at [time]" |
| 3 | Morning of | Final reminder + directions/join link | "Today at [time] — [link/address]" |

*(Healthcare/legal: add a 3rd reminder 48–72h out.)* Reminders cut no-shows by **~35% on average** (up to 90%).

**B. No-show recovery**
| # | Timing | Purpose | Subject angle |
|---|---|---|---|
| 1 | +1–2h after | Warm, no-penalty re-book | "Missed you — let's find a better time" |
| 2 | +2 days | Second nudge + remove friction | "Still want that [outcome]? One click to rebook" |

**C. Post-meeting follow-up**
| # | Timing | Purpose | Subject angle |
|---|---|---|---|
| 1 | Same day | Recap + next step / proposal / booking | "Great talking — here's the recap + next step" |
| 2 | +3 days | Soft follow-up if no response | "Any questions on [what we discussed]?" |

**Personalization:** reference the specific service/appointment type and the rep/practitioner's name.

**Success metrics:** show-up rate, no-show recovery (rebook) rate, reminder CTR, post-meeting conversion.

**Vertical tweaks:** local/service & healthcare lean on A + B (attendance is the revenue event). B2B/SaaS lean on A (demo prep) + C (deal progression).

---

### Campaign 5 — Value Newsletter (ongoing nurture/retention)
**Objective:** Stay top-of-mind and build authority across the long cycle without discounting.
**Stage:** Nurture / Retention.
**Trigger:** Scheduled cadence (weekly/biweekly/monthly).
**Segment:** All engaged contacts; suppress active onboarding (Campaign 1) and recently-dormant (route to Campaign 7 instead).

**Format (repeatable template), not a fixed sequence:**
- One useful idea per send (tip, trend, mini-case, FAQ, behind-the-scenes).
- 80% value / 20% soft offer.
- A single primary CTA (read, watch, reply, book).
- A recurring section that builds habit (e.g., "This week's [niche] tip").

**Subject-line angles:** curiosity + benefit ("The one thing most [persona] get wrong about [topic]"), timely ("What [recent event] means for your [outcome]"), list ("3 ways to [result] this month").

**Personalization:** segment editions by persona/industry; insert dynamic content blocks by interest tag.

**Success metrics:** CTR, CTOR, reply rate, unsubscribe rate (keep low), assisted conversions / pipeline influenced.

**Vertical tweaks:** consulting/finance/legal → thought leadership + regulatory updates; local/service → seasonal tips + community; SaaS → product tips + customer stories; nonprofit/education → impact stories + learning content.

---

### Campaign 6 — Renewal, Anniversary & Expansion
**Objective:** Protect recurring revenue and grow accounts.
**Stage:** Retention.
**Trigger:** Renewal date − 60/90 days; account anniversary; usage milestone signaling upsell readiness.
**Segment:** Active customers/members approaching renewal; branch by health (high-usage = expansion, low-usage = save).

**Flow:**
| # | Timing | Purpose | Subject angle |
|---|---|---|---|
| 1 | Renewal − 90d | Value recap — quantify the outcome they got this year | "Your year with us, by the numbers" |
| 2 | Renewal − 45d | Renewal path + what's new / what's coming | "Renew early + here's what's next" |
| 3 | Renewal − 14d | Reminder + remove friction + human contact | "Your renewal is coming up on [date]" |
| 4 | Anniversary | Celebrate + (if healthy) expansion offer | "Happy 1 year! Here's a thank-you" |
| — | On low usage | Save branch — re-onboard / offer help before they churn | "Let's make sure you're getting [value]" |

**Personalization:** the recap email must show *their* real usage/outcomes. Expansion offers gated on health score.

**Success metrics:** renewal rate, voluntary vs involuntary churn, expansion/upsell revenue, recap-email engagement.

**Vertical tweaks:** SaaS → seat/plan expansion; membership/gym → renewal + tier upgrade; nonprofit → recurring-gift upgrade / annual impact appeal; B2B retainer → renewal + scope expansion.

---

### Campaign 7 — Win-Back / Re-Engagement
**Objective:** Reactivate dormant contacts and churned customers; clean the list.
**Stage:** Re-engagement.
**Trigger:** Inactivity threshold (e.g., 60–90 days no opens/clicks/logins) or cancellation.
**Segment:** Dormant subscribers; separately, churned customers (different message).

**Flow — 4 emails over ~3 weeks, then sunset:**
| # | Timing | Purpose | Subject angle |
|---|---|---|---|
| 1 | Day 0 | "We miss you" + remind of core value | "Did we lose you?" / "Still want [outcome]?" |
| 2 | Day 7 | Pattern-interrupt — new content, a strong reason to return | "Here's what's new since you left" |
| 3 | Day 14 | Incentive or personalized recommendation (genre/feature/service) | "A little something to win you back" |
| 4 | Day 21 | Sunset — "is this goodbye?" last chance to stay subscribed | "Should we stop emailing you?" |

Re-engagement recovers **5–15% of inactive subscribers**; expect ~12% opens on these. Suppress/sunset non-responders to protect deliverability.

**Personalization:** churned-customer branch references what they used most and what's changed since. Dormant-lead branch leans on fresh value.

**Success metrics:** reactivation rate, % recovered, deliverability/sender-reputation improvement after sunset.

**Vertical tweaks:** subscription/streaming → personalized recommendations (one brand hit 38% open / 2.53% CTR / 500% ROI in 6 months with genre-based win-back); SaaS → "here's what's new" + re-onboard; local/service → "we'd love to see you again" + booking incentive; nonprofit → impact since last gift.

---

### Optional 8th — Referral / Advocacy
**Objective:** Turn happy customers into an acquisition channel.
**Trigger:** Activation milestone or a value moment (e.g., hitting a usage limit, completing a successful project, leaving a positive review).
**Why embed it everywhere:** Dropbox's two-sided referral (free storage for both sides), embedded in the welcome email, onboarding checklist, and at storage-limit moments, drove **3,900% growth in 15 months**. Build the ask into Campaigns 1, 5, and 6 rather than treating it as a standalone blast.
**Flow:** (1) trigger-based "you're getting great results — share it" → (2) reminder with the reward framed for both sides → (3) review/testimonial request for non-referrers.

---

## Where to start (priority order for a new client)

Don't build all 7 at once. Sequence by ROI and by the gaps the intake worksheet surfaces:

1. **Welcome & Onboarding (Campaign 1)** — highest engagement, sets activation, fastest to show a win.
2. **Trial/Consult Conversion (Campaign 3)** — the core revenue play; build wherever there's a trial/consult/demo.
3. **Booking & Reminders (Campaign 4)** — if the brand runs on appointments, this recovers revenue immediately (~35% fewer no-shows).
4. **Lead-Magnet Nurture (Campaign 2)** — once there's a lead magnet feeding the top of funnel.
5. **Win-Back (Campaign 7)** — quick to ship, protects deliverability, recovers 5–15%.
6. **Value Newsletter (Campaign 5)** — the always-on retention engine.
7. **Renewal & Expansion (Campaign 6)** — for subscription/membership/retainer models.
8. **Referral** — once onboarding and retention are solid.

---

## Metrics that matter (and the one to ignore)

**Optimize for (MPP-proof and revenue-proximate):**
- Click rate (CTR) & click-to-open rate (CTOR)
- Reply rate / meetings booked / SQLs
- Activation rate (onboarding), trial→paid (conversion), show-up rate (booking)
- Renewal rate, expansion revenue, reactivation rate
- Pipeline / revenue influenced

**Ignore as a success metric:** open rate. Apple Mail Privacy Protection auto-loads tracking pixels, inflating reported opens by 18–32 points. Use opens only as a rough deliverability canary.

See [`benchmarks-and-sources.md`](./benchmarks-and-sources.md) for target numbers by vertical and every source.

---

## Appendix: Sample copy (Campaign 1, Email 1)

> **Subject:** Welcome to [Brand] — your first win is inside
> **Preview:** Two minutes to [the outcome they came for].
>
> Hi [First name],
>
> Welcome aboard — and thanks for [signing up / booking / joining]. You're here because you want [the outcome the brand delivers], so let's not waste your time. Here's the single fastest way to get your first win:
>
> **→ [One specific first action, as a button]**
>
> That's it. Do that one thing and you'll [the concrete payoff] — most people see it in about [X] minutes.
>
> Over the next couple of weeks I'll send you a few short emails showing you how to get the most out of [Brand] — no fluff, just the stuff that actually moves the needle. And if you ever get stuck, just hit reply. A real person (me) reads every one.
>
> Talk soon,
> [Name]
> [Brand]
>
> *P.S. Curious what's possible? [Here's how [peer/segment] used [Brand] to [result].]*

Adapt the bracketed pieces per client using the intake worksheet. Keep it short, one CTA, human voice, and a real reply-to address.
