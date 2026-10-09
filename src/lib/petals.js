/* Falling petal particle system drawn on a canvas. `scale` makes petals bigger and denser. */
export class Petals {
  constructor(canvas, scale = 1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scale = scale;
    this.P = [];
    this.w = 0;
    this.h = 0;
  }

  make(init) {
    const { w, h, scale } = this;
    return {
      x: Math.random() * w,
      y: init ? Math.random() * h : -20 - Math.random() * (scale > 1 ? h * 0.8 : 60),
      s: (5 + Math.random() * 7) * scale,
      vy: (0.35 + Math.random() * 0.7) * (scale > 1 ? 1.5 : 1),
      sw: 0.5 + Math.random() * 1.2,
      ph: Math.random() * 6.28,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.04,
      fl: Math.random() * 6.28,
      c: Math.random() < 0.5 ? 0 : 1,
    };
  }

  size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    if (!this.w || !this.h) return;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = this.scale > 1
      ? Math.round(Math.min(90, Math.max(30, this.w / 9)))
      : Math.round(Math.min(46, Math.max(18, this.w / 22)));
    this.P = Array.from({ length: n }, () => this.make(true));
  }

  /** Restart every petal above the top edge so a fresh shower falls in. */
  rain() {
    this.P.forEach((p) => {
      p.x = Math.random() * this.w;
      p.y = -20 - Math.random() * this.h * 1.1;
    });
  }

  step(wind, colors) {
    const { ctx, w, h, P } = this;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      p.y += p.vy;
      p.ph += 0.018;
      p.x += Math.sin(p.ph) * p.sw * 0.5 + wind * 0.3;
      p.r += p.vr;
      p.fl += 0.04;
      if (p.y > h + 20 || p.x < -30 || p.x > w + 30) {
        P[i] = this.make(false);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.scale(1, 0.35 + Math.abs(Math.cos(p.fl)) * 0.65);
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = p.c ? colors.rose : colors.blush;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.s * 0.55, p.s, 0, 0, 6.28);
      ctx.fill();
      ctx.restore();
    }
  }
}
