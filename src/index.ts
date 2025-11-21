import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

/**
 * Main entry point for the Design System MCP server
 */
async function main(): Promise<void> {
  // Log to stderr (stdout is reserved for MCP protocol)
  console.error('🎨 Design System MCP Server is running...');
  console.error('   Tools: list-components, get-component, search-components, generate-code, map-figma-component');
  console.error('   Resources: ds://components, ds://registry, ds://categories');

  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error('✅ Server connected and ready');

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
