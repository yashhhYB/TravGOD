/**
 * MyTrips.js — Unified Command Center for Escrow Bookings & AI Safety Itineraries
 * Local Guide Connect (TRAVGOD)
 * - Fixed 72px Standard App Header
 * - User Travel DNA bar (Personalized for Yash B.) with interactive edit modal
 * - Tab 1: Escrow Bookings (3) with status badges, PayPal escrow breakdowns,
 *         interactive GPS Check-In, Issue Dispute, Release Payout, and Live Chat
 * - Tab 2: AI Safety Itinerary (3 Days) with ⚠️ 300m Scam Radar proximity alerts,
 *         🎯 Qloo Taste AI™ matches, walking distance trails, interactive "Mark Visited" checkboxes,
 *         real-time completion progress tracker, and "View on Live Map" links.
 */

import { Storage } from '../utils/storage.js';
import { getAppHeaderHtml, initAppHeader } from './AppHeader.js';
import { renderOnboardingModal } from './OnboardingModal.js';
import { renderChatWindow } from './ChatWindow.js';
import { GUIDES } from '../data/guides.js';
import { getMockCity, getSampleTrip, getAuditDemo } from '../data/mockData.js';
import { auditTrip } from '../utils/safetyAudit.js';

export function renderMyTrips(container) {
  let activeTab = 'bookings'; // 'bookings' or 'itinerary'
  let activeDayFilter = 'all'; // 'all', 1, 2, 3
  let currentItineraryCity = 'rome'; // 'rome' or 'paris'

  // User State & Travel DNA (Default to Yash B. if not set)
  let user = Storage.get('travgod_user', null);
  if (!user) {
    user = {
      name: 'Yash B.',
      email: 'yash@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'traveler'
    };
    Storage.set('travgod_user', user);
  }

  const userDna = Storage.get('travgod_travel_dna', {
    interests: ['Food & Wine', 'Art & Architecture'],
    pace: 'Balanced',
    budget: 'Mid-range (€50-100/day)'
  });

  // Default Seed Bookings matching user's exact specification
  const defaultBookings = [
    {
      id: 'TG-ROM-I8IFE',
      destinationId: 'rome',
      cityName: 'Rome, Italy',
      guideId: 'g-rome-marco',
      guideName: 'Marco Rossi',
      guideAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      meetingPoint: 'Piazza Santa Maria in Trastevere Fountain',
      date: '2026-10-14',
      time: '10:00 AM',
      hours: 2,
      rate: 32,
      total: 64.00,
      paymentSource: 'PayPal Escrow Deposit',
      status: 'paid_in_escrow',
      escrowReleased: false,
      checkedIn: false,
      createdAt: '2026-10-10T09:00:00Z'
    },
    {
      id: 'TG-ROM-4RS0O',
      destinationId: 'rome',
      cityName: 'Rome, Italy',
      guideId: 'g-rome-marco',
      guideName: 'Marco Rossi',
      guideAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      meetingPoint: 'Piazza Santa Maria in Trastevere Fountain',
      date: '2026-10-14',
      time: '10:00 AM',
      hours: 2,
      rate: 32,
      total: 64.00,
      paymentSource: 'PayPal Escrow Deposit',
      status: 'paid_in_escrow',
      escrowReleased: false,
      checkedIn: false,
      createdAt: '2026-10-10T11:30:00Z'
    },
    {
      id: 'TG-ROM-P3W3K',
      destinationId: 'rome',
      cityName: 'Rome, Italy',
      guideId: 'g-paris-alexandre',
      guideName: 'Alexandre Dubois',
      guideAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      meetingPoint: 'Piazza Santa Maria in Trastevere Fountain',
      date: '2026-10-12',
      time: '10:00 AM',
      hours: 2,
      rate: 25,
      total: 50.00,
      paymentSource: 'PayPal Escrow Deposit',
      status: 'checked_in',
      escrowReleased: false,
      checkedIn: true,
      createdAt: '2026-10-09T14:15:00Z'
    }
  ];

  let bookings = Storage.get('travgod_bookings', null);
  if (!bookings || bookings.length === 0) {
    bookings = defaultBookings;
    Storage.set('travgod_bookings', bookings);
  }

  // 3-Day Rome Itinerary
  const defaultRomeItinerary = [
    {
      day: 1,
      theme: 'Ancient Core & Historic Alleys',
      stops: [
        {
          id: 'r1-s1',
          time: '09:00 AM',
          duration: '2.5 hrs',
          title: 'Colosseum & Roman Forum Archaeological Walk',
          category: 'Ancient Heritage',
          address: 'Piazza del Colosseo, 1',
          scamAlert: {
            title: 'Centurion Photo Extortion Active (within 150m)',
            desc: 'Individuals in gladiator costumes demand €20–€50 aggressively after taking photos. Firmly decline and do not hand your phone.',
            severity: 'high'
          },
          tasteMatch: '96% Taste AI match for Ancient History',
          walkToNext: '14 min walk (950m) through Via dei Fori Imperiali',
          mapCoords: [41.8902, 12.4922],
          completed: false
        },
        {
          id: 'r1-s2',
          time: '12:30 PM',
          duration: '1.5 hrs',
          title: 'Lunch at Rione Monti Authentic Trattoria',
          category: 'Local Food',
          address: 'Via Urbana, Monti',
          scamAlert: null,
          tasteMatch: '98% Taste AI match for Roman culinary authenticity (no photo menus)',
          walkToNext: '18 min walk (1.2 km) across Piazza Venezia',
          mapCoords: [41.8955, 12.4940],
          completed: false
        },
        {
          id: 'r1-s3',
          time: '03:00 PM',
          duration: '2 hrs',
          title: 'Pantheon & Hidden Jesuit Church of Sant’Ignazio',
          category: 'Architecture',
          address: 'Piazza della Rotonda',
          scamAlert: {
            title: 'Laminated "100g Price" Fish Deception in adjacent alleys',
            desc: 'Verify exact dish price before ordering whole seafood or cuts of beef.',
            severity: 'medium'
          },
          tasteMatch: '92% Taste AI match for Baroque architectural wonders',
          walkToNext: 'Rest of evening free for sunset stroll in Trastevere',
          mapCoords: [41.8986, 12.4769],
          completed: false
        }
      ]
    },
    {
      day: 2,
      theme: 'Vatican Splendors & Bohemian Trastevere',
      stops: [
        {
          id: 'r2-s1',
          time: '08:30 AM',
          duration: '3 hrs',
          title: 'Vatican Museums & St. Peter’s Basilica',
          category: 'Renaissance Art',
          address: 'Viale Vaticano, 00165 Roma',
          scamAlert: {
            title: 'Street Skip-The-Line Touts at Ottaviano Metro (within 200m)',
            desc: 'Do not purchase tickets from unauthorized street touts claiming main doors are closed. Official entrance is strictly valid.',
            severity: 'high'
          },
          tasteMatch: '95% Taste AI match for classic Italian masterworks',
          walkToNext: '22 min scenic river walk (1.5 km) along Lungotevere',
          mapCoords: [41.9065, 12.4536],
          completed: false
        },
        {
          id: 'r2-s2',
          time: '01:00 PM',
          duration: '2.5 hrs',
          title: 'Trastevere Alleys, Supplì & Historic Jewish Ghetto',
          category: 'Street Life & Food',
          address: 'Piazza Santa Maria in Trastevere',
          scamAlert: null,
          tasteMatch: '99% Taste AI match based on your preferences for local vibe and artisanal bites',
          walkToNext: 'Guided tour meeting point at Trastevere Piazza Fountain',
          mapCoords: [41.8898, 12.4702],
          completed: false
        },
        {
          id: 'r2-s3',
          time: '05:30 PM',
          duration: '2 hrs',
          title: 'Sunset Secret Tour with Verified Guide Marco Rossi',
          category: 'Local Guide Connect',
          address: 'Trastevere Piazza Fountain',
          scamAlert: null,
          tasteMatch: '100% Verified Local Guide Match',
          walkToNext: 'Celebratory Roman dinner at Da Enzo al 29',
          mapCoords: [41.8895, 12.4705],
          completed: false
        }
      ]
    },
    {
      day: 3,
      theme: 'Secret Rome & Testaccio Culinary Market',
      stops: [
        {
          id: 'r3-s1',
          time: '10:00 AM',
          duration: '1.5 hrs',
          title: 'Aventine Keyhole & Knights of Malta Priory View',
          category: 'Hidden Spot',
          address: 'Piazza dei Cavalieri di Malta, 3',
          scamAlert: null,
          tasteMatch: '94% Secret Rome Local recommendation',
          walkToNext: '12 min walk (800m) downhill to Testaccio',
          mapCoords: [41.8828, 12.4788],
          completed: false
        },
        {
          id: 'r3-s2',
          time: '12:00 PM',
          duration: '2 hrs',
          title: 'Mercato di Testaccio: Sandwiches, Cheeses & Real Carbonara',
          category: 'Culinary Market',
          address: 'Via Aldo Manuzio, 66b',
          scamAlert: null,
          tasteMatch: '99% Foodie Paradise with 0% tourist markup',
          walkToNext: '15 min bus or bike to Ancient Appian Way',
          mapCoords: [41.8745, 12.4770],
          completed: false
        },
        {
          id: 'r3-s3',
          time: '03:30 PM',
          duration: '2.5 hrs',
          title: 'Ancient Appian Way (Via Appia Antica) Cycling or Stroll',
          category: 'Ancient Outdoors',
          address: 'Via Appia Antica',
          scamAlert: null,
          tasteMatch: '91% Peaceful escape from urban bustle',
          walkToNext: 'Tour Complete — Rome 3-Day Route Concluded',
          mapCoords: [41.8540, 12.5220],
          completed: false
        }
      ]
    }
  ];

  // 3-Day Paris Itinerary (from verified mock dataset)
  const defaultParisItinerary = [
    {
      day: 1,
      theme: 'Île de la Cité & Historic Le Marais',
      stops: [
        {
          id: 'p1-s1',
          time: '10:00 AM',
          duration: '1.5 hrs',
          title: 'Arrival via RER B to Châtelet & Scenic Quays',
          category: 'Transport & Historic Center',
          address: 'Châtelet-Les Halles, 75001 Paris',
          scamAlert: {
            title: 'Turnstile Pickpockets & Metro Helpers Active',
            desc: 'Hold bags in front. Only use official RATP machines with touchscreen flag.',
            severity: 'medium'
          },
          tasteMatch: '95% Taste AI match for historic arrival',
          walkToNext: '10 min walk (700m) to Notre-Dame de Paris',
          mapCoords: [48.8606, 2.3470],
          completed: false
        },
        {
          id: 'p1-s2',
          time: '02:00 PM',
          duration: '1.5 hrs',
          title: 'Notre-Dame de Paris & Shakespeare and Company',
          category: 'Historic Landmark',
          address: '6 Parvis Notre-Dame, 75004 Paris',
          scamAlert: {
            title: 'Deaf-Mute Charity Petition Touts on Parvis',
            desc: 'Youths with clipboards distract tourists to pickpocket bags. Never sign.',
            severity: 'high'
          },
          tasteMatch: '98% Taste AI match for Gothic architectural heritage',
          walkToNext: '8 min walk (550m) across Pont Saint-Michel to Sainte-Chapelle',
          mapCoords: [48.8530, 2.3499],
          completed: false
        },
        {
          id: 'p1-s3',
          time: '03:30 PM',
          duration: '1 hr',
          title: 'Sainte-Chapelle Stained Glass Wonders',
          category: 'Royal Heritage',
          address: '10 Boulevard du Palais, 75001 Paris',
          scamAlert: null,
          tasteMatch: '96% Taste AI match for breathtaking medieval glasswork',
          walkToNext: '15 min scenic stroll into Le Marais for evening falafel and galleries',
          mapCoords: [48.8554, 2.3450],
          completed: false
        }
      ]
    },
    {
      day: 2,
      theme: 'The Louvre, Tuileries & Eiffel Tower Sunset',
      stops: [
        {
          id: 'p2-s1',
          time: '09:00 AM',
          duration: '3 hrs',
          title: 'Louvre Museum: Classical Sculptures & Masterpieces',
          category: 'World-Class Museum',
          address: 'Rue de Rivoli, 75001 Paris',
          scamAlert: {
            title: 'Pickpockets on Mona Lisa Room & Pyramid Plaza',
            desc: 'Keep backpack zipped in front. Enter via Porte des Lions to skip main pyramid queues.',
            severity: 'high'
          },
          tasteMatch: '99% Taste AI match for classic art connoisseurship',
          walkToNext: '12 min walk across Pont des Arts to Saint-Germain bistro',
          mapCoords: [48.8606, 2.3376],
          completed: false
        },
        {
          id: 'p2-s2',
          time: '01:00 PM',
          duration: '1.5 hrs',
          title: 'Authentic Neighborhood Bistro Lunch (Formule Midi)',
          category: 'Gastronomy',
          address: 'Saint-Germain-des-Prés',
          scamAlert: null,
          tasteMatch: '97% Authentic bistronomy with complimentary carafe d’eau guaranteed by law',
          walkToNext: '20 min walk through Luxembourg Gardens tree alleys',
          mapCoords: [48.8540, 2.3325],
          completed: false
        },
        {
          id: 'p2-s3',
          time: '07:30 PM',
          duration: '2 hrs',
          title: 'Eiffel Tower Sunset & Champ de Mars Illuminations',
          category: 'Iconic Monument',
          address: 'Champ de Mars, 5 Av. Anatole France',
          scamAlert: {
            title: 'Three-Card Monte & Souvenir Aggressors on Pont d’Iéna',
            desc: 'Card games are rigged. Unofficial ticket touts resell fake stairs slots.',
            severity: 'high'
          },
          tasteMatch: '100% Unforgettable Paris twilight vista',
          walkToNext: 'Tour Concluded — Relax with Seine riverside night views',
          mapCoords: [48.8584, 2.2945],
          completed: false
        }
      ]
    },
    {
      day: 3,
      theme: 'Montmartre Village & Canal Saint-Martin Quays',
      stops: [
        {
          id: 'p3-s1',
          time: '09:00 AM',
          duration: '2.5 hrs',
          title: 'Sacré-Cœur Basilica & Artists’ Quarter via Side Steps',
          category: 'Bohemian Village',
          address: '35 Rue du Chevalier de la Barre, 75018 Paris',
          scamAlert: {
            title: 'Friendship Bracelet Ambush at Main Staircase',
            desc: 'Do not let anyone touch your wrist. Take the Funicular or Rue Foyatier steps.',
            severity: 'high'
          },
          tasteMatch: '94% Panoramic Montmartre views with scam-safe route',
          walkToNext: '15 min walk down towards covered passages',
          mapCoords: [48.8867, 2.3431],
          completed: false
        },
        {
          id: 'p3-s2',
          time: '01:00 PM',
          duration: '1 hr',
          title: 'Historic Covered Arcades (Passage des Panoramas)',
          category: 'Hidden Architecture',
          address: '11 Boulevard Montmartre, 75002 Paris',
          scamAlert: null,
          tasteMatch: '93% 19th-century glass-roofed arcades with antique shops',
          walkToNext: '18 min stroll or Metro Line 5 to Canal Saint-Martin',
          mapCoords: [48.8715, 2.3418],
          completed: false
        },
        {
          id: 'p3-s3',
          time: '05:00 PM',
          duration: '2 hrs',
          title: 'Canal Saint-Martin Sunset Walk & Local Picnic',
          category: 'Waterside Quays',
          address: 'Quai de Valmy, 75010 Paris',
          scamAlert: null,
          tasteMatch: '98% Hip Parisian picnic scene with iron footbridges',
          walkToNext: 'Itinerary Complete — Paris 3-Day Route Concluded',
          mapCoords: [48.8710, 2.3638],
          completed: false
        }
      ]
    }
  ];

  function getItineraryDays() {
    if (currentItineraryCity === 'paris') {
      return Storage.get('travgod_paris_itinerary', defaultParisItinerary);
    }
    return Storage.get('travgod_rome_itinerary', defaultRomeItinerary);
  }

  function setItineraryDays(newDays) {
    if (currentItineraryCity === 'paris') {
      Storage.set('travgod_paris_itinerary', newDays);
    } else {
      Storage.set('travgod_rome_itinerary', newDays);
    }
  }

  function getCompletedCount() {
    const days = getItineraryDays();
    let count = 0;
    let total = 0;
    days.forEach(d => {
      d.stops.forEach(s => {
        total++;
        if (s.completed) count++;
      });
    });
    return { count, total, percent: total > 0 ? Math.round((count / total) * 100) : 0 };
  }

  function renderSafetyAuditModal() {
    const modalCont = container.querySelector('#trips-modal-container');
    if (!modalCont) return;

    let auditDemoMode = 'sample'; // 'sample' or 'flawed'

    function drawAuditModal() {
      const mockCity = getMockCity(currentItineraryCity);
      const auditDemo = getAuditDemo(currentItineraryCity);
      const isFlawed = auditDemoMode === 'flawed';

      const tripToAudit = (isFlawed && auditDemo)
        ? { days: [{ day: 1, weekday: auditDemo.draft_weekday, stops: auditDemo.draft }] }
        : (getSampleTrip(currentItineraryCity) || { days: [] });

      const auditResult = auditTrip(tripToAudit, mockCity);

      modalCont.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(15,23,42,0.65); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1.5rem;">
          <div style="background: white; border-radius: 24px; padding: 2rem; max-width: 580px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            
            <!-- Modal Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.35rem;">
                  🔬
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 1.25rem; font-weight: 900; color: #0f172a;">
                    Deterministic Safety Audit
                  </h3>
                  <div style="font-size: 0.78rem; color: #64748b;">
                    ${currentItineraryCity === 'paris' ? '🇫🇷 Paris, France' : '🇮🇹 Rome, Italy'} • Rules-based verification engine
                  </div>
                </div>
              </div>
              <button id="btn-close-audit-modal" style="background: none; border: none; color: #64748b; font-size: 1.25rem; cursor: pointer; padding: 4px;">✕</button>
            </div>

            <!-- Mode Selector -->
            <div style="display: flex; gap: 0.4rem; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 1.25rem;">
              <button id="btn-modal-audit-safe" style="flex: 1; padding: 6px 10px; border-radius: 8px; border: none; font-size: 0.78rem; font-weight: 800; cursor: pointer; transition: all 0.2s; background: ${!isFlawed ? '#0284c7' : 'transparent'}; color: ${!isFlawed ? '#ffffff' : '#64748b'};">
                ✓ Verified Itinerary (Grade A)
              </button>
              <button id="btn-modal-audit-flawed" style="flex: 1; padding: 6px 10px; border-radius: 8px; border: none; font-size: 0.78rem; font-weight: 800; cursor: pointer; transition: all 0.2s; background: ${isFlawed ? '#dc2626' : 'transparent'}; color: ${isFlawed ? '#ffffff' : '#64748b'};">
                ⚠️ Test Flawed Draft (4 Violations)
              </button>
            </div>

            <!-- Verdict Card -->
            <div style="background: ${isFlawed ? '#fff1f2' : '#f0fdf4'}; border: 1px solid ${isFlawed ? '#fecdd3' : '#bbf7d0'}; border-radius: 16px; padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                <div>
                  <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: ${isFlawed ? '#991b1b' : '#166534'};">
                    Audit Status
                  </span>
                  <h4 style="margin: 2px 0 0 0; font-size: 1.35rem; font-weight: 900; color: ${isFlawed ? '#b91c1c' : '#15803d'};">
                    ${auditResult.gradeLabel}
                  </h4>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 1.5rem; font-weight: 900; color: ${isFlawed ? '#b91c1c' : '#15803d'};">
                    ${auditResult.meanRisk} <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">/ 100</span>
                  </div>
                  <span style="font-size: 0.7rem; font-weight: 700; color: #64748b;">Mean Risk Index</span>
                </div>
              </div>

              <!-- 5 Risk Pillars Progress Bars -->
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; background: white; padding: 0.75rem; border-radius: 12px; font-size: 0.72rem; border: 1px solid rgba(0,0,0,0.04);">
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: #475569;">🛡️ Scam Density</span>
                    <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '24/35' : '8/35'}</span>
                  </div>
                  <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                    <div style="width: ${isFlawed ? '68%' : '23%'}; height: 100%; background: ${isFlawed ? '#e11d48' : '#0284c7'};"></div>
                  </div>
                </div>
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: #475569;">🌙 Night Caution</span>
                    <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '15/20' : '0/20'}</span>
                  </div>
                  <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                    <div style="width: ${isFlawed ? '75%' : '0%'}; height: 100%; background: ${isFlawed ? '#e11d48' : '#10b981'};"></div>
                  </div>
                </div>
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: #475569;">👥 Crowd Pressure</span>
                    <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '15/15' : '8/15'}</span>
                  </div>
                  <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                    <div style="width: ${isFlawed ? '100%' : '53%'}; height: 100%; background: #f59e0b;"></div>
                  </div>
                </div>
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: #475569;">⏱️ Logistics Friction</span>
                    <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '15/15 (Critical)' : '3/15'}</span>
                  </div>
                  <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                    <div style="width: ${isFlawed ? '100%' : '20%'}; height: 100%; background: ${isFlawed ? '#dc2626' : '#10b981'};"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Findings Feed -->
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 0.9rem; font-weight: 800; color: #0f172a; margin: 0 0 0.75rem 0;">
                Engine Findings (${auditResult.allFindings.length})
              </h4>
              <div style="display: flex; flex-direction: column; gap: 0.65rem; max-height: 240px; overflow-y: auto;">
                ${auditResult.allFindings.map(f => {
                  const isBlocking = f.severity === 'blocking';
                  const isWarn = f.severity === 'warn';
                  const bg = isBlocking ? '#fef2f2' : isWarn ? '#fffbeb' : '#f0fdf4';
                  const border = isBlocking ? '#fecaca' : isWarn ? '#fef08a' : '#dcfce7';
                  const textColor = isBlocking ? '#991b1b' : isWarn ? '#92400e' : '#166534';
                  const badgeBg = isBlocking ? '#dc2626' : isWarn ? '#d97706' : '#16a34a';

                  return `
                    <div style="background: ${bg}; border: 1px solid ${border}; border-radius: 12px; padding: 0.75rem 0.85rem;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.65rem; font-weight: 900; background: ${badgeBg}; color: white; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">
                          ${f.severity} • ${f.code}
                        </span>
                        <span style="font-size: 0.68rem; color: #64748b; font-weight: 700;">@ ${f.stop || 'Itinerary'}</span>
                      </div>
                      <p style="margin: 0; font-size: 0.78rem; color: ${textColor}; line-height: 1.4;">
                        ${f.msg}
                      </p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <button id="btn-close-audit-modal-action" style="width: 100%; padding: 0.85rem; background: #0f172a; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer;">
              Done
            </button>
          </div>
        </div>
      `;

      modalCont.querySelector('#btn-close-audit-modal').onclick = () => { modalCont.innerHTML = ''; };
      modalCont.querySelector('#btn-close-audit-modal-action').onclick = () => { modalCont.innerHTML = ''; };

      const bSafe = modalCont.querySelector('#btn-modal-audit-safe');
      const bFlawed = modalCont.querySelector('#btn-modal-audit-flawed');
      if (bSafe) {
        bSafe.onclick = () => {
          auditDemoMode = 'sample';
          drawAuditModal();
        };
      }
      if (bFlawed) {
        bFlawed.onclick = () => {
          auditDemoMode = 'flawed';
          drawAuditModal();
        };
      }
    }

    drawAuditModal();
  }

  function render() {
    const progress = getCompletedCount();

    container.innerHTML = `
      <div id="trips-page" style="min-height: 100vh; background: #f8fafc; color: var(--text-primary, #0f172a); font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Fixed Standard Header -->
        ${getAppHeaderHtml({ activeNav: 'trips', isSolid: true })}

        <!-- Main Wrapper with 72px top offset -->
        <div style="padding-top: 72px;">
          
          <!-- Traveler DNA Bar -->
          <div style="background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%); color: white; padding: 0.75rem 1.5rem; box-shadow: 0 2px 8px rgba(2,132,199,0.2);">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; font-weight: 700;">
                <span style="font-size: 1.1rem;">✨</span>
                <span>Personalized for <strong>${user ? user.name : 'Yash B.'}</strong> • Travel DNA:</span>
                <span style="background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem;">
                  ${(userDna.interests || ['Food & Wine', 'Art & Architecture']).join(', ')} (${userDna.pace || 'Balanced'})
                </span>
              </div>
              <button id="btn-edit-dna" style="background: rgba(255,255,255,0.9); border: none; color: #0369a1; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 0.78rem; cursor: pointer; transition: all 0.2s;">
                Edit Travel DNA ➔
              </button>
            </div>
          </div>

          <!-- Page Body -->
          <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem;">
            
            <!-- Page Title & Tabs Switcher -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span style="font-size: 0.82rem; font-weight: 800; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.05em;">
                  Rome Travel Command Center
                </span>
                <h1 style="font-size: 2.3rem; font-weight: 900; letter-spacing: -0.75px; margin: 0.25rem 0 0 0; color: #0f172a;">
                  My Trips & Escrow Protections
                </h1>
              </div>

              <!-- Main Navigation Tabs -->
              <div style="display: flex; background: #e2e8f0; padding: 4px; border-radius: 14px; gap: 4px;">
                <button id="tab-btn-bookings" style="padding: 0.65rem 1.35rem; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; transition: all 0.2s; background: ${activeTab === 'bookings' ? '#ffffff' : 'transparent'}; color: ${activeTab === 'bookings' ? '#0ea5e9' : '#64748b'}; box-shadow: ${activeTab === 'bookings' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'};">
                  <svg width="16" height="16" data-lucide="shield-check"></svg>
                  Escrow Bookings (${bookings.length})
                </button>
                <button id="tab-btn-itinerary" style="padding: 0.65rem 1.35rem; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; transition: all 0.2s; background: ${activeTab === 'itinerary' ? '#ffffff' : 'transparent'}; color: ${activeTab === 'itinerary' ? '#0ea5e9' : '#64748b'}; box-shadow: ${activeTab === 'itinerary' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'};">
                  <svg width="16" height="16" data-lucide="map"></svg>
                  AI Safety Itinerary (3 Days)
                </button>
              </div>
            </div>

            <!-- Tab Content View -->
            ${activeTab === 'bookings' ? renderBookingsTab() : renderItineraryTab(progress)}

          </main>
        </div>

        <!-- Float Modals Container -->
        <div id="trips-modal-container"></div>
      </div>
    `;

    initAppHeader(container);
    attachHandlers();
  }

  // ── Tab 1: Escrow Bookings ─────────────────────────────────────────────────
  function renderBookingsTab() {
    return `
      <div>
        
        <!-- PayPal Escrow Protection Guarantee Banner -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 50px; height: 50px; border-radius: 14px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="26" height="26" data-lucide="lock"></svg>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: #0f172a;">PayPal Escrow Protection Guarantee</h3>
                <span style="font-size: 0.7rem; font-weight: 800; background: #dcfce7; color: #16a34a; padding: 2px 8px; border-radius: 999px;">100% Insured</span>
              </div>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.88rem; line-height: 1.4;">
                Funds are held in neutral escrow. Payouts are transferred to guides <strong>only after</strong> your in-person check-in on tour day.
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button id="btn-seed-sample-tour" style="padding: 0.65rem 1.25rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 800; font-size: 0.85rem; color: #0f172a; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;">
              <svg width="15" height="15" data-lucide="plus-circle" style="color: #0ea5e9;"></svg> + Add Sample Rome Tour
            </button>
          </div>
        </div>

        <!-- Bookings List -->
        ${bookings.length === 0 ? `
          <div style="text-align: center; padding: 4.5rem 2rem; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; color: #94a3b8;">
              <svg width="32" height="32" data-lucide="briefcase"></svg>
            </div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.35rem; font-weight: 800; color: #0f172a;">No Active Escrow Bookings Yet</h3>
            <p style="color: #64748b; font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem;">
              Connect with verified local guides to unlock authentic spots, avoid scams, and keep your payment 100% protected in PayPal escrow.
            </p>
            <div style="display: flex; justify-content: center; gap: 0.75rem;">
              <a href="#/explore" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 0.92rem;">
                Browse Local Guides ➔
              </a>
              <button id="btn-quick-sample" style="padding: 0.75rem 1.5rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; font-size: 0.92rem; color: #0f172a; cursor: pointer;">
                Load Demo Booking
              </button>
            </div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${bookings.map(b => renderBookingCard(b)).join('')}
          </div>
        `}

      </div>
    `;
  }

  function renderBookingCard(b) {
    const isPaidInEscrow = b.status === 'paid_in_escrow' || b.status === 'confirmed';
    const isCheckedIn = b.status === 'checked_in';
    const isReleased = b.status === 'released';

    let statusBadge = '';
    if (isPaidInEscrow) {
      statusBadge = `<span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #0284c7; display: inline-block;"></span> Paid (Held in Escrow)</span>`;
    } else if (isCheckedIn) {
      statusBadge = `<span style="background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #9333ea; display: inline-block;"></span> Checked In (In-Person Verified)</span>`;
    } else if (isReleased) {
      statusBadge = `<span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a; display: inline-block;"></span> Payout Released to Guide</span>`;
    }

    const guideCut = (b.total * 0.88).toFixed(2);
    const platformCut = (b.total * 0.12).toFixed(2);

    return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 1.75rem; box-shadow: 0 4px 16px rgba(0,0,0,0.02); transition: all 0.2s;">
        
        <!-- Header row -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <img src="${b.guideAvatar}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid #0ea5e9; box-shadow: 0 4px 12px rgba(14,165,233,0.25);" />
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 900; color: #0f172a;">Tour with ${b.guideName}</h3>
                ${statusBadge}
              </div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 3px;">
                ${b.cityName || 'Rome, Italy'} &nbsp;•&nbsp; Booking Ref: <strong style="font-family: monospace; color: #0f172a; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${b.id}</strong>
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #0284c7;">€${(b.total).toFixed(2)}</div>
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700;">${b.paymentSource || 'PayPal Escrow Deposit'}</div>
          </div>
        </div>

        <!-- Details Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; background: #f8fafc; border-radius: 16px; padding: 1.25rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Tour Date & Time</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 2px;">
              ${b.date} @ ${b.time}
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">${b.hours} Hours Private Tour</div>
          </div>

          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Meeting Location</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 2px;">
              ${b.meetingPoint}
            </div>
            <div style="font-size: 0.78rem; color: #16a34a; font-weight: 800; display: flex; align-items: center; gap: 0.25rem;">
              <svg width="12" height="12" data-lucide="check-circle"></svg> GPS Location Confirmed
            </div>
          </div>

          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Escrow Breakdown</div>
            <div style="font-size: 0.85rem; color: #334155; margin-top: 2px;">
              Guide Payout: <strong>€${guideCut}</strong> (88%)
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Platform Escrow Fee: €${platformCut} (12%)
            </div>
          </div>
        </div>

        <!-- Actions Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          
          <div style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 0.4rem;">
            ${isPaidInEscrow ? `
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #0284c7;"></span>
              Step 1 of 2: Meet guide in Rome, then click <strong>Check In</strong>.
            ` : isCheckedIn ? `
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #7e22ce;"></span>
              Step 2 of 2: Tour in progress. Click <strong>Release Payout</strong> when tour concludes.
            ` : `
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #16a34a;"></span>
              Escrow completed. Payout sent to guide. Thank you!
            `}
          </div>

          <!-- Buttons -->
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            
            ${isPaidInEscrow ? `
              <button class="btn-checkin-booking" data-id="${b.id}" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #7e22ce, #6b21a8); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(126,34,206,0.3);">
                <svg width="16" height="16" data-lucide="map-pin"></svg> Check In with Guide
              </button>
              <button class="btn-hold-escrow" data-id="${b.id}" style="padding: 0.75rem 1rem; background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; border-radius: 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                Hold Escrow / Report Issue
              </button>
            ` : isCheckedIn ? `
              <button class="btn-release-escrow" data-id="${b.id}" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #16a34a, #15803d); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(22,163,74,0.3);">
                <svg width="16" height="16" data-lucide="check-check"></svg> Release Escrow Payout (€${guideCut})
              </button>
              <button class="btn-chat-guide" data-guide-id="${b.guideId}" data-name="${b.guideName}" style="padding: 0.75rem 1.25rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; font-size: 0.85rem; color: #0f172a; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                <svg width="15" height="15" data-lucide="message-circle"></svg> Chat with Guide
              </button>
            ` : `
              <button class="btn-chat-guide" data-guide-id="${b.guideId}" data-name="${b.guideName}" style="padding: 0.75rem 1.25rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; font-size: 0.85rem; color: #0f172a; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                <svg width="15" height="15" data-lucide="message-circle"></svg> Chat with Guide
              </button>
              <button class="btn-review-guide" data-id="${b.id}" style="padding: 0.75rem 1.25rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; font-weight: 800; font-size: 0.85rem; color: #0284c7; cursor: pointer;">
                ★ Leave Verified Review
              </button>
            `}

          </div>

        </div>

      </div>
    `;
  }

  function renderItineraryTab(progress) {
    const itineraryDays = getItineraryDays();
    const isParis = currentItineraryCity === 'paris';
    const displayedDays = activeDayFilter === 'all' 
      ? itineraryDays 
      : itineraryDays.filter(d => d.day === activeDayFilter);

    return `
      <div>
        
        <!-- Controls & Legend Bar -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <h3 style="margin: 0; font-size: 1.2rem; font-weight: 900; color: #0f172a;">
                  ${isParis ? 'Paris 🇫🇷' : 'Rome 🇮🇹'} 3-Day Curated Safety Itinerary
                </h3>
                <span style="font-size: 0.72rem; font-weight: 800; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 999px;">
                  300m Fraud Radar Active
                </span>
                
                <!-- City Switcher Pills -->
                <div style="display: flex; gap: 4px; background: #f1f5f9; padding: 2px 4px; border-radius: 999px; border: 1px solid #cbd5e1;">
                  <button id="btn-itin-city-rome" style="padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; border: none; cursor: pointer; background: ${!isParis ? '#0ea5e9' : 'transparent'}; color: ${!isParis ? '#ffffff' : '#64748b'};">
                    🇮🇹 Rome
                  </button>
                  <button id="btn-itin-city-paris" style="padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; border: none; cursor: pointer; background: ${isParis ? '#0ea5e9' : 'transparent'}; color: ${isParis ? '#ffffff' : '#64748b'};">
                    🇫🇷 Paris
                  </button>
                </div>
              </div>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.85rem;">
                Generated with verified walking times, Qloo taste matching, and real-time 300m scam radar proximity alerts.
              </p>
            </div>

            <!-- Action & Legend Pills -->
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <button id="btn-open-safety-audit-modal" style="padding: 6px 14px; background: linear-gradient(135deg, #0ea5e9, #0284c7); border: none; border-radius: 999px; font-size: 0.78rem; font-weight: 800; color: white; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(14,165,233,0.3); transition: transform 0.15s;">
                <svg width="14" height="14" data-lucide="shield-check"></svg>
                🛡️ Run Safety Audit
              </button>
              <span style="font-size: 0.75rem; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 999px;">
                ⚠️ Scam Radar (300m)
              </span>
              <span style="font-size: 0.75rem; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px;">
                🎯 Qloo Taste AI™ Match
              </span>
              <button id="btn-reset-itinerary" style="padding: 5px 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.78rem; font-weight: 800; color: #475569; cursor: pointer;">
                Reset Stops
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="background: #f1f5f9; border-radius: 12px; padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #0f172a; white-space: nowrap;">
              Progress: ${progress.count} of ${progress.total} Stops Visited (${progress.percent}%)
            </div>
            <div style="flex: 1; height: 10px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
              <div style="width: ${progress.percent}%; height: 100%; background: linear-gradient(90deg, #0ea5e9, #10b981); transition: width 0.3s ease;"></div>
            </div>
          </div>

          <!-- Day Filter Buttons -->
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
            ${[
              { id: 'all', label: 'All 3 Days (9 Stops)' },
              { id: 1, label: 'Day 1: Ancient Core' },
              { id: 2, label: 'Day 2: Vatican & Trastevere' },
              { id: 3, label: 'Day 3: Secret Rome & Testaccio' }
            ].map(f => `
              <button class="day-filter-btn ${activeDayFilter === f.id ? 'active' : ''}" data-day="${f.id}" style="padding: 5px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; border: 1px solid ${activeDayFilter === f.id ? '#0ea5e9' : '#cbd5e1'}; background: ${activeDayFilter === f.id ? '#0ea5e9' : '#ffffff'}; color: ${activeDayFilter === f.id ? '#ffffff' : '#475569'}; cursor: pointer;">
                ${f.label}
              </button>
            `).join('')}
          </div>

        </div>

        <!-- Days Column -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          ${displayedDays.map(dayObj => `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
              
              <!-- Day Header -->
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 6px 14px; border-radius: 12px; font-weight: 900; font-size: 0.95rem;">
                    DAY ${dayObj.day}
                  </span>
                  <h2 style="margin: 0; font-size: 1.35rem; font-weight: 900; color: #0f172a;">
                    ${dayObj.theme}
                  </h2>
                </div>
                <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
                  ${dayObj.stops.length} Curated Stops
                </span>
              </div>

              <!-- Stops Timeline -->
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                ${dayObj.stops.map((stop, idx) => `
                  <div style="position: relative; padding-left: 2.25rem; border-left: 2px dashed #cbd5e1; margin-left: 0.75rem;">
                    
                    <!-- Bullet dot -->
                    <div style="position: absolute; left: -11px; top: 0; width: 20px; height: 20px; border-radius: 50%; background: ${stop.completed ? '#16a34a' : '#0ea5e9'}; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.15);"></div>

                    <!-- Stop Card -->
                    <div style="background: ${stop.completed ? '#f0fdf4' : '#f8fafc'}; border: 1px solid ${stop.completed ? '#bbf7d0' : '#e2e8f0'}; border-radius: 18px; padding: 1.25rem; transition: all 0.2s;">
                      
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="font-size: 0.8rem; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 6px;">
                              ${stop.time} (${stop.duration})
                            </span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #64748b;">
                              ${stop.category}
                            </span>
                          </div>
                          <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: ${stop.completed ? '#166534' : '#0f172a'}; text-decoration: ${stop.completed ? 'line-through' : 'none'};">
                            ${stop.title}
                          </h4>
                          <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
                            📍 ${stop.address}
                          </div>
                        </div>

                        <button class="btn-toggle-stop" data-day="${dayObj.day}" data-id="${stop.id}" style="padding: 5px 12px; border-radius: 8px; border: 1px solid ${stop.completed ? '#16a34a' : '#cbd5e1'}; background: ${stop.completed ? '#dcfce7' : '#ffffff'}; color: ${stop.completed ? '#16a34a' : '#475569'}; font-size: 0.78rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
                          ${stop.completed ? '✓ Visited' : 'Mark Visited'}
                        </button>
                      </div>

                      <!-- 300m Scam Proximity Alert (if active) -->
                      ${stop.scamAlert ? `
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 0.75rem 1rem; margin: 0.75rem 0;">
                          <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                            <span style="font-size: 1.1rem; line-height: 1;">⚠️</span>
                            <div>
                              <div style="font-size: 0.84rem; font-weight: 800; color: #991b1b;">
                                ${stop.scamAlert.title}
                              </div>
                              <div style="font-size: 0.78rem; color: #7f1d1d; margin-top: 2px; line-height: 1.4;">
                                ${stop.scamAlert.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      ` : ''}

                      <!-- Taste AI Match Badge -->
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="font-size: 0.78rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 3px 10px; border-radius: 999px;">
                          🎯 ${stop.tasteMatch}
                        </span>
                        
                        <div style="display: flex; gap: 0.5rem;">
                          <a href="#/explore" class="btn-view-map-stop" data-coords="${stop.mapCoords.join(',')}" style="font-size: 0.78rem; font-weight: 800; color: #0ea5e9; text-decoration: none; padding: 4px 10px; border-radius: 6px; background: white; border: 1px solid #cbd5e1; display: flex; align-items: center; gap: 0.3rem;">
                            <svg width="12" height="12" data-lucide="map-pin"></svg> View on Live Map ➔
                          </a>
                        </div>
                      </div>

                    </div>

                    <!-- Walking transit indicator to next stop -->
                    ${idx < dayObj.stops.length - 1 ? `
                      <div style="padding: 0.5rem 0 0.5rem 0.5rem; font-size: 0.78rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 0.4rem;">
                        <svg width="14" height="14" data-lucide="footprints" style="color: #0ea5e9;"></svg>
                        <span>${stop.walkToNext}</span>
                      </div>
                    ` : ''}

                  </div>
                `).join('')}
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // ── Event Handlers ────────────────────────────────────────────────────────
  function attachHandlers() {
    // 1. Tab switching
    const tabBookingsBtn = container.querySelector('#tab-btn-bookings');
    const tabItineraryBtn = container.querySelector('#tab-btn-itinerary');

    if (tabBookingsBtn && tabItineraryBtn) {
      tabBookingsBtn.addEventListener('click', () => {
        activeTab = 'bookings';
        render();
      });
      tabItineraryBtn.addEventListener('click', () => {
        activeTab = 'itinerary';
        render();
      });
    }

    // 2. Edit Travel DNA
    const editDnaBtn = container.querySelector('#btn-edit-dna');
    if (editDnaBtn) {
      editDnaBtn.addEventListener('click', () => {
        let modalContainer = document.getElementById('trips-modal-container');
        if (!modalContainer) {
          modalContainer = document.createElement('div');
          modalContainer.id = 'trips-modal-container';
          document.body.appendChild(modalContainer);
        }
        renderOnboardingModal(modalContainer, {
          onComplete: () => {
            render();
          }
        });
      });
    }

    // 3. Seed demo booking
    const seedBtn = container.querySelector('#btn-seed-sample-tour');
    const quickSampleBtn = container.querySelector('#btn-quick-sample');
    const handleSeed = () => {
      const demoId = `TG-ROM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const sample = {
        id: demoId,
        destinationId: 'rome',
        cityName: 'Rome, Italy',
        guideId: 'g-rome-marco',
        guideName: 'Marco Rossi',
        guideAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        meetingPoint: 'Piazza Santa Maria in Trastevere Fountain',
        date: '2026-10-15',
        time: '10:00 AM',
        hours: 2,
        rate: 32,
        total: 64.00,
        paymentSource: 'PayPal Escrow Deposit',
        status: 'paid_in_escrow',
        escrowReleased: false,
        checkedIn: false,
        createdAt: new Date().toISOString()
      };
      bookings.unshift(sample);
      Storage.set('travgod_bookings', bookings);
      render();
    };

    if (seedBtn) seedBtn.addEventListener('click', handleSeed);
    if (quickSampleBtn) quickSampleBtn.addEventListener('click', handleSeed);

    // 4. In-person Check-in Action with Modal Simulation
    container.querySelectorAll('.btn-checkin-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const b = bookings.find(item => item.id === id);
        if (b) {
          const modalCont = container.querySelector('#trips-modal-container');
          if (modalCont) {
            modalCont.innerHTML = `
              <div style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1.5rem;">
                <div style="background: white; border-radius: 24px; padding: 2rem; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                  <div style="width: 60px; height: 60px; border-radius: 50%; background: #f3e8ff; color: #7e22ce; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.5rem;">
                    📍
                  </div>
                  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 900; color: #0f172a;">Verify In-Person Check-In</h3>
                  <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0 0 1.25rem 0;">
                    GPS Location: <strong>${b.meetingPoint}</strong>.<br/>
                    Please confirm you are physically meeting with <strong>${b.guideName}</strong>. Payout remains locked in escrow until tour completion.
                  </p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: #16a34a; font-weight: 700;">
                    ✓ GPS Match: Within 15 meters of Trastevere meeting point
                  </div>
                  <div style="display: flex; gap: 0.75rem;">
                    <button id="btn-cancel-checkin" style="flex: 1; padding: 0.75rem; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; cursor: pointer;">Cancel</button>
                    <button id="btn-confirm-checkin" style="flex: 1; padding: 0.75rem; background: linear-gradient(135deg, #7e22ce, #6b21a8); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">Confirm Check-In</button>
                  </div>
                </div>
              </div>
            `;

            modalCont.querySelector('#btn-cancel-checkin').onclick = () => {
              modalCont.innerHTML = '';
            };
            modalCont.querySelector('#btn-confirm-checkin').onclick = () => {
              b.status = 'checked_in';
              b.checkedIn = true;
              b.checkedInAt = new Date().toISOString();
              Storage.set('travgod_bookings', bookings);
              modalCont.innerHTML = '';
              render();
            };
          }
        }
      });
    });

    // 5. Release Escrow Payout
    container.querySelectorAll('.btn-release-escrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const b = bookings.find(item => item.id === id);
        if (b) {
          const guideCut = (b.total * 0.88).toFixed(2);
          const modalCont = container.querySelector('#trips-modal-container');
          if (modalCont) {
            modalCont.innerHTML = `
              <div style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1.5rem;">
                <div style="background: white; border-radius: 24px; padding: 2rem; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                  <div style="width: 60px; height: 60px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.5rem;">
                    💸
                  </div>
                  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 900; color: #0f172a;">Release PayPal Escrow Payout</h3>
                  <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0 0 1.25rem 0;">
                    Release <strong>€${guideCut}</strong> directly to <strong>${b.guideName}</strong> via PayPal Sandbox Payouts.
                  </p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.85rem; margin-bottom: 1.5rem; font-size: 0.82rem; text-align: left;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Guide Payout:</span><strong>€${guideCut}</strong></div>
                    <div style="display: flex; justify-content: space-between; color: #64748b;"><span>Platform Fee (12%):</span><span>€${(b.total * 0.12).toFixed(2)}</span></div>
                  </div>
                  <div style="display: flex; gap: 0.75rem;">
                    <button id="btn-cancel-release" style="flex: 1; padding: 0.75rem; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; cursor: pointer;">Cancel</button>
                    <button id="btn-confirm-release" style="flex: 1; padding: 0.75rem; background: linear-gradient(135deg, #16a34a, #15803d); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">Release €${guideCut}</button>
                  </div>
                </div>
              </div>
            `;

            modalCont.querySelector('#btn-cancel-release').onclick = () => {
              modalCont.innerHTML = '';
            };
            modalCont.querySelector('#btn-confirm-release').onclick = () => {
              b.status = 'released';
              b.escrowReleased = true;
              b.releasedAt = new Date().toISOString();
              Storage.set('travgod_bookings', bookings);
              modalCont.innerHTML = '';
              render();
            };
          }
        }
      });
    });

    // 6. Hold Escrow / Report Issue Modal
    container.querySelectorAll('.btn-hold-escrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const b = bookings.find(item => item.id === id);
        const modalCont = container.querySelector('#trips-modal-container');
        if (modalCont && b) {
          modalCont.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1.5rem;">
              <div style="background: white; border-radius: 24px; padding: 2rem; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.5rem;">
                  🛡️
                </div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 900; color: #0f172a;">Hold Escrow & Freeze Funds</h3>
                <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0 0 1.25rem 0;">
                  If your guide was late, no-show, or you experienced an issue, freeze the funds. Payout will not be disbursed.
                </p>
                <select id="select-issue-reason" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; margin-bottom: 1.25rem; outline: none;">
                  <option value="late">Guide delayed over 20 minutes</option>
                  <option value="noshow">Guide did not arrive at meeting point</option>
                  <option value="location">Guide changed location without agreement</option>
                  <option value="safety">Safety concern or unexpected cost</option>
                </select>
                <div style="display: flex; gap: 0.75rem;">
                  <button id="btn-cancel-issue" style="flex: 1; padding: 0.75rem; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; cursor: pointer;">Go Back</button>
                  <button id="btn-confirm-issue" style="flex: 1; padding: 0.75rem; background: #dc2626; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">Freeze Escrow</button>
                </div>
              </div>
            </div>
          `;

          modalCont.querySelector('#btn-cancel-issue').onclick = () => {
            modalCont.innerHTML = '';
          };
          modalCont.querySelector('#btn-confirm-issue').onclick = () => {
            alert(`🛡️ Escrow Dispute Logged.\nTicket ID: DISPUTE-${Math.random().toString(36).substring(2, 6).toUpperCase()}\nFunds frozen in neutral PayPal escrow. Our Trust & Safety team will review within 2 hours.`);
            modalCont.innerHTML = '';
          };
        }
      });
    });

    // 7. Chat with Guide
    container.querySelectorAll('.btn-chat-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        const guideId = btn.dataset.guideId;
        const guideName = btn.dataset.name;
        const guide = GUIDES.find(g => g.id === guideId) || GUIDES.find(g => g.name === guideName) || GUIDES[0];
        const modalCont = container.querySelector('#trips-modal-container');
        if (modalCont && guide) {
          renderChatWindow(modalCont, guide, () => {
            modalCont.innerHTML = '';
          });
        }
      });
    });

    // 8. Review guide
    container.querySelectorAll('.btn-review-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Thank you! Your verified 5-star review has been credited to the guide’s profile on Local Guide Connect.');
      });
    });

    // 9. Itinerary City Switcher
    const btnItinRome = container.querySelector('#btn-itin-city-rome');
    const btnItinParis = container.querySelector('#btn-itin-city-paris');
    if (btnItinRome) {
      btnItinRome.addEventListener('click', () => {
        if (currentItineraryCity !== 'rome') {
          currentItineraryCity = 'rome';
          activeDayFilter = 'all';
          render();
        }
      });
    }
    if (btnItinParis) {
      btnItinParis.addEventListener('click', () => {
        if (currentItineraryCity !== 'paris') {
          currentItineraryCity = 'paris';
          activeDayFilter = 'all';
          render();
        }
      });
    }

    // 10. Open Safety Audit Modal
    const btnOpenAudit = container.querySelector('#btn-open-safety-audit-modal');
    if (btnOpenAudit) {
      btnOpenAudit.addEventListener('click', () => {
        renderSafetyAuditModal();
      });
    }

    // 11. Day filters in Itinerary
    container.querySelectorAll('.day-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.day;
        activeDayFilter = (val === 'all') ? 'all' : parseInt(val, 10);
        render();
      });
    });

    // 12. Toggle stop visited
    container.querySelectorAll('.btn-toggle-stop').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayNum = parseInt(btn.dataset.day, 10);
        const stopId = btn.dataset.id;
        const currentDays = getItineraryDays();
        const dayObj = currentDays.find(d => d.day === dayNum);
        if (dayObj) {
          const stop = dayObj.stops.find(s => s.id === stopId);
          if (stop) {
            stop.completed = !stop.completed;
            setItineraryDays(currentDays);
            render();
          }
        }
      });
    });

    // 13. Reset itinerary
    const resetBtn = container.querySelector('#btn-reset-itinerary');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const currentDays = getItineraryDays();
        currentDays.forEach(d => d.stops.forEach(s => s.completed = false));
        setItineraryDays(currentDays);
        render();
      });
    }
  }

  // Initial draw
  render();
}
