import { useEffect, useState } from 'react';

export function useCountdown(target) {
  const calc = () => {
    const s = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  };
  const [v, setV] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setV(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.getTime()]);
  return v;
}
