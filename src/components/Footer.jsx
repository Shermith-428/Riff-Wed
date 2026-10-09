import { CONFIG } from '../config.js';

export default function Footer() {
  return (
    <footer>
      <span className="script">{CONFIG.a[0]}&amp;{CONFIG.b[0]}</span>
      <p className="label">#{CONFIG.a}And{CONFIG.b}</p>
      <p>With love and gratitude.</p>
    </footer>
  );
}
