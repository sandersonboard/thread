/* flows.js — multi-state flow controller for take detail pages.

   Markup contract:
   - Wrap each step in <div class="flow-state" data-state="step-name">…</div>.
   - Optional stepper at top: <div class="flow-stepper">
       <div class="flow-step" data-step="step-name">…</div> …
     </div>
   - Any element with data-go="step-name" advances to that step on click.
   - Any element with data-go="reset" returns to the first declared step.
   - URL hash mirrors the active step (#step-name) so links are shareable.
*/
(function () {
  let stateNames = [];

  function getStates() {
    return Array.from(document.querySelectorAll('.flow-state'));
  }

  function showState(name, opts) {
    opts = opts || {};
    const states = getStates();
    let resolved = name;
    if (!states.some(el => el.dataset.state === resolved)) {
      resolved = states[0] && states[0].dataset.state;
    }
    states.forEach(el => {
      el.classList.toggle('is-active', el.dataset.state === resolved);
    });

    const idx = stateNames.indexOf(resolved);
    document.querySelectorAll('.flow-step').forEach(el => {
      const stepIdx = stateNames.indexOf(el.dataset.step);
      el.classList.toggle('is-current', el.dataset.step === resolved);
      el.classList.toggle('is-done', stepIdx >= 0 && stepIdx < idx);
    });

    if (!opts.silent && resolved) {
      try {
        history.replaceState(null, '', '#' + resolved);
      } catch (e) {}
    }

    document.querySelectorAll('[data-current-step]').forEach(el => {
      el.textContent = (idx + 1) + ' / ' + stateNames.length;
    });

    // Smooth scroll the active state into view if it's not visible
    const active = states.find(el => el.classList.contains('is-active'));
    if (active && opts.scroll !== false) {
      const rect = active.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        active.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function attachHandlers() {
    document.addEventListener('click', function (e) {
      const target = e.target.closest('[data-go]');
      if (!target) return;
      e.preventDefault();
      const go = target.dataset.go;
      if (go === 'reset') {
        showState(stateNames[0]);
      } else if (go === 'next') {
        const states = getStates();
        const idx = stateNames.indexOf(currentState());
        const next = stateNames[Math.min(idx + 1, stateNames.length - 1)];
        showState(next);
      } else if (go === 'prev') {
        const idx = stateNames.indexOf(currentState());
        const prev = stateNames[Math.max(idx - 1, 0)];
        showState(prev);
      } else {
        showState(go);
      }
    });

    document.querySelectorAll('.flow-step').forEach(el => {
      el.addEventListener('click', () => showState(el.dataset.step));
    });

    window.addEventListener('hashchange', () => {
      const name = window.location.hash.slice(1);
      if (name) showState(name, { silent: true });
    });
  }

  function currentState() {
    const active = document.querySelector('.flow-state.is-active');
    return active ? active.dataset.state : stateNames[0];
  }

  function init() {
    const states = getStates();
    stateNames = states.map(el => el.dataset.state).filter(Boolean);
    if (!stateNames.length) return;

    attachHandlers();

    const hash = window.location.hash.slice(1);
    const initial = stateNames.includes(hash) ? hash : stateNames[0];
    showState(initial, { silent: !hash, scroll: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
