import { CONFIG } from '../config.js';
import { useCountdown } from '../hooks/useCountdown.js';

const target = new Date(CONFIG.date);

function Cell({ value, label }) {
  return (
    <div className="cell">
      {/* the key remounts <b> when the number changes, which replays the flip animation */}
      <b key={value} className="tick">{value}</b>
      <span className="label">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const { d, h, m, s } = useCountdown(target);
  return (
    <section className="count" aria-labelledby="cd-h">
      <div className="wrap">
        <div className="head rv">
          <p className="label">Together with our families</p>
          <h2 id="cd-h">Counting the days</h2>
        </div>
        <div className="cells rv">
          <Cell value={d} label="Days" />
          <Cell value={h} label="Hours" />
          <Cell value={m} label="Minutes" />
          <Cell value={s} label="Seconds" />
        </div>
      </div>
    </section>
  );
}
