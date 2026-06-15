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

Watts Water Technologies — Q3 FY26 close — control 4.2.1 (quarterly user-access review on `prod-db-01.watts`).

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
