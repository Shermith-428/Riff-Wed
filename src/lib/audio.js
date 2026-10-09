/* Tiny WebAudio helper: a bell chime for the seal and an optional soft ambient pad.
   Browsers only allow sound after a tap, so the context is created lazily. */
export function createAudio() {
  let ac = null;
  let master = null;
  let pad = null;

  function ctx() {
    try {
      if (!ac) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        ac = new Ctor();
        master = ac.createGain();
        master.gain.value = 0.6;
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended') ac.resume();
    } catch {
      ac = null;
    }
    return ac;
  }

  function bell(freq, t) {
    [1, 2.01, 3.2].forEach((mult, k) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = freq * mult;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.13 / (k + 1), t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 2.7);
    });
  }

  return {
    chime() {
      if (!ctx()) return;
      const t = ac.currentTime + 0.02;
      [784, 988, 1318, 1568].forEach((f, i) => bell(f, t + i * 0.16));
    },
    padOn() {
      if (!ctx() || pad) return;
      const g = ac.createGain();
      const lp = ac.createBiquadFilter();
      const oscs = [];
      lp.type = 'lowpass';
      lp.frequency.value = 650;
      g.gain.value = 0.0001;
      lp.connect(g);
      g.connect(master);
      [196, 246.9, 293.7, 392, 493.9].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        o.detune.value = (i - 2) * 5;
        o.connect(lp);
        o.start();
        oscs.push(o);
      });
      const lfo = ac.createOscillator();
      const lg = ac.createGain();
      lfo.frequency.value = 0.12;
      lg.gain.value = 260;
      lfo.connect(lg);
      lg.connect(lp.frequency);
      lfo.start();
      oscs.push(lfo);
      g.gain.linearRampToValueAtTime(0.06, ac.currentTime + 2.5);
      pad = { g, oscs };
    },
    padOff() {
      if (!pad || !ac) return;
      const p = pad;
      pad = null;
      p.g.gain.cancelScheduledValues(ac.currentTime);
      p.g.gain.setValueAtTime(p.g.gain.value, ac.currentTime);
      p.g.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 1);
      setTimeout(() => p.oscs.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } }), 1200);
    },
  };
}
