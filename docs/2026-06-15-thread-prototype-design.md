# Thread — Design Spec

**Date:** 2026-06-15
**Status:** Draft — pending user review
**Codename:** Thread (local: `~/thread-borb/`, public: `sandersonboard.github.io/thread/`)

---

## Premise

Most ECM tools assume the AI talks to one person at a time. What changes when the bot, the control owner, and the reviewer are all in the same Slack thread?

That's the only question this prototype answers. It seeded from the existing `signal/slack-a` ("Bot DM" take), but the premise has moved on: from one-to-one AI conversation to multi-party trialogue, with the thread itself becoming the judgment artifact the auditor sees later.

## Identity

Standalone prototype. Not a sibling to anything. No family framing in README, header, or index page.

- Local folder: `~/thread-borb/`
- Repo: `sandersonboard/thread` (public, drops `-borb`)
- Live URL: `https://sandersonboard.github.io/thread/`
- Password gate: BORB (shared soft-gate pattern, `file://` and `localhost` bypass)

No cross-link to `signal/slack-a`. No Luna brand on display. The bot inside Slack is named "Optro ECM" because that's the AuditBoard anonymization placeholder the user has used consistently, but the prototype's own identity is not pinned to it.

## Cast and scenario world

Helios Robotics, Inc. — mid-Q3 FY2026 close.

| Person | Role | Slack handle |
|---|---|---|
| Weston Prohaska | IT Lead / control owner | @ Weston |
| Marie Curie | Internal Audit / reviewer | @ Marie |
| Ada Lovelace | SOX PMO | @ Ada (joins only when escalated) |
| Optro ECM | Bot | Optro ECM `APP` |

The recurring control is **4.2.1 — Quarterly user-access review, `prod-db-01.helios`**. Each take has its own scenario chosen to stress-test that take's design choice.

## Visual fidelity bar

The chrome is Slack. The only "designed" element is the Optro ECM bot's own message blocks.

### Slack chrome (the surroundings)

- **Workspace sidebar:** aubergine `#3F0F40` background, white text 90% opacity, hover `rgba(255,255,255,0.06)`, active item `#1164A3` background. Workspace squircle pill at top with "H" Helios badge.
- **Sidebar sections:** "Channels" with `#` prefix, "Direct messages" with status dots, "Apps" with the Optro ECM mark.
- **Main column:** white background, `#1D1C1D` text, font stack `Slack-Lato, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`.
- **Channel header:** `# channel-name` or `Optro ECM`, topic line beneath, bookmarks row, member avatars stack on the right.
- **Composer:** Slack's full composer — formatting toolbar (B I S link list quote code), file/emoji/mention icons, green Send button (`#007A5A`) when content present.
- **Message row hover state:** faint gray background plus the floating action toolbar (emoji react, reply in thread, share, three-dots).
- **Bot tag:** small gray `APP` pill exactly like real Slack apps.
- **Reactions row:** rounded pill, count, hover state matching real Slack.
- **Thread reply pill:** the actual "↩ 3 replies — Last reply 4m ago" mini-bar with stacked member avatars.

### Optro ECM card (the only "designed" element)

- Posted as a Slack Block Kit message: left rule + header section + divider + fields section + action buttons row.
- Left rule color: **neutral dark gray** (`#3D3D3D`), not purple, not teal. Reads as a generic-bot styling, not Luna.
- Action buttons use real Slack Block Kit styling: pill shape with gray border, primary action green-filled (`#007A5A`), danger red-outlined.
- Confidence renders as a Slack context block: small Optro mark + `"5 prior identical-shape attestations · drift score 0.02"` — facts, not a Luna progress bar.
- Citations: Slack blue (`#1264A3`), underline on hover, with a small chain-link icon. Not Luna purple pills.
- Avatar: Optro ECM mark on a 36px rounded square with a soft neutral-gradient tile.

### What is removed from `signal/slack-a`

- Luna purple/teal borders on the surrounding page chrome.
- Luna badge pills in the page header (`is-purple`, `is-teal`).
- Luna heading typography on the surrounding caption strip.
- The Luna-styled flow stepper at the page top (replaced — see Navigation).
- Luna confidence-bar component (replaced with a Slack-style context block).
- The entire `signal/styles.css` inheritance — Thread's CSS is written fresh against Slack's actual visual language.

## The 6 takes

Two axes, three takes each. Each take has its own scenario chosen to put the design choice under real load. Target fidelity: **10–13 states per take. Each state introduces 1–3 new messages, so a complete take accumulates roughly 20–30 messages total** (not per state).

