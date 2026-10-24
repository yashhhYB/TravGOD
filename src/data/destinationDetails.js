/**
 * destinationDetails.js — Destination Intelligence Data
 * Sourced facts, history, legal guidelines, tourist allowances, safety tips, and scams.
 */

export const DESTINATION_DETAILS = {
  rome: {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    coords: { lat: 41.9028, lng: 12.4964 },
    tagline: 'The Eternal City — Ancient Grandeur, Authentic Neighborhoods & Living Culture',
    bannerImg: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    history: {
      summary: 'Founded in 753 BC by Romulus, Rome served as the capital of the Roman Empire, the historic seat of the Papacy, and the crucible of Western legal and architectural traditions. Its ancient monuments stand side-by-side with living neighborhoods like Trastevere and Monti.',
      keyFacts: [
        'The Colosseum hosted up to 50,000 spectators for gladiatorial contests starting in 80 AD.',
        'The Pantheon features the world’s largest unreinforced concrete dome, standing intact since 125 AD.',
        'Over 2,500 historic public drinking water fountains ("Nasoni") provide free potable spring water throughout the city.'
      ]
    },
    legal: {
      allowances: 'EU Schengen rules apply. Non-EU travelers: duty-free up to 200 cigarettes, 1L spirits, 4L wine, goods up to €430 value.',
      laws: [
        'Eating messy food or sitting on historic monument steps (Spanish Steps, Trevi Fountain) is prohibited by municipal police (fines €250–€400).',
        'Alcohol consumption from glass containers on public streets is banned after 10:00 PM.',
        'St. Peter’s Basilica and churches strictly enforce covered shoulders and knees dress code.',
        'Recreational drones are prohibited anywhere over Rome without ENAC authorization.'
      ],
      emergency: {
        police: '113',
        ambulance: '118',
        euEmergency: '112',
        touristPolice: '+39 06 67691'
      }
    },
    safetyScams: [
      { title: 'Colosseum Gladiator Photo Trap', risk: 'high', desc: 'Actors place helmets/props in your hand and demand €20–€50 fees.' },
      { title: 'Termini Station Ticket Helpers', risk: 'medium', desc: 'Aggressive individuals press touchscreen buttons and demand cash tips.' },
      { title: 'Unmetered Airport Taxi Surcharge', risk: 'high', desc: 'Drivers quote €100+; legal fixed flat rate is €50 from Fiumicino to inside Aurelian walls.' }
    ],
    typicalCosts: {
      espresso: '€1.20 – €1.50',
      metroTicket: '€1.50 (100 mins)',
      trattoriaMeal: '€12 – €16',
      guideHourly: '€28 – €45 / hr'
    }
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    coords: { lat: 48.8566, lng: 2.3522 },
    tagline: 'The City of Light — Art, Gastronomy & Timeless Architecture',
    bannerImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    history: {
      summary: 'Founded in the 3rd century BC by the Parisii Celtic tribe on the Île de la Cité, Paris grew into a medieval seat of royal power, the birthplace of the Age of Enlightenment, and the cultural capital of modern Europe.',
      keyFacts: [
        'The Eiffel Tower was built for the 1889 Exposition Universelle.',
        'Home to the Louvre Museum, the world’s largest art museum holding over 38,000 objects.',
        'Haussmannian architecture redesigned Paris’s avenues between 1853 and 1870 under Napoleon III.'
      ]
    },
    legal: {
      allowances: 'Duty-free allowance for non-EU travelers: up to 200 cigarettes, 1L spirits, 4L still wine, and goods up to €430 value.',
      laws: [
        'Must carry government ID or passport copy at all times.',
        'Smoking is banned in all indoor public spaces, public transport, and covered restaurant terraces.',
        'Tipping: Service tax (15%) is included by law (service compris); leaving 5–10% extra is customary for great service.'
      ],
      emergency: {
        police: '17',
        ambulance: '15',
        euEmergency: '112',
        touristPolice: '+33 1 53 71 53 71'
      }
    },
    safetyScams: [
      { title: 'Gold Ring Scam', risk: 'high', desc: 'A stranger "finds" a gold ring near your feet, hands it to you, and asks for cash reward.' },
      { title: 'Petition / Charity Signature', risk: 'high', desc: 'Deaf/mute petition clipboard signers surround tourists to pickpocket while you sign.' },
      { title: 'Unmetered Taxi Overcharge', risk: 'medium', desc: 'Fake airport taxis charge €100+ instead of official fixed Paris rates (€56 Charles de Gaulle to Rive Droite).' }
    ],
    typicalCosts: {
      espresso: '€2.50 – €4.00',
      metroTicket: '€2.15',
      bistroMeal: '€20 – €35',
      guideHourly: '€25 – €45 / hr'
    }
  },

  tokyo: {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    coords: { lat: 35.6762, lng: 139.6503 },
    tagline: 'Neon Metropolis Meets Ancient Shinto Harmony',
    bannerImg: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    history: {
      summary: 'Originally a small fishing village named Edo, Tokyo became Japan’s political capital in 1603 under Tokugawa Ieyasu and was renamed Tokyo ("Eastern Capital") in 1868 during the Meiji Restoration.',
      keyFacts: [
        'Shibuya Crossing is the busiest pedestrian intersection in the world with up to 3,000 people per green light.',
        'Tokyo boasts over 200 Michelin-starred restaurants, more than any other city globally.',
        'Meiji Shrine was constructed in 1920 to honor Emperor Meiji.'
      ]
    },
    legal: {
      allowances: 'Duty-free allowance: 400 cigarettes, 3 bottles of alcohol (760ml each), and goods up to ¥200,000.',
      laws: [
        'Strict zero-tolerance drug laws. Carrying unauthorized prescription medication can lead to detention.',
        'Outdoor smoking is restricted to designated smoking zones in most Tokyo wards.',
        'No tipping culture in Japan; tipping is considered rude in restaurants and taxis.'
      ],
      emergency: {
        police: '110',
        ambulance: '119',
        euEmergency: '110',
        touristHelpline: '050-3816-2720 (JNTO)'
      }
    },
    safetyScams: [
      { title: 'Kabukicho Bar Tout Overcharge', risk: 'high', desc: 'Touts invite tourists into bars with free drinks, then demand ¥100,000+ cover fees under threat.' },
      { title: 'Fake Monk Donation', risk: 'medium', desc: 'People dressed as Buddhist monks hand out lucky charms then demand aggressive cash donations.' }
    ],
    typicalCosts: {
      ramenBowl: '¥900 – ¥1,400',
      subwayPass: '¥800 / day',
      izakayaMeal: '¥3,000 – ¥4,500',
      guideHourly: '¥3,500 – ¥6,000 / hr'
    }
  },

  cairo: {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    flag: '🇪🇬',
    coords: { lat: 30.0444, lng: 31.2357 },
    tagline: 'The Mother of the World — Pyramids & Nile Grandeur',
    bannerImg: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    history: {
      summary: 'Founded in 969 AD by the Fatimid dynasty, Cairo sits adjacent to the ancient Egyptian capitals of Memphis and Giza. It is home to the last remaining wonder of the ancient world.',
      keyFacts: [
        'The Great Pyramid of Giza was constructed over 4,500 years ago.',
        'Khan el-Khalili bazaar dates back to 1382 AD as a major trade hub.',
        'The Grand Egyptian Museum in Giza houses the complete King Tutankhamun collection.'
      ]
    },
    legal: {
      allowances: 'Tourist visa required (e-Visa or visa-on-arrival for 70+ nations). Duty free: 200 cigarettes, 1L alcohol.',
      laws: [
        'Drones are strictly prohibited without military permits.',
        'Respect local customs; modest clothing is recommended around religious sites.',
        'Photography near government or military installations is illegal.'
      ],
      emergency: {
        police: '122',
        ambulance: '123',
        touristPolice: '126'
      }
    },
    safetyScams: [
      { title: 'Camel & Horse Ride Markup', risk: 'high', desc: 'Operators quote $10 to get on the camel, then demand $150 to let you dismount.' },
      { title: 'Closed Site / Fake Ticket Helper', risk: 'medium', desc: 'Touts state a venue is closed to redirect you to their commission shop.' }
    ],
    typicalCosts: {
      kosharyMeal: 'EGP 40 – EGP 80',
      pyramidTicket: 'EGP 540',
      guideHourly: 'EGP 600 – 1,200 / hr'
    }
  },

  barcelona: {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    coords: { lat: 41.3851, lng: 2.1734 },
    tagline: 'Gaudí’s Masterpiece, Mediterranean Culture & Tapas',
    bannerImg: 'https://images.unsplash.com/photo-1583422409516-2895a771deda?auto=format&fit=crop&w=1200&q=80',
    history: {
      summary: 'Founded as a Roman city (Barcino), Barcelona became the capital of the County of Barcelona in the Middle Ages. Its modern landscape is defined by Antoni Gaudí’s Catalan Modernism.',
      keyFacts: [
        'La Sagrada Família has been under construction since 1882.',
        'Park Güell was commissioned by Eusebi Güell as a garden city project.',
        'The Gothic Quarter retains city structures from Roman and medieval eras.'
      ]
    },
    legal: {
      allowances: 'EU Schengen rules apply. Non-EU: 200 cigarettes, 1L spirits, 4L still wine.',
      laws: [
        'Drinking alcohol in public streets (botellón) is illegal in Barcelona and subject to fines.',
        'Wearing swimwear outside of beach zones is prohibited by city ordinance.',
        'Tipping is modest (5–10% for good service).'
      ],
      emergency: {
        police: '091 / 092',
        ambulance: '061',
        euEmergency: '112'
      }
    },
    safetyScams: [
      { title: 'Las Ramblas Pickpocketing', risk: 'high', desc: 'Distraction teams ask for directions or spill liquids while accomplices steal wallets.' },
      { title: 'Rose / Rosemary Flower Gift', risk: 'medium', desc: 'Women force flowers into your hand, read fortunes, then aggressively demand €20+.' }
    ],
    typicalCosts: {
      tapasPlate: '€4 – €9',
      sagradaFamilia: '€26',
      guideHourly: '€25 – €50 / hr'
    }
  }
};
