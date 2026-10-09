import { useCallback, useEffect, useRef, useState } from 'react';
import { createAudio } from './lib/audio.js';
import { useReveal } from './hooks/useReveal.js';
import Gate from './components/Gate.jsx';
import SoundToggle from './components/SoundToggle.jsx';
import PhotoIntro from './components/PhotoIntro.jsx';
import Hero from './components/Hero.jsx';
import Countdown from './components/Countdown.jsx';
import Story from './components/Story.jsx';
import Schedule from './components/Schedule.jsx';
import Details from './components/Details.jsx';
import Rsvp from './components/Rsvp.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const audio = useRef(null);
  if (!audio.current) audio.current = createAudio();
  const photoPetals = useRef(null);
  const [opened, setOpened] = useState(false); // envelope has been opened
  const [gateGone, setGateGone] = useState(false);
  const [sound, setSound] = useState(false);

  useReveal();

  /* lock page scroll until the envelope is opened */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('locked', !opened);
    root.classList.toggle('opened', opened);
  }, [opened]);

  const handleLeave = useCallback(() => {
    setOpened(true);
    window.scrollTo(0, 0);
    photoPetals.current?.rain();
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    if (next) audio.current.padOn();
    else audio.current.padOff();
  };

  return (
    <>
      {!gateGone && <Gate audio={audio.current} onLeave={handleLeave} onGone={() => setGateGone(true)} />}
      <SoundToggle on={sound} onToggle={toggleSound} />
      <main>
        <PhotoIntro ref={photoPetals} />
        <Hero />
        <Countdown />
        <Story />
        <Schedule />
        <Details />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}
