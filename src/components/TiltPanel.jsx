import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/util.js';

/** A chamfered glass panel that tilts in 3D toward the pointer. */
export default function TiltPanel({ as: Tag = 'article', className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const move = (e) => {
      if (e.pointerType === 'touch' || prefersReducedMotion()) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--tx', `${(-y * 9).toFixed(2)}deg`);
      el.style.setProperty('--ty', `${(x * 11).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(0)}%`);
      el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(0)}%`);
    };
    const leave = () => {
      el.style.setProperty('--tx', '0deg');
      el.style.setProperty('--ty', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <Tag ref={ref} className={`panel tilt ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
