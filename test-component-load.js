#!/usr/bin/env node

/**
 * Test component loading from built dist/
 */

console.log('🧪 Testing Component Loading from dist/\n');

// Don't set NODE_ENV - test default behavior like Claude Code does
console.log('NODE_ENV:', process.env.NODE_ENV || '(not set - default)');
console.log('');

async function test() {
  try {
    // Import from dist to simulate real usage
    const { createServer } = await import('./dist/index.js');

    console.log('✅ Server module loaded\n');

    // Import loader directly to test
    const content = await import('./dist/index.js');

    // Extract the bundled functions by analyzing the exports
    // Since everything is bundled, we need to test via the server
    console.log('🎉 Module loaded successfully!');
    console.log('');
    console.log('Now restart Claude Code MCP server to test:');
    console.log('  1. Command Palette: "Developer: Reload Window"');
    console.log('  2. Or: MCP: Restart All Servers');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
