# Wedding Invitation (React + Vite)

An animated wedding invitation web app: wax-seal envelope intro, photo scene with falling petals,
3D garden-path hero, live countdown, story, schedule, event details and an RSVP form.

## Run it
```bash
npm install
npm run dev        # opens http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```
Requires Node 18 or newer.

## Change your details
Everything personal lives in **`src/config.js`**: names, date and time, venue, address, RSVP deadline,
max guests, WhatsApp number, story, schedule and event cards.

To change the photo, replace **`src/assets/couple.jpg`** (keep the same file name, or update the import in
`src/components/PhotoIntro.jsx`). Black-and-white portrait photos work best.

## Project layout
```
src/
  App.jsx                 page order, scroll lock, sound toggle, petal shower on open
  config.js               all your content
  index.css               design tokens (dark + light themes), layout, animation
  components/
    Gate.jsx              3D envelope + wax seal
    PhotoIntro.jsx        photo scene shown right after opening
    Hero.jsx              parallax garden scene, blossom arch, glowing path
    PetalCanvas.jsx       reusable falling-petal canvas
    Countdown.jsx  Story.jsx  Schedule.jsx  Details.jsx
    Rsvp.jsx              RSVP form and confirmation
    TiltPanel.jsx         glass panel that tilts toward the pointer
    SoundToggle.jsx  Footer.jsx
  hooks/                  useCountdown, useReveal, useThemeVersion
  lib/                    audio, petals, bloom (canvas drawing), rsvp helpers
```

## RSVP: how replies reach you
After a guest submits, they get **Send on WhatsApp** (pre-written message) and **Copy reply** buttons.
Set `whatsapp` in `src/config.js` (country code, no plus, e.g. `94771234567`) so it opens your chat.

To also collect replies automatically, set `rsvpEndpoint` in `src/config.js` to a URL that accepts a JSON
POST, for example a Google Apps Script web app writing to a Google Sheet, Formspree, or a Supabase
function. The page sends `{ name, attending, guests, meal, note, at }`. When the endpoint accepts it, the
guest sees "Your reply has been recorded". This project has no server of its own.

## Deploy
Run `npm run build` and upload `dist/` to Netlify, Vercel, Cloudflare Pages or GitHub Pages.
