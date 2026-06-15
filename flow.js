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

    renderPills(state);
    renderMessages(state);
    renderCaption(state);
    // Keyboard navigation is owned by tour.js (←/→/Enter/Esc) — flow.js no longer binds keys
    // to prevent the tour text and message state from desyncing.
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
    if (author.isBot) {
      const img = document.createElement('img');
      img.src = 'optro-mark.svg';
      img.alt = 'Optro ECM';
      av.appendChild(img);
    } else {
      av.textContent = author.initials;
    }
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
      att.className = 'slack-attachment';
      var attName = (typeof m.attachment === 'string') ? m.attachment : m.attachment.name;
      var attMeta = (typeof m.attachment === 'object' && m.attachment.meta) || null;
      att.innerHTML = `
        <span class="att-icon">📎</span>
        <span>
          <div class="att-name">${attName}</div>
          ${attMeta ? `<div class="att-meta">${attMeta}</div>` : ''}
        </span>`;
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
        ctx.innerHTML = `<span>${c}</span>`;
        body.appendChild(ctx);
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

    wrap.appendChild(body);
    return wrap;
  }

  function renderCard(card) {
    const root = document.createElement('div');
    root.className = 'optro-card';
    if (card.header) {
      const s = document.createElement('div');
      s.className = 'card-section';
      var headerHTML = '<div class="card-header"><span class="ai-chip">Optro ECM</span>' + card.header;
      if (card.subtitle) headerHTML += '<span class="subtitle">' + card.subtitle + '</span>';
      headerHTML += '</div>';
      if (card.meta) headerHTML += '<div class="card-meta">' + card.meta + '</div>';
      s.innerHTML = headerHTML;
      // Confidence bar row
      if (card.confidence) {
        var pct = Math.round(card.confidence.pct);
        var conf = document.createElement('div');
        conf.className = 'conf-row';
        conf.innerHTML = '<span>' + (card.confidence.label || 'Match to your usual pattern') + '</span>'
          + '<span class="ai-confidence-bar" style="width:100%"><span style="width:' + pct + '%"></span></span>'
          + '<span class="conf-pct">' + pct + '%</span>';
        s.appendChild(conf);
      }
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

  // Expose a minimal Flow API so tour.js can drive state from step.before() callbacks.
  // Flow.go(n) re-renders the message list to show messages with state <= n.
  window.Flow = {
    go: function (n) {
      var total = computeTotal(THREAD);
      var s = { current: Math.max(1, Math.min(total, n | 0)), total: total };
      renderMessages(s);
    },
  };
})();
