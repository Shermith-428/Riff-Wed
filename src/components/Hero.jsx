import { useEffect, useMemo, useRef } from 'react';
import { CONFIG } from '../config.js';
import { drawBloom } from '../lib/bloom.js';
import { fmtDate, prefersReducedMotion } from '../lib/util.js';
import { useThemeVersion } from '../hooks/useThemeVersion.js';
import PetalCanvas from './PetalCanvas.jsx';

export default function Hero() {
  const heroRef = useRef(null);
  const sceneRef = useRef(null);
  const bloomRef = useRef(null);
  const floorRef = useRef(null);
  const wind = useRef(0);
  const themeV = useThemeVersion();
  const stones = useMemo(() => Array.from({ length: 11 }, (_, i) => i), []);
  const target = new Date(CONFIG.date);

  /* pointer-driven parallax, with a slow idle drift until the pointer moves */
  useEffect(() => {
    const scene = sceneRef.current;
    const hero = heroRef.current;
    const reduce = prefersReducedMotion();
    const t0 = performance.now();
    let mx = 0, my = 0, tx = 0, ty = 0, seen = false, raf = 0, visible = true;

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      seen = true;
      const r = scene.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const loop = (now) => {
      raf = 0;
      if (!visible) return;
      const t = (now - t0) / 1000;
      if (!seen && !reduce) { tx = Math.sin(t * 0.35) * 0.8; ty = Math.cos(t * 0.27) * 0.5; }
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      scene.style.setProperty('--mx', mx.toFixed(3));
      scene.style.setProperty('--my', my.toFixed(3));
      wind.current = mx;
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    hero.addEventListener('pointermove', onMove);
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); });
    io.observe(scene);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      hero.removeEventListener('pointermove', onMove);
    };
  }, []);

  /* blossom arch + branches: drawn once, redrawn on resize or theme change */
  useEffect(() => {
    const draw = () => drawBloom(bloomRef.current, floorRef.current);
    draw();
    let timer = 0;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(draw, 150); };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize); };
  }, [themeV]);

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="scene" ref={sceneRef} aria-hidden="true">
        <div className="stage">
          <div className="layer stars" />
          <div className="layer orb" />
          <div className="layer hills" />
          <canvas id="bloom" ref={bloomRef} />
          <div className="floor" ref={floorRef}>
            <div className="plane">
              {stones.map((i) => (
                <i key={i} className="stone" style={{ '--i': i, '--o': `${i % 2 ? 0.9 : -0.9}%` }} />
              ))}
            </div>
          </div>
        </div>
        <PetalCanvas id="petals" scale={1} wind={wind} />
      </div>
      <div className="wrap hero-copy">
        <p className="label rv">We&apos;re getting married</p>
        <h1 className="names rv">
          <span>{CONFIG.a}</span>
          <span className="amp">&amp;</span>
          <span>{CONFIG.b}</span>
        </h1>
        <p className="hero-date rv">{fmtDate(target, CONFIG.tz, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p className="hero-place rv">{CONFIG.venueName}</p>
        <a className="btn rv" href="#rsvp">Confirm attendance</a>
      </div>
    </header>
  );
}
