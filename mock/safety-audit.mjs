// Deterministic itinerary safety audit for Local Guide Connect.
// The AI never decides the findings. This engine does; the language model only explains them.
// Usage: node safety-audit.mjs   (runs the built-in demo against seed/rome.json and seed/paris.json)

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const SEV_W = { low: 5, medium: 12, high: 20 };
const CROWD_W = { extreme: 15, high: 10, medium: 5, controlled: 3, low: 0 };
const WALK_KMH = 4.5;       // average urban walking speed
const DETOUR = 1.3;         // street network is longer than a straight line

const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const hourOf = (hhmm) => Math.floor(toMin(hhmm) / 60);

export function haversineM(a, b) {
  if (!a || !b || a.lat == null || b.lat == null) return 0;
  const R = 6371000, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function buildIndex(city) {
  const idx = new Map();
  for (const sec of ['places', 'food', 'hidden_spots', 'transport']) for (const x of city[sec] || []) idx.set(x.id, x);
  return idx;
}

function zonesAt(place, city) {
  if (!place || place.lat == null) return [];
  return city.safety_zones.filter((z) => haversineM(place, z) <= z.r_m + 100);
}

function activeNow(active, hour) {
  const isNight = hour >= 20 || hour < 6;
  if (active === 'any') return 1;
  if (active === 'day') return isNight ? 0.3 : 1;
  if (active === 'night') return isNight ? 1 : 0.3;
  return 1;
}

export function scoreStop(stop, city, idx, ctx) {
  const place = idx.get(stop.place);
  const findings = [];
  const parts = { scam: 0, time: 0, crowd: 0, rules: 0, logistics: 0 };
  if (!place) return { stop, score: 0, parts, findings: [{ code: 'UNKNOWN_PLACE', severity: 'warn', stop: stop.place, msg: 'Place not found in the database.' }] };

  const hour = hourOf(stop.time);
  const zones = zonesAt(place, city);
  const zoneIds = new Set(zones.map((z) => z.id));

  // 1. Scam exposure (0-35): scams listed on the place, or active in any zone the place sits in.
  const scamIds = new Set(place.scams || []);
  for (const s of city.scams) if (s.zones.some((z) => zoneIds.has(z))) scamIds.add(s.id);
  const hits = [...scamIds].map((id) => city.scams.find((s) => s.id === id)).filter(Boolean);
  for (const s of hits) parts.scam += (SEV_W[s.sev] || 5) * activeNow(s.active, hour);
  parts.scam = Math.min(35, Math.round(parts.scam));
  const top = hits.sort((a, b) => (SEV_W[b.sev] || 0) - (SEV_W[a.sev] || 0)).slice(0, 2);
  for (const s of top) findings.push({ code: 'SCAM_NEARBY', severity: s.sev === 'high' ? 'warn' : 'info', stop: stop.place, evidence: [s.id], msg: `${s.title}. ${s.avoid}` });

  // 2. Time of day (0-20)
  const nightZone = zones.some((z) => z.night_caution);
  if (hour >= 22 || hour < 6) parts.time = nightZone ? 15 : 8;
  else if (hour >= 20 && nightZone) parts.time = 5;
  if (parts.time >= 8 && nightZone) findings.push({ code: 'NIGHT_CROWD', severity: 'warn', stop: stop.place, evidence: [...zoneIds], msg: 'Late-night visit in an area flagged for pickpockets. Keep valuables in front pockets and use official taxis or well-lit main routes.' });

  // 3. Crowd pressure (0-15)
  parts.crowd = CROWD_W[place.crowd] ?? 0;

  // 4. Rules friction (0-15)
  for (const rid of place.rules || []) {
    const r = city.rules.find((x) => x.id === rid);
    if (!r) continue;
    if (r.sev === 'careful') parts.rules += 4;
    if (r.sev === 'serious') parts.rules += 8;
    if (r.sev !== 'info') findings.push({ code: 'RULE_APPLIES', severity: 'info', stop: stop.place, evidence: [r.id], msg: `${r.title}. ${r.instead}` });
  }
  parts.rules = Math.min(15, parts.rules);

  // 5. Logistics (0-15) with blocking checks
  if (place.status === 'closed_renovation') { parts.logistics = 15; findings.push({ code: 'CLOSED_VENUE', severity: 'blocking', stop: stop.place, msg: `${place.name} is reported closed. Remove it or verify before keeping it.` }); }
  if (place.closed_weekday && ctx.weekday === place.closed_weekday) { parts.logistics = 15; findings.push({ code: 'CLOSED_DAY', severity: 'blocking', stop: stop.place, msg: `${place.name} is normally closed on ${place.closed_weekday}s. Move it to another day.` }); }
  if (place.book === 'required') {
    if (stop.booked === false) { parts.logistics = Math.max(parts.logistics, 12); findings.push({ code: 'RESERVATION_MISSING', severity: 'blocking', stop: stop.place, msg: `${place.name} needs an advance reservation or timed ticket.` }); }
    else if (stop.booked === undefined) findings.push({ code: 'RESERVATION_REMINDER', severity: 'info', stop: stop.place, msg: `Remember to reserve ${place.name} in advance.` });
  }

  const score = Math.min(100, parts.scam + parts.time + parts.crowd + parts.rules + parts.logistics);
  return { stop, name: place.name, score, band: score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low', parts, findings };
}

export function auditDay(day, city, idx) {
  const ctx = { weekday: day.weekday || day.date_weekday };
  const scored = day.stops.map((s) => scoreStop(s, city, idx, ctx));
  const findings = scored.flatMap((s) => s.findings);

  // Overlap and tight transfers between consecutive stops
  for (let i = 0; i < day.stops.length - 1; i++) {
    const a = day.stops[i], b = day.stops[i + 1];
    const pa = idx.get(a.place), pb = idx.get(b.place);
    if (!pa || !pb || pa.lat == null || pb.lat == null) continue;
    const endA = toMin(a.time) + (a.mins ?? pa.mins ?? 60);
    const gap = toMin(b.time) - endA;
    const travel = Math.round((haversineM(pa, pb) * DETOUR) / 1000 / WALK_KMH * 60);
    if (gap < 0) findings.push({ code: 'OVERLAP', severity: 'blocking', stop: b.place, evidence: [a.place], msg: `${pa.name} (${a.time}, about ${a.mins ?? pa.mins} min) overlaps with ${pb.name} at ${b.time}.` });
    else if (gap < Math.min(travel, 30) && travel > 8) findings.push({ code: 'TIGHT_TRANSFER', severity: 'warn', stop: b.place, evidence: [a.place], msg: `Only ${gap} min between ${pa.name} and ${pb.name}; walking takes about ${travel} min. Allow more time or use transit.` });
  }
  const scores = scored.map((s) => s.score);
  const mean = scores.length ? Math.round(scores.reduce((x, y) => x + y, 0) / scores.length) : 0;
  return { stops: scored, findings, mean, max: Math.max(0, ...scores) };
}

export function auditTrip(trip, city) {
  const idx = buildIndex(city);
  const days = (trip.days || []).map((d) => auditDay(d, city, idx));
  const blocking = days.flatMap((d) => d.findings).filter((f) => f.severity === 'blocking').length;
  const mean = days.length ? Math.round(days.reduce((x, d) => x + d.mean, 0) / days.length) : 0;
  const grade = blocking ? 'Needs fixes' : mean < 20 ? 'A' : mean < 35 ? 'B' : mean < 50 ? 'C' : 'D';
  return { grade, blocking, mean, days };
}

// ---- demo ----
if (process.argv[1] && process.argv[1].endsWith('safety-audit.mjs')) {
  for (const name of ['rome', 'paris']) {
    const filePath = fileURLToPath(new URL(`${name}.json`, import.meta.url));
    const city = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const good = auditTrip(city.sample_trip, city);
    console.log(`\n=== ${city.meta.city}: sample trip ===`);
    console.log(`grade ${good.grade}, mean risk ${good.mean}, blocking ${good.blocking}`);
    for (const d of good.days) console.log('  day mean', d.mean, 'stops:', d.stops.map((s) => `${s.name || s.stop.place}=${s.score}`).join(', '));
    const bad = auditTrip({ days: [{ weekday: city.audit_demo.draft_weekday, stops: city.audit_demo.draft }] }, city);
    console.log(`--- ${city.meta.city}: flawed draft ---`);
    console.log(`grade ${bad.grade}, blocking ${bad.blocking}`);
    for (const f of bad.days[0].findings.filter((x) => x.severity !== 'info')) console.log(`  [${f.severity}] ${f.code} @ ${f.stop}: ${f.msg}`);
  }
}
