export const tok = (name, fallback = '#f3cfc4') =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const fmtDate = (date, tz, opts) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date);

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
