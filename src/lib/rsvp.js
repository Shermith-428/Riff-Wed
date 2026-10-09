import { CONFIG } from '../config.js';

export function summaryText(d) {
  let text = `RSVP from ${d.name}: ${d.attending === 'yes' ? 'joyfully accepting' : 'regretfully declining'}`;
  if (d.attending === 'yes') text += `, ${d.guests} ${d.guests === 1 ? 'guest' : 'guests'}, meal: ${d.meal}`;
  if (d.note) text += `. Note: ${d.note}`;
  return text;
}

export function whatsappLink(d) {
  const text = `${summaryText(d)} (${CONFIG.a} & ${CONFIG.b} wedding)`;
  return `https://wa.me/${CONFIG.whatsapp || ''}?text=${encodeURIComponent(text)}`;
}

/** Sends the reply to CONFIG.rsvpEndpoint when one is set. Resolves true when the server accepted it. */
export async function submitRsvp(d) {
  if (!CONFIG.rsvpEndpoint) return false;
  try {
    const res = await fetch(CONFIG.rsvpEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // plain text avoids a CORS preflight (works with Apps Script)
      body: JSON.stringify(d),
    });
    return res.ok;
  } catch {
    return false;
  }
}
