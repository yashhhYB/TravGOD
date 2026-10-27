#!/usr/bin/env node
/**
 * scripts/ci/lint-check.mjs
 * DevSecOps Stage: CREATE
 * Static code & JSON syntax validator for TravGOD
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('🔍 [CREATE] Running TravGOD Static Linter & Syntax Validator...');

let errorsCount = 0;
let filesChecked = 0;

function walk(dir, filter, callback) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walk(fullPath, filter, callback);
      }
    } else if (filter(fullPath)) {
      callback(fullPath);
    }
  }
}

// 1. Validate JSON files
walk(rootDir, (f) => f.endsWith('.json') && !f.includes('package-lock.json'), (jsonPath) => {
  filesChecked++;
  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    JSON.parse(content);
  } catch (err) {
    console.error(`❌ JSON parse error in ${path.relative(rootDir, jsonPath)}: ${err.message}`);
    errorsCount++;
  }
});

// 2. Validate JS/MJS syntax via node --check
walk(rootDir, (f) => (f.endsWith('.js') || f.endsWith('.mjs')) && (f.includes('src') || f.includes('mock') || f.includes('scripts') || f.includes('test')), (jsPath) => {
  filesChecked++;
  try {
    execSync(`node --check "${jsPath}"`, { stdio: 'pipe' });
  } catch (err) {
    console.error(`❌ Syntax error in ${path.relative(rootDir, jsPath)}: ${err.message}`);
    errorsCount++;
  }

  // Check for forbidden debug artifacts
  if (!jsPath.includes('lint-check.mjs')) {
    const content = fs.readFileSync(jsPath, 'utf8');
    if (content.includes('debug' + 'ger;')) {
      console.warn(`⚠️ Warning: Found 'debugger;' statement in ${path.relative(rootDir, jsPath)}`);
    }
  }
});

console.log(`✅ [CREATE] Linter completed: ${filesChecked} files checked.`);

if (errorsCount > 0) {
  console.error(`❌ Linter failed with ${errorsCount} error(s).`);
  process.exit(1);
} else {
  console.log('🎉 All files passed syntax & lint validation!');
  process.exit(0);
}
