// src/data/mockData.js — Central loader and normalizer for Paris & Rome mock data
import parisRaw from '../../mock/paris.json';
import romeRaw from '../../mock/rome.json';

export const PARIS_DATA = parisRaw;
export const ROME_DATA = romeRaw;

export function getMockCity(cityId = 'paris') {
  const id = String(cityId).toLowerCase();
  if (id.includes('rome') || id === 'it') return ROME_DATA;
  return PARIS_DATA;
}

export function getSafetyZones(cityId) {
  return getMockCity(cityId).safety_zones || [];
}

export function getPlaces(cityId) {
  return getMockCity(cityId).places || [];
}

export function getFood(cityId) {
  return getMockCity(cityId).food || [];
}

export function getHiddenSpots(cityId) {
  return getMockCity(cityId).hidden_spots || [];
}

export function getScams(cityId) {
  return getMockCity(cityId).scams || [];
}

export function getRules(cityId) {
  return getMockCity(cityId).rules || [];
}

export function getFairPrices(cityId) {
  return getMockCity(cityId).fair_prices || [];
}

export function getPhrases(cityId) {
  return getMockCity(cityId).phrases || [];
}

export function getTransport(cityId) {
  return getMockCity(cityId).transport || [];
}

export function getExperiences(cityId) {
  return getMockCity(cityId).experiences || [];
}

export function getSampleTrip(cityId) {
  return getMockCity(cityId).sample_trip || null;
}

export function getAuditDemo(cityId) {
  return getMockCity(cityId).audit_demo || null;
}

export function getSampleChat(cityId) {
  return getMockCity(cityId).sample_chat || [];
}

// Normalized demo guide avatars and coordinates mapping for the mock guides
const DEMO_GUIDE_METAS = {
  'g_pa1': {
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    coords: [48.8574, 2.3592],
    neighborhood: 'Le Marais'
  },
  'g_pa2': {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    coords: [48.8462, 2.3464],
    neighborhood: 'Latin Quarter'
  },
  'g_pa3': {
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    coords: [48.8606, 2.3376],
    neighborhood: 'Louvre & Tuileries'
  },
  'g_pa4': {
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    coords: [48.8867, 2.3431],
    neighborhood: 'Montmartre'
  },
  'g_pa5': {
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    coords: [48.8710, 2.3638],
    neighborhood: 'Canal Saint-Martin'
  },
  'g_ro1': {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coords: [41.8745, 12.4770],
    neighborhood: 'Testaccio'
  },
  'g_ro2': {
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    coords: [41.8902, 12.4922],
    neighborhood: 'Colosseo & Monti'
  },
  'g_ro3': {
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    coords: [41.9065, 12.4536],
    neighborhood: 'Vatican & Prati'
  },
  'g_ro4': {
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    coords: [41.8898, 12.4702],
    neighborhood: 'Trastevere'
  },
  'g_ro5': {
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    coords: [41.9130, 12.4860],
    neighborhood: 'Villa Borghese'
  }
};

export function getEnrichedGuides(cityId = 'paris') {
  const mockCity = getMockCity(cityId);
  const cityKey = cityId.toLowerCase().includes('rome') ? 'rome' : 'paris';
  return (mockCity.guides || []).map((g) => {
    const meta = DEMO_GUIDE_METAS[g.id] || {};
    const languages = (g.langs || []).map(l => (Array.isArray(l) ? l[0] : l));
    return {
      id: g.id,
      destinationId: cityKey,
      name: g.name,
      avatar: meta.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      languages: languages.length ? languages : ['English', cityKey === 'rome' ? 'Italian' : 'French'],
      rate: g.rate_eur || 35,
      rating: 4.9,
      reviews: 28,
      verified: true,
      verificationLevel: g.licence === 'licensed_guide_demo' ? 'Licensed National Guide' : `Level ${g.level || 2}: Verified Local`,
      isLegend: g.level >= 3,
      interests: g.specialties || ['Culture', 'History'],
      bio: g.bio,
      coords: meta.coords || (cityKey === 'rome' ? [41.9028, 12.4964] : [48.8566, 2.3522]),
      neighborhood: meta.neighborhood || '',
      responseHours: g.response_h || 1,
      experiences: (mockCity.experiences || []).filter(e => e.guide === g.id || e.guide_id === g.id)
    };
  });
}
