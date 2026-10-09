import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Petals } from '../lib/petals.js';
import { prefersReducedMotion, tok } from '../lib/util.js';
import { useThemeVersion } from '../hooks/useThemeVersion.js';

/**
 * A canvas of falling petals. `wind` is an optional ref holding a number (-1..1) that nudges them sideways.
 * Call ref.current.rain() to start a fresh shower from the top.
 */
const PetalCanvas = forwardRef(function PetalCanvas({ scale = 1, wind, id }, ref) {
  const canvasRef = useRef(null);
  const petalsRef = useRef(null);
  const colors = useRef({ blush: '#f3cfc4', rose: '#e39aa3' });
  const themeV = useThemeVersion();

  useImperativeHandle(ref, () => ({ rain: () => petalsRef.current?.rain() }), []);

  useEffect(() => {
    colors.current = { blush: tok('--blush'), rose: tok('--rose') };
  }, [themeV]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const petals = new Petals(canvas, scale);
    petalsRef.current = petals;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let visible = true;
    let resizeTimer = 0;

    const loop = () => {
      raf = 0;
      if (!visible) return;
      if (document.hidden) { raf = requestAnimationFrame(loop); return; }
      petals.step(wind ? wind.current : 0, colors.current);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    colors.current = { blush: tok('--blush'), rose: tok('--rose') };
    petals.size();
    kick();

    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { petals.size(); kick(); }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      petalsRef.current = null;
    };
  }, [scale, wind]);

  return <canvas ref={canvasRef} id={id} aria-hidden="true" />;
});

export default PetalCanvas;
