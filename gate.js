/* BORB soft password gate — shared across Optro/Auditborb family.
   Case-insensitive password "BORB", persists to sessionStorage + localStorage. */
(function () {
  var KEY = 'borb-auth';
  function authed() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function authedFallback() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function persist() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  if (authed() || authedFallback()) return;

  var overlay = document.createElement('div');
  overlay.id = 'borb-gate';
  overlay.style.cssText = 'position:fixed;inset:0;background:#0f172a;display:flex;align-items:center;justify-content:center;z-index:2147483647;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;';
  overlay.innerHTML =
    '<div style="background:#fff;color:#0f172a;padding:32px 36px;border-radius:12px;max-width:400px;width:90%;box-shadow:0 24px 48px rgba(0,0,0,0.4);">' +
    '  <div style="display:flex;align-items:center;gap:10px;margin:0 0 6px;">' +
    '    <div style="width:32px;height:32px;border-radius:6px;background:#266c92;display:grid;place-items:center;color:#fff;font-weight:700;font-size:15px;">🔒</div>' +
    '    <h2 style="margin:0;font-size:17px;font-weight:700;">Password required</h2>' +
    '  </div>' +
    '  <p style="font-size:13px;color:#475569;margin:8px 0 18px;line-height:1.5;">Optro Signal — internal preview.</p>' +
    '  <form id="borb-pw-form" style="display:flex;flex-direction:column;gap:12px;">' +
    '    <input id="borb-pw-input" type="password" placeholder="Password" autocomplete="off" autofocus style="padding:10px 12px;font-size:14px;border:1px solid #cbd5e1;border-radius:6px;font-family:inherit;outline:none;color:#0f172a;background:#fff;" />' +
    '    <div id="borb-pw-error" style="font-size:12px;color:#db3535;display:none;">Incorrect password.</div>' +
    '    <button type="submit" style="background:#266c92;color:#fff;border:none;padding:10px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">Unlock</button>' +
    '  </form>' +
    '</div>';

  function mount() {
    (document.body || document.documentElement).appendChild(overlay);
    var input = overlay.querySelector('#borb-pw-input');
    var form = overlay.querySelector('#borb-pw-form');
    var err = overlay.querySelector('#borb-pw-error');
    if (!form || !input) return;
    try { input.focus(); } catch (e) {}
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var v = (input.value || '').trim().toUpperCase();
      if (v === 'BORB') {
        persist();
        try { overlay.remove(); } catch (e) { overlay.style.display = 'none'; }
      } else {
        if (err) err.style.display = 'block';
        try { input.select(); } catch (e) {}
      }
      return false;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
