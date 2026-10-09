import { useEffect } from 'react';
import { prefersReducedMotion } from '../lib/util.js';

/** Slides `.rv` elements into place as they scroll into view. Nothing is ever hidden, only offset. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      els.forEach((e) => e.classList.add('in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}
