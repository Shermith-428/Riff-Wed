import { useEffect, useState } from 'react';

/** Returns a number that changes whenever the light/dark theme changes, so canvases can re-read colour tokens. */
export function useThemeVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const bump = () => setV((x) => x + 1);
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', bump);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { mq.removeEventListener('change', bump); mo.disconnect(); };
  }, []);
  return v;
}