For each take, a structural moat is surfaced — graph, integration, or history — so the demo doesn't read as just an LLM wrapper.

### Axis 1 — Bot's role in the thread

#### Take 1 · `role-drafter.html` — Optro ECM as Drafter
**Scenario:** Boring routine. Fifth identical-shape AR Q3 in a row. The bot has earned the right to do almost everything; humans approve.

**Moat surfaced:** prior-attestation graph. The bot drafts because it has 5 prior matching records to learn from — not because it's an articulate LLM.

**State outline (10 states):**
1. Thread opens with Optro ECM posting a full Block Kit draft: ask language, suggested artifact (`snow-query-AR-prod-db.csv`), proposed reviewer note "in Marie's voice."
2. Weston joins the thread (status dot lights up). Reads the draft.
3. Weston clicks "Approve & file" — one tap. Bot acknowledges with a compact "uploaded by Weston · 1 click" line. (The "filed" receipt comes only after Marie also signs off at state 9 — upload ≠ file.)
4. Marie joins the thread. Bot pings her with the pre-drafted reviewer note: "I drafted what you usually sign — edit or approve."
5. Marie reads the drafted note. Three options visible: Approve, Edit, Rewrite.
6. Marie clicks Edit. The drafted note inflates inline; she changes "checked" → "verified."
7. Bot logs the edit silently into its draft-pattern store (visible context block: "edit recorded · drafted-note-pattern updated").
8. Marie signs off with green-check button.
9. Bot posts the filing receipt: `filed · 4.2.1 · Q3 · 1m32s end-to-end · 2 clicks · chain anchored`.
10. Footer block — collapsible "Why I played drafter here": **5 prior identical-shape attestations · same reviewer · same artifact source · drift score 0.02 · pattern confidence 0.94**. The proof is in the audit trail behind the right to draft.

#### Take 2 · `role-mediator.html` — Optro ECM as Mediator
**Scenario:** Real disagreement. Weston's Q3 export has a new `termination_date_normalized` column that wasn't in Q2. Marie's not sure it's legitimate. The bot doesn't take sides — it surfaces the diff and the provenance.

**Moat surfaced:** integration graph. The bot finds the DBA team's CR ticket on its own because it knows the connected systems (Oracle patch log, Jira, change-management).

**State outline (11 states):**
1. Weston posts: "Q3 AR attached. Same query as last quarter." Drops CSV.
2. Marie joins. Reads. Posts: "Quick question — there's a new column. Where'd it come from?"
3. Bot posts a minimal context block: `noticed the schema diff: +1 field vs Q2 (termination_date_normalized).` No conclusion offered.
4. Bot follows with a button-only message: `[Lay out the diff]` `[Find the change source]` `[Stay out of it]`.
5. Marie clicks "Lay out the diff." Bot posts a Block Kit side-by-side card: Q2 schema (11 columns) vs Q3 schema (12 columns), new field highlighted.
6. Marie clicks "Find the change source." Bot pauses 2 seconds (typing indicator), then returns with a card linking the Oracle patch log entry from Apr 14 plus the linked DBA-team Jira CR (`DBA-CR-2401`).
7. Weston comes back into the thread: "Oh, that's the GDPR field — DBA team added it after legal review."
8. Bot posts a "judgment trail" Block Kit card: `Marie's concern: new field provenance. Weston's answer: DBA-CR-2401. Linked artifact attached.`
9. Bot button: `[Record this exchange in 4.2.1's history?]`. Marie clicks yes.
10. Marie signs off. The reviewer note auto-references the exchange thread: `"Verified — new column documented via DBA-CR-2401, see thread for context."`
11. Filing receipt — `filed · 4.2.1 · Q3 · resolved 1 reviewer question · 11 messages · chain anchored · exchange linked.`

#### Take 3 · `role-silent.html` — Optro ECM as Silent Auditor
**Scenario:** Near-miss. Weston files, Marie reviews, both about to seal. Quiet anomaly only the bot noticed. The whole point is that the bot stayed out of the way until restraint was the wrong choice.

**Moat surfaced:** cross-system anomaly detection. The bot earns its keep by knowing 4 quarters of attestation pattern just got broken — and saying so once.

