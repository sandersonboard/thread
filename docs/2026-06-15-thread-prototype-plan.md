# Thread Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 6-page static Slack-mockup prototype (`sandersonboard.github.io/thread/`) that explores multi-party (owner + reviewer + bot) evidence-collection threads across two axes — bot's role (drafter / mediator / silent) and thread granularity (per ask / per control / per period).

**Architecture:** Pure static HTML/CSS/JS, no build step. Three CSS files (`slack-chrome.css`, `optro-card.css`, `flow.css`), one JS engine (`flow.js`) that reads a per-page `THREAD` array and renders Slack messages additively as the viewer steps through 10–13 state pills. Each page declares its own `THREAD` inline before loading `flow.js`. BORB soft password gate, GH Pages deploy.

**Tech Stack:** HTML5, vanilla JS (no framework), modern CSS, SVG assets, GitHub Pages.

**Verification model:** No automated tests. Every task ends with a browser verification step — open the file, observe a specific outcome, confirm before committing. This matches the verification pattern used in sibling prototypes (`signal`, `velocity`, `benchmark`, `practice`).

---

## File Structure (created across these tasks)

```
~/thread-borb/
  index.html                # Task 14
  role-drafter.html         # Task 9
  role-mediator.html        # Task 8  (canonical reference take)
  role-silent.html          # Task 10
  unit-ask.html             # Task 11
  unit-control.html         # Task 12
  unit-period.html          # Task 13

  slack-chrome.css          # Task 2
  optro-card.css            # Task 3
  flow.css                  # Task 4

  gate.js                   # Task 1 (copied from signal)
  flow.js                   # Task 5
  scenario.js               # Task 1

  optro-mark.svg            # Task 6
  workspace-helios.svg      # Task 6

  README.md                 # Task 1
  .gitignore                # Task 1

  docs/
    2026-06-15-thread-prototype-design.md  (exists)
    2026-06-15-thread-prototype-plan.md    (this file)
```

---

## Task 1: Project Skeleton

**Files:**
- Create: `~/thread-borb/README.md`
- Create: `~/thread-borb/.gitignore`
- Create: `~/thread-borb/gate.js` (copy from signal)
- Create: `~/thread-borb/scenario.js`

- [ ] **Step 1.1: Verify the docs already exist**

Run: `ls /Users/sanderson/thread-borb/docs/`
Expected output:
```
2026-06-15-thread-prototype-design.md
2026-06-15-thread-prototype-plan.md
```

- [ ] **Step 1.2: Copy the BORB gate from signal**

Run: `cp /Users/sanderson/optro-signal-borb/gate.js /Users/sanderson/thread-borb/gate.js`
Verify with: `head -5 /Users/sanderson/thread-borb/gate.js`
Expected: file exists and starts with the gate logic.

- [ ] **Step 1.3: Write `scenario.js`**

Path: `/Users/sanderson/thread-borb/scenario.js`

```js
// Constants reused across the 6 take pages. Story-world only — no family branding.

const SCENARIO = {
  company: 'Helios Robotics',
  workspaceLetter: 'H',
  workspaceColor: '#266c92',
  control: '4.2.1',
  controlLabel: 'Quarterly user-access review',
  asset: 'prod-db-01.helios',
  period: 'Q3 FY26',
  cast: {
    weston: { name: 'Weston Prohaska', initials: 'WP', tone: '#5a3a8a', role: 'IT Lead' },
    marie:  { name: 'Marie Curie',     initials: 'MC', tone: '#1f7a6a', role: 'Internal Audit' },
    ada:    { name: 'Ada Lovelace',    initials: 'AL', tone: '#a64a3a', role: 'SOX PMO' },
    sarah:  { name: 'Sarah Kim',       initials: 'SK', tone: '#7a6a1f', role: 'External Auditor' },
    optro:  { name: 'Optro ECM',       initials: 'OE', tone: '#3D3D3D', role: 'ECM bot', isBot: true },
  },
};
```

- [ ] **Step 1.4: Write `.gitignore`**

Path: `/Users/sanderson/thread-borb/.gitignore`

```
.DS_Store
*.swp
.vscode/
.idea/
node_modules/
```

- [ ] **Step 1.5: Write `README.md`**

Path: `/Users/sanderson/thread-borb/README.md`

```markdown
# Thread

Multi-party SOX evidence collection in Slack — what changes when the bot, the control owner, and the reviewer are all in the same thread?

**Live demo:** https://sandersonboard.github.io/thread/
**Password:** BORB (case-insensitive)

## Six takes on two axes

**Bot's role in the thread**
- `role-drafter.html` — Optro ECM drafts everything; humans approve.
- `role-mediator.html` — Bot surfaces the diff, finds the change source, summarizes the resolution. Doesn't take sides.
- `role-silent.html` — Bot stays silent until restraint is the wrong choice.

**Thread granularity**
- `unit-ask.html` — One thread per evidence ask. Born when needed, sealed when done.
- `unit-control.html` — One thread per control. 4 quarters of history visible at the top.
- `unit-period.html` — One thread per close period. The thread *is* the close.

## Cast

Helios Robotics — Q3 FY26 close — control 4.2.1 (quarterly user-access review on `prod-db-01.helios`).

- **Weston Prohaska** — IT Lead, control owner
- **Marie Curie** — Internal Audit, reviewer
- **Ada Lovelace** — SOX PMO (joins on escalation)
- **Sarah Kim** — External Auditor (cameo)
- **Optro ECM** — the bot

## Stack

Pure static HTML/CSS/JS. No build, no `node_modules`, no framework. Open `index.html` directly or:

```bash
cd ~/thread-borb
python3 -m http.server 8000
open http://localhost:8000/
```

`file://` and `localhost` bypass the BORB gate.

## How the takes are built

Each take page is a thin Slack-window HTML shell plus an inline `THREAD = [...]` array describing every message. `flow.js` reads the array, renders messages additively as the viewer clicks through the state-pill row above the workspace, and handles keyboard navigation (← / → / Esc / End).
```

- [ ] **Step 1.6: Initialize git and make first commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git init
git add README.md .gitignore gate.js scenario.js docs/
git commit -m "init: project skeleton with README, gate, scenario constants, and design+plan docs"
```

Expected: a single commit on `main` containing 6 files.

---

## Task 2: Slack Chrome CSS

**Files:**
- Create: `~/thread-borb/slack-chrome.css`
- Create: `~/thread-borb/_test-chrome.html` (temporary verification page; removed at end of task)

- [ ] **Step 2.1: Write `slack-chrome.css`**

Path: `/Users/sanderson/thread-borb/slack-chrome.css`

```css
/* Slack workspace chrome — high-fidelity rebuild. Colors and shapes match real Slack. */

:root {
  --slack-aubergine: #3F0F40;
  --slack-aubergine-hover: rgba(255, 255, 255, 0.06);
  --slack-active-blue: #1164A3;
  --slack-link-blue: #1264A3;
  --slack-green: #007A5A;
  --slack-green-hover: #148567;
  --slack-text: #1D1C1D;
  --slack-text-muted: #616061;
  --slack-text-meta: #868686;
  --slack-border: #DDDDDD;
  --slack-hover-bg: #F8F8F8;
  --slack-channel-bg: #FFFFFF;
  --slack-app-tag-bg: #E8E8E8;
  --slack-app-tag-text: #5D5D5D;
  --slack-reaction-bg: #F2F2F2;
  --slack-reaction-border: #DDDDDD;
  --slack-reaction-active-bg: #E8F1F8;
  --slack-reaction-active-border: #1264A3;
}

body {
  margin: 0;
  font-family: "Slack-Lato", "Lato", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: var(--slack-text);
  background: var(--slack-channel-bg);
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
  line-height: 1.46;
}

.slack-window {
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 720px;
  border: 1px solid var(--slack-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--slack-channel-bg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* --- Sidebar --- */
.slack-sidebar {
  background: var(--slack-aubergine);
  color: rgba(255, 255, 255, 0.9);
  padding: 0;
  font-size: 14px;
  overflow-y: auto;
}
.slack-workspace {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px 12px;
  font-weight: 800;
  color: #FFFFFF;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.slack-workspace .workspace-mark {
  width: 24px; height: 24px;
  border-radius: 4px;
  display: grid; place-items: center;
  font-size: 12px;
  color: #FFFFFF;
  font-weight: 800;
}
.slack-section {
  padding: 14px 18px 4px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
  text-transform: none;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.slack-section::before {
  content: '▾';
  font-size: 9px;
  opacity: 0.7;
}
.slack-channel {
  padding: 4px 18px 4px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.78);
  position: relative;
}
.slack-channel:hover { background: var(--slack-aubergine-hover); }
.slack-channel.is-active {
  background: var(--slack-active-blue);
  color: #FFFFFF;
  font-weight: 700;
}
.slack-channel .hash {
  opacity: 0.7;
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 14px;
}
.slack-channel .dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}
.slack-channel .dot.is-online { background: #2BAC76; }

/* --- Main column --- */
.slack-main {
  display: flex;
  flex-direction: column;
  background: var(--slack-channel-bg);
}
.slack-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--slack-border);
  font-weight: 800;
  font-size: 17px;
  color: var(--slack-text);
  flex-shrink: 0;
}
.slack-header .topic {
  font-size: 13px;
  font-weight: 400;
  color: var(--slack-text-muted);
  margin-left: 8px;
}
.slack-header .members {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: -4px;
}
.slack-header .members .avatar {
  width: 24px; height: 24px;
  border-radius: 4px;
  margin-left: -4px;
  border: 1px solid #FFFFFF;
}

/* --- Messages --- */
.slack-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0 8px;
}
.slack-msg {
  display: grid;
  grid-template-columns: 52px 1fr;
  padding: 6px 20px;
  position: relative;
}
.slack-msg:hover {
  background: var(--slack-hover-bg);
}
.slack-msg .avatar {
  width: 36px; height: 36px;
  border-radius: 4px;
  background: linear-gradient(135deg, #cfd8dc, #b0bec5);
  display: grid; place-items: center;
  color: #FFFFFF;
  font-weight: 800;
  font-size: 14px;
}
.slack-msg.is-bot .avatar {
  background: linear-gradient(135deg, #e5e5e5, #c8c8c8);
}
.slack-msg .body {
  font-size: 15px;
  color: var(--slack-text);
}
.slack-msg .head {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 2px;
}
.slack-msg .head .name {
  font-weight: 900;
  font-size: 15px;
}
.slack-msg .head .ts {
  font-size: 12px;
  color: var(--slack-text-meta);
  font-weight: 400;
}
.slack-msg .head .app-tag {
  background: var(--slack-app-tag-bg);
  color: var(--slack-app-tag-text);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  padding: 1px 4px;
  border-radius: 2px;
  text-transform: uppercase;
}
.slack-msg .body p {
  margin: 2px 0;
  font-size: 15px;
  line-height: 1.46;
}
.slack-msg .body a, .slack-msg .body .cite {
  color: var(--slack-link-blue);
  text-decoration: none;
  cursor: pointer;
}
.slack-msg .body a:hover, .slack-msg .body .cite:hover {
  text-decoration: underline;
}

/* Hover toolbar */
.slack-msg .hover-tools {
  position: absolute;
  top: -10px;
  right: 24px;
  display: none;
  background: #FFFFFF;
  border: 1px solid var(--slack-border);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 2px 4px;
  gap: 0;
}
.slack-msg:hover .hover-tools { display: flex; }
.slack-msg .hover-tools button {
  border: none;
  background: transparent;
  padding: 6px;
  font-size: 14px;
  cursor: pointer;
  color: var(--slack-text-muted);
}
.slack-msg .hover-tools button:hover { background: var(--slack-hover-bg); color: var(--slack-text); }

/* Reactions */
.slack-reactions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.slack-reactions .reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  border: 1px solid var(--slack-reaction-border);
  background: var(--slack-reaction-bg);
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
}
.slack-reactions .reaction.is-mine {
  border-color: var(--slack-reaction-active-border);
  background: var(--slack-reaction-active-bg);
  color: var(--slack-link-blue);
}
.slack-reactions .reaction .count { font-weight: 700; }

/* Thread reply pill */
.slack-thread-pill {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.slack-thread-pill:hover { background: var(--slack-hover-bg); border: 1px solid var(--slack-border); padding: 3px 7px; }
.slack-thread-pill .avatars {
  display: flex;
}
.slack-thread-pill .avatars .a {
  width: 20px; height: 20px; border-radius: 4px;
  background: #b0bec5;
  margin-right: -4px;
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 800;
  display: grid; place-items: center;
}
.slack-thread-pill .replies-count {
  font-size: 13px;
  font-weight: 700;
  color: var(--slack-link-blue);
}
.slack-thread-pill .last-reply {
  font-size: 12px;
  color: var(--slack-text-muted);
}

/* Composer */
.slack-composer {
  border-top: 1px solid var(--slack-border);
  padding: 12px 20px 16px;
  flex-shrink: 0;
}
.slack-composer .input-shell {
  border: 1px solid var(--slack-border);
  border-radius: 8px;
  background: #FFFFFF;
  padding: 0;
}
.slack-composer .toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-bottom: 1px solid #EEEEEE;
  color: var(--slack-text-muted);
  font-size: 14px;
}
.slack-composer .toolbar .tool {
  padding: 3px 5px;
  cursor: pointer;
  border-radius: 4px;
}
.slack-composer .toolbar .tool:hover { background: var(--slack-hover-bg); }
.slack-composer .toolbar .divider { color: var(--slack-border); margin: 0 2px; }
.slack-composer .input-line {
  padding: 10px 12px;
  font-size: 15px;
  color: var(--slack-text-muted);
}
.slack-composer .input-line.is-ghost {
  font-style: italic;
  color: var(--slack-text-meta);
}
.slack-composer .send-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid #EEEEEE;
  color: var(--slack-text-muted);
  font-size: 14px;
}
.slack-composer .send-row .icons {
  display: flex; gap: 8px;
}
.slack-composer .send-row .icons .icon {
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
}
.slack-composer .send-btn {
  background: var(--slack-green);
  color: #FFFFFF;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}
.slack-composer .send-btn:hover { background: var(--slack-green-hover); }
.slack-composer .send-btn:disabled { opacity: 0.4; cursor: default; }
```

