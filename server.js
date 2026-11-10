// Sito vetrina MCM Luxury Custom – Express statico con iniezione GA4/GSC
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const { alert } = require('./src/alert');

const app = express();
const PUB = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;
const GA4 = (process.env.GA4_ID || '').trim();
const GSC = (process.env.GSC_VERIFICATION || '').trim();
// URL di build sostituito a runtime con PUBLIC_URL (canonical, hreflang, og, sitemap)
const BUILD_URL = 'https://www.mavirachartermotorsport.com';
const SITE_URL = (process.env.PUBLIC_URL || BUILD_URL).replace(/\/$/, '');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://www.googletagmanager.com'],
      imgSrc: ["'self'", 'data:', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
      connectSrc: ["'self'", 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Redirect al dominio canonico (es. senza www → www) se PUBLIC_URL è impostato
const canon = process.env.PUBLIC_URL ? new URL(process.env.PUBLIC_URL) : null;
app.use((req, res, next) => {
  if (canon && req.hostname !== canon.hostname && !req.hostname.endsWith('.railway.app') && req.hostname !== 'localhost') {
    return res.redirect(301, `${canon.origin}${req.originalUrl}`);
  }
  next();
});

// Pagine HTML con meta GA4/GSC iniettati lato server (cache in memoria)
const cache = new Map();
function pagina(file) {
  if (cache.has(file)) return cache.get(file);
  let html = fs.readFileSync(file, 'utf8');
  const meta = [
    GSC ? `<meta name="google-site-verification" content="${esc(GSC)}">` : '',
    GA4 ? `<meta name="ga4-id" content="${esc(GA4)}">` : '',
  ].filter(Boolean).join('\n  ');
  html = html.replace('<!--GSC-->', meta).split(BUILD_URL).join(SITE_URL);
  cache.set(file, html);
  return html;
}

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  let p = decodeURIComponent(req.path);
  if (p.endsWith('/')) p += 'index.html';
  if (!p.endsWith('.html')) {
    if (p === '/en') return res.redirect(301, '/en/');
    return next();
  }
  const file = path.normalize(path.join(PUB, p));
  if (!file.startsWith(PUB) || !fs.existsSync(file)) return next();
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(pagina(file));
});

for (const f of ['sitemap.xml', 'robots.txt']) {
  app.get(`/${f}`, (req, res) => {
    res.type(f.endsWith('.xml') ? 'application/xml' : 'text/plain')
      .send(fs.readFileSync(path.join(PUB, f), 'utf8').split(BUILD_URL).join(SITE_URL));
  });
}

app.use(express.static(PUB, { maxAge: '7d', index: false }));

app.use((req, res) => {
  const en = req.path.startsWith('/en');
  res.status(404).type('html').send(`<!DOCTYPE html><html lang="${en ? 'en' : 'it'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | MCM Luxury Custom</title><link rel="stylesheet" href="/assets/style.css"></head><body><main class="sec legal"><div class="wrap narrow"><h1>404</h1><p>${en ? 'Page not found.' : 'Pagina non trovata.'}</p><a class="btn btn-gold" href="${en ? '/en/' : '/'}">Home</a></div></main></body></html>`);
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  alert('errore 5xx', `${req.method} ${req.originalUrl}\n${err.stack || err}`);
  res.status(500).type('text').send('Errore interno');
});

process.on('unhandledRejection', (e) => { console.error(e); alert('unhandledRejection', String(e && e.stack || e)); });
process.on('uncaughtException', (e) => { console.error(e); alert('uncaughtException', String(e && e.stack || e)).finally(() => process.exit(1)); });

app.listen(PORT, () => console.log(`MCM Luxury Custom su :${PORT}`));
