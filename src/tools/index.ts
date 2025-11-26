import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  getAllComponents,
  getComponentByName,
  searchComponents,
  getComponentsByCategory,
  getCategories,
  mapFigmaComponent,
} from '../registry/combined-loader.js';
import {
  getComponentMarkdown,
  getMarkdownMetadata,
} from '../registry/markdown-loader.js';
import { Component } from '../types/index.js';

/**
 * Register all tools with the MCP server
 */
export function registerTools(server: McpServer): void {
  // List all components
  server.tool(
    'list-components',
    'List all available Design System components, optionally filtered by category',
    {
      category: z.string().optional().describe('Filter by component category (e.g., "Form", "Layout", "Feedback")'),
    },
    async ({ category }) => {
      const components = category
        ? getComponentsByCategory(category)
        : getAllComponents();

      const categories = getCategories();

      const result = {
        total: components.length,
        categories,
        components: components.map((c) => ({
          name: c.name,
          description: c.description,
          category: c.category,
        })),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // Get component details (Markdown format for 77% token savings)
  server.tool(
    'get-component',
    `Get detailed information about a specific Design System component in Markdown format.

    Returns component documentation in human-readable Markdown format with:
    - Props with types, defaults, and descriptions
    - Events with payloads
    - Examples with code snippets
    - Common mistakes and best practices
    - Related components

    Note: Markdown format provides 77% token savings compared to JSON.`,
    {
      name: z.string().describe('Component name (e.g., InButton, InDatePickerV2)'),
    },
    async ({ name }) => {
      // Try to load markdown first (77% token savings)
      const markdown = getComponentMarkdown(name);

      if (markdown) {
        // Get metadata for stats
        const mdMetadata = getMarkdownMetadata();
        const componentStats = mdMetadata?.components?.find((c: any) => c.name === name);

        return {
          content: [
            {
              type: 'text',
              text: markdown,
            },
          ],
          _meta: {
            format: 'markdown',
            tokensSaved: componentStats?.jsonSize
              ? Math.round((componentStats.jsonSize - componentStats.markdownSize) / 4)
              : undefined,
            savings: componentStats?.savings
              ? `${componentStats.savings}%`
              : '~77%',
          },
        };
      }

      // Fallback to JSON format if markdown not available
      const combinedComponent = getComponentByName(name);

      if (!combinedComponent) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${name}" not found. Use list-components to see available components.`,
            },
          ],
          isError: true,
        };
      }

      // Return JSON as fallback (with warning)
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(combinedComponent, null, 2),
          },
        ],
        _meta: {
          format: 'json',
          warning: 'Markdown format not available. Run: npm run generate:markdown',
        },
      };
    }
  );

  // Search components
  server.tool(
    'search-components',
    'Search for Design System components by name, description, or category',
    {
      query: z.string().describe('Search query'),
    },
    async ({ query }) => {
      const results = searchComponents(query);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                total: results.length,
                results: results.map((c) => ({
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

  // Get component props
  server.tool(
    'get-props',
    'Get detailed props information for a component with types, defaults, and descriptions',
    {
      name: z.string().describe('Component name'),
    },
    async ({ name }) => {
      const component = getComponentByName(name);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${name}" not found.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                component: component.name,
                props: component.props,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get component events
  server.tool(
    'get-events',
    'Get all events emitted by a component with their payloads',
    {
      name: z.string().describe('Component name'),
    },
    async ({ name }) => {
      const component = getComponentByName(name);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${name}" not found.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                component: component.name,
                events: component.emits,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get usage examples
  server.tool(
    'get-examples',
    'Get code examples for using a component',
    {
      name: z.string().describe('Component name'),
    },
    async ({ name }) => {
      const component = getComponentByName(name);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${name}" not found.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                component: component.name,
                examples: component.examples,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Generate component code
  server.tool(
    'generate-code',
    'Generate Vue component code with the specified props',
    {
      component: z.string().describe('Component name'),
      props: z.record(z.any()).optional().describe('Props to set on the component'),
      includeScript: z.boolean().optional().describe('Include script setup section (default: true)'),
    },
    async ({ component, props = {}, includeScript = true }) => {
      const comp = getComponentByName(component);

      if (!comp) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${component}" not found.`,
            },
          ],
          isError: true,
        };
      }

      const code = generateComponentCode(comp as any, props, includeScript);

      return {
        content: [
          {
            type: 'text',
            text: code,
          },
        ],
      };
    }
  );

  // Map Figma component to DS component
  server.tool(
    'map-figma-component',
    'Map a Figma component name to the corresponding Design System component with default props',
    {
      figmaComponentName: z.string().describe('Component name from Figma (e.g., "Button/Primary", "DatePicker/Range")'),
    },
    async ({ figmaComponentName }) => {
      const component = mapFigmaComponent(figmaComponentName);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  figmaName: figmaComponentName,
                  matched: false,
                  suggestion: 'No matching component found. Use search-components to find similar components.',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // TODO: Add defaultProps support when integrating with Figma MCP
      // The mapFigmaComponent should return props from figma-mappings.ts
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                figmaName: figmaComponentName,
                matched: true,
                dsComponent: component.name,
                componentInfo: {
                  description: component.description,
                  category: component.category,
                  propsCount: Object.keys(component.props).length,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}

/**
 * Generate Vue component code
 */
function generateComponentCode(
  component: Component,
  props: Record<string, unknown>,
  includeScript: boolean
): string {
  // Generate props string
  const propsEntries = Object.entries(props);
  const propsString = propsEntries
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? `:${key}="true"` : `:${key}="false"`;
      }
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      }
      return `:${key}="${JSON.stringify(value)}"`;
    })
    .join('\n    ');

  // Generate template
  const template = `<template>
  <${component.name}${propsString ? '\n    ' + propsString : ''}
  />
</template>`;

  if (!includeScript) {
    return template;
  }

  // Generate script
  const script = `
<script setup>
import { ${component.name} } from '@useinsider/design-system-vue';
import '@useinsider/design-system-vue/dist/design-system-vue.css';
</script>`;

  return template + '\n' + script;
}
