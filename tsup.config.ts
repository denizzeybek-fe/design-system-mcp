import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';

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
    // Copy registry to dist root (loader expects it in __dirname)
    copyFileSync('src/registry/components.json', 'dist/components.json');
    console.log('✓ Copied components.json to dist/');
  },
});
