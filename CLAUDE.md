# Regole progetto mcm-luxury-custom
- Seguire gli skill `stack-standard` e `sito-web-standard` di Simone.
- Ogni testo esiste in IT e EN (`locales/`). Le pagine in `public/*.html` si rigenerano con `npm run build`: non modificarle a mano.
- Footer sempre con "Powered by www.simonescaffidi.it".
- Nessuno script o contenuto di terze parti senza consenso (CSP in `server.js`).
- Dati mancanti dal cliente: P.IVA (`AZ.piva` in `scripts/build.js`), ID GA4, codice Search Console, dominio definitivo.
- A fine lavoro aggiornare la riga in "00 - Indice Progetti" (Drive Claude).