**State outline (12 states):**
1. Weston posts: "Q3 AR done — same as Q2, file attached." Bot is silent.
2. Marie joins, reads, posts: "Looks good — signing off."
3. Marie hovers her sign-off button. Bot interrupts with an ephemeral-style message: **"before you sign — heads up."**
4. Bot posts a context block, single line: `DBA cleanup ticket DBA-2407 closed Friday without an attestation from the DBA-team lead. First time in 4 quarters that's happened.`
5. Marie pauses. Posts: "Weston, did you see this?"
6. Weston: "Hmm — that's weird. Let me ping the DBA lead."
7. Weston opens a side DM with the DBA lead (visible as a small "side conversation" embed in the main thread).
8. Bot stays silent.
9. DBA lead's attestation message comes back into Weston's side thread.
10. Bot — once it sees the attestation arrive — auto-links the side thread back into the main thread: `attestation received · DBA-team-lead · linked here.`
11. Marie signs off, this time with the addendum stapled on. Reviewer note: `Verified — required additional attestation from DBA-team lead, see linked side thread.`
12. Bot posts its only other message: the final receipt. `filed · 4.2.1 · Q3 · 1 anomaly flagged + resolved · 2 attestations attached · chain anchored.` Underneath, a tiny "Why I interrupted" expander: **"4 prior quarters had a DBA attestation within 48hr of cleanup-ticket close. Q3 broke that pattern."**

### Axis 2 — Thread granularity

#### Take 4 · `unit-ask.html` — One thread per evidence ask
**Scenario:** A normal Friday. Weston has 3 different ask-threads open, each in a different state. After clearing one, he scrolls through his "filed asks" archive — 47 sealed threads from this quarter. Then an old sealed ask gets re-opened by an auditor as a fresh ask-thread referencing it.

**Moat surfaced:** the per-ask thread is ephemeral; the graph that wires them together is permanent. Old threads die but their receipts are queryable.

**State outline (10 states):**
1. Open Slack sidebar view: 3 active threads visible — `t1` "Q3 AR prod-db" (mid-review), `t2` "SOC2 firewall rule export" (stalled 3 days), `t3` "Quarterly priv-account list" (just opened).
2. User clicks `t2` (the stalled one). Thread opens — Optro ECM's ask was posted Tuesday, Weston never replied.
3. Bot posts a soft nudge in `t2`: "Heads up Weston — this is due Wed, want me to ping you again Tue morning?"
4. Weston responds in `t2`: "Sorry, in IDS-tuning all week — file attached." Drops artifact.
5. Bot in `t2`: auto-tags, posts receipt, seals the thread.
6. User clicks `t1` (Q3 AR mid-review). Marie has just posted "approved." Bot seals `t1` with receipt.
7. User clicks `t3` (just opened priv-account list). Bot's opening ask is visible; Weston hasn't responded yet.
8. User clicks the workspace's "Filed asks" archive view. Scroll feed: 47 sealed threads from this quarter, each showing its receipt as the last visible message.
9. A new thread `t-q4-1` appears at the top of the sidebar: "Q4 backup retention attestation" — an auditor (Sarah Kim) opened it, with a quoted reference to the Q2 sealed thread on the same control.
10. User clicks `t-q4-1` — Sarah's opening message includes a Block Kit card with the Q2 receipt embedded, and Optro ECM's first post resurrects the relevant context from the sealed Q2 thread automatically.

#### Take 5 · `unit-control.html` — One thread per control
**Scenario:** Drift detection across 4 quarters of history. The thread for control 4.2.1 has been alive since Q4 FY25. Optro ECM sees the whole arc. When Q3 FY26 lands, it can compare not just to Q2 but to the full attestation history.

**Moat surfaced:** longitudinal control-history graph. The control isn't an empty noun — it's a thread with a 4-quarter track record.

**State outline (10 states):**
1. Open `# ctrl-4-2-1` thread. Channel header reads "Quarterly user-access review · prod-db-01.helios."
2. Scrollback view: Q4 FY25 sign-off (collapsed sticky), Q1 FY26 sign-off (collapsed sticky), Q2 FY26 sign-off (collapsed sticky). Each collapsed sticky is one message tall — `✓ Q1 FY26 sign-off · Marie · Apr 14`.
3. Latest visible message: Optro ECM posts the Q3 ask. Includes a Block Kit "drift since last quarter" card: row count Q4→Q1→Q2→Q3 (sparkline), schema diff (none), reviewer turnaround time (1.2 days avg).
4. Weston posts artifact in-thread.
5. Bot auto-compares against the 3 prior quarters' artifacts: posts a context block — `row count +3% (within band), schema unchanged, source query identical to Q2, file size +127kb.`
6. Marie joins the thread. Reads the drift card.
7. Marie clicks a "view prior 3 sign-offs" link in the drift card — expands the Q4/Q1/Q2 stickies inline for 5 seconds.
8. Marie signs off. Her reviewer note auto-includes a "history-aware" boilerplate: "Verified — consistent with 3 prior quarters."
9. Bot collapses Q3 into a new sticky at the top of the thread alongside the others (`✓ Q3 FY26 sign-off · Marie · Jun 14`).
10. Pinned at thread bottom: a "control health" card — **4 quarters · 4 clean reviews · 0 disputes · avg turnaround 1.2 days · drift trend: stable.** That card *is* the control's reputation.

