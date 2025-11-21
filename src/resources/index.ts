import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  getAllComponents,
  getComponentByName,
  getCategories,
  getMetadata,
} from '../registry/combined-loader.js';

/**
 * Register all resources with the MCP server
 */
export function registerResources(server: McpServer): void {
  // Static resource: All components list
  server.resource(
    'components-list',
    'ds://components',
    {
      description: 'List of all available Design System components',
      mimeType: 'application/json',
    },
    async () => {
      const components = getAllComponents();
      const categories = getCategories();

      return {
        contents: [
          {
            uri: 'ds://components',
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                total: components.length,
                categories,
                components: components.map((c) => ({
                  name: c.name,
                  description: c.description,
                  category: c.category,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Static resource: Registry metadata
  server.resource(
    'registry-info',
    'ds://registry',
    {
      description: 'Design System registry metadata and version info',
      mimeType: 'application/json',
    },
    async () => {
      const metadata = getMetadata();

      return {
        contents: [
          {
            uri: 'ds://registry',
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                version: metadata.version,
                generatedAt: metadata.generatedAt,
                totalComponents: metadata.totalComponents,
                enrichedComponents: metadata.enrichedComponents,
                sources: metadata.sources,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Dynamic resource: Individual component
  server.resource(
    'component',
    new ResourceTemplate('ds://component/{name}', { list: undefined }),
    {
      description: 'Detailed information about a specific component',
      mimeType: 'application/json',
    },
    async (uri, { name }) => {
      const componentName = Array.isArray(name) ? name[0] : name;
      const component = getComponentByName(componentName);

      if (!component) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify({ error: `Component "${componentName}" not found` }),
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    }
  );

  // Static resource: Categories
  server.resource(
    'categories',
    'ds://categories',
    {
      description: 'All component categories',
      mimeType: 'application/json',
    },
    async () => {
      const categories = getCategories();
      const components = getAllComponents();

      const categoriesWithCount = categories.map((cat) => ({
        name: cat,
        count: components.filter((c) => c.category === cat).length,
      }));

      return {
        contents: [
          {
            uri: 'ds://categories',
            mimeType: 'application/json',
            text: JSON.stringify(categoriesWithCount, null, 2),
          },
        ],
      };
    }
  );
}