- [ ] **Step 2.2: Write a temporary verification page**

Path: `/Users/sanderson/thread-borb/_test-chrome.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Chrome verification</title>
<link rel="stylesheet" href="slack-chrome.css" />
</head>
<body style="padding:24px; background:#f0f0f0;">
<div class="slack-window">
  <aside class="slack-sidebar">
    <div class="slack-workspace">
      <span class="workspace-mark" style="background:#266c92;">H</span>
      Helios Robotics
    </div>
    <div class="slack-section">Channels</div>
    <div class="slack-channel"><span class="hash">#</span> sox-q3-close</div>
    <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
    <div class="slack-channel"><span class="hash">#</span> dba-team</div>
    <div class="slack-section">Direct messages</div>
    <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
    <div class="slack-channel"><span class="dot"></span> Marie Curie</div>
  </aside>
  <main class="slack-main">
    <header class="slack-header">
      <span style="color:#868686;font-family:ui-monospace,monospace;">#</span>
      ctrl-4-2-1
      <span class="topic">Quarterly user-access review · prod-db-01.helios</span>
    </header>
    <div class="slack-messages">
      <div class="slack-msg">
        <div class="avatar">WP</div>
        <div class="body">
          <div class="head"><span class="name">Weston Prohaska</span><span class="ts">2:48 PM</span></div>
          <p>Q3 AR attached. Same query as last quarter.</p>
          <div class="slack-reactions">
            <span class="reaction">👍 <span class="count">2</span></span>
          </div>
        </div>
        <div class="hover-tools">
          <button>😀</button><button>↩</button><button>📤</button><button>⋯</button>
        </div>
      </div>
      <div class="slack-msg is-bot">
        <div class="avatar">OE</div>
        <div class="body">
          <div class="head">
            <span class="name">Optro ECM</span>
            <span class="app-tag">APP</span>
            <span class="ts">2:51 PM</span>
          </div>
          <p>Noticed the schema diff: +1 field vs Q2 (<span class="cite">termination_date_normalized</span>).</p>
        </div>
      </div>
    </div>
    <div class="slack-composer">
      <div class="input-shell">
        <div class="toolbar">
          <span class="tool"><b>B</b></span>
          <span class="tool"><i>I</i></span>
          <span class="tool"><s>S</s></span>
          <span class="divider">|</span>
          <span class="tool">🔗</span>
          <span class="tool">≡</span>
          <span class="tool">"</span>
          <span class="tool">{ }</span>
        </div>
        <div class="input-line">Message #ctrl-4-2-1</div>
        <div class="send-row">
          <div class="icons">
            <span class="icon">+</span>
            <span class="icon">📎</span>
            <span class="icon">@</span>
            <span class="icon">😊</span>
          </div>
          <button class="send-btn" disabled>Send</button>
        </div>
      </div>
    </div>
  </main>
</div>
</body>
</html>
```

- [ ] **Step 2.3: Open in browser and verify**

Run: `open /Users/sanderson/thread-borb/_test-chrome.html`

Verify all of:
- [ ] Sidebar is aubergine `#3F0F40`, "ctrl-4-2-1" channel is highlighted in Slack blue `#1164A3`
- [ ] Helios workspace mark visible at top of sidebar
- [ ] Channel header shows `#` + `ctrl-4-2-1` + topic line
- [ ] Hovering a message shows the floating action toolbar in the top-right
- [ ] Bot message shows the small gray `APP` tag next to the name
- [ ] Citation `termination_date_normalized` is Slack blue
- [ ] Composer has formatting toolbar + message line + green Send button (disabled)
- [ ] Font is sans-serif (Lato-style), text color is `#1D1C1D` not pure black

If anything looks off, fix it in `slack-chrome.css` and re-verify.

- [ ] **Step 2.4: Delete the test page and commit**

Run:
```bash
rm /Users/sanderson/thread-borb/_test-chrome.html
cd /Users/sanderson/thread-borb
git add slack-chrome.css
git commit -m "feat: Slack workspace chrome CSS — sidebar, header, messages, composer, reactions"
```

---

## Task 3: Bot Card CSS (`optro-card.css`)

**Files:**
- Create: `~/thread-borb/optro-card.css`
- Create: `~/thread-borb/_test-card.html` (temporary)

- [ ] **Step 3.1: Write `optro-card.css`**

Path: `/Users/sanderson/thread-borb/optro-card.css`

```css
/* Block Kit-flavored card the Optro ECM bot posts inside a Slack message.
   Neutral gray accents — does not import Luna tokens. */

:root {
  --card-rule: #3D3D3D;
  --card-bg: #FFFFFF;
  --card-border: #DDDDDD;
  --card-text: #1D1C1D;
  --card-text-muted: #616061;
  --card-divider: #EEEEEE;
  --card-btn-border: #BBBBBB;
  --card-btn-text: #1D1C1D;
  --card-btn-bg: #FFFFFF;
  --card-btn-bg-hover: #F4F4F4;
  --card-btn-primary-bg: #007A5A;
  --card-btn-primary-bg-hover: #148567;
  --card-btn-primary-text: #FFFFFF;
  --card-btn-danger-border: #C0392B;
  --card-btn-danger-text: #C0392B;
  --card-cite: #1264A3;
}

.optro-card {
  margin-top: 8px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-left: 4px solid var(--card-rule);
  border-radius: 4px;
  max-width: 540px;
  overflow: hidden;
  font-size: 14px;
  color: var(--card-text);
}

.optro-card .card-section {
  padding: 12px 14px;
}
.optro-card .card-divider {
  height: 1px;
  background: var(--card-divider);
  margin: 0;
}

.optro-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
}
.optro-card .card-header .mark {
  width: 18px; height: 18px;
  border-radius: 3px;
  background: linear-gradient(135deg, #e5e5e5, #c8c8c8);
  display: grid; place-items: center;
  font-size: 9px;
  font-weight: 800;
  color: #FFFFFF;
}
.optro-card .card-header .subtitle {
  margin-left: auto;
  font-weight: 400;
  font-size: 12px;
  color: var(--card-text-muted);
}

.optro-card .card-fields {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 6px 14px;
  font-size: 13px;
}
.optro-card .card-fields .label {
  color: var(--card-text-muted);
  font-weight: 600;
}
.optro-card .card-fields .value {
  color: var(--card-text);
}

.optro-card .card-fact {
  font-size: 13px;
  color: var(--card-text);
  line-height: 1.5;
}
.optro-card .card-fact .cite {
  color: var(--card-cite);
  text-decoration: none;
  cursor: pointer;
}
.optro-card .card-fact .cite:hover { text-decoration: underline; }
.optro-card .card-fact .cite::before {
  content: '🔗 ';
  font-size: 10px;
  opacity: 0.6;
}

.optro-card .card-actions {
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  flex-wrap: wrap;
}
.optro-card .card-actions button {
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 4px;
  border: 1px solid var(--card-btn-border);
  background: var(--card-btn-bg);
  color: var(--card-btn-text);
  cursor: pointer;
  font-family: inherit;
}
.optro-card .card-actions button:hover { background: var(--card-btn-bg-hover); }
.optro-card .card-actions button.primary {
  background: var(--card-btn-primary-bg);
  color: var(--card-btn-primary-text);
  border-color: var(--card-btn-primary-bg);
}
.optro-card .card-actions button.primary:hover { background: var(--card-btn-primary-bg-hover); border-color: var(--card-btn-primary-bg-hover); }
.optro-card .card-actions button.danger {
  border-color: var(--card-btn-danger-border);
  color: var(--card-btn-danger-text);
}

/* Compact context block — used for the bot's "noticed X" lines */
.optro-context {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 13px;
  color: var(--card-text-muted);
}
.optro-context .mark {
  width: 14px; height: 14px;
  border-radius: 3px;
  background: linear-gradient(135deg, #e5e5e5, #c8c8c8);
  flex-shrink: 0;
}
.optro-context .body { line-height: 1.4; }
.optro-context .body .cite {
  color: var(--card-cite);
  cursor: pointer;
}
.optro-context .body .cite:hover { text-decoration: underline; }

/* Side-by-side diff card (used in role-mediator Take 2 state 5) */
.optro-diff {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-top: 1px solid var(--card-divider);
}
.optro-diff .col {
  padding: 10px 14px;
  font-size: 12px;
}
.optro-diff .col + .col {
  border-left: 1px solid var(--card-divider);
}
.optro-diff .col .col-title {
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--card-text-muted);
  letter-spacing: 0.3px;
  margin-bottom: 6px;
}
.optro-diff .col ul {
  margin: 0; padding-left: 14px;
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 12px;
}
.optro-diff .col ul li.is-new {
  background: #FFF7DA;
  font-weight: 700;
}

/* Filing receipt — terminal/monospace looking, but Slack-themed */
.optro-receipt {
  margin-top: 4px;
  padding: 8px 12px;
  background: #F7F8FA;
  border: 1px solid var(--card-border);
  border-left: 3px solid var(--card-rule);
  border-radius: 4px;
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 12px;
  color: var(--card-text);
  line-height: 1.5;
}
.optro-receipt strong { color: var(--card-text); }

/* "Why I played X here" expander */
.optro-expander {
  margin-top: 6px;
  font-size: 12px;
  color: var(--card-text-muted);
  cursor: pointer;
}
.optro-expander summary {
  list-style: none;
  user-select: none;
}
.optro-expander summary::before {
  content: '▸ ';
  font-size: 10px;
  display: inline-block;
  transition: transform 0.12s;
}
.optro-expander[open] summary::before {
  content: '▾ ';
}
.optro-expander .reveal {
  margin-top: 6px;
  padding: 8px 10px;
  background: #F7F8FA;
  border: 1px solid var(--card-border);
  border-radius: 4px;
  color: var(--card-text);
  font-size: 12px;
  line-height: 1.5;
}

/* Ephemeral interjection (Take 3 / role-silent) */
.optro-ephemeral {
  margin-top: 4px;
  padding: 8px 12px;
  background: #FFF8E1;
  border: 1px solid #FFE0A6;
  border-left: 3px solid #C8911D;
  border-radius: 4px;
  font-size: 13px;
  color: #6E5414;
}
.optro-ephemeral .label {
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
  color: #8A6612;
}
```

- [ ] **Step 3.2: Write a temporary verification page**

Path: `/Users/sanderson/thread-borb/_test-card.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Card verification</title>
<link rel="stylesheet" href="slack-chrome.css" />
<link rel="stylesheet" href="optro-card.css" />
</head>
<body style="padding:24px; background:#fff; max-width:680px;">

<h4>Card variants — all rendered inside a Slack message body</h4>

<div class="slack-msg is-bot">
  <div class="avatar">OE</div>
  <div class="body">
    <div class="head"><span class="name">Optro ECM</span><span class="app-tag">APP</span><span class="ts">2:48 PM</span></div>
    <p>Q3 AR for control 4.2.1 — drafted for you both.</p>
    <div class="optro-card">
      <div class="card-section">
        <div class="card-header">
          <span class="mark">OE</span>
          Evidence draft · AR-Q3FY26-prod-db
          <span class="subtitle">Optro ECM</span>
        </div>
      </div>
      <div class="card-divider"></div>
      <div class="card-section">
        <div class="card-fields">
          <span class="label">Control</span>      <span class="value">4.2.1</span>
          <span class="label">Cadence</span>      <span class="value">Quarterly</span>
          <span class="label">Reviewer</span>     <span class="value">Marie Curie</span>
          <span class="label">Suggested artifact</span> <span class="value"><span class="cite">snow-query-AR-prod-db.csv</span></span>
        </div>
      </div>
      <div class="card-divider"></div>
      <div class="card-actions">
        <button class="primary">✓ Approve &amp; file</button>
        <button>Edit query</button>
        <button>Upload your own</button>
      </div>
    </div>

    <div class="optro-context">
      <span class="mark"></span>
      <span class="body">5 prior identical-shape attestations · drift score 0.02 · pattern confidence 0.94</span>
    </div>

    <details class="optro-expander">
      <summary>Why I played drafter here</summary>
      <div class="reveal">5 prior identical-shape attestations · same reviewer · same artifact source · drift score 0.02 · pattern confidence 0.94. The bot earned the right to draft because the pattern is well-precedented.</div>
    </details>

    <div class="optro-receipt">
      filed: <strong>AR-Q3FY26-prod-db.csv</strong> → control 4.2.1 · classifier 93% · routed=Marie · sla=2bd · chain=block #4,180,221
    </div>

    <div class="optro-ephemeral">
      <span class="label">Before you sign — heads up</span>
      DBA cleanup ticket DBA-2407 closed Friday without an attestation. First time in 4 quarters that's happened.
    </div>
  </div>
</div>
</body>
</html>
```

- [ ] **Step 3.3: Open and verify**

Run: `open /Users/sanderson/thread-borb/_test-card.html`

Verify:
- [ ] Bot card has a neutral dark-gray left rule (`#3D3D3D`), not purple
- [ ] Card header, fields, and divider lines all render
- [ ] "Approve & file" button is Slack-green (`#007A5A`), others are white with gray border
- [ ] Citation `snow-query-AR-prod-db.csv` is Slack-blue with a `🔗` prefix
- [ ] Context block ("5 prior identical-shape…") is muted gray with tiny Optro mark
- [ ] Expander collapses/expands on click
- [ ] Filing receipt is monospaced, slightly off-white background
- [ ] Ephemeral message has yellow-amber tint with "BEFORE YOU SIGN — HEADS UP" label

- [ ] **Step 3.4: Clean up and commit**

Run:
```bash
rm /Users/sanderson/thread-borb/_test-card.html
cd /Users/sanderson/thread-borb
git add optro-card.css
git commit -m "feat: Optro ECM Block Kit card CSS — neutral grays, context, receipt, ephemeral, expander"
```

---

## Task 4: Flow CSS (state pill row + page chrome)

**Files:**
- Create: `~/thread-borb/flow.css`

- [ ] **Step 4.1: Write `flow.css`**

