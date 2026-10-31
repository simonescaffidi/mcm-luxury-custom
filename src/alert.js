// Alert errori via email (anti-spam 30 min per tipo, in memoria: il sito non ha DB)
const { invia } = require('./mailer');

const SLUG = 'mcm-luxury-custom';
const ultimi = new Map();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function alert(tipo, dettaglio) {
  const ora = Date.now();
  if (ultimi.has(tipo) && ora - ultimi.get(tipo) < 30 * 60 * 1000) return;
  ultimi.set(tipo, ora);
  const quando = new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Rome' }).format(new Date());
  const railway = process.env.RAILWAY_PROJECT_ID ? `https://railway.com/project/${process.env.RAILWAY_PROJECT_ID}` : '';
  const testo = `${quando}\n${dettaglio}\n${railway}`;
  try {
    const r = await invia({
      to: process.env.ALERT_EMAIL || 'info@simonescaffidi.it',
      subject: `[ALERT] ${SLUG} – ${tipo}`,
      text: testo,
      html: `<pre style="font-family:monospace">${esc(testo)}</pre>`,
    });
    if (!r.inviata) console.error('[ALERT] invio fallito:', r.motivo);
  } catch (e) {
    console.error('[ALERT] errore invio:', e);
  }
}
module.exports = { alert };
