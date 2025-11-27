#!/usr/bin/env tsx

/**
 * Remove extra fields not in schema
 *
 * Removes:
 * - version, lastUpdated (use _metadata instead)
 * - migrationNotes (move to separate migration guide)
 */

import fs from 'fs';
import path from 'path';

const enrichmentDir = 'src/registry/enrichments';

const EXTRA_FIELDS = ['version', 'lastUpdated', 'migrationNotes'];

function removeExtraFields(filename: string): { cleaned: boolean; removedFields: string[] } {
  const filePath = path.join(enrichmentDir, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  const removedFields: string[] = [];
  let cleaned = false;

  for (const field of EXTRA_FIELDS) {
    if (field in data) {
      delete data[field];
      removedFields.push(field);
      cleaned = true;
    }
  }

  if (cleaned) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  return { cleaned, removedFields };
}

async function main() {
  console.log('🧹 Removing extra fields from enrichment files...\n');
  console.log('ℹ️  Fields to remove: version, lastUpdated, migrationNotes\n');

  const files = fs.readdirSync(enrichmentDir)
    .filter(f => f.endsWith('.json') && f !== '_TEMPLATE.json');

  let cleanedCount = 0;
  const results: Array<{ file: string; removedFields: string[] }> = [];

  for (const file of files) {
    const { cleaned, removedFields } = removeExtraFields(file);

    if (cleaned) {
      cleanedCount++;
      results.push({ file, removedFields });
      console.log(`✓ ${file}: removed ${removedFields.join(', ')}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary');
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

  console.log('\n✨ Done!\n');
}

main().catch((error) => {
  console.error('❌ Failed:', error);
  process.exit(1);
});
