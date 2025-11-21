#!/usr/bin/env node

/**
 * Test MCP server in production mode (from dist/)
 */

console.log('🧪 Testing MCP Server in Production Mode...\n');

// Set production mode
process.env.NODE_ENV = 'production';

async function test() {
  try {
    // Try to load the tools module which will trigger dataset loading
    console.log('📦 Loading MCP server from dist/...');

    const toolsModule = await import('./dist/index.js');

    console.log('✅ MCP server loaded successfully\n');

    // Give it a moment to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🎉 Production test passed!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Add to Claude Desktop config');
    console.log('  2. Restart Claude Desktop');
    console.log('  3. Test with: "Get InButtonV2 component"');

    process.exit(0);
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
    console.error('');
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

test();