Path: `/Users/sanderson/thread-borb/flow.css`

```css
/* Outer page chrome for each take — state pill row above the workspace, caption strip, jump link. */

.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 24px 48px;
  background: #F4F5F7;
}

.page-caption {
  margin: 0 0 12px;
  font-size: 13px;
  color: #4A4A4A;
  line-height: 1.5;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.page-caption .crumbs a {
  color: #4A4A4A;
  text-decoration: none;
}
.page-caption .crumbs a:hover { text-decoration: underline; }
.page-caption .crumbs .sep { margin: 0 4px; color: #B0B0B0; }
.page-caption .take-title {
  font-size: 14px;
  font-weight: 700;
  color: #1D1C1D;
}
.page-caption .axis-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  padding: 2px 6px;
  background: #E0E2E5;
  color: #4A4A4A;
  border-radius: 3px;
}

.state-pills {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 12px 0;
  padding: 8px 0;
  flex-wrap: wrap;
}
.state-pills .pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  background: #E5E7EA;
  color: #4A4A4A;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
}
.state-pills .pill:hover { background: #D6D9DD; }
.state-pills .pill.is-done {
  background: #D5E0E8;
  color: #2E5F77;
}
.state-pills .pill.is-done::before {
  content: '✓';
  font-size: 11px;
  font-weight: 800;
}
.state-pills .pill.is-active {
  background: #1D1C1D;
  color: #FFFFFF;
}
.state-pills .pill.is-future {
  opacity: 0.4;
}
.state-pills .connector {
  width: 14px;
  height: 1px;
  background: #C7CACE;
}

.state-pills-controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
  font-size: 12px;
  color: #4A4A4A;
}
.state-pills-controls button {
  border: 1px solid #C7CACE;
  background: #FFFFFF;
  color: #1D1C1D;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
}
.state-pills-controls button:hover { background: #F4F4F4; }

.page-layout {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 20px;
}

.page-side {
  font-size: 13px;
  color: #4A4A4A;
  padding-top: 8px;
}
.page-side .state-caption {
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;
}
.page-side .state-caption .label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #888;
  display: block;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.page-side .jump-link {
  display: block;
  font-size: 12px;
  color: #1264A3;
  text-decoration: none;
  margin-top: 12px;
  font-weight: 700;
}
.page-side .jump-link:hover { text-decoration: underline; }

.page-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #DDDDDD;
  font-size: 12px;
  color: #888;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-footer a {
  color: #1264A3;
  text-decoration: none;
}
.page-footer a:hover { text-decoration: underline; }
```

- [ ] **Step 4.2: Commit (no in-isolation verification needed; will be verified together with `flow.js` in Task 5)**

Run:
```bash
cd /Users/sanderson/thread-borb
git add flow.css
git commit -m "feat: page chrome CSS — state pill row, caption strip, side panel, jump-to-receipt"
```

---

## Task 5: Flow JS Engine

**Files:**
- Create: `~/thread-borb/flow.js`
- Create: `~/thread-borb/_test-flow.html` (temporary verification)

- [ ] **Step 5.1: Write `flow.js`**

Path: `/Users/sanderson/thread-borb/flow.js`

```js
// Renders THREAD additively as the viewer steps through state pills.
// Expects globals: SCENARIO (from scenario.js), THREAD (from each page).
//
// THREAD shape:
//   { state: 1..N, author: 'weston'|'marie'|'ada'|'sarah'|'optro',
//     ts: '2:48 PM',                    // display timestamp
//     body: 'plain text',               // message body (citations as <span class="cite">)
//     attachment: 'AR-Q3FY26.csv',      // optional attached file
//     reactions: ['👍 2', '🎯 1'],       // optional reaction chips
//     kind: 'message'|'card'|'context'|'buttons-only'|'ephemeral'|'receipt'|'expander'|'diff'|'side-thread',
//     card: { header, subtitle, fields:[[label,value]], facts:[...], actions:[{label,primary?,danger?}] },
//     context: 'noticed schema diff...',
//     ephemeral: { label, body },
//     receipt: '<receipt html>',
//     expander: { summary, reveal },
//     diff: { left:{title, items:[{text, isNew?}]}, right:{title, items:[...]} },
//     sideThread: { participants:[name1,name2], summary, count } }
//
// stateCaption: optional per-state caption shown in the right side-panel.
//   const STATE_CAPTIONS = { 1: 'Bot opens with full draft', ... }

(function () {
  const main = () => {
    const state = { current: 1, total: computeTotal(THREAD) };
    const root = document.getElementById('flow-root');
    if (!root) return console.error('No #flow-root element');

    renderPills(state);
    renderMessages(state);
    renderCaption(state);
    bindKeyboard(state);
    bindJumpLink(state);
  };

  function computeTotal(thread) {
    return thread.reduce((max, m) => Math.max(max, m.state || 1), 1);
  }

  function renderPills(state) {
    const host = document.getElementById('state-pills');
    if (!host) return;
    host.innerHTML = '';
    for (let i = 1; i <= state.total; i++) {
      const pill = document.createElement('button');
      pill.className = 'pill';
      pill.textContent = i;
      pill.dataset.state = i;
      if (i < state.current) pill.classList.add('is-done');
      if (i === state.current) pill.classList.add('is-active');
      if (i > state.current) pill.classList.add('is-future');
      pill.addEventListener('click', () => go(state, i));
      host.appendChild(pill);
      if (i < state.total) {
        const c = document.createElement('span');
        c.className = 'connector';
        host.appendChild(c);
      }
    }
    const ctrls = document.getElementById('state-controls');
    if (ctrls) {
      ctrls.innerHTML = '';
      const back = btn('← Back', () => go(state, Math.max(1, state.current - 1)));
      const next = btn('Next →', () => go(state, Math.min(state.total, state.current + 1)));
      const reset = btn('Reset', () => go(state, 1));
      ctrls.append(back, next, reset);
    }
  }

  function btn(label, onClick) {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function renderMessages(state) {
    const host = document.getElementById('slack-messages');
    if (!host) return;
    host.innerHTML = '';
    let lastAuthor = null;
    let lastState = null;
    for (const m of THREAD) {
      if (m.state > state.current) break;
      if (m.state !== lastState && lastState !== null) {
        // No visual separator between states — flows like a real thread
      }
      host.appendChild(renderMessage(m, lastAuthor));
      lastAuthor = m.author;
      lastState = m.state;
    }
    // smooth scroll to bottom
    requestAnimationFrame(() => { host.scrollTop = host.scrollHeight; });
  }

  function renderMessage(m, prevAuthor) {
    const author = (window.SCENARIO && SCENARIO.cast[m.author]) || { name: m.author, initials: '??', isBot: false };
    const wrap = document.createElement('div');
    wrap.className = 'slack-msg' + (author.isBot ? ' is-bot' : '');

    const av = document.createElement('div');
    av.className = 'avatar';
    av.textContent = author.initials;
    if (author.tone && !author.isBot) av.style.background = `linear-gradient(135deg, ${author.tone}, ${shade(author.tone, -15)})`;
    wrap.appendChild(av);

    const body = document.createElement('div');
    body.className = 'body';

    const head = document.createElement('div');
    head.className = 'head';
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = author.name;
    head.appendChild(name);
    if (author.isBot) {
      const tag = document.createElement('span');
      tag.className = 'app-tag';
      tag.textContent = 'APP';
      head.appendChild(tag);
    }
    const ts = document.createElement('span');
    ts.className = 'ts';
    ts.textContent = m.ts || '';
    head.appendChild(ts);
    body.appendChild(head);

    // Message body
    if (m.body) {
      const p = document.createElement('p');
      p.innerHTML = m.body; // body may contain <span class="cite">
      body.appendChild(p);
    }
    if (m.attachment) {
      const att = document.createElement('div');
      att.style.cssText = 'margin-top:6px; padding:8px 12px; background:#F5F6F7; border:1px solid #DDD; border-radius:4px; font-size:12px; color:#1D1C1D; display:inline-flex; gap:8px; align-items:center;';
      att.innerHTML = `<span style="font-size:18px;">📎</span><span><strong>${m.attachment}</strong></span>`;
      body.appendChild(att);
    }
    if (m.reactions && m.reactions.length) {
      const row = document.createElement('div');
      row.className = 'slack-reactions';
      for (const r of m.reactions) {
        const chip = document.createElement('span');
        chip.className = 'reaction';
        chip.innerHTML = r.replace(/(\d+)/, '<span class="count">$1</span>');
        row.appendChild(chip);
      }
      body.appendChild(row);
    }

    // Optro-specific kinds (rendered as embedded blocks in the bot message body)
    if (m.kind === 'card' && m.card) {
      body.appendChild(renderCard(m.card));
    }
    if (m.kind === 'context' || m.context) {
      const c = m.context || (m.kind === 'context' ? m.body : null);
      if (c) {
        const ctx = document.createElement('div');
        ctx.className = 'optro-context';
        ctx.innerHTML = `<span class="mark"></span><span class="body">${c}</span>`;
        body.appendChild(ctx);
        // The "context-only" version doesn't also include a regular paragraph
        if (m.kind === 'context') {
          const ps = body.querySelectorAll('p');
          ps.forEach(p => p.remove());
        }
      }
    }
    if (m.kind === 'buttons-only' && m.buttons) {
      const acts = document.createElement('div');
      acts.className = 'optro-card';
      acts.style.borderLeftColor = 'transparent';
      acts.style.border = 'none';
      acts.style.marginTop = '4px';
      const row = document.createElement('div');
      row.className = 'card-actions';
      row.style.padding = '0';
      for (const b of m.buttons) {
        const btnEl = document.createElement('button');
        btnEl.textContent = b.label;
        if (b.primary) btnEl.classList.add('primary');
        if (b.danger) btnEl.classList.add('danger');
        row.appendChild(btnEl);
      }
      acts.appendChild(row);
      body.appendChild(acts);
    }
    if (m.kind === 'ephemeral' && m.ephemeral) {
      const e = document.createElement('div');
      e.className = 'optro-ephemeral';
      e.innerHTML = `<span class="label">${m.ephemeral.label}</span>${m.ephemeral.body}`;
      body.appendChild(e);
    }
    if (m.kind === 'receipt' && m.receipt) {
      const r = document.createElement('div');
      r.className = 'optro-receipt';
      r.innerHTML = m.receipt;
      body.appendChild(r);
    }
    if (m.kind === 'expander' && m.expander) {
      const d = document.createElement('details');
      d.className = 'optro-expander';
      d.innerHTML = `<summary>${m.expander.summary}</summary><div class="reveal">${m.expander.reveal}</div>`;
      body.appendChild(d);
    }
    if (m.kind === 'diff' && m.diff) {
      const d = document.createElement('div');
      d.className = 'optro-card';
      const wrapDiff = document.createElement('div');
      wrapDiff.className = 'optro-diff';
      wrapDiff.innerHTML = `
        <div class="col">
          <div class="col-title">${m.diff.left.title}</div>
          <ul>${m.diff.left.items.map(i => `<li class="${i.isNew?'is-new':''}">${i.text}</li>`).join('')}</ul>
        </div>
        <div class="col">
          <div class="col-title">${m.diff.right.title}</div>
          <ul>${m.diff.right.items.map(i => `<li class="${i.isNew?'is-new':''}">${i.text}</li>`).join('')}</ul>
        </div>`;
      d.appendChild(wrapDiff);
      body.appendChild(d);
    }
    if (m.kind === 'side-thread' && m.sideThread) {
      const t = document.createElement('div');
      t.className = 'slack-thread-pill';
      const avs = m.sideThread.participants.map(p => {
        const c = (window.SCENARIO && SCENARIO.cast[p]) || { initials: '??', tone: '#888' };
        return `<span class="a" style="background:${c.tone};">${c.initials}</span>`;
      }).join('');
      t.innerHTML = `
        <div class="avatars">${avs}</div>
        <span class="replies-count">${m.sideThread.count} ${m.sideThread.count === 1 ? 'reply' : 'replies'}</span>
        <span class="last-reply">${m.sideThread.summary}</span>`;
      body.appendChild(t);
    }

    // Hover toolbar
    const tools = document.createElement('div');
    tools.className = 'hover-tools';
    tools.innerHTML = '<button>😀</button><button>↩</button><button>📤</button><button>⋯</button>';
    wrap.appendChild(body);
    wrap.appendChild(tools);
    return wrap;
  }

  function renderCard(card) {
    const root = document.createElement('div');
    root.className = 'optro-card';
    if (card.header) {
      const s = document.createElement('div');
      s.className = 'card-section';
      s.innerHTML = `
        <div class="card-header">
          <span class="mark">OE</span>
          ${card.header}
          ${card.subtitle ? `<span class="subtitle">${card.subtitle}</span>` : ''}
        </div>`;
      root.appendChild(s);
    }
    if (card.fields && card.fields.length) {
      root.appendChild(divider());
      const s = document.createElement('div');
      s.className = 'card-section';
      const grid = document.createElement('div');
      grid.className = 'card-fields';
      for (const [label, value] of card.fields) {
        const l = document.createElement('span'); l.className = 'label'; l.textContent = label;
        const v = document.createElement('span'); v.className = 'value'; v.innerHTML = value;
        grid.append(l, v);
      }
      s.appendChild(grid);
      root.appendChild(s);
    }
    if (card.facts && card.facts.length) {
      root.appendChild(divider());
      const s = document.createElement('div');
      s.className = 'card-section';
      for (const f of card.facts) {
        const p = document.createElement('p');
        p.className = 'card-fact';
        p.innerHTML = f;
        s.appendChild(p);
      }
      root.appendChild(s);
    }
    if (card.actions && card.actions.length) {
      root.appendChild(divider());
      const row = document.createElement('div');
      row.className = 'card-actions';
      for (const a of card.actions) {
        const btnEl = document.createElement('button');
        btnEl.textContent = a.label;
        if (a.primary) btnEl.classList.add('primary');
        if (a.danger) btnEl.classList.add('danger');
        row.appendChild(btnEl);
      }
      root.appendChild(row);
    }
    return root;
  }

  function divider() {
    const d = document.createElement('div');
    d.className = 'card-divider';
    return d;
  }

  function renderCaption(state) {
    const host = document.getElementById('state-caption');
    if (!host) return;
    const caps = window.STATE_CAPTIONS || {};
    host.innerHTML = `
      <span class="label">State ${state.current} of ${state.total}</span>
      ${caps[state.current] || ''}
    `;
  }

  function go(state, n) {
    state.current = Math.max(1, Math.min(state.total, n));
    renderPills(state);
    renderMessages(state);
    renderCaption(state);
  }

  function bindKeyboard(state) {
    document.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight') go(state, state.current + 1);
      if (e.key === 'ArrowLeft')  go(state, state.current - 1);
      if (e.key === 'Escape')     go(state, 1);
      if (e.key === 'End')        go(state, state.total);
    });
  }

  function bindJumpLink(state) {
    const link = document.getElementById('jump-to-receipt');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      go(state, state.total);
    });
  }

  function shade(hex, percent) {
    // Lighten/darken a hex color by percent. Minimal — used for avatar gradients.
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + percent));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + percent));
    const b = Math.max(0, Math.min(255, (num & 0xFF) + percent));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
```

