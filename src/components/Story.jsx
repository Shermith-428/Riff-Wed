import { CONFIG } from '../config.js';
import TiltPanel from './TiltPanel.jsx';

export default function Story() {
  return (
    <section aria-labelledby="st-h">
      <div className="wrap">
        <div className="head rv">
          <p className="label">How it began</p>
          <h2 id="st-h">Our Story</h2>
        </div>
        <div className="story">
          {CONFIG.story.map((m) => (
            <div className="mwrap rv" key={m.t}>
              <span className="dot" />
              <TiltPanel className="moment">
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </TiltPanel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
