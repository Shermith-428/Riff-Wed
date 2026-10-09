/* ============ EDIT YOUR DETAILS HERE ============ */
export const CONFIG = {
  a: 'Amaya',
  b: 'Nirmal',
  date: '2027-03-20T18:30:00+05:30',
  tz: 'Asia/Colombo',
  venueName: 'The Rose Fountain Pavilion',
  address: '123 Garden Lane, Colombo',
  rsvpBy: '20 February 2027',
  maxGuests: 4,
  /* Country code, no plus or spaces, e.g. "94771234567". Empty lets the guest pick a chat. */
  whatsapp: '',
  /* Optional: a URL that accepts a JSON POST (Google Apps Script, Formspree, Supabase function...).
     When set, replies are sent there as well as offered via WhatsApp. */
  rsvpEndpoint: '',
  dress: 'Garden formal. Blush and sage tones are welcome.',
  parking: 'Complimentary valet parking',
  story: [
    { t: 'The First Glance', d: "Amaya and Nirmal crossed paths at a mutual friend's gathering. It was a fleeting moment, yet it left a mark neither could forget." },
    { t: 'The First Date', d: 'A quiet coffee shop in the heart of the city became the backdrop for hours of laughter, dreams and the beginning of something beautiful.' },
    { t: 'The Proposal', d: 'Beneath a golden sunset by a calm lake, Nirmal knelt on one knee and asked Amaya to begin the next chapter of their lives together.' },
  ],
  schedule: [
    { t: '5:30 PM', h: 'Guests arrive', d: 'Welcome drinks and a seat under the blossoms.' },
    { t: '6:30 PM', h: 'Wedding ceremony', d: 'The vows, the rings, the first kiss.' },
    { t: '7:30 PM', h: 'Cocktail hour', d: 'Canapés, music and photographs with the couple.' },
    { t: '8:30 PM', h: 'Dinner', d: 'A long table, shared plates and a few toasts.' },
    { t: '10:00 PM', h: 'First dance and celebration', d: 'Join us on the floor until the lights go down.' },
  ],
  events: [
    { h: 'Wedding Ceremony', t: '6:30 PM' },
    { h: 'Reception', t: '7:30 PM' },
  ],
};
