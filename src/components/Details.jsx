import { CONFIG } from '../config.js';
import { fmtDate } from '../lib/util.js';
import TiltPanel from './TiltPanel.jsx';

export default function Details() {
  const longDate = fmtDate(new Date(CONFIG.date), CONFIG.tz, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONFIG.venueName}, ${CONFIG.address}`)}`;

  return (
    <section aria-labelledby="ev-h">
      <div className="wrap">
        <div className="head rv">
          <p className="label">Join us</p>
          <h2 id="ev-h">Event Details</h2>
          <p>Everything you need to know before you arrive.</p>
        </div>
        <div className="cards">
          {CONFIG.events.map((e, i) => {
            const rows = i === 0 ? [['Date', longDate], ['Dress code', CONFIG.dress]] : [['Date', longDate], ['Parking', CONFIG.parking]];
            return (
              <TiltPanel key={e.h} className="detail rv">
                <h3>{e.h}</h3>
                <span className="t">{e.t}</span>
                <address>{CONFIG.venueName}, {CONFIG.address}</address>
                <dl>
                  {rows.map(([k, v]) => (
                    <div key={k} style={{ display: 'contents' }}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
              </TiltPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
