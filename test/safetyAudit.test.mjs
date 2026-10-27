import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { haversineM, buildIndex, auditTrip } from '../mock/safety-audit.mjs';

test('haversineM calculates geodesic distance accurately', () => {
  const colosseum = { lat: 41.8902, lng: 12.4922 };
  const vatican = { lat: 41.9029, lng: 12.4534 };
  const dist = haversineM(colosseum, vatican);

  // Distance between Colosseum and Vatican is approximately 3.5 km (3500m)
  assert.ok(dist > 3000 && dist < 4000, `Expected distance ~3.5km, got ${dist}`);
});

test('haversineM returns 0 for identical points or null coordinates', () => {
  const p1 = { lat: 48.8584, lng: 2.2945 };
  assert.equal(haversineM(p1, p1), 0);
  assert.equal(haversineM(null, p1), 0);
  assert.equal(haversineM(p1, null), 0);
});

test('buildIndex catalogs places, food, hidden_spots and transport', () => {
  const romePath = fileURLToPath(new URL('../mock/rome.json', import.meta.url));
  const rome = JSON.parse(fs.readFileSync(romePath, 'utf8'));
  const idx = buildIndex(rome);

  assert.ok(idx.has('p_colosseum'), 'Index should contain Colosseum');
  assert.ok(idx.has('f_roman4'), 'Index should contain Roman pasta four');
  assert.ok(idx.has('t_leo'), 'Index should contain Leonardo Express');
});

test('auditTrip approves compliant sample trip with Grade A or B and 0 blocking issues', () => {
  const parisPath = fileURLToPath(new URL('../mock/paris.json', import.meta.url));
  const paris = JSON.parse(fs.readFileSync(parisPath, 'utf8'));
  const result = auditTrip(paris.sample_trip, paris);

  assert.equal(result.blocking, 0, 'Compliant trip should have 0 blocking findings');
  assert.ok(['A', 'B'].includes(result.grade), `Expected Grade A or B, got ${result.grade}`);
  assert.ok(result.mean < 30, `Mean risk should be low, got ${result.mean}`);
});

test('auditTrip flags flawed drafts with blocking issues and "Needs fixes" grade', () => {
  const romePath = fileURLToPath(new URL('../mock/rome.json', import.meta.url));
  const rome = JSON.parse(fs.readFileSync(romePath, 'utf8'));
  const flawedTrip = {
    days: [{ weekday: rome.audit_demo.draft_weekday, stops: rome.audit_demo.draft }]
  };
  const result = auditTrip(flawedTrip, rome);

  assert.ok(result.blocking > 0, 'Flawed draft must detect blocking issues');
  assert.equal(result.grade, 'Needs fixes', 'Grade must be "Needs fixes"');
  
  // Verify specific finding codes are caught
  const findingCodes = result.days.flatMap(d => d.findings).map(f => f.code);
  assert.ok(findingCodes.includes('CLOSED_DAY'), 'Must detect closed day');
  assert.ok(findingCodes.includes('OVERLAP'), 'Must detect schedule overlap');
});
