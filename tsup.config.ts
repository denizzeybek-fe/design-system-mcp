import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, cpSync, existsSync } from 'fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  onSuccess: async () => {
    // Copy data directory (combined dataset) - PRIMARY SOURCE
    if (existsSync('data')) {
      mkdirSync('dist/data', { recursive: true });
      cpSync('data', 'dist/data', { recursive: true });
      console.log('✓ Copied data/ to dist/');
    } else {
      console.warn('⚠️  data/ directory not found. Run: npm run extract:all');
    }
  },
});
