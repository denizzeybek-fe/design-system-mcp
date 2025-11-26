#!/usr/bin/env tsx
/**
 * Add _metadata to existing enrichment files
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ENRICHMENTS_DIR = resolve('src/registry/enrichments');

// Metadata for each component (from .enrichment-queue.json)
const metadata: Record<string, any> = {
  InCheckBoxV2: { propsHash: "959915b34bb6", eventsHash: "e10808d43975", propCount: 17, eventCount: 1 },
  InChips: { propsHash: "b7bcee727040", eventsHash: "d827049039f8", propCount: 11, eventCount: 2 },
  InContainer: { propsHash: "1bfa2b00a4fc", eventsHash: "4f53cda18c2b", propCount: 11, eventCount: 0 },
  InDataTable: { propsHash: "b81668415884", eventsHash: "41c59fa49883", propCount: 43, eventCount: 5 },
  InDataTableV2: { propsHash: "99623a75db10", eventsHash: "90ff4592ef03", propCount: 58, eventCount: 30 },
  InDatePicker: { propsHash: "4c002fa8a262", eventsHash: "e10808d43975", propCount: 23, eventCount: 1 },
  InDatePickerV2: { propsHash: "29c197a84335", eventsHash: "7db6af6c4a11", propCount: 41, eventCount: 7 },
  InDropDown: { propsHash: "5af3ca16ac82", eventsHash: "c7cf003aa202", propCount: 33, eventCount: 8 },
  InDropdownMenu: { propsHash: "405ec2061e6b", eventsHash: "d9b44726d530", propCount: 40, eventCount: 9 },
  InMultiDropDown: { propsHash: "7a84befceda1", eventsHash: "41c59fa49883", propCount: 35, eventCount: 5 },
  InMultiSelect: { propsHash: "345f121c122c", eventsHash: "67b68754bcb3", propCount: 49, eventCount: 10 },
  InOnPageMessage: { propsHash: "93809f71daae", eventsHash: "4f53cda18c2b", propCount: 12, eventCount: 0 },
  InRichTextInput: { propsHash: "0b2c0ec016be", eventsHash: "0de5e4df1f1d", propCount: 73, eventCount: 18 },
  InSelect: { propsHash: "f63c4768d755", eventsHash: "c7cf003aa202", propCount: 47, eventCount: 8 },
  InSidebarV2: { propsHash: "fd53edc29c4b", eventsHash: "41c59fa49883", propCount: 7, eventCount: 5 },
  InSuperInput: { propsHash: "eceb9f5b9cc3", eventsHash: "e10808d43975", propCount: 49, eventCount: 1 },
  InTooltipV2: { propsHash: "b4ef99145505", eventsHash: "4f53cda18c2b", propCount: 14, eventCount: 0 }
};

const timestamp = new Date().toISOString();
let updated = 0;
let skipped = 0;

console.log('🔧 Adding _metadata to enrichment files...\n');

for (const [componentName, meta] of Object.entries(metadata)) {
  const filePath = resolve(ENRICHMENTS_DIR, `${componentName}.json`);

  try {
    const content = readFileSync(filePath, 'utf-8');
    const enrichment = JSON.parse(content);

    // Check if already has metadata
    if (enrichment._metadata) {
      console.log(`⏭️  ${componentName}: Already has _metadata, skipping`);
      skipped++;
      continue;
    }

    // Add metadata after component name
    const newEnrichment = {
      component: enrichment.component,
      _metadata: {
        lastUpdated: timestamp,
        ...meta
      },
      ...Object.fromEntries(
        Object.entries(enrichment).filter(([key]) => key !== 'component')
      )
    };

    // Write back with proper formatting
    writeFileSync(filePath, JSON.stringify(newEnrichment, null, 2) + '\n');
    console.log(`✅ ${componentName}: Added _metadata (${meta.propCount} props, ${meta.eventCount} events)`);
    updated++;

  } catch (error: any) {
    console.error(`❌ ${componentName}: Error - ${error.message}`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updated}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total: ${updated + skipped}`);

if (updated > 0) {
  console.log(`\n💡 Next steps:`);
  console.log(`   npm run extract:merge  # Merge changes`);
  console.log(`   npm run build          # Rebuild MCP server`);
  console.log(`   npm run extract:enrich # Verify all up to date`);
}
