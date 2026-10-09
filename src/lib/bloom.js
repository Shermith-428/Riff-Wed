import { tok } from './util.js';

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function blossom(ctx, x, y, r, color, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  for (let k = 0; k < 5; k++) {
    ctx.rotate((Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.62, r * 0.46, r * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = tok('--gold');
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Draws the blossom arch and corner branches once (seeded, so it looks the same on every redraw). */
export function drawBloom(canvas, floorEl) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const rnd = rng(11);
  const hz = h - floorEl.offsetHeight;
  const cx = w / 2;
  const R = Math.min(w * 0.27, floorEl.offsetHeight * 1.2);
  const cols = [tok('--blush'), tok('--rose'), tok('--blush')];
  const leaf = tok('--sage');
  const glow = tok('--rose');

  function branch(x0, y0, x1, y1, x2, y2, n, size) {
    ctx.strokeStyle = tok('--line-strong');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
    const point = (t) => {
      const m = 1 - t;
      return [m * m * x0 + 2 * m * t * x1 + t * t * x2, m * m * y0 + 2 * m * t * y1 + t * t * y2];
    };
    for (let i = 0; i < n; i++) {
      const [px, py] = point(rnd());
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = leaf;
      ctx.translate(px + (rnd() - 0.5) * 34, py + (rnd() - 0.5) * 34);
      ctx.rotate(rnd() * 6.28);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.9, size * 0.38, 0, 0, 6.28);
      ctx.fill();
      ctx.restore();
    }
    for (let j = 0; j < n; j++) {
      const [bx, by] = point(rnd());
      ctx.shadowColor = glow;
      ctx.shadowBlur = 14;
      blossom(ctx, bx + (rnd() - 0.5) * 40, by + (rnd() - 0.5) * 40, size * (0.7 + rnd() * 0.8), cols[j % 3], rnd() * 6.28);
      ctx.shadowBlur = 0;
    }
  }

  /* arch: leaves first, then blossoms */
  for (let i = 0; i < 70; i++) {
    const a = Math.PI + rnd() * Math.PI;
    const rr = R * (1 + (rnd() - 0.5) * 0.14);
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = leaf;
    ctx.translate(cx + Math.cos(a) * rr, hz + Math.sin(a) * rr * 1.1);
    ctx.rotate(a + rnd());
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 4, 0, 0, 6.28);
    ctx.fill();
    ctx.restore();
  }
  for (let k = 0; k < 130; k++) {
    const b = Math.PI + (k / 130) * Math.PI + (rnd() - 0.5) * 0.06;
    const r2 = R * (1 + (rnd() - 0.5) * 0.16);
    ctx.shadowColor = glow;
    ctx.shadowBlur = 16;
    blossom(ctx, cx + Math.cos(b) * r2, hz + Math.sin(b) * r2 * 1.1, 5 + rnd() * 8, cols[k % 3], rnd() * 6.28);
    ctx.shadowBlur = 0;
  }

  /* corner branches (shorter on phones so they stay clear of the names) */
  const size = Math.max(9, Math.min(w, 900) / 60);
  const narrow = w < 640;
  const n = narrow ? 16 : 42;
  branch(-10, h * 0.03, w * (narrow ? 0.07 : 0.16), h * 0.01, w * (narrow ? 0.1 : 0.3), h * (narrow ? 0.13 : 0.3), n, size);
  branch(w + 10, h * 0.06, w * (narrow ? 0.93 : 0.84), h * 0.03, w * (narrow ? 0.9 : 0.72), h * (narrow ? 0.15 : 0.34), n, size);
}