- [ ] **Step 5.2: Write the temporary engine-verification page**

Path: `/Users/sanderson/thread-borb/_test-flow.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Flow verification</title>
<link rel="stylesheet" href="slack-chrome.css" />
<link rel="stylesheet" href="optro-card.css" />
<link rel="stylesheet" href="flow.css" />
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Test</span>
    <span class="take-title">Engine verification</span>
    <span class="axis-tag">Internal</span>
  </div>

  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>

  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">Channels</div>
        <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header"><span style="color:#868686;font-family:ui-monospace,monospace;">#</span> ctrl-4-2-1<span class="topic">Q3 verification</span></header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="input-line is-ghost">Marie is typing…</div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = {
  1: 'Weston posts the artifact.',
  2: 'Marie raises a concern.',
  3: 'Optro ECM offers options.',
  4: 'Marie chooses to see the diff.',
  5: 'Weston explains. Marie signs off with reasoning attached.',
};

const THREAD = [
  { state: 1, author: 'weston', ts: '2:48 PM',
    body: 'Q3 AR attached. Same query as last quarter.',
    attachment: 'AR-Q3FY26-prod-db.csv',
    reactions: ['👀 1'] },
  { state: 2, author: 'marie',  ts: '2:51 PM',
    body: "Quick question — there's a new column. Where'd it come from?" },
  { state: 3, author: 'optro',  ts: '2:51 PM', kind: 'context',
    body: 'noticed the schema diff: +1 field vs Q2 (<span class="cite">termination_date_normalized</span>).' },
  { state: 4, author: 'optro',  ts: '2:52 PM', kind: 'buttons-only',
    buttons: [
      { label: 'Lay out the diff' },
      { label: 'Find the change source', primary: true },
      { label: 'Stay out of it', danger: true },
    ] },
  { state: 5, author: 'optro', ts: '2:53 PM', kind: 'card',
    card: {
      header: 'Resolution recorded',
      fields: [['Concern raised by', 'Marie Curie'], ['Resolved by', 'Weston Prohaska']],
      facts: ['Linked: <span class="cite">DBA-CR-2401</span>'],
      actions: [{ label: 'Record exchange in 4.2.1 history', primary: true }],
    } },
];
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 5.3: Open and verify the engine works**

Run: `open /Users/sanderson/thread-borb/_test-flow.html`

Verify:
- [ ] On load, only state 1 visible — Weston's message about Q3 AR with the attachment chip
- [ ] State pills row shows 5 pills, "1" is dark, "2–5" are dimmed
- [ ] Click pill "3" — three messages now visible (Weston, Marie, Optro context line)
- [ ] Pills "1" and "2" now show ✓, "3" is dark, "4" and "5" dimmed
- [ ] Press `→` — advances to state 4; the buttons-only row appears
- [ ] Press `End` — jumps to state 5; the card with header + fields + facts + primary button visible
- [ ] Press `←` — back to state 4
- [ ] Press `Esc` — back to state 1
- [ ] Click "→ Jump to receipt" link — jumps to state 5
- [ ] State caption ("State 5 of 5 · Weston explains…") updates with each pill change
- [ ] Avatar tints: Weston purple-ish, Marie teal-ish, Optro neutral gray
- [ ] Messages accumulate (do not swap) — earlier messages still visible at higher states
- [ ] Scroll to top of message area at state 5, scroll back down — all 5 messages present

- [ ] **Step 5.4: Clean up and commit**

Run:
```bash
rm /Users/sanderson/thread-borb/_test-flow.html
cd /Users/sanderson/thread-borb
git add flow.js
git commit -m "feat: flow.js engine — pill nav, additive rendering, keyboard, message kinds"
```

---

## Task 6: SVG Assets

**Files:**
- Create: `~/thread-borb/optro-mark.svg`
- Create: `~/thread-borb/workspace-helios.svg`

- [ ] **Step 6.1: Write `optro-mark.svg`**

Path: `/Users/sanderson/thread-borb/optro-mark.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5A5A5A"/>
      <stop offset="1" stop-color="#2A2A2A"/>
    </linearGradient>
  </defs>
  <text x="32" y="40" font-family="-apple-system, system-ui, sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="#FFFFFF">OE</text>
</svg>
```

- [ ] **Step 6.2: Write `workspace-helios.svg`**

Path: `/Users/sanderson/thread-borb/workspace-helios.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#266c92"/>
  <text x="32" y="44" font-family="-apple-system, system-ui, sans-serif" font-size="32" font-weight="800" text-anchor="middle" fill="#FFFFFF">H</text>
</svg>
```

- [ ] **Step 6.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add optro-mark.svg workspace-helios.svg
git commit -m "feat: Optro ECM and Helios SVG marks"
```

---

## Task 7: Reusable Slack Window Shell

This step doesn't create a new file — it defines the HTML shell pattern used by every take page. Future tasks (8–13) embed this shell verbatim. Captured here once for reference.

**Reference shell — every take page uses this exact structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · {{Take Name}}</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> {{Axis Group Name}}</span>
    <span class="take-title">{{Take Title}}</span>
    <span class="axis-tag">{{Axis Tag}}</span>
  </div>

  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>

  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace">
          <span class="workspace-mark" style="background:#266c92;">H</span>
          Helios Robotics
        </div>
        <div class="slack-section">Channels</div>
        <div class="slack-channel"><span class="hash">#</span> sox-q3-close</div>
        <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
        <div class="slack-channel"><span class="hash">#</span> dba-team</div>
        <div class="slack-channel"><span class="hash">#</span> it-security</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
        <div class="slack-channel"><span class="dot"></span> Marie Curie</div>
        <div class="slack-channel"><span class="dot"></span> Ada Lovelace</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header">
          <span style="color:#868686;font-family:ui-monospace,monospace;">#</span>
          ctrl-4-2-1
          <span class="topic">Quarterly user-access review · prod-db-01.helios</span>
        </header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar">
              <span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span>
              <span class="divider">|</span>
              <span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span>
            </div>
            <div class="input-line is-ghost" id="ghost-composer">…</div>
            <div class="send-row">
              <div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div>
              <button class="send-btn" disabled>Send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>

  <div class="page-footer">
    <span>Thread · {{Take Title}}</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = { /* per-take */ };
const THREAD = [ /* per-take */ ];
</script>
<script src="flow.js"></script>
</body>
</html>
```

The channel header (`# ctrl-4-2-1` etc.) and active sidebar item differ per take — most takes are channel `# ctrl-4-2-1`, but `unit-period.html` is `# q3-fy26-close`, and `unit-ask.html` is a DM with Optro ECM.

No commit needed for this task — it's a documentation step. The actual shell is committed as part of Task 8.

---

## Task 8: `role-mediator.html` (Canonical First Take)

This is the canonical, most-detailed take. Build first to lock the pattern; the remaining 5 takes reuse it.

**Files:**
- Create: `~/thread-borb/role-mediator.html`

- [ ] **Step 8.1: Write `role-mediator.html`**

Path: `/Users/sanderson/thread-borb/role-mediator.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · Optro ECM as Mediator</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Bot's role</span>
    <span class="take-title">Optro ECM as Mediator</span>
    <span class="axis-tag">Role · Mediator</span>
  </div>

  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>

  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">Channels</div>
        <div class="slack-channel"><span class="hash">#</span> sox-q3-close</div>
        <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
        <div class="slack-channel"><span class="hash">#</span> dba-team</div>
        <div class="slack-channel"><span class="hash">#</span> it-security</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
        <div class="slack-channel"><span class="dot"></span> Marie Curie</div>
        <div class="slack-channel"><span class="dot"></span> Ada Lovelace</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header">
          <span style="color:#868686;font-family:ui-monospace,monospace;">#</span>
          ctrl-4-2-1
          <span class="topic">Quarterly user-access review · prod-db-01.helios</span>
        </header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar"><span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span><span class="divider">|</span><span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span></div>
            <div class="input-line is-ghost" id="ghost-composer">Message #ctrl-4-2-1</div>
            <div class="send-row"><div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div><button class="send-btn" disabled>Send</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>

  <div class="page-footer">
    <span>Thread · Optro ECM as Mediator</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = {
  1:  "Weston drops the Q3 export. No bot intervention yet.",
  2:  "Marie spots a new column. Pushes back.",
  3:  "Bot surfaces the schema diff as a fact — no conclusion offered.",
  4:  "Bot offers three options, doesn't pick.",
  5:  "Marie picks 'lay out the diff'. Bot posts side-by-side.",
  6:  "Marie picks 'find the change source'. Bot finds the CR ticket.",
  7:  "Weston explains the GDPR field.",
  8:  "Bot summarizes into a judgment trail.",
  9:  "Marie agrees to record the exchange.",
  10: "Marie signs off with the exchange embedded in her reviewer note.",
  11: "Filing receipt. Chain anchored.",
};

const THREAD = [
  { state: 1, author: 'weston', ts: '2:48 PM',
    body: 'Q3 AR attached. Same query as last quarter.',
    attachment: 'AR-Q3FY26-prod-db.csv',
    reactions: ['👀 1'] },

  { state: 2, author: 'marie', ts: '2:51 PM',
    body: "Quick question — there's a new column. Where'd it come from?" },

  { state: 3, author: 'optro', ts: '2:51 PM', kind: 'context',
    body: 'noticed the schema diff: +1 field vs Q2 (<span class="cite">termination_date_normalized</span>).' },

  { state: 4, author: 'optro', ts: '2:52 PM', kind: 'buttons-only',
    buttons: [
      { label: 'Lay out the diff' },
      { label: 'Find the change source' },
      { label: 'Stay out of it' },
    ] },

  { state: 5, author: 'optro', ts: '2:53 PM', kind: 'diff',
    diff: {
      left:  { title: 'Q2 schema (11 cols)', items: [
        { text: 'user_id' }, { text: 'role' }, { text: 'role_assigned_at' },
        { text: 'last_login' }, { text: 'last_review_date' }, { text: 'reviewer' },
        { text: 'review_outcome' }, { text: 'is_active' }, { text: 'created_at' },
        { text: 'updated_at' }, { text: 'export_ts' },
      ]},
      right: { title: 'Q3 schema (12 cols)', items: [
        { text: 'user_id' }, { text: 'role' }, { text: 'role_assigned_at' },
        { text: 'last_login' }, { text: 'last_review_date' }, { text: 'reviewer' },
        { text: 'review_outcome' }, { text: 'is_active' }, { text: 'created_at' },
        { text: 'updated_at' }, { text: 'export_ts' },
        { text: 'termination_date_normalized', isNew: true },
      ]},
    }},

  { state: 6, author: 'optro', ts: '2:54 PM', kind: 'card',
    card: {
      header: 'Change source located',
      subtitle: 'Optro ECM',
      fields: [
        ['Field added', 'termination_date_normalized'],
        ['Source patch', '<span class="cite">Oracle patch log · Apr 14, 2026</span>'],
        ['Linked CR', '<span class="cite">DBA-CR-2401 · "Add GDPR-normalized termination date column"</span>'],
        ['Approved by', 'Legal Review · Apr 12, 2026'],
      ],
    }},

  { state: 7, author: 'weston', ts: '2:56 PM',
    body: "Oh, that's the GDPR field — DBA team added it after legal review. Sorry, should have flagged that." },

  { state: 8, author: 'optro', ts: '2:56 PM', kind: 'card',
    card: {
      header: 'Judgment trail',
      subtitle: 'Optro ECM',
      fields: [
        ["Marie's concern", 'New field provenance — where did <span class="cite">termination_date_normalized</span> come from?'],
        ["Weston's answer",  'GDPR compliance field added via <span class="cite">DBA-CR-2401</span>'],
        ['Linked artifacts', '<span class="cite">DBA-CR-2401</span> · <span class="cite">legal-review-apr12.pdf</span>'],
      ],
      actions: [
        { label: "Record exchange in 4.2.1's history", primary: true },
        { label: 'Edit summary' },
      ],
    }},

  { state: 9, author: 'marie', ts: '2:58 PM',
    body: 'Yes — record it. Good catch on the patch log.',
    reactions: ['👍 1'] },

  { state: 10, author: 'marie', ts: '3:01 PM', kind: 'card',
    card: {
      header: 'Reviewer sign-off · Q3 FY26',
      subtitle: 'Marie Curie',
      fields: [
        ['Outcome', '<strong>Approved with notes</strong>'],
        ['Reviewer note', '"Verified — new column documented via <span class="cite">DBA-CR-2401</span>, see thread for full context."'],
        ['Exchange link', '<span class="cite">thread://ctrl-4-2-1/q3-2026/exchange-1</span>'],
      ],
    }},

  { state: 11, author: 'optro', ts: '3:01 PM', kind: 'receipt',
    receipt: 'filed: <strong>AR-Q3FY26-prod-db.csv</strong> → control 4.2.1 · classifier 93% · routed=Marie · resolved 1 reviewer Q · 11 messages · chain=block #4,180,318' },
];
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 8.2: Open and verify all 11 states**

Run: `open /Users/sanderson/thread-borb/role-mediator.html`

Verify:
- [ ] State 1: Weston's message with attached CSV file chip and a 👀 reaction
- [ ] State 2: Marie's message added, both visible
- [ ] State 3: Optro context line appears (gray, small mark)
- [ ] State 4: Buttons-only row with 3 buttons, "Find the change source" is plain (not primary), "Stay out of it" has no danger styling (we changed our minds on this from earlier — verify the visual is plain). If they look wrong adjust the data.
- [ ] State 5: Two-column diff card — Q2 vs Q3 schemas, the new field highlighted yellow
- [ ] State 6: Change-source card with 4 field rows, citations in Slack blue with 🔗 prefix
- [ ] State 7: Weston's apology added
- [ ] State 8: Judgment-trail card with two action buttons, primary green
- [ ] State 9: Marie's "yes — record it" message with 👍 reaction
- [ ] State 10: Marie's sign-off card with outcome, reviewer note, exchange link
- [ ] State 11: Final receipt — monospaced text with `filed: ...`
- [ ] Keyboard: → / ← / Esc / End all work
- [ ] Jump-to-receipt link jumps to state 11
- [ ] Thread accumulates (state 11 still shows states 1–10 above)

- [ ] **Step 8.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add role-mediator.html
git commit -m "feat: role-mediator.html — canonical 11-state take, bot surfaces diff and CR ticket"
```

