#!/usr/bin/env tsx

/**
 * Cleanup Enrichment Files
 *
 * Removes deprecated fields from enrichment files:
 * - helperFunctions (deprecated)
 * - figmaMapping (deprecated)
 */

import fs from 'fs';
import path from 'path';

const enrichmentDir = 'src/registry/enrichments';

function cleanupFile(filename: string): { cleaned: boolean; removedFields: string[] } {
  const filePath = path.join(enrichmentDir, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  const removedFields: string[] = [];
  let cleaned = false;

  // Remove helperFunctions field
  if ('helperFunctions' in data) {
    delete data.helperFunctions;
    removedFields.push('helperFunctions');
    cleaned = true;
  }

  // Remove figmaMapping field
  if ('figmaMapping' in data) {
    delete data.figmaMapping;
    removedFields.push('figmaMapping');
    cleaned = true;
  }

  if (cleaned) {
    // Write back with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  return { cleaned, removedFields };
}

async function main() {
  console.log('🧹 Cleaning up enrichment files...\n');

  const files = fs.readdirSync(enrichmentDir)
    .filter(f => f.endsWith('.json') && f !== '_TEMPLATE.json');

  let cleanedCount = 0;
  const results: Array<{ file: string; removedFields: string[] }> = [];

  for (const file of files) {
    const { cleaned, removedFields } = cleanupFile(file);

    if (cleaned) {
      cleanedCount++;
      results.push({ file, removedFields });
      console.log(`✓ ${file}: removed ${removedFields.join(', ')}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Cleanup Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Total files: ${files.length}`);
  console.log(`Cleaned: ${cleanedCount}`);
  console.log(`Unchanged: ${files.length - cleanedCount}\n`);

  if (results.length > 0) {
    console.log('✅ Cleaned files:');
    results.forEach(r => {
      console.log(`   - ${r.file}: removed ${r.removedFields.join(', ')}`);
    });
  }

  console.log('\n✨ Cleanup complete!\n');
}

main().catch((error) => {
  console.error('❌ Cleanup failed:', error);
  process.exit(1);
});
