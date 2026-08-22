/* Auto-refresh for the local editing flow.
 *
 * Polls the local server's /api/version (content.js's modification time).
 * When it changes — i.e. after a "Save locally" from admin.html — the page
 * reloads itself, so you never need Cmd+R. If the tab is in the background,
 * it waits until you switch back, then refreshes.
 *
 * LOCAL MACHINE ONLY. It used to test the protocol alone, which is true of
 * the live site as well, so every visitor's browser asked GitHub Pages for
 * /api/version every 1.5 seconds and was told 404 every 1.5 seconds, forever.
 * It cost the visitor nothing but it filled the console and it was a request
 * per second and a half that could never be answered. The host has to be this
 * machine, not merely a web server.
 *
 * Kill switch (pause auto-refresh):  localStorage.setItem('ar_off', '1')
 * Resume:                            localStorage.removeItem('ar_off')
 */
(function () {
  'use strict';
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
  /* the local server, and nothing else. 127.0.0.1, ::1 and the name localhost
     all reach it; a real domain never does. */
  if (!/^(localhost|127(\.\d+){3}|\[?::1\]?|0\.0\.0\.0)$/.test(location.hostname)) return;
  try { if (localStorage.getItem('ar_off') === '1') return; } catch (e) { return; }

  var INTERVAL = 1500;
  var last = null;
  var pending = false;

  function reload() {
    try { sessionStorage.setItem('ar_flash', '1'); } catch (e) {}
    location.reload();
  }

  function check() {
    fetch('/api/version', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) return;
        if (last === null) { last = d.version; return; }
        if (d.version !== last) {
          last = d.version;
          if (document.hidden) { pending = true; }
          else { reload(); }
        }
      })
      .catch(function () { /* no local server — stay quiet */ });
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && pending) { pending = false; reload(); }
  });

  /* Tiny "Updated" note after an auto-reload, so it's clear the refresh
     wasn't a glitch. Respects the site's own tokens with fallbacks. */
  try {
    if (sessionStorage.getItem('ar_flash')) {
      sessionStorage.removeItem('ar_flash');
      var t = document.createElement('div');
      t.textContent = 'Updated \u2713';
      t.setAttribute('aria-live', 'polite');
      t.style.cssText =
        'position:fixed;top:14px;right:14px;z-index:9999;padding:8px 14px;' +
        'background:var(--surface, #211a13);color:var(--accent-bright, #e8a35a);' +
        'font-family:var(--mono, "Space Mono", monospace);font-size:11px;' +
        'letter-spacing:.12em;text-transform:uppercase;' +
        'border:1px solid var(--line, #3a2f22);border-radius:4px;' +
        'opacity:0;transition:opacity .3s;pointer-events:none;';
      document.body.appendChild(t);
      requestAnimationFrame(function () { t.style.opacity = '1'; });
      setTimeout(function () {
        t.style.opacity = '0';
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 400);
      }, 4000);
    }
  } catch (e) {}

  check();
  setInterval(check, INTERVAL);
})();