---

## Task 9: `role-drafter.html`

**Files:**
- Create: `~/thread-borb/role-drafter.html`

- [ ] **Step 9.1: Write `role-drafter.html`**

Same shell as Task 8 (only the title, breadcrumbs, axis-tag, ghost composer, page footer label, `STATE_CAPTIONS`, and `THREAD` differ).

Path: `/Users/sanderson/thread-borb/role-drafter.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · Optro ECM as Drafter</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Bot's role</span>
    <span class="take-title">Optro ECM as Drafter</span>
    <span class="axis-tag">Role · Drafter</span>
  </div>

  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>

  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">Channels</div>
        <div class="slack-channel"><span class="hash">#</span> sox-q3-close</div>
        <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
        <div class="slack-channel"><span class="hash">#</span> dba-team</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
        <div class="slack-channel"><span class="dot"></span> Marie Curie</div>
        <div class="slack-channel"><span class="dot"></span> Ada Lovelace</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header">
          <span style="color:#868686;font-family:ui-monospace,monospace;">#</span>
          ctrl-4-2-1
          <span class="topic">Quarterly user-access review · prod-db-01.helios</span>
        </header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar"><span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span><span class="divider">|</span><span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span></div>
            <div class="input-line is-ghost">Message #ctrl-4-2-1</div>
            <div class="send-row"><div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div><button class="send-btn" disabled>Send</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>

  <div class="page-footer">
    <span>Thread · Optro ECM as Drafter</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = {
  1:  "Bot opens the thread with a full Block Kit draft.",
  2:  "Weston joins, reads the draft.",
  3:  "Weston one-clicks Approve & file. Upload acknowledged.",
  4:  "Marie joins. Bot pings her with the pre-drafted reviewer note.",
  5:  "Marie reads the drafted note.",
  6:  "Marie clicks Edit. Inflates inline.",
  7:  "Marie changes 'checked' → 'verified'. Bot logs the edit.",
  8:  "Marie signs off.",
  9:  "Bot posts the filing receipt.",
  10: "Footer expander reveals why the bot earned the right to draft.",
};

const THREAD = [
  { state: 1, author: 'optro', ts: 'Friday · 9:00 AM',
    body: 'Q3 AR for <span class="cite">control 4.2.1</span> — drafted for you both.',
    kind: 'card',
    card: {
      header: 'Evidence draft · AR-Q3FY26-prod-db',
      subtitle: 'Optro ECM',
      fields: [
        ['Control',             '4.2.1'],
        ['Cadence',             'Quarterly'],
        ['Reviewer',            'Marie Curie'],
        ['Suggested artifact',  '<span class="cite">snow-query-AR-prod-db.csv</span>'],
        ['Proposed reviewer note', '"Checked — consistent with Q2."'],
      ],
      facts: ['5 prior identical-shape attestations · drift score 0.02 · pattern confidence 0.94'],
      actions: [
        { label: '✓ Approve & file', primary: true },
        { label: 'Edit query' },
        { label: 'Upload your own' },
      ],
    } },

  { state: 2, author: 'weston', ts: '9:14 AM',
    body: 'Reviewing the draft now.' },

  { state: 3, author: 'optro', ts: '9:14 AM', kind: 'context',
    body: 'uploaded by Weston · 1 click · awaiting reviewer sign-off' },

  { state: 4, author: 'optro', ts: '10:32 AM',
    body: 'Marie — I drafted what you usually sign for this control. Edit or approve below.',
    kind: 'card',
    card: {
      header: 'Drafted reviewer note · Q3 FY26',
      subtitle: 'Optro ECM',
      fields: [
        ['Drafted text',   '"Checked — consistent with Q2. No outliers flagged. Routine approval."'],
        ['Style match',    'Marie\'s prior Q2 / Q1 / Q4 sign-offs'],
        ['Style score',    '0.91'],
      ],
      actions: [
        { label: '✓ Approve', primary: true },
        { label: 'Edit' },
        { label: 'Rewrite from scratch' },
      ],
    } },

  { state: 5, author: 'marie', ts: '10:34 AM',
    body: 'Reading it now…' },

  { state: 6, author: 'marie', ts: '10:35 AM',
    body: 'Editing — one word change.' },

  { state: 7, author: 'optro', ts: '10:35 AM', kind: 'context',
    body: 'edit recorded · "checked" → "verified" · drafted-note pattern updated for future Q4 sign-offs' },

  { state: 8, author: 'marie', ts: '10:36 AM',
    body: 'Done — verified and signed.',
    reactions: ['✅ 1'] },

  { state: 9, author: 'optro', ts: '10:36 AM', kind: 'receipt',
    receipt: 'filed: <strong>snow-query-AR-prod-db.csv</strong> → control 4.2.1 · classifier 94% · routed=Marie · 1m32s end-to-end · 2 clicks · chain=block #4,180,221' },

  { state: 10, author: 'optro', ts: '10:36 AM', kind: 'expander',
    expander: {
      summary: 'Why I played drafter here',
      reveal: '5 prior identical-shape attestations · same reviewer · same artifact source · drift score 0.02 · pattern confidence 0.94. <br><br>The bot earns the right to draft only when prior pattern depth crosses 4 quarters AND drift &lt; 0.05 AND reviewer-style match &gt; 0.85. This control hit all three. Any one of them missing → the bot would have stayed in mediator mode instead.',
    } },
];
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 9.2: Open and verify 10 states**

Run: `open /Users/sanderson/thread-borb/role-drafter.html`

Verify:
- [ ] State 1: Block Kit card with header, 5 field rows including the drafted reviewer note, facts line with attestation stats, 3 action buttons (Approve & file primary green)
- [ ] State 4: Second card with "Drafted reviewer note · Q3 FY26", 3 fields, Approve/Edit/Rewrite buttons
- [ ] State 7: Context line showing the edit was recorded
- [ ] State 10: Expander — click "Why I played drafter here", it expands with the full reasoning
- [ ] Receipt at state 9 shows monospaced filing line

- [ ] **Step 9.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add role-drafter.html
git commit -m "feat: role-drafter.html — 10-state take, bot drafts ask + reviewer note in Marie's voice"
```

---

## Task 10: `role-silent.html`

**Files:**
- Create: `~/thread-borb/role-silent.html`

- [ ] **Step 10.1: Write `role-silent.html`**

Path: `/Users/sanderson/thread-borb/role-silent.html`

Same shell as Task 8. Differences:
- Title: `Thread · Optro ECM as Silent Auditor`
- Take title: `Optro ECM as Silent Auditor`
- Axis tag: `Role · Silent`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · Optro ECM as Silent Auditor</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Bot's role</span>
    <span class="take-title">Optro ECM as Silent Auditor</span>
    <span class="axis-tag">Role · Silent</span>
  </div>
  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>
  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">Channels</div>
        <div class="slack-channel"><span class="hash">#</span> sox-q3-close</div>
        <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
        <div class="slack-channel"><span class="hash">#</span> dba-team</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
        <div class="slack-channel"><span class="dot"></span> Marie Curie</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header">
          <span style="color:#868686;font-family:ui-monospace,monospace;">#</span> ctrl-4-2-1
          <span class="topic">Quarterly user-access review · prod-db-01.helios</span>
        </header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar"><span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span><span class="divider">|</span><span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span></div>
            <div class="input-line is-ghost">Message #ctrl-4-2-1</div>
            <div class="send-row"><div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div><button class="send-btn" disabled>Send</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>
  <div class="page-footer">
    <span>Thread · Optro ECM as Silent Auditor</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = {
  1:  "Weston posts. Bot silent.",
  2:  "Marie acknowledges. Bot silent.",
  3:  "Marie hovers her sign-off button. Bot interjects ONCE.",
  4:  "The single context fact behind the interjection.",
  5:  "Marie asks Weston. Bot silent.",
  6:  "Weston pings the DBA lead in a side thread. Bot silent.",
  7:  "DBA lead responds in the side thread (visible as a pill).",
  8:  "Bot auto-links the side-thread resolution into the main thread.",
  9:  "Marie signs off with the addendum stapled on.",
  10: "Final receipt with the anomaly flag + resolution.",
  11: "Footer expander: why the bot interrupted.",
  12: "Bot's silence after sealing — no chatter, no follow-up.",
};

const THREAD = [
  { state: 1, author: 'weston', ts: '11:02 AM',
    body: 'Q3 AR done — same as Q2, file attached.',
    attachment: 'AR-Q3FY26-prod-db.csv' },

  { state: 2, author: 'marie', ts: '11:21 AM',
    body: 'Looks good — signing off.' },

  { state: 3, author: 'optro', ts: '11:21 AM', kind: 'ephemeral',
    ephemeral: {
      label: 'Before you sign — heads up',
      body: 'DBA cleanup ticket <span class="cite">DBA-2407</span> closed Friday without an attestation from the DBA-team lead. <strong>First time in 4 quarters that\'s happened.</strong>',
    } },

  { state: 4, author: 'optro', ts: '11:21 AM', kind: 'context',
    body: '4 prior quarters had a DBA attestation within 48hr of cleanup-ticket close. Q3 broke that pattern.' },

  { state: 5, author: 'marie', ts: '11:23 AM',
    body: 'Weston, did you see this?' },

  { state: 6, author: 'weston', ts: '11:24 AM',
    body: "Hmm — that's weird. Let me ping the DBA lead." },

  { state: 7, author: 'weston', ts: '11:31 AM',
    body: 'Side thread with DBA lead:',
    kind: 'side-thread',
    sideThread: {
      participants: ['weston', 'optro'],
      summary: 'Last reply 4m ago — DBA lead confirmed cleanup, sent attestation',
      count: 3,
    } },

  { state: 8, author: 'optro', ts: '11:35 AM', kind: 'context',
    body: 'attestation received · DBA-team-lead · <span class="cite">linked here</span>' },

  { state: 9, author: 'marie', ts: '11:38 AM', kind: 'card',
    card: {
      header: 'Reviewer sign-off · Q3 FY26',
      subtitle: 'Marie Curie',
      fields: [
        ['Outcome', '<strong>Approved with addendum</strong>'],
        ['Reviewer note', '"Verified — required additional attestation from DBA-team lead, see linked side thread."'],
        ['Addendum',    '<span class="cite">DBA-team-lead attestation · 11:35 AM Apr 14</span>'],
      ],
    } },

  { state: 10, author: 'optro', ts: '11:38 AM', kind: 'receipt',
    receipt: 'filed: <strong>AR-Q3FY26-prod-db.csv</strong> → control 4.2.1 · 1 anomaly flagged + resolved · 2 attestations attached · chain=block #4,180,402' },

  { state: 11, author: 'optro', ts: '11:38 AM', kind: 'expander',
    expander: {
      summary: 'Why I interrupted',
      reveal: '4 prior quarters had a DBA-team-lead attestation within 48hr of cleanup-ticket close. Q3 had no attestation. The bot stays silent unless prior pattern breaks at a confidence threshold of 0.9 or higher. This was 1.0.',
    } },

  { state: 12, author: 'optro', ts: '11:39 AM', kind: 'context',
    body: 'thread sealed · 12 messages · 1 bot interjection · 0 bot follow-ups' },
];
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 10.2: Open and verify 12 states**

Run: `open /Users/sanderson/thread-borb/role-silent.html`

Verify:
- [ ] States 1–2 are pure human conversation, no bot messages
- [ ] State 3: yellow-amber ephemeral box with "BEFORE YOU SIGN — HEADS UP" label
- [ ] State 4: muted context line explaining the pattern break
- [ ] State 6 → State 7: side-thread pill appears, showing avatars + reply count + "last reply 4m ago"
- [ ] State 9: Marie's sign-off card with three fields including the addendum
- [ ] State 11: Expander reveal — confidence threshold 0.9, this was 1.0
- [ ] State 12: Final "thread sealed · 12 messages · 1 bot interjection" line as bot context

