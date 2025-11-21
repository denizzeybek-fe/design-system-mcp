import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';

/**
 * Create and configure the MCP server
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'insider-design-system',
    version: '1.0.0',
  });

  // Register all tools
  registerTools(server);

  // Register all resources
  registerResources(server);

  return server;
}
