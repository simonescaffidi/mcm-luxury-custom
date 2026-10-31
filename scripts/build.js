// Genera le pagine statiche IT/EN in public/ a partire da locales/*.json
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const SITE_URL = (process.env.PUBLIC_URL || 'https://www.mavirachartermotorsport.com').replace(/\/$/, '');

const AZ = {
  nome: 'Mavira Charter Motorsport',
  marchio: 'MCM Luxury Custom',
  via: 'Via Nicolò Cento 8/10',
  cap: '90135',
  citta: 'Palermo',
  prov: 'PA',
  tel: '+39 393 911 6994',
  telHref: '+393939116994',
  wa: '393939116994',
  email: 'officinemcm@gmail.com',
  piva: '', // TODO: P.IVA del cliente
  maps: 'https://www.google.com/maps/search/?api=1&query=Via+Nicol%C3%B2+Cento+8+90135+Palermo',
  ig: 'https://www.instagram.com/mcm_luxurycustom/',
  ig2: 'https://www.instagram.com/mcmluxurycustom/',
  fb: 'https://www.facebook.com/mavirachartermotorsport/',
  yt: 'https://www.youtube.com/channel/UC_n-8as_xj4I-Y2TNX1Nxng',
};

const L = {
  it: require('../locales/it.json'),
  en: require('../locales/en.json'),
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICON = {
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21 7.6c-.1-1.6-.4-3-1.6-4.1C18.3 2.4 16.9 2 15.3 2 13.7 2 10.3 2 8.7 2 7.1 2 5.7 2.4 4.6 3.5 3.5 4.6 3.1 6 3 7.6 3 9.2 3 14.8 3 16.4c.1 1.6.4 3 1.6 4.1 1.1 1.1 2.5 1.5 4.1 1.5h6.6c1.6 0 3-.4 4.1-1.5 1.1-1.1 1.5-2.5 1.6-4.1.1-1.6.1-7.2 0-8.8zM19 18.3a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.2.4s-4 .1-5.2-.4A3.3 3.3 0 0 1 5 18.3c-.5-1.3-.4-4.3-.4-5.3s-.1-4 .4-5.3A3.3 3.3 0 0 1 6.8 6c1.3-.5 4.3-.4 5.2-.4s4-.1 5.2.4A3.3 3.3 0 0 1 19 7.7c.5 1.3.4 4.3.4 5.3s.1 4-.4 5.3z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.7 3-5.7 3z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.3 3.3 0 0 0-1 2.5 5.8 5.8 0 0 0 1.2 3.1 13.3 13.3 0 0 0 5.1 4.5c1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.8-.5zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
};

function head(t, { title, description, page, lang }) {
  const itUrl = `${SITE_URL}${page === 'index' ? '/' : `/${page}.html`}`;
  const enUrl = `${SITE_URL}/en${page === 'index' ? '/' : `/${page}.html`}`;
  const self = lang === 'it' ? itUrl : enUrl;
  const jsonld = page === 'index' ? `
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: `${AZ.marchio} – ${AZ.nome}`,
    alternateName: 'Officine MCM',
    image: `${SITE_URL}/assets/img/og.jpg`,
    logo: `${SITE_URL}/assets/img/logo.webp`,
    url: self,
    telephone: AZ.tel,
    email: AZ.email,
    address: { '@type': 'PostalAddress', streetAddress: AZ.via, postalCode: AZ.cap, addressLocality: AZ.citta, addressRegion: AZ.prov, addressCountry: 'IT' },
    sameAs: [AZ.ig, AZ.ig2, AZ.fb, AZ.yt],
  })}</script>` : '';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <!--GSC-->
  <link rel="canonical" href="${self}">
  <link rel="alternate" hreflang="it" href="${itUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${itUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${AZ.marchio}">
  <meta property="og:locale" content="${t.ogLocale}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${self}">
  <meta property="og:image" content="${SITE_URL}/assets/img/og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0b0b0c">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="preload" href="/assets/fonts/oswald-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/style.css">${jsonld}
</head>`;
}

function header(t, page) {
  const b = t.base;
  const anchor = (id) => (page === 'index' ? `#${id}` : `${b}/#${id}`);
  const alt = `${t.altBase}${page === 'index' ? '/' : `/${page}.html`}`;
  return `
<a class="skip" href="#main">${t.lang === 'it' ? 'Vai al contenuto' : 'Skip to content'}</a>
<header class="hdr" id="top">
  <div class="wrap hdr-in">
    <a class="brand" href="${b}/" aria-label="${AZ.marchio} – home">
      <img src="/assets/img/logo.webp" width="44" height="44" alt="Logo MCM Design – Mavira Charter Motorsport Luxury Custom">
      <span><strong>MCM</strong><small>Luxury Custom</small></span>
    </a>
    <button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav id="menu" class="nav" aria-label="${t.lang === 'it' ? 'Navigazione principale' : 'Main navigation'}">
      <a href="${anchor('servizi')}">${t.nav.services}</a>
      <a href="${anchor('lavori')}">${t.nav.works}</a>
      <a href="${anchor('chi-siamo')}">${t.nav.about}</a>
      <a href="${anchor('contatti')}">${t.nav.contact}</a>
      <a class="lang" href="${alt}" hreflang="${t.lang === 'it' ? 'en' : 'it'}" lang="${t.lang === 'it' ? 'en' : 'it'}" title="${t.altName}">${t.altLabel}</a>
      <a class="btn btn-gold btn-sm" href="${anchor('contatti')}">${t.nav.cta}</a>
    </nav>
  </div>
</header>`;
}

function footer(t) {
  const b = t.base;
  const year = new Date().getFullYear();
  return `
<footer class="ftr">
  <div class="wrap ftr-grid">
    <div>
      <a class="brand" href="${b}/"><img src="/assets/img/logo.webp" width="44" height="44" alt="Logo MCM" loading="lazy"><span><strong>MCM</strong><small>Luxury Custom</small></span></a>
      <p class="muted">${t.footer.tagline}</p>
      <div class="social">
        <a href="${AZ.ig}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>
        <a href="${AZ.fb}" target="_blank" rel="noopener" aria-label="Facebook">${ICON.fb}</a>
        <a href="${AZ.yt}" target="_blank" rel="noopener" aria-label="YouTube">${ICON.yt}</a>
      </div>
    </div>
    <div>
      <h2 class="ftr-h">${t.nav.contact}</h2>
      <p>${AZ.via}<br>${AZ.cap} ${AZ.citta} (${AZ.prov})</p>
      <p><a href="tel:${AZ.telHref}">${AZ.tel}</a><br><a href="mailto:${AZ.email}">${AZ.email}</a></p>
    </div>
    <div>
      <h2 class="ftr-h">${t.footer.legal}</h2>
      <p><a href="${b}/privacy-policy.html">${t.footer.privacy}</a><br>
      <a href="${b}/cookie-policy.html">${t.footer.cookie}</a><br>
      <a href="#" data-cookie-settings>${t.footer.manage}</a></p>
    </div>
  </div>
  <div class="wrap ftr-bottom">
    <p>© ${year} ${AZ.nome}${AZ.piva ? ` · P.IVA ${AZ.piva}` : ''} · ${t.footer.rights}</p>
    <p class="powered-by">Powered by <a href="https://www.simonescaffidi.it" target="_blank" rel="noopener noreferrer">www.simonescaffidi.it</a></p>
  </div>
</footer>
<div id="cookie-banner" class="cb" role="dialog" aria-live="polite" aria-label="${t.consent.title}" hidden>
  <div class="cb-in">
    <p>${t.consent.text} <a href="${b}/cookie-policy.html">${t.footer.cookie}</a> · <a href="${b}/privacy-policy.html">${t.footer.privacy}</a></p>
    <div class="cb-prefs" hidden>
      <strong>${t.consent.title}</strong>
      <label><input type="checkbox" checked disabled> ${t.consent.necessary}</label>
      <label><input type="checkbox" id="cb-stat"> ${t.consent.statistics}</label>
    </div>
    <div class="cb-btns">
      <button type="button" class="btn btn-ghost" data-cb="reject">${t.consent.reject}</button>
      <button type="button" class="btn btn-ghost" data-cb="customize">${t.consent.customize}</button>
      <button type="button" class="btn btn-ghost" data-cb="save" hidden>${t.consent.save}</button>
      <button type="button" class="btn btn-gold" data-cb="accept">${t.consent.accept}</button>
    </div>
  </div>
</div>
<script src="/assets/consent.js" defer></script>
<script src="/assets/main.js" defer></script>
</body>
</html>
`;
}

function img(name, alt, { sizes = '(max-width: 768px) 100vw, 33vw', lazy = true, cls = '' } = {}) {
  return `<img src="/assets/img/${name}.webp" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${cls ? ` class="${cls}"` : ''} sizes="${sizes}">`;
}

function home(t) {
  const waUrl = `https://wa.me/${AZ.wa}?text=${encodeURIComponent(t.contact.waText + ' ')}`;
  return `${head(t, { ...t.home, page: 'index', lang: t.lang })}
<body>${header(t, 'index')}
<main id="main">
  <section class="hero">
    <div class="hero-media">${img('gt3', t.works.items[0].t, { lazy: false, sizes: '100vw' })}</div>
    <div class="wrap hero-in">
      <p class="kicker">${t.hero.kicker}</p>
      <h1>${t.hero.h1}</h1>
      <p class="lead">${t.hero.lead}</p>
      <div class="hero-cta">
        <a class="btn btn-gold" href="#contatti">${t.hero.cta1}</a>
        <a class="btn btn-ghost" href="#lavori">${t.hero.cta2}</a>
      </div>
    </div>
    <ul class="wrap stats">
      ${t.stats.map((s) => `<li><strong>${s.n}</strong><span>${s.l}</span></li>`).join('')}
    </ul>
  </section>

  <section id="servizi" class="sec">
    <div class="wrap">
      <p class="kicker">${t.services.kicker}</p>
      <h2>${t.services.h2}</h2>
      <div class="cards">
        ${t.services.items.map((s, i) => `
        <article class="card">
          <div class="card-img">${img(s.img, s.t)}</div>
          <div class="card-body"><span class="num">0${i + 1}</span><h3>${s.t}</h3><p>${s.d}</p></div>
        </article>`).join('')}
      </div>
    </div>
  </section>

  <section id="lavori" class="sec sec-alt">
    <div class="wrap">
      <div class="sec-head">
        <div><p class="kicker">${t.works.kicker}</p><h2>${t.works.h2}</h2><p class="muted">${t.works.lead}</p></div>
        <a class="btn btn-ghost" href="${AZ.ig}" target="_blank" rel="noopener">${ICON.ig} ${t.works.follow}</a>
      </div>
      <div class="gallery">
        ${t.works.items.map((w) => `<figure>${img(w.img, w.t, { sizes: '(max-width: 768px) 50vw, 25vw' })}<figcaption>${w.t}</figcaption></figure>`).join('')}
      </div>
    </div>
  </section>

  <section id="chi-siamo" class="sec">
    <div class="wrap about">
      <div class="about-img">${img('lusso', 'Officine MCM – Mavira Charter Motorsport, Palermo')}</div>
      <div>
        <p class="kicker">${t.about.kicker}</p>
        <h2>${t.about.h2}</h2>
        <p>${t.about.p1}</p>
        <p>${t.about.p2}</p>
        <blockquote>“${t.about.quote}”</blockquote>
      </div>
    </div>
  </section>

  <section id="contatti" class="sec sec-alt">
    <div class="wrap contact">
      <div>
        <p class="kicker">${t.contact.kicker}</p>
        <h2>${t.contact.h2}</h2>
        <p class="lead">${t.contact.lead}</p>
        <a class="btn btn-gold btn-lg" href="${waUrl}" target="_blank" rel="noopener">${ICON.wa} ${t.contact.whatsapp}</a>
      </div>
      <dl class="info">
        <div><dt>${t.contact.address}</dt><dd>${AZ.via}<br>${AZ.cap} ${AZ.citta} (${AZ.prov})<br><a href="${AZ.maps}" target="_blank" rel="noopener">${t.contact.maps} →</a></dd></div>
        <div><dt>${t.contact.phone}</dt><dd><a href="tel:${AZ.telHref}">${AZ.tel}</a></dd></div>
        <div><dt>${t.contact.email}</dt><dd><a href="mailto:${AZ.email}">${AZ.email}</a></dd></div>
        <div><dt>${t.contact.social}</dt><dd><a href="${AZ.ig}" target="_blank" rel="noopener">@mcm_luxurycustom</a><br><a href="${AZ.ig2}" target="_blank" rel="noopener">@mcmluxurycustom</a><br><a href="${AZ.fb}" target="_blank" rel="noopener">Facebook</a> · <a href="${AZ.yt}" target="_blank" rel="noopener">YouTube</a></dd></div>
      </dl>
    </div>
  </section>
</main>${footer(t)}`;
}

const LEGAL = {
  it: {
    privacy: {
      title: 'Privacy Policy | MCM Luxury Custom',
      description: 'Informativa sul trattamento dei dati personali del sito di Mavira Charter Motorsport – MCM Luxury Custom (GDPR, Reg. UE 2016/679).',
      h1: 'Privacy Policy',
      body: `
<p>Informativa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR). Ultimo aggiornamento: ottobre 2026.</p>
<h2>1. Titolare del trattamento</h2>
<p>${AZ.nome} (${AZ.marchio}), ${AZ.via}, ${AZ.cap} ${AZ.citta}${AZ.piva ? `, P.IVA ${AZ.piva}` : ''}. Email: <a href="mailto:${AZ.email}">${AZ.email}</a> – Tel. ${AZ.tel}.</p>
<h2>2. Dati trattati</h2>
<p><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate e dati tecnici raccolti automaticamente dal server per garantire il funzionamento e la sicurezza del sito.</p>
<p><strong>Dati forniti volontariamente:</strong> nome, numero di telefono, email e contenuto dei messaggi quando ci contatti via telefono, email o WhatsApp.</p>
<p><strong>Dati statistici:</strong> solo previo consenso, dati di utilizzo raccolti tramite Google Analytics 4 (vedi <a href="/cookie-policy.html">Cookie Policy</a>).</p>
<h2>3. Finalità e basi giuridiche</h2>
<ul>
<li>Rispondere alle richieste di informazioni e preventivi – misure precontrattuali (art. 6.1.b GDPR).</li>
<li>Gestione tecnica e sicurezza del sito – legittimo interesse (art. 6.1.f GDPR).</li>
<li>Statistiche di utilizzo anonime o aggregate – consenso (art. 6.1.a GDPR), revocabile in ogni momento.</li>
<li>Adempimenti di legge, fiscali e contabili – obbligo legale (art. 6.1.c GDPR).</li>
</ul>
<h2>4. Conservazione</h2>
<p>I dati delle richieste sono conservati per il tempo necessario a gestirle e comunque non oltre 24 mesi dall'ultimo contatto, salvo obblighi di legge (es. 10 anni per i documenti fiscali). I log tecnici sono conservati per un massimo di 30 giorni.</p>
<h2>5. Destinatari e trasferimenti</h2>
<p>I dati possono essere trattati da fornitori che operano come responsabili del trattamento: hosting del sito (Railway Corp., server nell'Unione Europea), Google Ireland Ltd. (Google Analytics, solo con consenso), Meta Platforms Ireland Ltd. (WhatsApp, se scegli di contattarci tramite questo canale). Eventuali trasferimenti verso Paesi extra-UE avvengono sulla base delle Clausole Contrattuali Standard o del EU-US Data Privacy Framework.</p>
<h2>6. Diritti dell'interessato</h2>
<p>Puoi chiedere in qualsiasi momento accesso, rettifica, cancellazione, limitazione, portabilità dei tuoi dati e opporti al trattamento (artt. 15-22 GDPR) scrivendo a <a href="mailto:${AZ.email}">${AZ.email}</a>. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">www.garanteprivacy.it</a>).</p>
<h2>7. Natura del conferimento</h2>
<p>Il conferimento dei dati di contatto è facoltativo, ma senza di essi non possiamo rispondere alla tua richiesta.</p>`,
    },
    cookie: {
      title: 'Cookie Policy | MCM Luxury Custom',
      description: 'Informativa sui cookie del sito di Mavira Charter Motorsport – MCM Luxury Custom: cookie tecnici e statistici (Google Analytics 4) previo consenso.',
      h1: 'Cookie Policy',
      body: `
<p>Questa pagina descrive i cookie e le tecnologie simili usate dal sito, secondo le Linee guida del Garante Privacy del 10 giugno 2021. Ultimo aggiornamento: ottobre 2026.</p>
<h2>Cookie tecnici (sempre attivi)</h2>
<table><thead><tr><th>Nome</th><th>Scopo</th><th>Durata</th></tr></thead><tbody>
<tr><td>mcm_consent (localStorage)</td><td>Memorizza le tue scelte sui cookie</td><td>6 mesi</td></tr>
</tbody></table>
<h2>Cookie statistici (solo con consenso)</h2>
<table><thead><tr><th>Nome</th><th>Fornitore</th><th>Scopo</th><th>Durata</th></tr></thead><tbody>
<tr><td>_ga, _ga_*</td><td>Google Ireland Ltd. – Google Analytics 4</td><td>Statistiche aggregate sulle visite, con IP anonimizzato</td><td>fino a 14 mesi</td></tr>
</tbody></table>
<p>Il sito non usa cookie di profilazione o marketing. Mappe, video e social sono raggiungibili tramite semplici link: nessun contenuto di terze parti viene caricato senza la tua azione.</p>
<h2>Gestire il consenso</h2>
<p>Puoi modificare o revocare il consenso in qualsiasi momento: <a href="#" data-cookie-settings>Gestisci cookie</a>. Puoi anche cancellare i cookie dalle impostazioni del browser.</p>
<p>Per maggiori informazioni sul trattamento dei dati consulta la <a href="/privacy-policy.html">Privacy Policy</a>.</p>`,
    },
  },
  en: {
    privacy: {
      title: 'Privacy Policy | MCM Luxury Custom',
      description: 'How Mavira Charter Motorsport – MCM Luxury Custom processes personal data on this website (GDPR, EU Regulation 2016/679).',
      h1: 'Privacy Policy',
      body: `
<p>Information pursuant to Articles 13 and 14 of Regulation (EU) 2016/679 (GDPR). Last updated: October 2026.</p>
<h2>1. Data controller</h2>
<p>${AZ.nome} (${AZ.marchio}), ${AZ.via}, ${AZ.cap} ${AZ.citta}, Italy${AZ.piva ? `, VAT ${AZ.piva}` : ''}. Email: <a href="mailto:${AZ.email}">${AZ.email}</a> – Phone ${AZ.tel}.</p>
<h2>2. Data we process</h2>
<p><strong>Browsing data:</strong> IP address, browser type, pages visited and technical data collected automatically by the server to keep the site running and secure.</p>
<p><strong>Data you provide:</strong> name, phone number, email and message content when you contact us by phone, email or WhatsApp.</p>
<p><strong>Statistics:</strong> only with your consent, usage data collected through Google Analytics 4 (see the <a href="/en/cookie-policy.html">Cookie Policy</a>).</p>
<h2>3. Purposes and legal bases</h2>
<ul>
<li>Answering information and quote requests – pre-contractual measures (Art. 6.1.b GDPR).</li>
<li>Technical management and security of the site – legitimate interest (Art. 6.1.f GDPR).</li>
<li>Anonymous or aggregated usage statistics – consent (Art. 6.1.a GDPR), which you can withdraw at any time.</li>
<li>Legal, tax and accounting obligations – legal obligation (Art. 6.1.c GDPR).</li>
</ul>
<h2>4. Retention</h2>
<p>Request data is kept for as long as needed to handle it and no longer than 24 months after the last contact, unless the law requires otherwise (e.g. 10 years for tax records). Technical logs are kept for up to 30 days.</p>
<h2>5. Recipients and transfers</h2>
<p>Data may be processed by providers acting as processors: website hosting (Railway Corp., servers in the European Union), Google Ireland Ltd. (Google Analytics, only with consent), Meta Platforms Ireland Ltd. (WhatsApp, if you choose to contact us this way). Any transfer outside the EU is based on Standard Contractual Clauses or the EU-US Data Privacy Framework.</p>
<h2>6. Your rights</h2>
<p>You may request access, rectification, erasure, restriction, portability and object to processing (Arts. 15-22 GDPR) by writing to <a href="mailto:${AZ.email}">${AZ.email}</a>. You may also lodge a complaint with the Italian Data Protection Authority (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">www.garanteprivacy.it</a>).</p>
<h2>7. Providing data</h2>
<p>Providing contact details is optional, but without them we cannot answer your request.</p>`,
    },
    cookie: {
      title: 'Cookie Policy | MCM Luxury Custom',
      description: 'Cookie information for the Mavira Charter Motorsport – MCM Luxury Custom website: technical cookies and statistics cookies (Google Analytics 4) with consent.',
      h1: 'Cookie Policy',
      body: `
<p>This page describes the cookies and similar technologies used on this site, in line with the Italian Data Protection Authority guidelines of 10 June 2021. Last updated: October 2026.</p>
<h2>Technical cookies (always on)</h2>
<table><thead><tr><th>Name</th><th>Purpose</th><th>Duration</th></tr></thead><tbody>
<tr><td>mcm_consent (localStorage)</td><td>Stores your cookie choices</td><td>6 months</td></tr>
</tbody></table>
<h2>Statistics cookies (consent only)</h2>
<table><thead><tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead><tbody>
<tr><td>_ga, _ga_*</td><td>Google Ireland Ltd. – Google Analytics 4</td><td>Aggregated visit statistics with anonymised IP</td><td>up to 14 months</td></tr>
</tbody></table>
<p>The site does not use profiling or marketing cookies. Maps, videos and social networks are reached through plain links: no third-party content is loaded without your action.</p>
<h2>Managing consent</h2>
<p>You can change or withdraw your consent at any time: <a href="#" data-cookie-settings>Manage cookies</a>. You can also delete cookies in your browser settings.</p>
<p>For more on how we process data, see the <a href="/en/privacy-policy.html">Privacy Policy</a>.</p>`,
    },
  },
};

function legal(t, kind) {
  const p = LEGAL[t.lang][kind];
  const page = kind === 'privacy' ? 'privacy-policy' : 'cookie-policy';
  return `${head(t, { title: p.title, description: p.description, page, lang: t.lang })}
<body>${header(t, page)}
<main id="main" class="sec legal"><div class="wrap narrow"><h1>${p.h1}</h1>${p.body}</div></main>${footer(t)}`;
}

function write(rel, html) {
  const f = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

for (const t of Object.values(L)) {
  const dir = t.lang === 'it' ? '' : 'en/';
  write(`${dir}index.html`, home(t));
  write(`${dir}privacy-policy.html`, legal(t, 'privacy'));
  write(`${dir}cookie-policy.html`, legal(t, 'cookie'));
}

const pages = ['/', '/privacy-policy.html', '/cookie-policy.html'];
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap((p) => ['', '/en'].map((pre) => `  <url><loc>${SITE_URL}${pre}${p}</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="it" href="${SITE_URL}${p}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en${p}"/>
  </url>`)).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('Build OK →', SITE_URL);
