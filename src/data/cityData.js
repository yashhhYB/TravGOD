/**
 * cityData.js — Comprehensive Hand-Checked Seed Data for Paris 🇫🇷 & Rome 🇮🇹
 * Includes: Overview, Rules & Laws (with official citations & fines),
 * Scam Radar (ScamSense), Fair Prices (travel/transit/rent), Hidden Spots, and Emergency contacts.
 */

export const CITY_DATA = {
  paris: {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    coords: [48.8566, 2.3522],
    currency: 'EUR (€)',
    exchangeRateUsd: 1.08,
    timezone: 'Europe/Paris (CET/CEST)',
    primaryLanguages: ['French', 'English widely spoken in central zones'],
    overview: {
      tagline: 'The City of Light — Art, Gastronomy, Historic Boulevards & Bohemian Quarters',
      description: 'Paris is Europe’s cultural and gastronomic capital. While central arrondissements are generally very safe with world-class public transit, high-density tourist landmarks (Eiffel Tower, Louvre, Sacré-Cœur) require situational awareness against coordinated distraction pickpockets and street scams.',
      safetyScore: '8.4 / 10 (Safe — Watch for Pickpockets around Monuments)',
      bestSeason: 'April to October & December for Christmas Illuminations',
      transitSummary: 'RATP Metro runs 05:30 AM to 01:15 AM (02:15 AM weekends). Standard single ticket is €2.15 on Navigo Easy.',
      keyDistricts: [
        { name: 'Le Marais (3rd/4th)', vibe: 'Historic mansions, art galleries, vintage boutiques, vibrant cafés' },
        { name: 'Saint-Germain-des-Prés (6th)', vibe: 'Literary cafés, antique shops, elegant Parisian architecture' },
        { name: 'Montmartre (18th)', vibe: 'Artistic hilltop village, cobblestone alleys, panoramic city views' },
        { name: 'Latin Quarter (5th)', vibe: 'Student bookstores, ancient Roman ruins, affordable bistros' },
        { name: 'Canal Saint-Martin (10th)', vibe: 'Hip waterside wine bars, footbridges, relaxed local picnic scene' }
      ]
    },
    rules: [
      {
        id: 'rule-paris-alcohol',
        title: 'Public Alcohol Consumption Curfew on Riverbanks & Parks',
        severity: 'careful',
        category: 'Public Order',
        penalty: '€135 fine and confiscation of open containers.',
        summary: 'Drinking alcohol from open containers along the Seine riverbanks, Canal Saint-Martin, and Champ de Mars is prohibited between 10:00 PM and 07:00 AM under municipal police order.',
        whatToDoInstead: 'Enjoy drinks at licensed café and bistro terraces or indoors. In daytime, picnics with wine are permitted before 10 PM.',
        citation: 'Préfecture de Police de Paris — Arrêté préfectoral relatif à la consommation d’alcool sur la voie publique',
        verifiedAt: '2026-10-08'
      },
      {
        id: 'rule-paris-scooters',
        title: 'Rented E-Scooter Ban & Sidewalk Riding Prohibition',
        severity: 'serious',
        category: 'Transport & Safety',
        penalty: '€135 fine for sidewalk riding; €35 for improper parking.',
        summary: 'Free-floating commercial e-scooters (trottinettes) were officially banned from Paris in 2023. Privately owned e-scooters may never be ridden on pedestrian sidewalks or pedestrianized plazas.',
        whatToDoInstead: 'Use the official municipal Vélib bike-sharing system or ride private scooters exclusively in designated cycle paths (pistes cyclables).',
        citation: 'Ville de Paris — Réglementation des engins de déplacement personnel motorisés (EDPM)',
        verifiedAt: '2026-10-06'
      },
      {
        id: 'rule-paris-metro-tickets',
        title: 'Metro Ticket Validation & Fraud Controls',
        severity: 'serious',
        category: 'Public Transit',
        penalty: '€50 to €70 on-the-spot fine, or up to €180 if unpaid within 20 days.',
        summary: 'RATP transit inspectors conduct random ticket sweeps inside Metro stations and RER exits. Tailgating behind someone through turnstiles or discarding your validated ticket before exiting is penalized.',
        whatToDoInstead: 'Keep your validated Navigo Easy card or ticket until you have fully walked out of the station turnstiles onto the street.',
        citation: 'RATP — Conditions Générales de Vente et d’Utilisation du réseau métropolitain',
        verifiedAt: '2026-10-05'
      },
      {
        id: 'rule-paris-lawns',
        title: 'Sitting on Historic Lawns in Tuileries & Luxembourg',
        severity: 'info',
        category: 'Parks & Heritage',
        penalty: 'Verbal expulsion by municipal park wardens (agents de surveillance de Paris); €38 fine for defiance.',
        summary: 'In formal historic royal gardens (Jardin des Tuileries, Jardin du Luxembourg), sitting on manicured lawns marked "Pelouse au repos" (Lawn resting) is forbidden to preserve 300-year-old turf.',
        whatToDoInstead: 'Take one of the free iconic green metal chairs (fauteuils Sénat) placed throughout the tree-lined promenades and around the fountains.',
        citation: 'Sénat de France — Règlement d’usage du Jardin du Luxembourg',
        verifiedAt: '2026-10-04'
      },
      {
        id: 'rule-paris-locks',
        title: 'Attaching "Love Padlocks" to Historic Bridges',
        severity: 'careful',
        category: 'Monument Preservation',
        penalty: '€68 fine and immediate bolt-cutter removal.',
        summary: 'Attaching padlocks to bridge railings (Pont des Arts, Pont de l’Archevêché) causes structural railings to collapse and damages historic stone masonry.',
        whatToDoInstead: 'Take romantic photographs with the Seine backdrop. Do not leave metal padlocks on historic structures.',
        citation: 'Mairie de Paris — Campagne de préservation des ponts parisiens',
        verifiedAt: '2026-10-03'
      },
      {
        id: 'rule-paris-smoking',
        title: 'Smoking in Enclosed Public Areas & Children’s Playgrounds',
        severity: 'careful',
        category: 'Public Health',
        penalty: '€68 to €450 fine (Loi Évin).',
        summary: 'Smoking or vaping inside public transport, railway stations, enclosed restaurants, covered awnings, and public playgrounds is strictly prohibited by French law.',
        whatToDoInstead: 'Smoke only in open-air uncovered sidewalk spaces and always use the cigarette ash deposit bins on green municipal lampposts.',
        citation: 'Code de la santé publique — Article R3512-2',
        verifiedAt: '2026-10-01'
      }
    ],
    scams: [
      {
        id: 's-paris-bracelet',
        title: 'The Friendship Bracelet Trap',
        location: 'Sacré-Cœur Stairs / Montmartre',
        risk: 'high',
        coords: [48.8867, 2.3431],
        activeHours: '10:00 AM – 08:00 PM daily',
        howItWorks: 'Men block the narrow outdoor stairs leading up to Sacré-Cœur, grab your wrist or finger playfully, and rapidly braid a colored string onto you. Once tied, they aggressively surround you demanding €20–€50.',
        howToAvoid: 'Keep your hands in your pockets or folded. Look straight ahead, firmly say "Non merci," and take the Funiculaire de Montmartre or side stairs via Rue Foyatier.',
        ifItHappened: 'Do not hand them cash. Break the string or walk into the nearby church entrance where security guards are posted.',
        sourceUrl: 'https://www.prefecturedepolice.interieur.gouv.fr',
        verifiedAt: '2026-10-09'
      },
      {
        id: 's-paris-petition',
        title: 'The Fake Charity Petition & Distraction Pickpocket',
        location: 'Eiffel Tower / Champ de Mars / Louvre Carrousel',
        risk: 'high',
        coords: [48.8584, 2.2945],
        activeHours: '09:30 AM – 07:30 PM',
        howItWorks: 'Youths carrying clipboards approach posing as deaf-mute charity volunteers. While you sign the bogus petition, their accomplices lift your phone, wallet, or backpack contents from behind.',
        howToAvoid: 'Never make eye contact or sign clipboards on the street. Official charities never collect money with clipboards in front of monuments.',
        ifItHappened: 'Check your pockets immediately. Shout "Police!" to startle them away.',
        sourceUrl: 'https://www.paris.fr',
        verifiedAt: '2026-10-08'
      },
      {
        id: 's-paris-ring',
        title: 'The "Found Gold Ring" Deception',
        location: 'Pont Neuf & Seine River Promenades',
        risk: 'medium',
        coords: [48.8566, 2.3364],
        activeHours: 'Mid-morning to late afternoon',
        howItWorks: 'A stranger bends down right in front of you, picks up a shiny brass ring with a fake hallmark stamp, and asks if you dropped it. When you say no, they claim it is real 18k gold and try to give it to you in exchange for €20–€50 for "lunch".',
        howToAvoid: 'Ignore anyone bending down to pick up jewelry in front of you. Keep walking.',
        ifItHappened: 'Hand the brass ring back or drop it on the ground and walk away.',
        sourceUrl: 'https://www.prefecturedepolice.interieur.gouv.fr',
        verifiedAt: '2026-10-05'
      },
      {
        id: 's-paris-taxi',
        title: 'Unofficial Airport & Station Taxi Overcharging',
        location: 'CDG Airport / Orly Airport / Gare du Nord',
        risk: 'high',
        coords: [49.0097, 2.5479],
        activeHours: 'All hours',
        howItWorks: 'Touts approach you inside terminal halls whispering "Taxi? Taxi Paris?". They guide you to unmetered passenger cars and charge €120–€180 at your destination instead of the regulated flat rate.',
        howToAvoid: 'Follow the illuminated floor signs "Taxis officiels" to the outdoor queue. Fares from CDG to Paris are strictly legally fixed: €56 (Right Bank) and €65 (Left Bank).',
        ifItHappened: 'Demand the itemized fiscal receipt. Legitimate Paris taxis must accept credit cards by law.',
        sourceUrl: 'https://www.parisaeroport.fr',
        verifiedAt: '2026-10-06'
      },
      {
        id: 's-paris-bonneteau',
        title: 'Three-Card Monte (Le Bonneteau) Street Gambling',
        location: 'Pont d’Iéna (between Eiffel Tower & Trocadéro)',
        risk: 'high',
        coords: [48.8595, 2.2933],
        activeHours: 'Afternoon to sunset',
        howItWorks: 'A dealer shuffles three cardboard cups or cards on an upturned cardboard box. Fake "tourists" in the crowd win €50 visibly to lure you. The game is physically rigged using sleight of hand—you can never win.',
        howToAvoid: 'Never stop to watch. The crowd around the game consists of spotters and pickpockets targeting spectators.',
        ifItHappened: 'Walk away immediately; do not attempt to dispute with the gang.',
        sourceUrl: 'https://www.prefecturedepolice.interieur.gouv.fr',
        verifiedAt: '2026-10-04'
      },
      {
        id: 's-paris-metro-tickets',
        title: 'Fake "Helpful" Ticket Machine Helpers',
        location: 'Gare du Nord & Châtelet-Les Halles Automated Kiosks',
        risk: 'medium',
        coords: [48.8809, 2.3553],
        activeHours: 'Peak arrival hours (08:00 AM – 06:00 PM)',
        howItWorks: 'Scammers linger near touchscreens offering to help foreigners buy tickets, but sell expired child tickets or pocket your change directly.',
        howToAvoid: 'Switch the RATP machine interface to English using the touchscreen flag. Buy tickets from official uniformed glass booths if unsure.',
        ifItHappened: 'Contact station RATP staff inside the glass kiosk.',
        sourceUrl: 'https://www.ratp.fr',
        verifiedAt: '2026-10-02'
      }
    ],
    prices: [
      { item: 'Espresso (Au comptoir / At Counter)', touristRate: '€3.50 – €4.50 (seated on terrace)', localRate: '€1.20 – €1.50', category: 'Food & Drink', note: 'By French café law, drinking standing at the counter has a regulated lower tariff' },
      { item: 'Croissant au Beurre (Artisan Boulangerie)', touristRate: '€2.50 – €3.00', localRate: '€1.20 – €1.45', category: 'Food & Drink', note: 'Look for the "Artisan Boulanger" certification seal on the shopfront' },
      { item: 'Single Metro Ticket (Ticket T+ / Navigo Easy)', touristRate: '€3.00 (from bus driver with cash)', localRate: '€2.15 (€1.73 in carnet of 10)', category: 'Transport', note: 'Load a Navigo Easy card for the best value and seamless tap entry' },
      { item: 'Taxi: CDG Airport to Paris Right Bank', touristRate: '€90 – €140 (illegal touts)', localRate: '€56.00 (Mandatory Flat Rate)', category: 'Transport', note: 'Fixed municipal decree; no luggage surcharges apply' },
      { item: 'Taxi: CDG Airport to Paris Left Bank', touristRate: '€100 – €150 (illegal touts)', localRate: '€65.00 (Mandatory Flat Rate)', category: 'Transport', note: 'Fixed municipal decree; credit card mandatory' },
      { item: 'Bistro Lunch Menu (Formule Midi / Plat du Jour)', touristRate: '€28 – €40 in tourist traps', localRate: '€15 – €19', category: 'Food & Drink', note: 'Includes main dish + coffee or dessert at neighborhood bistros' },
      { item: 'Glass of Wine (Verre de Vin rouge/blanc)', touristRate: '€9 – €14 near monuments', localRate: '€4.50 – €6.50', category: 'Food & Drink', note: 'Ask for the house wine (vin de la maison) or Côtes du Rhône' },
      { item: 'Museum Entry (Louvre / Musée d’Orsay)', touristRate: '€45 – €60 (unofficial touts)', localRate: '€16 – €22 (official website)', category: 'Culture', note: 'Free for EU residents under 26 and free for all on the 1st Sunday of winter months' },
      { item: 'Private Local Guide (per hour)', touristRate: '€80 – €120 (commercial agencies)', localRate: '€20 – €45 / hr', category: 'Guide Services', note: 'Booked directly via verified Local Guide Connect with PayPal escrow' },
      { item: 'Vélib Bike Rental (24-Hour Pass)', touristRate: '€15 (commercial bike tour)', localRate: '€3.00 / day', category: 'Transport', note: 'Includes unlimited 30-minute mechanical bike trips across Paris' },
      { item: 'Studio Apartment / Boutique Hotel Room (per night)', touristRate: '€250 – €450 (high season luxury)', localRate: '€95 – €150 / night', category: 'Accommodation', note: 'Average authentic stay in 10th, 11th, or 14th arrondissements' }
    ],
    foodSpots: [
      {
        id: 'p-food-1',
        name: 'Le Chateaubriand',
        category: 'Modern Bistronomy',
        neighborhood: '11th Arrondissement',
        coords: [48.8688, 2.3712],
        priceLevel: '€€€',
        signatureDish: 'Creative Blind Tasting Menu (€85)',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
        description: 'Pioneered the Parisian bistronomy movement. High-energy dining room with inventive daily creations using freshest French market finds.',
        insiderTip: 'Walk in without reservations at 9:30 PM for the unbooked second service.'
      },
      {
        id: 'p-food-2',
        name: 'Septime',
        category: 'Michelin Star Farm-to-Table',
        neighborhood: 'Charonne / 11th',
        coords: [48.8532, 2.3804],
        priceLevel: '€€€',
        signatureDish: 'Roasted Trout with Wild Mushroom Emulsion',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        description: 'Voted one of the World’s 50 Best Restaurants. Sublime seasonal textures paired with low-intervention natural biodynamic wines.',
        insiderTip: 'Reservations open 21 days in advance at 10:00 AM sharp.'
      },
      {
        id: 'p-food-3',
        name: 'Café de Flore',
        category: 'Historic Literary Café',
        neighborhood: 'Saint-Germain-des-Prés',
        coords: [48.8540, 2.3325],
        priceLevel: '€€',
        signatureDish: 'Chocolat Chaud Spécial Flore & Club Sandwich',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
        description: 'Open since 1887. The intellectual birthplace of existentialism where Sartre, Simone de Beauvoir, and Picasso spent their mornings.',
        insiderTip: 'Head up to the second floor for a peaceful historical atmosphere away from terrace crowds.'
      },
      {
        id: 'p-food-4',
        name: 'L’As du Fallafel',
        category: 'Legendary Street Food',
        neighborhood: 'Le Marais (Rue des Rosiers)',
        coords: [48.8574, 2.3592],
        priceLevel: '€',
        signatureDish: 'Fallafel Spécial Pita (€9.50)',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80',
        description: 'World-famous warm pita packed with crisp herbed falafel balls, fried eggplant, shredded red cabbage, and rich nutty tahini sauce.',
        insiderTip: 'Order at the takeaway window and walk 4 minutes to eat peacefully in Place des Vosges.'
      },
      {
        id: 'p-food-5',
        name: 'Du Pain et des Idées',
        category: 'Artisan Master Boulangerie',
        neighborhood: 'Canal Saint-Martin (10th)',
        coords: [48.8710, 2.3638],
        priceLevel: '€',
        signatureDish: 'L’Escargot Chocolat Pistache & Pain des Amis',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        description: '1875 historic wood-paneled bakery acclaimed worldwide for wood-fired ancient wheat loaves and exquisite spiral pastries.',
        insiderTip: 'Closed on weekends—plan a visit Tuesday through Friday morning.'
      },
      {
        id: 'p-food-6',
        name: 'Bouillon Chartier',
        category: '1896 Belle Époque Dining Hall',
        neighborhood: 'Grands Boulevards (9th)',
        coords: [48.8719, 2.3429],
        priceLevel: '€',
        signatureDish: 'Traditional Bœuf Bourguignon (€11.80)',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        description: 'Under soaring stained-glass ceilings, waiters in black waistcoats calculate your bill directly on the paper tablecloth. Unbeatable authentic value.',
        insiderTip: 'No reservations; arrive at 11:45 AM or 6:30 PM to walk straight in without waiting.'
      },
      {
        id: 'p-food-7',
        name: 'Breizh Café',
        category: 'Organic Breton Crêperie',
        neighborhood: 'Le Marais (3rd)',
        coords: [48.8601, 2.3621],
        priceLevel: '€€',
        signatureDish: 'Galette Complète with Bordier Artisanal Butter',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80',
        description: 'Crispy buckwheat galettes made from stone-ground organic flour, topped with farm egg, gruyère, and smoked ham, paired with dry Brittany cider.',
        insiderTip: 'Try the salted caramel crêpe for dessert—made with legendary Jean-Yves Bordier butter.'
      }
    ],
    hiddenSpots: [
      {
        id: 'p-hidden-1',
        title: 'Promenade Plantée (Coulée Verte René-Dumont)',
        neighborhood: '12th Arrondissement',
        coords: [48.8475, 2.3789],
        description: 'A 4.7 km elevated tree-lined park built upon a decommissioned 19th-century railway viaduct, preceding New York’s High Line by 15 years. Lined with rose bushes and quiet benches.',
        bestTime: 'Morning or early sunset stroll',
        localTip: 'Start at Bastille (Viaduc des Arts) and walk east toward Bois de Vincennes.'
      },
      {
        id: 'p-hidden-2',
        title: 'Place Dauphine',
        neighborhood: 'Île de la Cité (1st Arrondissement)',
        coords: [48.8566, 2.3421],
        description: 'A quiet, secluded triangular square nestled behind the Palais de Justice. While millions crowd Notre-Dame nearby, locals play pétanque under chestnut trees here.',
        bestTime: 'Late afternoon with a glass of wine',
        localTip: 'Sit at Café la Rose de France for a tranquil apéritif away from crowds.'
      },
      {
        id: 'p-hidden-3',
        title: 'Arènes de Lutèce',
        neighborhood: 'Latin Quarter (5th Arrondissement)',
        coords: [48.8450, 2.3527],
        description: 'An authentic 1st-century Roman amphitheater hidden behind an ordinary apartment building facade on Rue Monge. Once held 15,000 Romans watching gladiatorial contests.',
        bestTime: 'Midday picnic spot',
        localTip: 'Bring bread, cheese, and pastries from nearby Rue Mouffetard bakeries.'
      },
      {
        id: 'p-hidden-4',
        title: 'Parc des Buttes-Chaumont & Temple de la Sibylle',
        neighborhood: '19th Arrondissement',
        coords: [48.8794, 2.3831],
        description: 'Dramatic romantic park built in an old gypsum quarry featuring a 50m rocky cliff, suspension footbridge, waterfall grotto, and an Italianate temple overlooking Montmartre.',
        bestTime: 'Sunset on the cliffside terrace',
        localTip: 'Visit Rosa Bonheur tavern inside the park for tapas and local music.'
      }
    ],
    emergency: {
      panEuropean: '112',
      medicalAmbulance: '15 (SAMU)',
      police: '17 (Police Secours)',
      fireRescue: '18 (Sapeurs-Pompiers)',
      sosDoctors: '+33 1 47 07 77 77 (SOS Médecins — 24/7 English-speaking home doctor service)',
      englishHospital: 'American Hospital of Paris (Neuilly-sur-Seine) — +33 1 46 41 25 25',
      centralHospital: 'Hôtel-Dieu Hospital Emergency (Île de la Cité, near Notre-Dame) — +33 1 42 34 82 34',
      pharmacy247: 'Pharmacie Les Champs (84 Avenue des Champs-Élysées, 75008 Paris) — Open 24/7',
      lostCreditCard: 'Oppositions Cartes Bancaires: 0892 705 705'
    }
  },

  rome: {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    coords: [41.9028, 12.4964],
    currency: 'EUR (€)',
    exchangeRateUsd: 1.08,
    timezone: 'Europe/Rome (CET/CEST)',
    primaryLanguages: ['Italian', 'English widely spoken in central areas'],
    overview: {
      tagline: 'The Eternal City — Ancient Grandeur, Authentic Neighborhoods & Living Culture',
      description: 'Rome is an open-air museum where ancient history meets vibrant neighborhood street life. While violent crime is exceptionally rare, high-density tourist centers (Colosseum, Vatican, Trevi Fountain, Termini) require awareness against pushy street touts, unmetered taxis, and fake skip-the-line agents.',
      safetyScore: '8.6 / 10 (Safe — Watch for Pickpockets & Street Vendors)',
      bestSeason: 'March to June & September to November for temperate weather',
      transitSummary: 'ATAC Metro lines A, B & C run 05:30 AM to 11:30 PM (01:30 AM Friday & Saturday). Standard BIT ticket is €1.50 valid for 100 minutes.',
      keyDistricts: [
        { name: 'Trastevere', vibe: 'Cobblestone medieval alleys, ivy-draped trattorias, lively evening piazza gatherings' },
        { name: 'Rione Monti', vibe: 'Bohemian artisan quarter, vintage boutiques, ancient views, hip wine bars' },
        { name: 'Testaccio', vibe: 'The authentic birthplace of Roman cuisine, covered food market, zero tourist traps' },
        { name: 'Centro Storico (Navona/Pantheon)', vibe: 'Baroque fountains, monumental piazzas, bustling artisan gelaterias' },
        { name: 'Prati / Borgo', vibe: 'Elegant Art Nouveau residential streets, culinary gourmet stores next to the Vatican' }
      ]
    },
    rules: [
      {
        id: 'rule-monuments',
        title: 'Sitting, Eating & Drinking on Historic Monument Steps',
        severity: 'careful',
        category: 'Heritage Preservation',
        penalty: 'Fines range from €250 up to €400, plus possible temporary ban from the area (DASPO urbano).',
        summary: 'Sitting on the Spanish Steps (Piazza di Spagna), eating messy foods on monument edges, or bathing/wading in fountains is strictly prohibited under Rome municipal urban security ordinances.',
        whatToDoInstead: 'Sit on municipal benches or enjoy food at outdoor cafés. Drink only from designated water fountains (nasoni).',
        citation: 'Roma Capitale — Regolamento di Polizia Urbana (Deliberazione AC n. 43)',
        verifiedAt: '2026-10-09'
      },
      {
        id: 'rule-fountains',
        title: 'Wading or Dipping Feet into Roman Fountains (Trevi, Navona)',
        severity: 'serious',
        category: 'Heritage Protection',
        penalty: '€450 fine and immediate police summons.',
        summary: 'Touching, wading, or swimming in historic monumental fountains (Fontana di Trevi, Fontana dei Quattro Fiumi, Barcaccia) is illegal under strict monument protection decrees.',
        whatToDoInstead: 'Toss coins over your left shoulder with your right hand backward into the Trevi pool from behind the designated stone parapet.',
        citation: 'Soprintendenza Speciale Archeologia Belle Arti e Paesaggio di Roma',
        verifiedAt: '2026-10-08'
      },
      {
        id: 'rule-centurions',
        title: 'Unauthorized "Centurion / Gladiator" Costume Solicitation',
        severity: 'serious',
        category: 'Public Order & Extortion',
        penalty: '€400 municipal fine and immediate confiscation of unauthorized historical costumes.',
        summary: 'Individuals dressing as Roman centurions/gladiators to solicit paid photographs outside the Colosseum and Roman Forum are legally banned by municipal ordinance.',
        whatToDoInstead: 'Politely refuse any photo requests. Take photos of the monument architecture directly or with certified tour guides.',
        citation: 'Ordinanza Sindacale n. 28/2019 — Divieto di svolgimento di attività di figurante storico',
        verifiedAt: '2026-10-07'
      },
      {
        id: 'rule-dress-code',
        title: 'Basilica & Church Modest Dress Code',
        severity: 'careful',
        category: 'Religious Etiquette',
        penalty: 'Immediate denial of entry by Swiss Guards and Vatican security staff.',
        summary: 'When visiting St. Peter’s Basilica, the Vatican Museums, the Pantheon, and Roman churches, shoulders and knees must be fully covered. Sleeveless tank tops and short shorts are strictly barred.',
        whatToDoInstead: 'Carry a light scarf or linen shawl in your daypack to drape over shoulders and knees before entering churches.',
        citation: 'Fabbrica di San Pietro in Vaticano — Regolamento di accesso',
        verifiedAt: '2026-10-05'
      },
      {
        id: 'rule-alcohol-curfew',
        title: 'Outdoor Alcohol Street Consumption Curfew',
        severity: 'careful',
        category: 'Nightlife Order',
        penalty: '€280 fine for patrons; €400 fine for vendors selling takeaway alcohol.',
        summary: 'Consuming alcohol from glass bottles on public streets and piazzas is prohibited after 10:00 PM (midnight on weekends) in central entertainment zones (Trastevere, Monti, San Lorenzo).',
        whatToDoInstead: 'Drink at seated tables inside or within permitted licensed café terraces (dehors).',
        citation: 'Roma Capitale — Ordinanza orari somministrazione bevande alcoliche',
        verifiedAt: '2026-10-04'
      },
      {
        id: 'rule-transit-tickets',
        title: 'ATAC Transit Ticket Pre-Validation',
        severity: 'careful',
        category: 'Public Transit',
        penalty: '€54.90 fine if paid within 5 days (rises to €104.90 + ticket cost).',
        summary: 'You must validate your ATAC paper ticket immediately upon boarding buses and trams or passing metro turnstiles. Holding an un-stamped ticket during an inspector check is considered fare evasion.',
        whatToDoInstead: 'Stamp paper tickets in the yellow machine upon boarding, or simply tap your contactless credit card directly on the turnstile reader (Tap&Go).',
        citation: 'ATAC S.p.A. — Condizioni Generali di Trasporto',
        verifiedAt: '2026-10-02'
      }
    ],
    scams: [
      {
        id: 's-rome-gladiator',
        title: 'The Fake Colosseum Centurion Photo Extortion',
        location: 'Colosseum Exterior & Via dei Fori Imperiali',
        risk: 'high',
        coords: [41.8902, 12.4922],
        activeHours: '10:00 AM – 06:00 PM',
        howItWorks: 'Costumed gladiators approach tourists warmly, place a toy wooden sword in your hands, and pose cheerfully. Once the photo is taken, they aggressively surround you demanding €20 to €50 per person.',
        howToAvoid: 'Firmly say "No, grazie" and walk past them without stopping. Never hand them your camera or phone.',
        ifItHappened: 'Walk briskly toward the Carabinieri or Polizia Locale post situated at the corner of Piazza del Colosseo.',
        sourceUrl: 'https://www.comune.roma.it',
        verifiedAt: '2026-10-09'
      },
      {
        id: 's-rome-termini-ticket',
        title: 'Termini Station Automated Ticket Machine "Helper"',
        location: 'Roma Termini — Trenitalia & Italo kiosks',
        risk: 'medium',
        coords: [41.9010, 12.5018],
        activeHours: 'All hours (Peak 08:00 AM – 09:00 PM)',
        howItWorks: 'Individuals stand right behind automated ticket kiosks, press buttons quickly on the touchscreen for you, and demand €5–€20 for "assistance" or scoop change from the coin return tray.',
        howToAvoid: 'Select the English language button yourself. Firmly say "Non ho bisogno, grazie".',
        ifItHappened: 'Report them to the uniformed Trenitalia staff or Polfer (Railway Police) officers patrolling the central ticket hall.',
        sourceUrl: 'https://www.trenitalia.com',
        verifiedAt: '2026-10-07'
      },
      {
        id: 's-rome-fake-vatican',
        title: 'Fake Vatican & Colosseum "Skip-the-Line" Street Touts',
        location: 'Ottaviano Metro Station & Via di Porta Angelica',
        risk: 'high',
        coords: [41.9060, 12.4540],
        activeHours: '08:30 AM – 03:00 PM',
        howItWorks: 'Touts wearing fake badges claim the main Vatican entrance is closed or has a 4-hour wait, redirecting tourists to buy unofficial €80+ tour packages that never skip any lines.',
        howToAvoid: 'Buy tickets exclusively from official portals (museivaticani.va or coopculture.it) or verified Local Guide Connect guides with badges.',
        ifItHappened: 'Do not pay cash to street vendors without official digital vouchers.',
        sourceUrl: 'https://www.museivaticani.va',
        verifiedAt: '2026-10-06'
      },
      {
        id: 's-rome-fish-weight',
        title: 'Fresh Fish & Florentine Steak "100g Price" Menu Deception',
        location: 'Tourist alleys near Navona, Trevi and Campo de’ Fiori',
        risk: 'medium',
        coords: [41.8992, 12.4731],
        activeHours: 'Dinner hours (07:30 PM – 11:30 PM)',
        howItWorks: 'Waiters recommend the "fresh whole sea bass" quoting €8. When the bill arrives, it totals €80 because the small print on the menu listed €8 per 100 grams, not for the dish.',
        howToAvoid: 'Always ask the waiter to confirm the exact weight and final total bill before authorizing cooking.',
        ifItHappened: 'Request the itemized fiscal receipt ("ricevuta fiscale"). Restaurants are legally required to provide weight disclosure.',
        sourceUrl: 'https://www.guardiadifinanza.gov.it',
        verifiedAt: '2026-10-04'
      },
      {
        id: 's-rome-airport-taxi',
        title: 'Airport Taxi Flat-Rate Overcharge',
        location: 'Fiumicino (FCO) & Ciampino (CIA) Airport Arrivals',
        risk: 'high',
        coords: [41.7999, 12.2462],
        activeHours: 'All hours',
        howItWorks: 'Drivers pretend the municipal fixed flat rate does not apply because of nighttime, excess bags, or drop-off location, charging €80–€100.',
        howToAvoid: 'Rome white taxis have official municipal emblems. Fares to anywhere inside the Aurelian Walls are legally fixed at €55 from Fiumicino and €40 from Ciampino.',
        ifItHappened: 'Take a photo of the taxi license number on the door panel and ask for the receipt.',
        sourceUrl: 'https://www.adr.it',
        verifiedAt: '2026-10-03'
      },
      {
        id: 's-rome-bracelet',
        title: 'Friendship Bracelet & "Free Rose" Ambush',
        location: 'Piazza Navona & Spanish Steps',
        risk: 'medium',
        coords: [41.8989, 12.4731],
        activeHours: 'Afternoon to evening',
        howItWorks: 'Men drop a friendship bracelet onto your arm or hand a rose to your partner stating "It’s a gift for peace/love", then aggressively follow you demanding cash.',
        howToAvoid: 'Never take anything placed into your hand. Let it fall to the cobblestones if they force it, and keep walking.',
        ifItHappened: 'Refuse to open your wallet and walk away.',
        sourceUrl: 'https://www.poliziadistato.it',
        verifiedAt: '2026-10-02'
      }
    ],
    prices: [
      { item: 'Espresso (Al banco / At Counter)', touristRate: '€3.50 – €4.50 (seated in piazza)', localRate: '€1.10 – €1.30', category: 'Food & Drink', note: 'Standard Italian price for espresso standing at the marble counter' },
      { item: 'Maritozzo con la Panna (Roman Cream Brioche)', touristRate: '€5.00 – €7.00', localRate: '€2.50 – €3.50', category: 'Food & Drink', note: 'Historic Roman breakfast specialty best enjoyed at Regoli bakery' },
      { item: 'Single ATAC Transit Ticket (BIT — 100 Minutes)', touristRate: '€2.50 (from hotel desk)', localRate: '€1.50 (standard kiosk / Tap&Go)', category: 'Transport', note: 'Valid for 100 minutes of unlimited bus/tram transfers and 1 metro ride' },
      { item: 'Taxi: Fiumicino Airport (FCO) to Central Rome', touristRate: '€80 – €110 (unmetered scam)', localRate: '€55.00 (Fixed Municipal Fare)', category: 'Transport', note: 'Legally fixed for anywhere within the historic Aurelian Walls' },
      { item: 'Taxi: Ciampino Airport (CIA) to Central Rome', touristRate: '€60 – €80 (unmetered scam)', localRate: '€40.00 (Fixed Municipal Fare)', category: 'Transport', note: 'Legally fixed municipal fare; all luggage included' },
      { item: 'Authentic Roman Pasta (Carbonara, Cacio e Pepe)', touristRate: '€18 – €25 in tourist traps', localRate: '€10 – €14', category: 'Food & Drink', note: 'Look for spots without photo menus in Testaccio and Trastevere' },
      { item: 'Glass of Wine (Vino della Casa / Frascati)', touristRate: '€8 – €12 near monuments', localRate: '€4.00 – €6.00', category: 'Food & Drink', note: 'A quartino (250ml carafe) of house wine is typically €5–€7' },
      { item: 'Colosseum Official Full Experience Ticket', touristRate: '€45 – €70 (street touts)', localRate: '€18.00 (Official Parco Colosseo)', category: 'Culture', note: 'Includes Colosseum, Roman Forum, and Palatine Hill entrance' },
      { item: 'Private Local Guide (per hour)', touristRate: '€70 – €100 (agency packages)', localRate: '€20 – €40 / hr', category: 'Guide Services', note: 'Booked directly with verified local guides under PayPal escrow' },
      { item: 'Dott / Lime E-Bike or Scooter', touristRate: '€0.35 / min', localRate: '€0.24 / min (€7.99 day pass)', category: 'Transport', note: 'Cycle along Tiber river bike path (Pista Ciclabile del Tevere)' },
      { item: 'Central Studio / Guest House (per night)', touristRate: '€220 – €380 (peak summer)', localRate: '€80 – €140 / night', category: 'Accommodation', note: 'Average authentic stay in Monti, Trastevere, or San Giovanni' }
    ],
    foodSpots: [
      {
        id: 'r-food-1',
        name: 'Trattoria Da Enzo al 29',
        category: 'Legendary Roman Trattoria',
        neighborhood: 'Trastevere',
        coords: [41.8885, 12.4765],
        priceLevel: '€€',
        signatureDish: 'Rigatoni alla Carbonara & Carciofo alla Giudia',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80',
        description: 'Tucked into a quiet cobblestone alley in Trastevere, this cozy family-run osteria serves Rome’s gold standard of carbonara using farm-fresh eggs and aged pecorino.',
        insiderTip: 'No reservations accepted; arrive 25 minutes before opening (12:00 PM lunch or 7:00 PM dinner) to grab a table.'
      },
      {
        id: 'r-food-2',
        name: 'Roscioli Salumeria con Cucina',
        category: 'Gourmet Deli & Wine Sanctuary',
        neighborhood: 'Centro Storico (Near Campo de’ Fiori)',
        coords: [41.8942, 12.4735],
        priceLevel: '€€€',
        signatureDish: 'Burrata Pugliese with Cantabrian Anchovies & Spaghettoni Carbonara',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
        description: 'A paradise for food purists. Over 300 artisanal cheeses, 150 cured salumi varieties, and a cellar of 2,800 hand-curated natural wines.',
        insiderTip: 'Book 2 weeks in advance and request a table in the subterranean wine cellar.'
      },
      {
        id: 'r-food-3',
        name: 'Pasticceria Regoli',
        category: 'Historic 1916 Pasticceria',
        neighborhood: 'Esquilino (Near Monti)',
        coords: [41.8962, 12.5025],
        priceLevel: '€',
        signatureDish: 'Maritozzo con la Panna (€3.00)',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&auto=format&fit=crop&q=80',
        description: 'Open since 1916. The undisputed temple of Rome’s sacred breakfast pastry: sweet golden yeast brioche sliced open and filled to order with cloud-like fresh whipped cream.',
        insiderTip: 'Pair with an espresso at the marble counter before noon when they often sell out.'
      },
      {
        id: 'r-food-4',
        name: 'Mordi & Vai',
        category: 'Nonna’s Slow-Cooked Panini',
        neighborhood: 'Mercato di Testaccio (Box 15)',
        coords: [41.8745, 12.4770],
        priceLevel: '€',
        signatureDish: 'Panino con Allesso di Scottona (€5.50)',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        description: 'Run by former butcher Sergio Esposito, serving crispy crusty rolls soaked in rich cooking juices of slow-braised beef and Roman tripe.',
        insiderTip: 'Closed Sundays. Pair with an artisan craft beer from the neighboring stall in the market hall.'
      },
      {
        id: 'r-food-5',
        name: 'Forno Campo de’ Fiori',
        category: 'Century-Old Master Bakery',
        neighborhood: 'Campo de’ Fiori',
        coords: [41.8956, 12.4722],
        priceLevel: '€',
        signatureDish: 'Hot Pizza Bianca with Mortadella Bologna IGP',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        description: 'Famous for paper-thin, crispy, sea-salt-dusted Roman pizza bianca pulled bubbling and steaming hot straight out of blazing wood-fired ovens.',
        insiderTip: 'Sold by weight (a taglio). Ask for "pizza con mortadella calda" for the ultimate street lunch.'
      },
      {
        id: 'r-food-6',
        name: 'Osteria Bonelli',
        category: 'Untouched Neighborhood Osteria',
        neighborhood: 'Tor Pignattara',
        coords: [41.8785, 12.5412],
        priceLevel: '€',
        signatureDish: 'Abbacchio al Forno & Hand-Chalked Cacio e Pepe',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=80',
        description: 'Zero tourist presence. Handwritten daily specials on chalkboards brought to your table with roaring laughter and generational Roman cooking under €10.',
        insiderTip: 'Take the Termini-Centocelle vintage narrow-gauge tram for a true working-class Roman cultural immersion.'
      },
      {
        id: 'r-food-7',
        name: 'Trapizzino Trastevere',
        category: 'Modern Roman Street Food Invention',
        neighborhood: 'Trastevere',
        coords: [41.8898, 12.4702],
        priceLevel: '€',
        signatureDish: 'Trapizzino Pollo alla Cacciatora & Supplì al Telefono',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
        description: 'Crisp triangular pockets of thick sourdough pizza crust stuffed with simmering Roman classics like hunter-style chicken, oxtail ragù, and eggplant parmigiana.',
        insiderTip: 'Grab a Trapizzino and a cold Birra del Borgo to eat on the steps of Santa Maria in Trastevere.'
      }
    ],
    hiddenSpots: [
      {
        id: 'r-hidden-1',
        title: 'The Aventine Keyhole (Piazza dei Cavalieri di Malta)',
        neighborhood: 'Aventine Hill',
        coords: [41.8828, 12.4788],
        description: 'Peer through the brass keyhole of the Priory of the Knights of Malta: a perfectly framed tunnel of cypress hedges leading directly to the dome of St. Peter’s Basilica.',
        bestTime: 'Early morning or dusk',
        localTip: 'Combine with a walk through the fragrant Orange Garden (Giardino degli Aranci) next door.'
      },
      {
        id: 'r-hidden-2',
        title: 'Quartiere Coppedè',
        neighborhood: 'Trieste District',
        coords: [41.9197, 12.5022],
        description: 'A surreal architectural fantasy quarter built between 1913 and 1927, blending Art Nouveau, Gothic, Baroque, and medieval Venetian palaces with a huge outdoor chandelier.',
        bestTime: 'Afternoon quiet walk',
        localTip: 'Photograph the Frog Fountain (Fontana delle Rane) in Piazza Mincio.'
      },
      {
        id: 'r-hidden-3',
        title: 'Mercato di Testaccio',
        neighborhood: 'Testaccio',
        coords: [41.8745, 12.4770],
        description: 'Rome’s premier culinary market where multi-generational butchers, cheese mongers, and street food stalls serve trippa alla romana, supplì, and panini with zero tourist markup.',
        bestTime: '10:30 AM to 01:30 PM (Closed Sundays)',
        localTip: 'Visit Mordi & Vai (Box 15) for legendary stewed beef panino.'
      },
      {
        id: 'r-hidden-4',
        title: 'Capitoline Hill Belvedere over Roman Forum',
        neighborhood: 'Campidoglio',
        coords: [41.8929, 12.4837],
        description: 'Walk behind Michelangelo’s Piazza del Campidoglio to Via del Campidoglio for a breathless, free, unobstructed panoramic overlook of the entire Roman Forum and Palatine Hill.',
        bestTime: 'Sunset as ancient ruins are illuminated',
        localTip: 'Completely free; no tickets or lines needed.'
      }
    ],
    emergency: {
      panEuropean: '112 (Universal Emergency)',
      police: '113 (Polizia di Stato) / 112 (Carabinieri)',
      medicalAmbulance: '118 (Emergenza Sanitaria)',
      fireRescue: '115 (Vigili del Fuoco)',
      englishHospital: 'Salvator Mundi International Hospital — +39 06 588961',
      centralHospital: 'Ospedale Fatebenefratelli (Tiber Island / Isola Tiberina) — +39 06 68371',
      pharmacy247: 'Farmacia della Stazione Termini (Central Station Gallery) — Open 24/7',
      lostCreditCard: 'Blocco Carta Credito: 800 822 056 (Toll Free Italy)'
    }
  }
};
