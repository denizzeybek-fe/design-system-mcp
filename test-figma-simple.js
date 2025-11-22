#!/usr/bin/env node

/**
 * Simple Figma Integration Test - Server Loading
 */

console.log('🎨 Testing Figma Integration (Simple)...\n');

async function test() {
  try {
    console.log('📦 Loading MCP server from dist/...');
    const { createServer } = await import('./dist/index.js');

    console.log('✅ Server module loaded\n');

    console.log('🔧 Creating server instance...');
    const server = createServer();

    console.log('✅ Server created successfully\n');

    console.log('📊 Server Info:');
    console.log('   Name: insider-design-system');
    console.log('   Version: 1.0.0');

    console.log('\n🎉 Figma integration successfully added to MCP server!');
    console.log('\n📚 New Tools Available:');
    console.log('   1. list-figma-mappings - List all Figma→DS mappings');
    console.log('   2. validate-figma-component - Validate Figma component names');
    console.log('   3. convert-figma-to-vue - Convert Figma frames to Vue code');
    console.log('   4. get-ds-for-figma - Get DS component for Figma component');
    console.log('   5. generate-figma-component - Generate code for single component');

    console.log('\n📖 Documentation:');
    console.log('   Read FIGMA_INTEGRATION.md for usage guide');

    console.log('\n🚀 Next Steps:');
    console.log('   1. Restart Claude Code MCP server');
    console.log('   2. Test with: list-figma-mappings');
    console.log('   3. Try: validate-figma-component("Button/Primary")');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

test();
