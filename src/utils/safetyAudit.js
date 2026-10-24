/**
 * src/utils/safetyAudit.js
 * Deterministic Itinerary Safety Audit Engine for Local Guide Connect (TRAVGOD)
 * Adapted from mock/safety-audit.mjs
 * 
 * Scores itineraries across 5 core risk vectors:
 * 1. Scam exposure (0–35): Active scams at the place or within its surrounding geofence
 * 2. Time-of-day / Night caution (0–20): Late-night presence in pickpocket hotspot zones
 * 3. Crowd pressure (0–15): Extreme, high, or medium density tourist pressure
 * 4. Local rules friction (0–15): Fines, prohibited behaviors, dress codes
 * 5. Logistics (0–15): Closed venues, closed weekdays, missing mandatory reservations, schedule overlaps
 */

const SEV_W = { low: 5, medium: 12, high: 20 };
const CROWD_W = { extreme: 15, high: 10, medium: 5, controlled: 3, low: 0 };
const WALK_KMH = 4.5; // Average urban walking speed
const DETOUR = 1.3;   // Street network pedestrian detour multiplier

const toMin = (hhmm) => {
  if (!hhmm) return 0;
  const clean = hhmm.replace(/\s*[apAP][mM]/, '');
  const [h, m] = clean.split(':').map(Number);
  let total = (h || 0) * 60 + (m || 0);
  if (/pm/i.test(hhmm) && h < 12) total += 720;
  if (/am/i.test(hhmm) && h === 12) total -= 720;
  return total;
};

const hourOf = (hhmm) => Math.floor(toMin(hhmm) / 60);

