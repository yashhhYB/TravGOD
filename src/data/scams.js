export const SCAMS = [
  {
    id: 's1',
    destinationId: 'paris',
    title: 'The Friendship Bracelet',
    location: 'Sacré-Cœur / Montmartre',
    risk: 'high', // 'high' -> rose, 'medium' -> amber
    redFlags: 'Someone approaches you with string, asking to show you a magic trick or tying it to your wrist without asking.',
    prevention: 'Keep your hands in your pockets. Firmly say "Non, merci" and keep walking.',
    coords: [48.8867, 2.3431]
  },
  {
    id: 's2',
    destinationId: 'paris',
    title: 'The Petition / Deaf Mute Scam',
    location: 'Eiffel Tower / Louvre',
    risk: 'high',
    redFlags: 'Groups (often teenagers) with clipboards asking for signatures for a charity, then demanding money aggressively while pickpocketing you.',
    prevention: 'Ignore them completely. Do not stop to read the clipboard.',
    coords: [48.8584, 2.2945] // Eiffel tower area
  },
  {
    id: 's3',
    destinationId: 'paris',
    title: 'The Gold Ring Trick',
    location: 'Seine Riverbanks',
    risk: 'medium',
    redFlags: 'A stranger picks up a "gold" ring from the ground near you, asks if you dropped it, then offers to sell it to you for a "reward".',
    prevention: 'Keep walking. Do not engage or accept the ring.',
    coords: [48.8600, 2.3210]
  },
  {
    id: 's4',
    destinationId: 'paris',
    title: 'Fake Taxi Rates',
    location: 'CDG Airport / Gare du Nord',
    risk: 'high',
    redFlags: 'Drivers soliciting inside the terminal without a proper taxi sign, claiming the meter is broken.',
    prevention: 'Only use the official taxi queue outside. Fares from CDG to Paris are strictly flat-rate (approx €56-€65).',
    coords: [49.0097, 2.5479] // CDG
  },
  {
    id: 's5',
    destinationId: 'paris',
    title: 'Restaurant "Tourist Menus"',
    location: 'Quartier Latin',
    risk: 'medium',
    redFlags: 'Waiters aggressively ushering you in from the street, menus with no prices or a special "tourist" menu with hidden service charges.',
    prevention: 'Eat where locals eat (menus in French, no aggressive street touts). Check prices before ordering.',
    coords: [48.8500, 2.3430]
  }
];

export const PRICES = [
  { item: 'Espresso (at the counter)', touristPrice: '€3.50 - €5.00', localPrice: '€1.20 - €1.50' },
  { item: 'Croissant (Bakery)', touristPrice: '€2.50', localPrice: '€1.10 - €1.30' },
  { item: 'Glass of House Wine', touristPrice: '€8.00 - €12.00', localPrice: '€4.00 - €6.00' },
  { item: 'Taxi (CDG to Right Bank)', touristPrice: '€80 - €100 (scam)', localPrice: '€56 (Flat Rate)' },
  { item: 'Crêpe (Street Cart)', touristPrice: '€7.00 - €10.00', localPrice: '€3.50 - €5.00' },
  { item: 'Metro Ticket (Single)', touristPrice: '€2.15', localPrice: '€2.15 (standard)' },
  { item: 'Bistro Lunch Menu (Plat du Jour)', touristPrice: '€25 - €35', localPrice: '€15 - €18' },
  { item: 'Eiffel Tower Souvenir', touristPrice: '€5.00 (street)', localPrice: '€1.00 for 5 (street)' },
];
