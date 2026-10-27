#!/usr/bin/env node
/**
 * scripts/ci/license-check.mjs
 * DevSecOps Stage: GOVERN
 * Repository MIT License verification sentinel
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('⚖️ [GOVERN] Verifying repository MIT License compliance...');

const licensePath = path.join(rootDir, 'LICENSE');
if (!fs.existsSync(licensePath)) {
  console.error('FATAL: LICENSE file missing from repository root.');
  process.exit(1);
}

const content = fs.readFileSync(licensePath, 'utf8');
if (!content.includes('MIT License')) {
  console.error('FATAL: LICENSE file does not contain valid MIT License declaration.');
  process.exit(1);
}

console.log('✅ LICENSE file verified with valid MIT License declaration.');
console.log('🎉 MIT License compliance verified 100%.');
process.exit(0);
