// Consenso cookie (linee guida Garante): Accetta / Rifiuta / Personalizza. GA4 solo dopo consenso.
(function () {
  var KEY = 'mcm_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 180; // 6 mesi
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  var prefs = banner.querySelector('.cb-prefs');
  var stat = document.getElementById('cb-stat');
  var btn = function (k) { return banner.querySelector('[data-cb="' + k + '"]'); };

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && Date.now() - c.ts < MAX_AGE) return c;
    } catch (e) { /* storage non disponibile */ }
    return null;
  }

  function loadGA() {
    var meta = document.querySelector('meta[name="ga4-id"]');
    var id = meta && meta.content;
    if (!id || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function clearGA() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n.indexOf('_ga') === 0) {
        var host = location.hostname.replace(/^www\./, '');
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=.' + host;
      }
    });
  }

  function apply(c) { if (c && c.statistics) loadGA(); }

  function save(statistics) {
    var c = { necessary: true, statistics: !!statistics, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* ignora */ }
    banner.hidden = true;
    if (!c.statistics) clearGA();
    apply(c);
  }

  function open(custom) {
    var c = read();
    stat.checked = !!(c && c.statistics);
    prefs.hidden = !custom;
    btn('save').hidden = !custom;
    btn('customize').hidden = !!custom;
    banner.hidden = false;
  }

  btn('accept').addEventListener('click', function () { save(true); });
  btn('reject').addEventListener('click', function () { save(false); });
  btn('customize').addEventListener('click', function () { open(true); });
  btn('save').addEventListener('click', function () { save(stat.checked); });
  document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(true); });
  });

  var existing = read();
  if (existing) apply(existing); else open(false);
})();