#### Take 6 · `unit-period.html` — One thread per close period
**Scenario:** 30-day quarter-end crunch. The omnibus "Q3 FY26 close" thread is everything that quarter — daily digests, inline filings, mid-quarter risk escalations, the final close package as the last message. Ada Lovelace (PMO) is in this thread.

**Moat surfaced:** the close period as a single narrative artifact. The thread is not documentation of the close — it *is* the close.

**State outline (13 states):**
1. **Day 1** — Optro ECM opens `# q3-fy26-close`. Pins a Block Kit kickoff card: "47 controls due by Mar 31. Daily digest at 5pm. PMO: Ada Lovelace."
2. **Day 1** — Ada posts a kickoff message: "Let's go. Flag anything stuck within 48hr."
3. **Day 4** — first daily digest reply from bot: "Day 4 · 3/47 cleared, 0 stalled."
4. **Day 12** — daily digest: "Day 12 · 23/47 cleared, 2 disputes open, 1 missing attestation. Top of pile: 4.2.1, 5.1.2."
5. **Day 12** — Weston files 4.2.1 inline as a reply to the digest: drops artifact, bot auto-tags.
6. **Day 14** — Marie's reviewer reply to Weston's filing: "Approved."
7. **Day 22** — bot posts a risk escalation: "3 controls depend on the DBA team's frozen change window (DBA-freeze ends Day 26). Recommend escalating: 6.1.4, 6.2.1, 6.2.2."
8. **Day 22** — Ada joins the risk sub-thread. Pings DBA lead in a side conversation. Bot links the side conversation into the main thread.
9. **Day 24** — DBA freeze partially lifted for SOX controls. Bot posts confirmation.
10. **Day 26** — daily digest: "Day 26 · 42/47 cleared, 3 in review, 2 pending."
11. **Day 28** — bot posts the close-package preview: a Block Kit card listing all 47 controls with status icons, drift flags, and a "click any control to drill into its thread" affordance.
12. **Day 30** — final 5 controls clear. Bot posts the close-package summary as the final message: all 47 sealed, total disputes resolved, average turnaround, chain anchor for the entire quarter.
13. **Day 30** — auto-generated audit-evidence bundle: a downloadable receipt that wraps the whole thread into a single artifact for Sarah Kim (auditor) when she arrives.

## Navigation model — thread accumulation

The thread accumulates. It does not swap.

- A **state pill row** sits above the Slack workspace window, Slack-native in style: small gray pills connected by a thin line, the active one filled `#1D1C1D`, completed ones showing a small `✓`, future ones dimmed at 40% opacity.
- Clicking pill N reveals all messages up to and including state N. Earlier messages stay visible above. The view smooth-scrolls to the most recent message in the new state.
- Scroll-up at any state is unrestricted — the reader can re-read earlier moments without losing their place.
- Composer at the bottom shows a ghost preview of the next person's pending message ("Marie is typing…", "Optro ECM is preparing a card…") to give the demo a sense of forward motion.
- Keyboard: `←` / `→` step through pills, `Esc` resets to state 1, `End` jumps to final state.
- Right-margin "Jump to receipt" link is always present — one click skips to the final state, useful for the demo punchline.

## File structure

```
~/thread-borb/
  index.html                # landing — premise, 2 axes, 6 take tiles
  role-drafter.html         # axis 1 · take 1
  role-mediator.html        # axis 1 · take 2
  role-silent.html          # axis 1 · take 3
  unit-ask.html             # axis 2 · take 4
  unit-control.html         # axis 2 · take 5
  unit-period.html          # axis 2 · take 6

  slack-chrome.css          # workspace sidebar, header, composer, message rows, hover toolbar, thread reply pill, reaction chips
  optro-card.css            # Block Kit-flavored bot card (neutral grays, action buttons, context blocks, citation links)
  flow.css                  # state pill row above workspace, page caption strip, jump-to-receipt margin link

  gate.js                   # BORB soft password gate (file:// and localhost bypass)
  flow.js                   # state machine: pill clicks, additive message reveal, smooth-scroll, keyboard handlers
  thread-data.js            # per-page: const THREAD = [...]; each message tagged with state-threshold + author + body + reactions

  optro-mark.svg            # bot avatar (36px rounded square on neutral-gradient tile)
  workspace-helios.svg      # workspace squircle "H"
  README.md
```

