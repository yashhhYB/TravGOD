/**
 * qlooApi.js — Qloo Taste AI™ Integration Service
 * Base URL: https://hackathon.api.qloo.com
 * Key: hack_2c9f994fb5f3a206108cfdbb2813a247fadb5d95
 */

const QLOO_API_URL = 'https://hackathon.api.qloo.com';
const QLOO_API_KEY = 'hack_2c9f994fb5f3a206108cfdbb2813a247fadb5d95';

const headers = {
  'X-Api-Key': QLOO_API_KEY,
  'Content-Type': 'application/json',
};

/**
 * Search entities (destinations, places, brands, cultural tags)
 */
export async function qlooSearch(query) {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`${QLOO_API_URL}/v2/search?query=${encodeURIComponent(query.trim())}`, { headers });
    if (!res.ok) {
      console.warn('Qloo Search HTTP error:', res.status);
      return [];
    }
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Qloo API Error:', err);
    return [];
  }
}

/**
 * Get curated places (Food & Attractions) for a city using Qloo Search
 */
export async function getCityPlacesFromQloo(cityName) {
  try {
    const [foodRes, attrRes] = await Promise.all([
      qlooSearch(`${cityName} restaurant`),
      qlooSearch(`${cityName} museum`),
    ]);

    const food = foodRes.map(item => ({
      id: item.entity_id || `food-${Math.random()}`,
      title: item.name,
      subtype: item.subtype || 'Restaurant',
      popularity: item.popularity ? Math.round(item.popularity * 100) : 85,
      aesthetics: item.properties?.aesthetic_properties || ['Gourmet', 'Local Favorite'],
      coords: item.location ? [item.location.lat, item.location.lon] : null,
      type: 'food'
    })).filter(f => f.coords);

    const attractions = attrRes.map(item => ({
      id: item.entity_id || `attr-${Math.random()}`,
      title: item.name,
      subtype: item.subtype || 'Landmark',
      popularity: item.popularity ? Math.round(item.popularity * 100) : 90,
      aesthetics: item.properties?.aesthetic_properties || ['Historical', 'Culture'],
      coords: item.location ? [item.location.lat, item.location.lon] : null,
      type: 'attraction'
    })).filter(a => a.coords);

    return { food, attractions };
  } catch (err) {
    console.error('Failed to fetch Qloo city places:', err);
    return { food: [], attractions: [] };
  }
}