- [ ] **Step 10.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add role-silent.html
git commit -m "feat: role-silent.html — 12-state take, bot interrupts once on near-miss, side thread embedded"
```

---

## Task 11: `unit-ask.html`

**Files:**
- Create: `~/thread-borb/unit-ask.html`

**Note:** This take's sidebar shows multiple asks (`t1`, `t2`, `t3`, archive) and the active item changes across states. We handle this by re-rendering sidebar context as part of the take's HTML when states require it — but for v1, we keep the static sidebar and use the *channel header* + state captions to communicate which "ask thread" is in focus. Switching active ask = switching channel-header text + main-column messages.

- [ ] **Step 11.1: Write `unit-ask.html`**

Path: `/Users/sanderson/thread-borb/unit-ask.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · One thread per evidence ask</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Granularity</span>
    <span class="take-title">One thread per evidence ask</span>
    <span class="axis-tag">Unit · Ask</span>
  </div>
  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>
  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">Open asks</div>
        <div class="slack-channel"><span class="hash">▸</span> t1 · Q3 AR prod-db</div>
        <div class="slack-channel is-active"><span class="hash">▸</span> t2 · SOC2 firewall export</div>
        <div class="slack-channel"><span class="hash">▸</span> t3 · Priv-account list Q3</div>
        <div class="slack-section">Filed asks (47)</div>
        <div class="slack-channel" style="color:rgba(255,255,255,0.4);">▾ See archive</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header" id="ask-header">
          <span style="color:#868686;">▸</span>
          <span id="ask-title">t2 · SOC2 firewall rule export</span>
          <span class="topic" id="ask-topic">Stalled 3 days · due Wed</span>
        </header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar"><span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span><span class="divider">|</span><span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span></div>
            <div class="input-line is-ghost">Reply in this thread</div>
            <div class="send-row"><div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div><button class="send-btn" disabled>Send</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>
  <div class="page-footer">
    <span>Thread · One thread per evidence ask</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = {
  1:  "t2 (SOC2 firewall) — Optro ECM's opening ask, posted Tuesday.",
  2:  "Day 1 — Weston doesn't reply.",
  3:  "Day 3 — Bot posts a soft nudge.",
  4:  "Weston responds, drops the artifact.",
  5:  "Bot auto-tags, seals thread t2.",
  6:  "Switch to t1 (Q3 AR prod-db) — Marie just approved.",
  7:  "Bot seals t1 with receipt.",
  8:  "Switch to t3 (priv-account list) — bot's opening ask only.",
  9:  "Switch to 'Filed asks' archive — scroll feed of 47 sealed threads.",
  10: "A new ask thread t-q4-1 appears at top: Sarah Kim referencing a Q2 sealed thread.",
};

// All threads share one #slack-messages container. The sidebar header text and topic update via JS in onState (declared below).
// For simplicity, this take's messages all live in one THREAD with their own state markers — the JS resets the header text per state.

window.addEventListener('load', () => {
  // Patch flow.js's go() with header swaps. We listen to state changes via a small MutationObserver on the messages container.
  const headerMap = {
    1: { title: 't2 · SOC2 firewall rule export', topic: 'Stalled 3 days · due Wed' },
    2: { title: 't2 · SOC2 firewall rule export', topic: 'Day 1 — no reply' },
    3: { title: 't2 · SOC2 firewall rule export', topic: 'Day 3 — bot nudge' },
    4: { title: 't2 · SOC2 firewall rule export', topic: 'Day 3 — artifact dropped' },
    5: { title: 't2 · SOC2 firewall rule export', topic: 'Sealed · 4 messages' },
    6: { title: 't1 · Q3 AR prod-db', topic: 'Mid-review · Marie just approved' },
    7: { title: 't1 · Q3 AR prod-db', topic: 'Sealed · 6 messages' },
    8: { title: 't3 · Priv-account list Q3', topic: 'Just opened · awaiting Weston' },
    9: { title: 'Filed asks · this quarter', topic: '47 sealed threads' },
    10: { title: 't-q4-1 · Q4 backup retention attestation', topic: 'Just opened by Sarah Kim · references Q2 sealed thread' },
  };
  const updateHeader = (n) => {
    const t = document.getElementById('ask-title');
    const topic = document.getElementById('ask-topic');
    if (t && headerMap[n]) t.textContent = headerMap[n].title;
    if (topic && headerMap[n]) topic.textContent = headerMap[n].topic;
  };
  // Watch the pill row for active-class changes
  const pills = document.getElementById('state-pills');
  if (!pills) return;
  const observer = new MutationObserver(() => {
    const active = pills.querySelector('.pill.is-active');
    if (active) updateHeader(Number(active.dataset.state));
  });
  observer.observe(pills, { subtree: true, attributes: true, attributeFilter: ['class'] });
  // initial
  setTimeout(() => updateHeader(1), 0);
});

const THREAD = [
  // --- t2 SOC2 firewall ask ---
  { state: 1, author: 'optro', ts: 'Tue · 9:00 AM',
    body: 'Q3 SOC2 firewall rule export needed by Wed close.',
    kind: 'card',
    card: {
      header: 'Evidence ask · SOC2 firewall rules',
      subtitle: 'Optro ECM',
      fields: [
        ['Control',       'SOC2-CC6.1'],
        ['Due',           'Wed Apr 30, 17:00'],
        ['Reviewer',      'Marie Curie'],
        ['Suggested artifact', '<span class="cite">snow-fw-export.csv</span> (same as Q2)'],
      ],
      actions: [
        { label: '✓ Approve & file', primary: true },
        { label: 'Upload your own' },
      ],
    } },
  { state: 2, author: 'optro', ts: 'Tue · 9:00 AM', kind: 'context',
    body: 'waiting on Weston · 0 replies' },

  { state: 3, author: 'optro', ts: 'Thu · 8:45 AM',
    body: 'Heads up Weston — this is due Wed (today). Want me to ping you again tomorrow morning?',
    kind: 'buttons-only',
    buttons: [
      { label: 'Snooze 24hr' },
      { label: 'I\'ll file it now', primary: true },
    ] },

  { state: 4, author: 'weston', ts: 'Thu · 9:12 AM',
    body: 'Sorry, in IDS-tuning all week — file attached.',
    attachment: 'snow-fw-export-q3.csv' },

  { state: 5, author: 'optro', ts: 'Thu · 9:12 AM', kind: 'receipt',
    receipt: 'filed: <strong>snow-fw-export-q3.csv</strong> → SOC2-CC6.1 · classifier 96% · routed=Marie · 1 bot nudge + 1 reply · thread sealed' },

  // --- t1 Q3 AR prod-db ---
  { state: 6, author: 'weston', ts: 'Fri · 2:48 PM',
    body: 'Q3 AR attached.',
    attachment: 'AR-Q3FY26-prod-db.csv' },

  { state: 6, author: 'marie', ts: 'Fri · 3:00 PM',
    body: 'Approved — clean Q3, consistent with Q2.',
    reactions: ['✅ 1'] },

  { state: 7, author: 'optro', ts: 'Fri · 3:00 PM', kind: 'receipt',
    receipt: 'filed: <strong>AR-Q3FY26-prod-db.csv</strong> → control 4.2.1 · classifier 94% · routed=Marie · 6 messages · thread sealed · chain=block #4,180,318' },

  // --- t3 priv-account list ---
  { state: 8, author: 'optro', ts: 'Fri · 4:10 PM',
    body: 'Q3 priv-account list ask for IT Lead.',
    kind: 'card',
    card: {
      header: 'Evidence ask · Privileged account list',
      subtitle: 'Optro ECM',
      fields: [
        ['Control',  '5.1.2'],
        ['Due',      'Mon Apr 28'],
        ['Reviewer', 'Marie Curie'],
      ],
      actions: [
        { label: '✓ Approve & file', primary: true },
        { label: 'Upload your own' },
      ],
    } },
  { state: 8, author: 'optro', ts: 'Fri · 4:10 PM', kind: 'context',
    body: 'thread just opened · awaiting Weston · 0 replies' },

  // --- archive view ---
  { state: 9, author: 'optro', ts: 'Filed feed', kind: 'card',
    card: {
      header: '47 sealed threads · Q3 FY26',
      subtitle: 'Filed asks archive',
      facts: [
        '<span class="cite">t1 · Q3 AR prod-db</span> — sealed Fri 3:00 PM · chain #4,180,318',
        '<span class="cite">t2 · SOC2 firewall export</span> — sealed Thu 9:12 AM',
        '<span class="cite">t-43 · Q3 backup retention</span> — sealed Apr 8',
        '<span class="cite">t-42 · IAM role review</span> — sealed Apr 7',
        '… 43 more',
      ],
    } },

  // --- new auditor ask referencing Q2 sealed thread ---
  { state: 10, author: 'sarah', ts: 'Tue · 10:14 AM',
    body: 'Opening a new ask for Q4 backup retention — referencing the Q2 sealed thread for context.',
    kind: 'card',
    card: {
      header: 'New ask · Q4 backup retention attestation',
      subtitle: 'Sarah Kim · External Auditor',
      fields: [
        ['References', '<span class="cite">t-22 · Q2 backup retention · sealed Jan 3, 2026</span>'],
        ['Control',    '7.3.4'],
        ['Due',        'May 30'],
      ],
      facts: ['Q2 sealed thread auto-attached. Optro ECM resurrected the relevant context (reviewer note, artifact, chain anchor) for Sarah\'s reference.'],
    } },
];
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 11.2: Open and verify 10 states**

Run: `open /Users/sanderson/thread-borb/unit-ask.html`

Verify:
- [ ] State 1: header shows "t2 · SOC2 firewall rule export" with topic "Stalled 3 days · due Wed", Optro's ask card visible
- [ ] State 3: Bot posts a soft-nudge message with "Snooze 24hr / I'll file it now" buttons
- [ ] State 5: t2 sealed, receipt visible
- [ ] State 6: header text changes to "t1 · Q3 AR prod-db", new messages from Weston and Marie appear *while previous t2 messages remain visible above*
- [ ] State 8: header changes to "t3 · Priv-account list Q3", new ask card from Optro
- [ ] State 9: header changes to "Filed asks · this quarter", archive card with 4 visible items + "43 more"
- [ ] State 10: header changes to "t-q4-1 · Q4 backup retention attestation", Sarah Kim's new ask references the Q2 sealed thread

Note: this take intentionally shows multiple threads' messages concatenated in one accumulated view — the channel header text is the navigation cue. This is a stylization, not a literal Slack feature.

- [ ] **Step 11.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add unit-ask.html
git commit -m "feat: unit-ask.html — 10-state take, 3 parallel asks + archive + cross-thread reference"
```

---

## Task 12: `unit-control.html`

**Files:**
- Create: `~/thread-borb/unit-control.html`

- [ ] **Step 12.1: Write `unit-control.html`**

Path: `/Users/sanderson/thread-borb/unit-control.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · One thread per control</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
<style>
.collapsed-sticky {
  margin: 4px 20px;
  padding: 6px 12px;
  background: #F4F5F7;
  border-left: 3px solid #C8C8C8;
  border-radius: 4px;
  font-size: 12px;
  color: #4A4A4A;
  display: flex;
  align-items: center;
  gap: 8px;
}
.collapsed-sticky .check { color: #007A5A; font-weight: 800; }

.health-card {
  margin: 16px 20px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #FAFBFC, #F4F5F7);
  border: 1px solid #D5DAE0;
  border-radius: 6px;
  font-size: 13px;
}
.health-card .label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #868686;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.health-card .stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  font-size: 12px;
}
.health-card .stats .stat .num {
  font-size: 18px;
  font-weight: 800;
  display: block;
  color: #1D1C1D;
}
.health-card .stats .stat .lbl {
  color: #868686;
  font-size: 11px;
}
</style>
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Granularity</span>
    <span class="take-title">One thread per control</span>
    <span class="axis-tag">Unit · Control</span>
  </div>
  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>
  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">SOX controls</div>
        <div class="slack-channel is-active"><span class="hash">#</span> ctrl-4-2-1</div>
        <div class="slack-channel"><span class="hash">#</span> ctrl-4-2-2</div>
        <div class="slack-channel"><span class="hash">#</span> ctrl-5-1-1</div>
        <div class="slack-channel"><span class="hash">#</span> ctrl-6-2-1</div>
        <div class="slack-channel" style="color:rgba(255,255,255,0.45);">+ 43 more</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header">
          <span style="color:#868686;font-family:ui-monospace,monospace;">#</span> ctrl-4-2-1
          <span class="topic">Quarterly user-access review · prod-db-01.helios · 4 quarters of history</span>
        </header>
        <div id="control-stickies"></div>
        <div class="slack-messages" id="slack-messages"></div>
        <div id="control-pinned-bottom"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar"><span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span><span class="divider">|</span><span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span></div>
            <div class="input-line is-ghost">Message #ctrl-4-2-1</div>
            <div class="send-row"><div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div><button class="send-btn" disabled>Send</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>
  <div class="page-footer">
    <span>Thread · One thread per control</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
// Render the 3 collapsed Q4/Q1/Q2 stickies above the message area (always visible).
window.addEventListener('load', () => {
  const host = document.getElementById('control-stickies');
  if (host) host.innerHTML = `
    <div class="collapsed-sticky"><span class="check">✓</span> Q4 FY25 sign-off · Marie · Jan 14, 2026 · clean · turnaround 1.1d</div>
    <div class="collapsed-sticky"><span class="check">✓</span> Q1 FY26 sign-off · Marie · Apr 14, 2026 · clean · turnaround 1.3d</div>
    <div class="collapsed-sticky"><span class="check">✓</span> Q2 FY26 sign-off · Marie · Jul 14, 2026 · clean · turnaround 1.0d</div>
  `;
});

const STATE_CAPTIONS = {
  1:  "Open #ctrl-4-2-1. Q4/Q1/Q2 sign-offs collapsed at the top.",
  2:  "Bot posts the Q3 ask with a drift-since-Q2 mini-card.",
  3:  "Weston files the Q3 artifact.",
  4:  "Bot auto-compares vs the 3 prior quarters.",
  5:  "Marie joins, reads the drift card.",
  6:  "Marie clicks 'view prior 3 sign-offs' — Q4/Q1/Q2 expand inline.",
  7:  "Marie signs off with a history-aware boilerplate.",
  8:  "Bot collapses Q3 into a new sticky at top.",
  9:  "Pinned control-health card appears at the thread bottom.",
  10: "4 quarters · 4 clean · 0 disputes · drift stable.",
};

