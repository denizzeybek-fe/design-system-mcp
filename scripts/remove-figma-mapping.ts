#!/usr/bin/env tsx

/**
 * Remove figmaMapping field from enrichment files
 *
 * figmaMapping is managed centrally in src/registry/figma-mappings.ts
 * and should not be duplicated in enrichment files.
 */

import fs from 'fs';
import path from 'path';

const enrichmentDir = 'src/registry/enrichments';

function removeFigmaMapping(filename: string): boolean {
  const filePath = path.join(enrichmentDir, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  if ('figmaMapping' in data) {
    delete data.figmaMapping;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    return true;
  }

  return false;
}

async function main() {
  console.log('🧹 Removing figmaMapping field from enrichment files...\n');
  console.log('ℹ️  Reason: figmaMapping is managed centrally in src/registry/figma-mappings.ts\n');

  const files = fs.readdirSync(enrichmentDir)
    .filter(f => f.endsWith('.json') && f !== '_TEMPLATE.json');

  let removedCount = 0;
  const removedFiles: string[] = [];

  for (const file of files) {
    const removed = removeFigmaMapping(file);
    if (removed) {
      removedCount++;
      removedFiles.push(file);
      console.log(`✓ ${file}: removed figmaMapping`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Total files: ${files.length}`);
  console.log(`Removed figmaMapping: ${removedCount}`);
  console.log(`Unchanged: ${files.length - removedCount}\n`);

  if (removedFiles.length > 0) {
    console.log('✅ Cleaned files:');
    removedFiles.forEach(f => console.log(`   - ${f}`));
  }

  console.log('\n✨ Done!\n');
}

main().catch((error) => {
  console.error('❌ Failed:', error);
  process.exit(1);
});
