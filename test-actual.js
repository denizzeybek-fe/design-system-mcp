#!/usr/bin/env node

/**
 * Test actual component loading
 */

console.log('🧪 Testing Actual Component Loading...\n');

// Set production mode
process.env.NODE_ENV = 'production';

async function test() {
  try {
    // Import the loader directly
    console.log('📦 Loading combined-loader from dist/...');
    const loader = await import('./dist/registry/combined-loader.js');

    console.log('✅ Loader imported successfully\n');

    // Try to get all components
    console.log('📊 Getting all components...');
    const allComponents = loader.getAllComponents();
    console.log(`   Found: ${allComponents.length} components`);

    if (allComponents.length === 0) {
      console.error('❌ No components loaded!');
      process.exit(1);
    }

    // Try to get a specific component
    console.log('\n🔍 Getting InDatePickerV2...');
    const component = loader.getComponentByName('InDatePickerV2');

    if (!component) {
      console.error('❌ InDatePickerV2 not found!');
      console.log('\nAvailable components:');
      allComponents.slice(0, 10).forEach(c => console.log(`   - ${c.name}`));
      process.exit(1);
    }

    console.log(`   ✅ Found: ${component.name}`);
    console.log(`   Version: ${component.version}`);
    console.log(`   Props: ${Object.keys(component.props).length}`);
    console.log(`   Enriched: ${component.enriched || false}`);

    // Try search
    console.log('\n🔍 Searching for "date"...');
    const searchResults = loader.searchComponents('date');
    console.log(`   Found: ${searchResults.length} components`);
    searchResults.forEach(c => console.log(`   - ${c.name}`));

    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

test();