const THREAD = [
  { state: 1, author: 'optro', ts: 'Apr 1 · 9:00 AM', kind: 'context',
    body: 'control thread alive since Oct 14, 2025 · 4 prior quarters · 4 prior clean sign-offs' },

  { state: 2, author: 'optro', ts: 'Apr 7 · 9:00 AM',
    body: 'Q3 AR ask for <span class="cite">control 4.2.1</span>.',
    kind: 'card',
    card: {
      header: 'Evidence ask · Q3 FY26 · 4.2.1',
      subtitle: 'Optro ECM',
      fields: [
        ['Reviewer',  'Marie Curie'],
        ['Due',       'Apr 14 (T+7)'],
        ['Drift since Q2',  'row count Q4→Q1→Q2 sparkline · schema unchanged · reviewer turnaround avg 1.2d'],
      ],
    }},

  { state: 3, author: 'weston', ts: 'Apr 12 · 11:20 AM',
    body: 'Q3 file attached.',
    attachment: 'AR-Q3FY26-prod-db.csv' },

  { state: 4, author: 'optro', ts: 'Apr 12 · 11:20 AM', kind: 'card',
    card: {
      header: 'Auto-compare vs 3 prior quarters',
      subtitle: 'Optro ECM',
      fields: [
        ['Row count',     'Q4: 247 · Q1: 251 · Q2: 254 · Q3: 261 (+3%, in band)'],
        ['Schema',        'identical to Q2 (12 cols)'],
        ['Source query',  'identical to Q2'],
        ['File size',     '+127kb (within 5% band)'],
      ],
    } },

  { state: 5, author: 'marie', ts: 'Apr 14 · 9:14 AM',
    body: 'Reading the drift card.' },

  { state: 6, author: 'marie', ts: 'Apr 14 · 9:15 AM',
    body: 'Expanding prior 3 sign-offs.',
    kind: 'context',
    context: 'Q4 + Q1 + Q2 stickies expanded inline for Marie' },

  { state: 7, author: 'marie', ts: 'Apr 14 · 9:17 AM', kind: 'card',
    card: {
      header: 'Reviewer sign-off · Q3 FY26',
      subtitle: 'Marie Curie',
      fields: [
        ['Outcome', '<strong>Approved</strong>'],
        ['Reviewer note', '"Verified — consistent with 3 prior quarters."'],
        ['History link', '<span class="cite">view prior 3 sign-offs</span>'],
      ],
    } },

  { state: 8, author: 'optro', ts: 'Apr 14 · 9:17 AM', kind: 'context',
    body: 'Q3 sign-off collapsed to top sticky · 4 quarters of history in this thread' },

  { state: 9, author: 'optro', ts: 'Apr 14 · 9:18 AM', kind: 'receipt',
    receipt: 'filed: <strong>AR-Q3FY26-prod-db.csv</strong> → control 4.2.1 · classifier 96% · drift 0.02 (stable) · history graph anchored · chain=block #4,180,500' },

  { state: 10, author: 'optro', ts: 'Apr 14 · 9:18 AM',
    body: 'Pinned to the thread footer:',
    kind: 'card',
    card: {
      header: 'Control health · 4.2.1',
      subtitle: 'Optro ECM · live',
      facts: ['Pinned · always visible at thread bottom'],
    } },
];

window.addEventListener('load', () => {
  const setHealth = (showIt) => {
    const host = document.getElementById('control-pinned-bottom');
    if (!host) return;
    host.innerHTML = showIt ? `
      <div class="health-card">
        <div class="label">Control health · 4.2.1 · pinned</div>
        <div class="stats">
          <div class="stat"><span class="num">4</span><span class="lbl">quarters</span></div>
          <div class="stat"><span class="num">4</span><span class="lbl">clean reviews</span></div>
          <div class="stat"><span class="num">0</span><span class="lbl">disputes</span></div>
          <div class="stat"><span class="num">1.2d</span><span class="lbl">avg turnaround</span></div>
          <div class="stat"><span class="num">stable</span><span class="lbl">drift trend</span></div>
        </div>
      </div>
    ` : '';
  };
  // Mirror state→pinned card via the pill-row observer
  const pills = document.getElementById('state-pills');
  if (!pills) return;
  new MutationObserver(() => {
    const active = pills.querySelector('.pill.is-active');
    if (active) setHealth(Number(active.dataset.state) >= 10);
  }).observe(pills, { subtree: true, attributes: true, attributeFilter: ['class'] });
});
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 12.2: Open and verify 10 states**

Run: `open /Users/sanderson/thread-borb/unit-control.html`

Verify:
- [ ] Above the messages area: 3 collapsed Q4/Q1/Q2 sticky rows with green checks (always visible regardless of state)
- [ ] State 2: drift-card from Optro with Q4→Q1→Q2 sparkline mention, schema, turnaround
- [ ] State 4: auto-compare card with 4 field rows
- [ ] State 7: Marie's sign-off card with history link
- [ ] State 9: receipt with chain anchor
- [ ] State 10: pinned "Control health · 4.2.1" card appears below messages with 5 stat cells (4 quarters, 4 clean, 0 disputes, 1.2d, stable)
- [ ] Pressing ← back to state 9 hides the pinned health card

- [ ] **Step 12.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add unit-control.html
git commit -m "feat: unit-control.html — 10-state take, 4-quarter history with drift card + pinned health card"
```

---

## Task 13: `unit-period.html`

**Files:**
- Create: `~/thread-borb/unit-period.html`

- [ ] **Step 13.1: Write `unit-period.html`**

Path: `/Users/sanderson/thread-borb/unit-period.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread · One thread per close period</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
<style>
.day-marker {
  display: flex;
  align-items: center;
  margin: 14px 20px 4px;
  gap: 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #868686;
  text-transform: uppercase;
}
.day-marker::before, .day-marker::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #DDDDDD;
}
</style>
</head>
<body>
<div id="flow-root" class="page">
  <div class="page-caption">
    <span class="crumbs"><a href="index.html">Thread</a><span class="sep">·</span> Granularity</span>
    <span class="take-title">One thread per close period</span>
    <span class="axis-tag">Unit · Period</span>
  </div>
  <div class="state-pills" id="state-pills"></div>
  <span class="state-pills-controls" id="state-controls"></span>
  <div class="page-layout">
    <div class="slack-window">
      <aside class="slack-sidebar">
        <div class="slack-workspace"><span class="workspace-mark" style="background:#266c92;">H</span>Helios Robotics</div>
        <div class="slack-section">Close periods</div>
        <div class="slack-channel is-active"><span class="hash">#</span> q3-fy26-close</div>
        <div class="slack-channel"><span class="hash">#</span> q2-fy26-close · sealed</div>
        <div class="slack-channel"><span class="hash">#</span> q1-fy26-close · sealed</div>
        <div class="slack-section">SOX controls</div>
        <div class="slack-channel"><span class="hash">#</span> ctrl-4-2-1</div>
        <div class="slack-channel"><span class="hash">#</span> ctrl-5-1-2</div>
        <div class="slack-section">Direct messages</div>
        <div class="slack-channel"><span class="dot is-online"></span> Optro ECM</div>
        <div class="slack-channel"><span class="dot"></span> Ada Lovelace</div>
      </aside>
      <main class="slack-main">
        <header class="slack-header">
          <span style="color:#868686;font-family:ui-monospace,monospace;">#</span> q3-fy26-close
          <span class="topic">Quarterly SOX close · 47 controls · Mar 1 → Mar 31 2026</span>
        </header>
        <div class="slack-messages" id="slack-messages"></div>
        <div class="slack-composer">
          <div class="input-shell">
            <div class="toolbar"><span class="tool"><b>B</b></span><span class="tool"><i>I</i></span><span class="tool"><s>S</s></span><span class="divider">|</span><span class="tool">🔗</span><span class="tool">≡</span><span class="tool">"</span><span class="tool">{ }</span></div>
            <div class="input-line is-ghost">Message #q3-fy26-close</div>
            <div class="send-row"><div class="icons"><span class="icon">+</span><span class="icon">📎</span><span class="icon">@</span><span class="icon">😊</span></div><button class="send-btn" disabled>Send</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="page-side">
      <div class="state-caption" id="state-caption"></div>
      <a href="#" class="jump-link" id="jump-to-receipt">→ Jump to receipt</a>
    </div>
  </div>
  <div class="page-footer">
    <span>Thread · One thread per close period</span>
    <span><a href="index.html">← All takes</a></span>
  </div>
</div>

<script src="scenario.js"></script>
<script>
const STATE_CAPTIONS = {
  1:  "Day 1 — Optro ECM opens the close thread. Pings Ada.",
  2:  "Day 1 — Ada posts the kickoff.",
  3:  "Day 4 — first daily digest.",
  4:  "Day 12 — digest names top-of-pile.",
  5:  "Day 12 — Weston files 4.2.1 inline.",
  6:  "Day 14 — Marie approves inline.",
  7:  "Day 22 — bot escalates a risk to Ada.",
  8:  "Day 22 — Ada joins the risk sub-thread, pings DBA lead.",
  9:  "Day 24 — DBA freeze partially lifted for SOX controls.",
  10: "Day 26 — daily digest, 42/47 cleared.",
  11: "Day 28 — close-package preview.",
  12: "Day 30 — final 5 clear. Bot posts the close-package summary.",
  13: "Day 30 — audit-evidence bundle generated. Thread is the close.",
};

// Helper: insert a day marker into the rendered messages by appending a 'kind:day-marker' message
// flow.js doesn't natively render day-markers — we extend by injecting a custom DOM node post-render.

window.addEventListener('load', () => {
  const pills = document.getElementById('state-pills');
  const msgs = document.getElementById('slack-messages');
  if (!pills || !msgs) return;

  const dayOf = {
    1: 'Day 1 — Mar 1', 2: 'Day 1 — Mar 1', 3: 'Day 4 — Mar 4',
    4: 'Day 12 — Mar 12', 5: 'Day 12 — Mar 12', 6: 'Day 14 — Mar 14',
    7: 'Day 22 — Mar 22', 8: 'Day 22 — Mar 22', 9: 'Day 24 — Mar 24',
    10: 'Day 26 — Mar 26', 11: 'Day 28 — Mar 28', 12: 'Day 30 — Mar 31', 13: 'Day 30 — Mar 31',
  };

  const decorate = () => {
    // Remove any existing day markers
    msgs.querySelectorAll('.day-marker').forEach(n => n.remove());
    let lastDay = '';
    Array.from(msgs.children).forEach(child => {
      // We rely on the order of messages matching THREAD; use data-state attribute? flow.js doesn't add one.
      // Instead, re-derive by matching the message body text — pragmatic for this take.
    });
    // Simpler: insert markers at fixed positions based on the current state.
    const active = pills.querySelector('.pill.is-active');
    if (!active) return;
    const cur = Number(active.dataset.state);
    const days = [];
    for (let i = 1; i <= cur; i++) {
      if (!days.includes(dayOf[i])) days.push(dayOf[i]);
    }
    // Insert markers above each message group. Approximate by message index per state.
    // Rather than precise insertion, prepend a single marker for the current focus.
    // Easier and clean: prepend one marker per unique day at the *start* of the message list, plus one before each new-day message.
    // We'll do this by counting messages per state from THREAD itself.
  };

  new MutationObserver(decorate).observe(msgs, { childList: true });
  // initial
  setTimeout(decorate, 0);
});

const THREAD = [
  { state: 1, author: 'optro', ts: 'Mar 1 · 9:00 AM',
    body: 'Q3 FY26 close opens. Daily digest at 5pm.',
    kind: 'card',
    card: {
      header: 'Q3 FY26 close · kickoff',
      subtitle: 'Optro ECM',
      fields: [
        ['Controls due',  '47'],
        ['Window',        'Mar 1 → Mar 31'],
        ['PMO',           'Ada Lovelace'],
        ['Daily digest',  '5:00 PM workspace local'],
      ],
    } },
  { state: 1, author: 'optro', ts: 'Mar 1 · 9:00 AM', kind: 'context',
    body: 'pinged @Ada · 47 controls assigned to 9 owners' },

  { state: 2, author: 'ada', ts: 'Mar 1 · 9:14 AM',
    body: "Let's go. Flag anything stuck within 48hr." },

  { state: 3, author: 'optro', ts: 'Mar 4 · 5:00 PM', kind: 'context',
    body: 'Day 4 · 3/47 cleared · 0 stalled · 0 disputes' },

  { state: 4, author: 'optro', ts: 'Mar 12 · 5:00 PM',
    body: 'Day 12 digest.',
    kind: 'card',
    card: {
      header: 'Day 12 · digest',
      subtitle: 'Optro ECM',
      fields: [
        ['Cleared',    '23/47'],
        ['Disputes',   '2 open'],
        ['Missing',    '1 attestation'],
        ['Top of pile','4.2.1, 5.1.2'],
      ],
    } },

  { state: 5, author: 'weston', ts: 'Mar 12 · 5:14 PM',
    body: 'Filing 4.2.1 — Q3 AR for prod-db.',
    attachment: 'AR-Q3FY26-prod-db.csv' },

  { state: 6, author: 'marie', ts: 'Mar 14 · 10:02 AM',
    body: '4.2.1 approved — clean.',
    reactions: ['✅ 1'] },

  { state: 7, author: 'optro', ts: 'Mar 22 · 11:30 AM', kind: 'card',
    card: {
      header: '⚠ Risk escalation',
      subtitle: 'Optro ECM',
      fields: [
        ['Risk',     '3 controls depend on the DBA team\'s frozen change window'],
        ['Affected', '6.1.4, 6.2.1, 6.2.2'],
        ['Freeze ends', 'Mar 26 (Day 26)'],
        ['Recommend', 'Escalate to @Ada · request partial unfreeze for SOX scope'],
      ],
      actions: [
        { label: 'Escalate now', primary: true },
        { label: 'Wait for unfreeze' },
      ],
    } },

  { state: 8, author: 'ada', ts: 'Mar 22 · 11:42 AM',
    body: 'Escalating — pinging DBA lead in side thread.',
    kind: 'side-thread',
    sideThread: {
      participants: ['ada', 'optro'],
      summary: 'Last reply 2hr ago — DBA lead agrees to partial unfreeze',
      count: 6,
    } },

  { state: 9, author: 'optro', ts: 'Mar 24 · 9:00 AM', kind: 'context',
    body: 'DBA freeze partially lifted for SOX scope (6.1.4, 6.2.1, 6.2.2) — Ada\'s ask approved' },

  { state: 10, author: 'optro', ts: 'Mar 26 · 5:00 PM', kind: 'context',
    body: 'Day 26 · 42/47 cleared · 3 in review · 2 pending' },

  { state: 11, author: 'optro', ts: 'Mar 28 · 5:00 PM',
    body: 'Close-package preview.',
    kind: 'card',
    card: {
      header: 'Q3 FY26 close package · preview',
      subtitle: 'Optro ECM',
      facts: [
        '44/47 controls cleared',
        '3 in final review · projected to clear by Day 30',
        '2 disputes resolved · 1 reviewer Q resolved',
        'Click any control to drill into its thread',
      ],
    } },

  { state: 12, author: 'optro', ts: 'Mar 31 · 4:45 PM',
    body: 'Final 5 cleared.',
    kind: 'card',
    card: {
      header: 'Q3 FY26 close · summary',
      subtitle: 'Optro ECM',
      fields: [
        ['Controls cleared', '47/47'],
        ['Total disputes',   '2 (both resolved)'],
        ['Reviewer Qs',      '4 (all resolved)'],
        ['Avg turnaround',   '1.4 days'],
        ['Chain anchor',     '<span class="cite">block #4,180,872</span>'],
      ],
    } },

  { state: 13, author: 'optro', ts: 'Mar 31 · 4:46 PM', kind: 'receipt',
    receipt: 'sealed: <strong>q3-fy26-close</strong> · 47/47 · audit-evidence bundle: <strong>q3-fy26-close-package.zip</strong> · 1.4 GB · the thread <strong>is</strong> the close' },
];
</script>
<script src="flow.js"></script>
</body>
</html>
```

- [ ] **Step 13.2: Open and verify 13 states**

Run: `open /Users/sanderson/thread-borb/unit-period.html`

Verify:
- [ ] Channel header reads `# q3-fy26-close`, topic `47 controls · Mar 1 → Mar 31 2026`
- [ ] State 1: kickoff card + bot context "pinged @Ada"
- [ ] State 4: Day 12 digest card with 23/47 cleared, top-of-pile list
- [ ] State 7: Risk escalation card with warning icon in header, "Escalate now" primary button
- [ ] State 8: Ada's message + a side-thread pill showing 6 replies, "Last reply 2hr ago"
- [ ] State 11: Close-package preview card
- [ ] State 12: Final summary card with 47/47, chain anchor citation
- [ ] State 13: Final receipt declaring the close-package zip