## The data pattern

Each page (e.g. `role-mediator.html`) is mostly a Slack-window shell. The actual thread content lives in a `THREAD` array declared just before `<script src="flow.js">`:

```js
const THREAD = [
  { state: 1, author: 'weston', ts: '2:48 PM',
    body: "Q3 AR attached. Same query as last quarter.",
    attachment: 'AR-Q3FY26-prod-db.csv' },
  { state: 2, author: 'marie',  ts: '2:51 PM',
    body: "Quick question — there's a new column. Where'd it come from?" },
  { state: 3, author: 'optro',  ts: '2:51 PM', kind: 'context',
    body: 'noticed the schema diff: +1 field vs Q2 (termination_date_normalized).' },
  // …
]
```

Author values: `'weston' | 'marie' | 'ada' | 'optro' | 'sarah'`. Kinds for `optro`: default `'message'`, plus `'card'` (Block Kit card with header/fields/buttons), `'context'` (small mark + facts line), `'buttons-only'` (action row, no body).

`flow.js` reads `THREAD`, renders messages whose `state ≤ currentState`, applies the right author template (own-message vs. other vs. bot-card vs. context-block vs. button-only), and updates the pill row. This makes the prototype ~10–20 lines of stub HTML per page plus a data file — manageable at 10+ states each.

## Index page (cold open)

- **Hero strip:** a still frame of an active Slack thread with all three humans + Optro ECM visible, mid-conversation. Just the picture, no copy overlaid.
- **Premise paragraph:** "Most ECM tools assume the AI talks to one person at a time. What changes when the bot, the control owner, and the reviewer are all in the same Slack thread? This prototype is six answers to that question."
- **Two axis rows.** Each row has a small header label and 3 tile cards:
  - *Bot's role in the thread* → Drafter · Mediator · Silent
  - *Thread granularity* → Per ask · Per control · Per period
- Each tile shows the take's one-line scenario hook and a "→" affordance.
- No family badges. No "Optro" wordmark hero. No mention of the Optro demo family, signal, or any sibling.

## Tech stack and constraints

- Pure static HTML/CSS/JS. No build step. No `node_modules`. No framework.
- Three CSS files (`slack-chrome.css`, `optro-card.css`, `flow.css`), three JS files (`gate.js`, `flow.js`, plus per-page `thread-data.js` inline).
- BORB soft password gate, shared pattern from prior prototypes — `file://` and `localhost` bypass it.
- GH Pages from `main` branch root, repo `sandersonboard/thread`.
- Browser support: modern Chromium + Safari + Firefox. No IE/legacy concerns.
- The site is open-content but BORB-gated to limit casual indexing.

## Out of scope

These are intentionally NOT in this prototype:

- Mobile / responsive layout — desktop Slack only (the demo viewer is using a laptop).
- Real Slack API integration — fully static mock.
- Sound / animation beyond CSS transitions and the smooth-scroll on state change.
- Light/dark theme toggle — Slack light theme only.
- Threading nesting deeper than 1 level — sub-threads referenced in the data are visualized as embed cards, not interactive nested threads.
- Search, filters, multi-channel navigation in the Slack sidebar — sidebar is decorative aside from showing the active channel/DM.
- Comparison-mode UI (e.g., side-by-side viewing of multiple takes simultaneously) — each take is its own page.
- Any actual chain anchoring, attestation cryptography, or real PDF/CSV parsing — text-only mocks.

## What success looks like

A demo viewer can:

1. Open `index.html`, read one paragraph, and understand the premise within 30 seconds.
2. Click any of the 6 take tiles and watch a 10+ state Slack conversation accumulate, end-to-end, in under 90 seconds of clicking through pills.
3. At the end of any take, see the structural moat (history graph, integration graph, anomaly pattern) made explicit in a final receipt or expander — so they don't walk away thinking "this is just an LLM in a Slack bot."
4. Switch between takes without a mental reset — the cast and control are constant; only the design choice changes.

## Open questions (for the next pass)

- Should there be a per-take "annotation overlay" mode that adds explanatory captions (similar to how `signal` has surface-caption text below each state), or should the takes be silent and let the receipts speak?
- Is there a 13th tile worth adding to the index — "what these all have in common" — that surfaces the multi-party thread as a *category* rather than 6 instances?
- Do we want a real auditor (Sarah Kim) cameo in any take besides Take 4's reopen scenario? She's referenced in the success criteria but not present in the threads.