export function haversineM(a, b) {
  if (!a || !b || a.lat == null || b.lat == null) return 0;
  const R = 6371000;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function buildIndex(city) {
  const idx = new Map();
  for (const sec of ['places', 'food', 'hidden_spots', 'transport']) {
    for (const x of city[sec] || []) {
      idx.set(x.id, x);
    }
  }
  return idx;
}

export function zonesAt(place, city) {
  if (!place || place.lat == null || !city.safety_zones) return [];
  return city.safety_zones.filter((z) => haversineM(place, z) <= (z.r_m || 300) + 100);
}

function activeNow(active, hour) {
  const isNight = hour >= 20 || hour < 6;
  if (active === 'any') return 1;
  if (active === 'day') return isNight ? 0.3 : 1;
  if (active === 'night') return isNight ? 1 : 0.3;
  return 1;
}

export function scoreStop(stop, city, idx, ctx = {}) {
  const placeId = stop.place || stop.placeId || stop.id;
  const place = idx.get(placeId) || (city.places || []).find(p => p.id === placeId || p.name === stop.title);
  const findings = [];
  const parts = { scam: 0, time: 0, crowd: 0, rules: 0, logistics: 0 };

  if (!place) {
    return {
      stop,
      name: stop.title || placeId,
      score: 10,
      band: 'low',
      parts,
      findings: [{
        code: 'UNKNOWN_PLACE',
        severity: 'warn',
        stop: placeId,
        msg: `Stop "${stop.title || placeId}" not indexed in verified city database.`
      }]
    };
  }

  const hour = hourOf(stop.time || '10:00');
  const zones = zonesAt(place, city);
  const zoneIds = new Set(zones.map((z) => z.id));

  // 1. Scam exposure (0-35)
  const scamIds = new Set(place.scams || []);
  for (const s of city.scams || []) {
    if ((s.zones || []).some((z) => zoneIds.has(z))) scamIds.add(s.id);
  }
  const hits = [...scamIds].map((id) => (city.scams || []).find((s) => s.id === id)).filter(Boolean);
  for (const s of hits) {
    parts.scam += (SEV_W[s.sev] || 5) * activeNow(s.active, hour);
  }
  parts.scam = Math.min(35, Math.round(parts.scam));

  const topScams = hits.sort((a, b) => (SEV_W[b.sev] || 0) - (SEV_W[a.sev] || 0)).slice(0, 2);
  for (const s of topScams) {
    findings.push({
      code: 'SCAM_NEARBY',
      severity: s.sev === 'high' ? 'warn' : 'info',
      stop: placeId,
      evidence: [s.id],
      msg: `${s.title}: ${s.avoid || s.tactic || 'Stay vigilant in surrounding street area.'}`
    });
  }

  // 2. Time of day / Night crowd caution (0-20)
  const nightZone = zones.some((z) => z.night_caution);
  if (hour >= 22 || hour < 6) {
    parts.time = nightZone ? 15 : 8;
  } else if (hour >= 20 && nightZone) {
    parts.time = 5;
  }
  if (parts.time >= 8 && nightZone) {
    findings.push({
      code: 'NIGHT_CROWD',
      severity: 'warn',
      stop: placeId,
      evidence: [...zoneIds],
      msg: 'Late-night visit in an area flagged for pickpockets. Keep valuables in front pockets and use official taxis or well-lit main avenues.'
    });
  }

  // 3. Crowd pressure (0-15)
  parts.crowd = CROWD_W[place.crowd] ?? 0;

  // 4. Rules friction (0-15)
  for (const rid of place.rules || []) {
    const r = (city.rules || []).find((x) => x.id === rid);
    if (!r) continue;
    if (r.sev === 'careful') parts.rules += 4;
    if (r.sev === 'serious') parts.rules += 8;
    if (r.sev !== 'info') {
      findings.push({
        code: 'RULE_APPLIES',
        severity: 'info',
        stop: placeId,
        evidence: [r.id],
        msg: `${r.title}: ${r.instead || r.rule || 'Follow posted municipal guidelines.'}`
      });
    }
  }
  parts.rules = Math.min(15, parts.rules);

  // 5. Logistics (0-15) with blocking checks
  if (place.status === 'closed_renovation') {
    parts.logistics = 15;
    findings.push({
      code: 'CLOSED_VENUE',
      severity: 'blocking',
      stop: placeId,
      msg: `${place.name} is reported closed for renovation. Remove it or verify official reopening before scheduling.`
    });
  }

  const currentWeekday = ctx.weekday || ctx.date_weekday;
  if (place.closed_weekday && currentWeekday && currentWeekday.toLowerCase() === place.closed_weekday.toLowerCase()) {
    parts.logistics = 15;
    findings.push({
      code: 'CLOSED_DAY',
      severity: 'blocking',
      stop: placeId,
      msg: `${place.name} is normally closed on ${place.closed_weekday}s. Move it to another day.`
    });
  }

  if (place.book === 'required') {
    if (stop.booked === false) {
      parts.logistics = Math.max(parts.logistics, 12);
      findings.push({
        code: 'RESERVATION_MISSING',
        severity: 'blocking',
        stop: placeId,
        msg: `${place.name} requires an advance reservation or timed ticket.`
      });
    } else if (stop.booked === undefined) {
      findings.push({
        code: 'RESERVATION_REMINDER',
        severity: 'info',
        stop: placeId,
        msg: `Remember to reserve ${place.name} in advance via official channels.`
      });
    }
  }

  const score = Math.min(100, parts.scam + parts.time + parts.crowd + parts.rules + parts.logistics);
  const band = score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low';

  return {
    stop,
    name: place.name || stop.title || placeId,
    placeId,
    score,
    band,
    parts,
    findings,
    zones
  };
}

export function auditDay(day, city, idx) {
  const ctx = { weekday: day.weekday || day.date_weekday };
  const stops = day.stops || [];
  const scored = stops.map((s) => scoreStop(s, city, idx, ctx));
  const findings = scored.flatMap((s) => s.findings);

  // Overlap and tight transfer detection between consecutive stops
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    const pa = idx.get(a.place || a.placeId) || (city.places || []).find(p => p.id === (a.place || a.placeId));
    const pb = idx.get(b.place || b.placeId) || (city.places || []).find(p => p.id === (b.place || b.placeId));
    if (!pa || !pb || pa.lat == null || pb.lat == null) continue;

    const startA = toMin(a.time || '10:00');
    const startB = toMin(b.time || '11:00');
    const durationA = a.mins ?? pa.mins ?? 60;
    const endA = startA + durationA;
    const gap = startB - endA;
    const travel = Math.round(((haversineM(pa, pb) * DETOUR) / 1000 / WALK_KMH) * 60);

    if (gap < 0) {
      findings.push({
        code: 'OVERLAP',
        severity: 'blocking',
        stop: b.place || b.placeId,
        evidence: [a.place || a.placeId],
        msg: `${pa.name} (${a.time}, ~${durationA} min) overlaps with ${pb.name} at ${b.time}.`
      });
    } else if (gap < Math.min(travel, 30) && travel > 8) {
      findings.push({
        code: 'TIGHT_TRANSFER',
        severity: 'warn',
        stop: b.place || b.placeId,
        evidence: [a.place || a.placeId],
        msg: `Only ${gap} min buffer between ${pa.name} and ${pb.name}; walking takes ~${travel} min. Allow more time or use transit.`
      });
    }
  }

  const scores = scored.map((s) => s.score);
  const mean = scores.length ? Math.round(scores.reduce((x, y) => x + y, 0) / scores.length) : 0;
  return {
    dayNumber: day.day,
    title: day.title || `Day ${day.day}`,
    weekday: ctx.weekday,
    stops: scored,
    findings,
    mean,
    max: Math.max(0, ...scores)
  };
}

export function auditTrip(trip, city) {
  const idx = buildIndex(city);
  const days = (trip.days || []).map((d) => auditDay(d, city, idx));
  const allFindings = days.flatMap((d) => d.findings);
  const blocking = allFindings.filter((f) => f.severity === 'blocking').length;
  const warnings = allFindings.filter((f) => f.severity === 'warn').length;
  const mean = days.length ? Math.round(days.reduce((x, d) => x + d.mean, 0) / days.length) : 0;
  
  const grade = blocking > 0 ? 'Needs fixes' : mean < 20 ? 'A' : mean < 35 ? 'B' : mean < 50 ? 'C' : 'D';

  return {
    grade,
    gradeLabel: grade === 'Needs fixes' ? 'Fixes Required (Blocking Issues)' : `Grade ${grade} (Safe & Scam-Optimized)`,
    blocking,
    warnings,
    meanRisk: mean,
    days,
    allFindings
  };
}

export function auditDraft(draftStops, weekday, city) {
  return auditTrip(
    {
      days: [{ day: 1, weekday, stops: draftStops }]
    },
    city
  );
}
