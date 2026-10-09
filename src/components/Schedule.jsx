import { useEffect, useRef } from 'react';
import { CONFIG } from '../config.js';

export default function Schedule() {
  const railRef = useRef(null);

  /* the glowing rail fills as the section scrolls into view */
  useEffect(() => {
    const el = railRef.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
      el.style.setProperty('--p', p.toFixed(3));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return (
    <section aria-labelledby="sc-h" style={{ background: 'color-mix(in srgb, var(--bg-2) 60%, var(--bg))' }}>
      <div className="wrap">
        <div className="head rv">
          <p className="label">What we have planned for you</p>
          <h2 id="sc-h">Schedule of the Day</h2>
        </div>
        <div className="sched" ref={railRef}>
          {CONFIG.schedule.map((s) => (
            <div className="slot rv" key={s.t}>
              <time>{s.t}</time>
              <div className="body">
                <h3>{s.h}</h3>
                <p>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
