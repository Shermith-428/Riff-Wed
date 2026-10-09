import { forwardRef } from 'react';
import { CONFIG } from '../config.js';
import couple from '../assets/couple.jpg';
import PetalCanvas from './PetalCanvas.jsx';

/** Full-screen photo shown right after the envelope opens, with petals falling over it. */
const PhotoIntro = forwardRef(function PhotoIntro(_props, petalsRef) {
  return (
    <section className="photo" id="photo" aria-label="A moment together">
      <img
        className="photo-img"
        src={couple}
        alt="A groom's hand and a bride's hand gently linked, both wearing rings, in black and white"
      />
      <div className="photo-tint" aria-hidden="true" />
      <div className="photo-shade" aria-hidden="true" />
      <PetalCanvas ref={petalsRef} id="petals2" scale={1.5} />
      <div className="photo-copy">
        <p className="label rv">Forever begins here</p>
        <p className="big rv">{CONFIG.a} &amp; {CONFIG.b}</p>
        <a className="cue rv" href="#top"><span className="label">Scroll</span><i /></a>
      </div>
    </section>
  );
});

export default PhotoIntro;