Note: the day-marker decoration is currently a no-op stub — we'll skip it for v1 since timestamps already convey day boundaries.

- [ ] **Step 13.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add unit-period.html
git commit -m "feat: unit-period.html — 13-state take, 30-day close as a single thread with daily digests + risk escalation"
```

---

## Task 14: `index.html` (Landing)

**Files:**
- Create: `~/thread-borb/index.html`

- [ ] **Step 14.1: Write `index.html`**

Path: `/Users/sanderson/thread-borb/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<script src="gate.js"></script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thread — multi-party SOX evidence in Slack</title>
<link rel="stylesheet" href="slack-chrome.css?v=20260615" />
<link rel="stylesheet" href="optro-card.css?v=20260615" />
<link rel="stylesheet" href="flow.css?v=20260615" />
<style>
.landing { max-width: 1180px; margin: 0 auto; padding: 36px 24px 64px; }
.landing .hero-still {
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  margin-bottom: 28px;
  height: 360px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #F8F9FA, #EEF1F4);
  color: #4A4A4A;
  font-size: 14px;
  font-style: italic;
}
.landing h1 {
  font-family: "Slack-Lato", "Lato", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: #1D1C1D;
  margin: 0 0 8px;
  line-height: 1.2;
}
.landing .premise {
  font-size: 16px;
  color: #4A4A4A;
  line-height: 1.6;
  max-width: 760px;
  margin: 0 0 36px;
}
.axis-row { margin-bottom: 32px; }
.axis-row .axis-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #868686;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.axis-row .tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.axis-row .tile {
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  padding: 18px 18px 16px;
  background: #FFFFFF;
  text-decoration: none;
  color: #1D1C1D;
  display: block;
  transition: border-color 0.12s, box-shadow 0.12s;
}
.axis-row .tile:hover {
  border-color: #1264A3;
  box-shadow: 0 4px 16px rgba(18, 100, 163, 0.10);
}
.axis-row .tile .tile-title {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
}
.axis-row .tile .tile-hook {
  font-size: 13px;
  color: #4A4A4A;
  line-height: 1.5;
  margin-bottom: 12px;
}
.axis-row .tile .arrow {
  font-size: 13px;
  color: #1264A3;
  font-weight: 700;
}
.landing-footer {
  margin-top: 48px;
  padding-top: 18px;
  border-top: 1px solid #DDDDDD;
  font-size: 12px;
  color: #888;
  display: flex;
  justify-content: space-between;
}
.landing-footer .gate-hint {
  font-family: ui-monospace, "SF Mono", monospace;
  color: #B0B0B0;
}
</style>
</head>
<body>
<div class="landing">

  <div class="hero-still">[hero still — placeholder for screenshot of a live thread with all 3 humans + Optro ECM visible]</div>

  <h1>Most ECM tools assume the AI talks to one person at a time.</h1>
  <p class="premise">
    What changes when the bot, the control owner, and the reviewer are all in the same Slack thread —
    and the thread itself becomes the judgment artifact the auditor sees later?
    This prototype is six answers, on two axes.
  </p>

  <div class="axis-row">
    <div class="axis-label">Bot's role in the thread</div>
    <div class="tiles">
      <a class="tile" href="role-drafter.html">
        <div class="tile-title">Drafter</div>
        <div class="tile-hook">5 identical-shape quarters in a row. Bot writes the ask, the artifact, and Marie's reviewer note in her voice. Humans approve.</div>
        <div class="arrow">Open take →</div>
      </a>
      <a class="tile" href="role-mediator.html">
        <div class="tile-title">Mediator</div>
        <div class="tile-hook">A new column shows up in the Q3 export. Marie pushes back. Bot surfaces the diff, finds the change-management ticket, doesn't take sides.</div>
        <div class="arrow">Open take →</div>
      </a>
      <a class="tile" href="role-silent.html">
        <div class="tile-title">Silent Auditor</div>
        <div class="tile-hook">Weston files. Marie's about to sign. The bot was silent the whole conversation — except for one quiet interjection right before sign-off.</div>
        <div class="arrow">Open take →</div>
      </a>
    </div>
  </div>

  <div class="axis-row">
    <div class="axis-label">Thread granularity</div>
    <div class="tiles">
      <a class="tile" href="unit-ask.html">
        <div class="tile-title">Per ask</div>
        <div class="tile-hook">Every evidence ask is its own short-lived thread. Born when needed, sealed when done. 47 sealed threads in the archive. The graph wires them.</div>
        <div class="arrow">Open take →</div>
      </a>
      <a class="tile" href="unit-control.html">
        <div class="tile-title">Per control</div>
        <div class="tile-hook">The control IS the thread. 4 quarters of sign-offs collapsed at the top, the current quarter expanded at the bottom, a pinned health card under it.</div>
        <div class="arrow">Open take →</div>
      </a>
      <a class="tile" href="unit-period.html">
        <div class="tile-title">Per period</div>
        <div class="tile-hook">One omnibus thread for the whole quarter close. Daily digests, inline filings, mid-quarter risk escalations. The final message <em>is</em> the close package.</div>
        <div class="arrow">Open take →</div>
      </a>
    </div>
  </div>

  <div class="landing-footer">
    <span>Helios Robotics · control 4.2.1 · Q3 FY26 · Weston · Marie · Ada</span>
    <span class="gate-hint">BORB</span>
  </div>
</div>
</body>
</html>
```

- [ ] **Step 14.2: Open and verify**

Run: `open /Users/sanderson/thread-borb/index.html`

Verify:
- [ ] Hero still placeholder visible (gray gradient, italicized caption)
- [ ] H1 reads "Most ECM tools assume the AI talks to one person at a time."
- [ ] Premise paragraph below in muted gray
- [ ] First axis row: "BOT'S ROLE IN THE THREAD" label, 3 tile cards (Drafter, Mediator, Silent Auditor)
- [ ] Second axis row: "THREAD GRANULARITY" label, 3 tile cards (Per ask, Per control, Per period)
- [ ] Hovering any tile changes border to Slack blue
- [ ] Clicking each tile opens the corresponding take page
- [ ] Footer shows scenario context + "BORB" in monospace

- [ ] **Step 14.3: Commit**

Run:
```bash
cd /Users/sanderson/thread-borb
git add index.html
git commit -m "feat: index.html — landing with premise + 6 take tiles across 2 axes"
```

---

## Task 15: Cross-Take Consistency Pass

**Files:**
- Modify: any of the 6 take pages and/or index, based on findings

- [ ] **Step 15.1: Open all 7 pages in tabs and walk through each end-to-end**

Run:
```bash
cd /Users/sanderson/thread-borb
open index.html role-drafter.html role-mediator.html role-silent.html unit-ask.html unit-control.html unit-period.html
```

Spend ~5 minutes on each take. For each, check:
- [ ] State pill row renders the correct count and steps through correctly
- [ ] Keyboard `→ ← Esc End` work
- [ ] Jump-to-receipt jumps to the last state
- [ ] All citations are Slack-blue with the 🔗 prefix
- [ ] All bot cards have the neutral-gray left rule (`#3D3D3D`), not purple
- [ ] All bot messages have the `APP` tag
- [ ] No console errors in DevTools
- [ ] Composer at the bottom shows the right `is-ghost` placeholder
- [ ] Page footer shows the correct "Thread · {{Take name}}" + "← All takes" link

- [ ] **Step 15.2: Fix any inconsistencies inline**

If a take page diverges from the patterns above, fix it directly (Edit the file, re-verify). Each fix should be a separate commit:

```bash
cd /Users/sanderson/thread-borb
git add <file>
git commit -m "fix: <specific consistency issue> in <file>"
```

- [ ] **Step 15.3: Verify with a final mass open**

Run: `open /Users/sanderson/thread-borb/index.html`

Click each of the 6 tile links from index. Each take should load without errors, and the back link `← All takes` on each take page should return to index.

No commit needed at this step if no changes were made.

---

## Task 16: Git Remote + GH Pages Deploy

**Files:**
- None directly — operations on remote/git config

- [ ] **Step 16.1: Create the GitHub repo**

Run:
```bash
gh repo create sandersonboard/thread --public --description "Multi-party SOX evidence collection in Slack — 6 takes on 2 axes" --homepage "https://sandersonboard.github.io/thread/"
```

Expected: repo created at `https://github.com/sandersonboard/thread`.

- [ ] **Step 16.2: Set up the remote and push `main`**

Run:
```bash
cd /Users/sanderson/thread-borb
git remote add origin git@github.com:sandersonboard/thread.git
git branch -M main
git push -u origin main
```

Expected: all commits push successfully to `origin/main`.

- [ ] **Step 16.3: Enable GitHub Pages from main / root**

Run:
```bash
gh api -X POST repos/sandersonboard/thread/pages \
  -f source[branch]=main \
  -f source[path]=/
```

Expected: response indicates Pages enabled. Wait ~30–60 seconds for the first build.

- [ ] **Step 16.4: Verify the live URL**

Run: `open https://sandersonboard.github.io/thread/`

Verify:
- [ ] BORB gate prompts for password
- [ ] After entering `BORB`, the landing page renders identically to the local version
- [ ] Clicking each take tile loads and works as locally
- [ ] No 404s on `slack-chrome.css`, `optro-card.css`, `flow.css`, `flow.js`, `scenario.js`, `gate.js`, `optro-mark.svg`, `workspace-helios.svg`

- [ ] **Step 16.5: Tag the launch**

Run:
```bash
cd /Users/sanderson/thread-borb
git tag -a v1.0.0 -m "Thread v1.0 — 6 takes on 2 axes, live at sandersonboard.github.io/thread/"
git push origin v1.0.0
```

---

## Self-Review Notes

**Spec coverage:** Every section of the spec has at least one task:
- Premise + identity → Tasks 1, 14 (README, index)
- Cast/scenario world → Task 1 (`scenario.js`)
- Visual fidelity bar → Tasks 2, 3 (`slack-chrome.css`, `optro-card.css`)
- 6 takes with 10+ states each → Tasks 8–13
- Navigation model (accumulation, pills, keyboard) → Tasks 4, 5 (`flow.css`, `flow.js`)
- File structure → Task 1 (skeleton) + each take in its task
- Index page → Task 14
- Tech stack + GH Pages → Tasks 1, 16
- Out of scope items (mobile, API integration, animations) → not built, consistent with spec

**Type/identifier consistency check:**
- `THREAD` array shape matches between `flow.js` rendering logic and every take's data (state, author, ts, body, kind, attachment, reactions, card, context, ephemeral, receipt, expander, diff, sideThread, buttons).
- Author values are consistently `weston|marie|ada|sarah|optro` across all takes and match `SCENARIO.cast` keys.
- DOM IDs used by `flow.js` (`flow-root`, `state-pills`, `state-controls`, `slack-messages`, `state-caption`, `jump-to-receipt`, `ghost-composer`) match the shell HTML in every take.
- CSS class names (`slack-msg`, `optro-card`, `optro-context`, `optro-ephemeral`, `optro-receipt`, `optro-expander`, `optro-diff`, `slack-thread-pill`, etc.) match between CSS definitions and JS construction.

**Placeholder scan:** No "TBD", "TODO", or "implement later" remaining. The hero-still on `index.html` is an explicit text placeholder for a screenshot to be captured after one of the take pages is built — noted as `[hero still — placeholder for screenshot]` so it's clear to anyone reading. Optional follow-up (not required for v1).

**Scope notes:** Task 11 (`unit-ask`) and Task 13 (`unit-period`) have small JS extensions (header swap on state change for `unit-ask`; day-marker stub on `unit-period`) that go slightly beyond the `flow.js` engine. These are isolated to the take pages and don't require changes to `flow.js`.

---

## Execution Handoff

**Plan complete and saved to `/Users/sanderson/thread-borb/docs/2026-06-15-thread-prototype-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
