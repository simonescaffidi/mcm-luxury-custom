# mcm-luxury-custom

Sito vetrina di **MCM Luxury Custom – Mavira Charter Motorsport** (Palermo): customizzazione supercar, wrapping/PPF, scarichi Tubi Style, elaborazioni, vendita e noleggio.

- Node 20 + Express 5 statico; pagine IT (`/`) ed EN (`/en/`) generate da `locales/*.json` con `npm run build`.
- GA4 e Search Console da env (`GA4_ID`, `GSC_VERIFICATION`), iniettati lato server; GA4 parte solo dopo consenso (`public/assets/consent.js`).
- `/health` per Railway e monitor uptime (`.github/workflows/uptime.yml`); alert email via Brevo.
- Deploy: Railway progetto `mcm-luxury-custom`, auto-deploy da `main`.

```bash
npm install && npm run build && npm start   # http://localhost:3000
npm test
```

Testi: `locales/it.json`, `locales/en.json`. Dati aziendali: oggetto `AZ` in `scripts/build.js`. Foto: `public/assets/img` (Instagram del cliente, webp).
