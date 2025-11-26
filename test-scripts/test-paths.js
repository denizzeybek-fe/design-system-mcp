#!/usr/bin/env node

/**
 * Test path resolution
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Path Resolution Test\n');

console.log('Current file:', __filename);
console.log('Current dir:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

// Simulate production path
const prodPath = join(__dirname, 'dist', 'data', 'combined.json');
console.log('Production path (from root):', prodPath);
console.log('  Exists?', existsSync(prodPath));

// Simulate what the bundled code would use
const distDir = join(__dirname, 'dist');
const bundledPath = join(distDir, 'data', 'combined.json');
console.log('\nBundled code path:', bundledPath);
console.log('  Exists?', existsSync(bundledPath));

if (existsSync(bundledPath)) {
  const content = readFileSync(bundledPath, 'utf-8');
  const data = JSON.parse(content);
  console.log('  Components:', Object.keys(data.components).length);
  console.log('  Has InDatePickerV2?', 'InDatePickerV2' in data.components);
}
