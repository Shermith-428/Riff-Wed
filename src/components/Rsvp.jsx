import { useState } from 'react';
import { CONFIG } from '../config.js';
import { submitRsvp, summaryText, whatsappLink } from '../lib/rsvp.js';
import { clamp } from '../lib/util.js';

function loadSavedName() {
  try {
    const saved = JSON.parse(localStorage.getItem('rsvp-last') || 'null');
    return saved?.name || '';
  } catch {
    return '';
  }
}

function Thanks({ reply, saved, onEdit }) {
  const [copyLabel, setCopyLabel] = useState('Copy reply');
  const yes = reply.attending === 'yes';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText(reply));
      setCopyLabel('Copied');
    } catch {
      setCopyLabel('Select and copy above');
    }
  };

  return (
    <div className="thanks">
      <svg className="check" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" />
        <path d="M15 27l8 8 14-17" />
      </svg>
      <h3>{yes ? "We can't wait to see you" : 'You will be missed'}</h3>
      <p>
        {saved
          ? 'Your reply has been recorded. Thank you.'
          : 'Your reply is ready. Send it to the couple on WhatsApp to confirm it.'}
      </p>
      <div className="sum">
        <span>Name: {reply.name}</span>
        <span>Reply: {yes ? 'Joyfully accepting' : 'Regretfully declining'}</span>
        {yes && <span>Guests: {reply.guests}</span>}
        {yes && <span>Meal: {reply.meal}</span>}
      </div>
      <div className="row">
        <a className="btn" href={whatsappLink(reply)} target="_blank" rel="noopener noreferrer">
          {saved ? 'Also message on WhatsApp' : 'Send on WhatsApp'}
        </a>
        <button className="btn ghost" type="button" onClick={copy}>{copyLabel}</button>
        <button className="btn ghost" type="button" onClick={onEdit}>Change my reply</button>
      </div>
    </div>
  );
}

export default function Rsvp() {
  const [name, setName] = useState(loadSavedName);
  const [attending, setAttending] = useState('yes');
  const [guests, setGuests] = useState(1);
  const [meal, setMeal] = useState('No preference');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { reply, saved }

  const yes = attending === 'yes';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Please enter your full name so we can find you on the guest list.');
      return;
    }
    const reply = {
      name: trimmed,
      attending,
      guests: yes ? guests : 0,
      meal: yes ? meal : '',
      note: note.trim().slice(0, 400),
      at: new Date().toISOString(),
    };
    try { localStorage.setItem('rsvp-last', JSON.stringify(reply)); } catch { /* storage unavailable */ }
    setBusy(true);
    const saved = await submitRsvp(reply);
    setBusy(false);
    setResult({ reply, saved });
  };

  return (
    <section id="rsvp" aria-labelledby="rs-h">
      <div className="wrap">
        <div className="head rv">
          <p className="label">Kindly reply by {CONFIG.rsvpBy}</p>
          <h2 id="rs-h">Will you join us?</h2>
          <p>Let us know so we can save you a seat.</p>
        </div>
        <div className="panel rsvp-box rv">
          {result ? (
            <Thanks reply={result.reply} saved={result.saved} onEdit={() => setResult(null)} />
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Your full name</label>
                <input
                  type="text" id="name" name="name" autoComplete="name" required
                  placeholder="As it appears on your invitation"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

              <fieldset>
                <legend>Your reply</legend>
                <div className="seg">
                  <input type="radio" name="attending" id="yes" value="yes" checked={yes} onChange={() => setAttending('yes')} />
                  <label htmlFor="yes">Joyfully accept</label>
                  <input type="radio" name="attending" id="no" value="no" checked={!yes} onChange={() => setAttending('no')} />
                  <label htmlFor="no">Regretfully decline</label>
                </div>
              </fieldset>

              {yes && (
                <div className="field">
                  <label id="gl">Guests, including you</label>
                  <div className="step" role="group" aria-labelledby="gl">
                    <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => clamp(g - 1, 1, CONFIG.maxGuests))}>&minus;</button>
                    <output aria-live="polite">{guests}</output>
                    <button type="button" aria-label="More guests" onClick={() => setGuests((g) => clamp(g + 1, 1, CONFIG.maxGuests))}>+</button>
                  </div>
                  <label htmlFor="meal" style={{ marginTop: '0.9rem' }}>Meal preference</label>
                  <select id="meal" name="meal" value={meal} onChange={(e) => setMeal(e.target.value)}>
                    {['No preference', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free'].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              )}

              <div className="field">
                <label htmlFor="note">A note for the couple (optional)</label>
                <textarea
                  id="note" name="note" value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="Allergies, a song request, or a few kind words"
                />
              </div>

              <p className="err" role="alert">{error}</p>
              <div className="row">
                <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send my reply'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
