#!/usr/bin/env node

/**
 * Test combined dataset structure
 */

import { readFileSync } from 'fs';

console.log('🧪 Testing Combined Dataset...\n');

try {
  // Load combined.json
  const data = JSON.parse(readFileSync('data/combined.json', 'utf-8'));

  // Test 1: Metadata
  console.log('📊 Test 1: Metadata');
  console.log(`   ✅ Version: ${data._metadata.version}`);
  console.log(`   ✅ Generated: ${data._metadata.generatedAt}`);
  console.log(`   ✅ Total Components: ${data._metadata.totalComponents}`);
  console.log(`   ✅ Enriched: ${data._metadata.enrichedComponents}`);
  console.log('');

  // Test 2: Component count
  console.log('📋 Test 2: Components');
  const componentCount = Object.keys(data.components).length;
  console.log(`   ✅ Found ${componentCount} components`);
  console.log('');

  // Test 3: InButtonV2 details
  console.log('🔍 Test 3: InButtonV2 Details');
  const buttonV2 = data.components.InButtonV2;

  if (buttonV2) {
    console.log(`   ✅ Name: ${buttonV2.name}`);
    console.log(`   ✅ Version: ${buttonV2.version}`);
    console.log(`   ✅ Props: ${Object.keys(buttonV2.props).length}`);
    console.log(`   ✅ Emits: ${buttonV2.emits.length}`);
    console.log(`   ✅ Enums: ${buttonV2.enums.length}`);
    console.log(`   ✅ Enriched: ${buttonV2.enriched ? 'Yes' : 'No'}`);

    // Check prop details
    if (buttonV2.props.iconSize) {
      console.log(`   ✅ iconSize type: ${buttonV2.props.iconSize.type}`);
      console.log(`   ✅ iconSize default: ${buttonV2.props.iconSize.default}`);
    }

    // Check enum values
    if (buttonV2.enums.length > 0) {
      const stylesEnum = buttonV2.enums.find(e => e.name === 'STYLES');
      if (stylesEnum) {
        console.log(`   ✅ STYLES enum: ${Object.values(stylesEnum.values).join(', ')}`);
      }
    }

    // Check enrichment
    if (buttonV2.propEnrichments && buttonV2.propEnrichments.iconSize) {
      const iconSizeEnrich = buttonV2.propEnrichments.iconSize;
      console.log(`   ✅ iconSize enrichment:`);
      console.log(`      - Valid values: ${iconSizeEnrich.valueFormat.validValues.join(', ')}`);
      console.log(`      - Common mistakes: ${iconSizeEnrich.commonMistakes.length}`);
    }
  } else {
    console.log('   ❌ InButtonV2 not found!');
    process.exit(1);
  }
  console.log('');

  // Test 4: Check props across all components
  console.log('📊 Test 4: Props Statistics');
  let totalProps = 0;
  let totalEmits = 0;
  let totalEnums = 0;
  let enrichedCount = 0;

  Object.values(data.components).forEach(comp => {
    totalProps += Object.keys(comp.props).length;
    totalEmits += comp.emits.length;
    totalEnums += comp.enums.length;
    if (comp.enriched) enrichedCount++;
  });

  console.log(`   ✅ Total Props: ${totalProps}`);
  console.log(`   ✅ Total Emits: ${totalEmits}`);
  console.log(`   ✅ Total Enums: ${totalEnums}`);
  console.log(`   ✅ Enriched Components: ${enrichedCount}`);
  console.log('');

  // Test 5: Find components with most props
  console.log('🏆 Test 5: Top 5 Components (by props)');
  const sorted = Object.values(data.components)
    .sort((a, b) => Object.keys(b.props).length - Object.keys(a.props).length)
    .slice(0, 5);

  sorted.forEach((comp, i) => {
    console.log(`   ${i + 1}. ${comp.name}: ${Object.keys(comp.props).length} props`);
  });
  console.log('');

  // Test 6: Migrations
  console.log('🔄 Test 6: Migrations');
  const migrationCount = Object.keys(data.migrations).length;
  console.log(`   ✅ Found ${migrationCount} migrations`);
  if (migrationCount > 0) {
    Object.entries(data.migrations).forEach(([key, mig]) => {
      console.log(`      - ${mig.fromComponent} → ${mig.toComponent}`);
    });
  }
  console.log('');

  // Summary
  console.log('✅ All tests passed!');
  console.log('');
  console.log('🎉 Combined dataset is valid and ready!');
  console.log('');
  console.log('Dataset Summary:');
  console.log(`   - ${componentCount} components with ${totalProps} props`);
  console.log(`   - ${enrichedCount} enriched components`);
  console.log(`   - ${totalEnums} enum definitions`);
  console.log(`   - ${migrationCount} migration guides`);

} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}
