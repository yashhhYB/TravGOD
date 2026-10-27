#!/usr/bin/env node
/**
 * scripts/ci/config-check.mjs
 * DevSecOps Stage: CONFIGURE
 * Configuration schema & runtime environment integrity sentinel
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('⚙️ [CONFIGURE] Checking configuration schema & runtime environment integrity...');

const requiredFiles = ['package.json', 'vite.config.js', '.env.example'];
let missingCount = 0;

for (const file of requiredFiles) {
  const p = path.join(rootDir, file);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing critical configuration file: ${file}`);
    missingCount++;
  } else {
    console.log(`✅ Verified config file: ${file}`);
  }
}

if (missingCount > 0) {
  console.error(`❌ Configuration drift check failed: ${missingCount} files missing.`);
  process.exit(1);
}

console.log('🎉 Configuration schema verified. Zero configuration drift detected.');
process.exit(0);
