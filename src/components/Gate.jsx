import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config.js';
import { fmtDate, prefersReducedMotion } from '../lib/util.js';

/** The sealed envelope. Tapping the seal opens it, then calls onLeave() as the page is revealed. */
export default function Gate({ audio, onLeave, onGone }) {
  const gateRef = useRef(null);
  const envRef = useRef(null);
  const timers = useRef([]);
  const [open, setOpen] = useState(false);
  const [mid, setMid] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const target = new Date(CONFIG.date);
  const mono = `${CONFIG.a[0]}&${CONFIG.b[0]}`;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const onMove = (e) => {
    if (e.pointerType === 'touch' || prefersReducedMotion() || !envRef.current) return;
    const r = gateRef.current.getBoundingClientRect();
    envRef.current.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 22).toFixed(1)}deg`);
    envRef.current.style.setProperty('--rx', `${(8 - ((e.clientY - r.top) / r.height - 0.5) * 16).toFixed(1)}deg`);
  };

  const openEnvelope = () => {
    if (open) return;
    audio.chime();
    setOpen(true);
    later(() => setMid(true), 420);
    later(() => { setLeaving(true); onLeave(); }, prefersReducedMotion() ? 300 : 2600);
    later(onGone, prefersReducedMotion() ? 600 : 4100);
  };

  return (
    <div
      ref={gateRef}
      className={`gate${leaving ? ' leave' : ''}`}
      role="dialog"
      aria-label="Wedding invitation envelope"
      onPointerMove={onMove}
    >
      <div className="gate-stars" />
      <p className="label gate-k">A private invitation</p>
      <button className="env-btn" type="button" onClick={openEnvelope} aria-label="Break the seal and open the invitation">
        <div ref={envRef} className={`env${open ? ' open' : ''}${mid ? ' mid' : ''}`}>
          <div className="env-back" />
          <div className="letter">
            <span className="l-k">You are invited</span>
            <span className="l-n script">{CONFIG.a} &amp; {CONFIG.b}</span>
            <span className="l-d">{fmtDate(target, CONFIG.tz, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="env-front" />
          <div className="flap" />
          <div className="seal"><span>{mono}</span></div>
        </div>
      </button>
      <p className="gate-hint">Tap the seal to open</p>
    </div>
  );
}
