/**
 * Figma Integration Tools for MCP
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  convertFigmaFrameToVue,
  validateFigmaComponentName,
  getAllMappings,
  FigmaFrame,
} from '../services/figma-converter.js';
import { findMapping } from '../registry/figma-mappings.js';
import { getComponentByName } from '../registry/combined-loader.js';

/**
 * Register Figma integration tools
 */
export function registerFigmaTools(server: McpServer): void {
  // List all Figma to DS mappings
  server.tool(
    'list-figma-mappings',
    'List all available Figma component to Design System component mappings',
    {},
    async () => {
      const mappings = getAllMappings();

      const result = {
        total: mappings.length,
        mappings: mappings.map(m => ({
          figmaPattern: typeof m.figmaPattern === 'string'
            ? m.figmaPattern
            : m.figmaPattern.source,
          dsComponent: m.dsComponent,
          defaultProps: m.defaultProps,
          propMappings: m.propMappings?.map(pm => ({
            figmaProperty: pm.figmaProperty,
            dsProp: pm.dsProp,
            required: pm.required,
          })),
          examples: m.examples,
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

  // Validate Figma component name
  server.tool(
    'validate-figma-component',
    'Check if a Figma component name can be mapped to a Design System component',
    {
      figmaComponentName: z.string().describe('Figma component name (e.g., "Button/Primary")'),
    },
    async ({ figmaComponentName }) => {
      const validation = validateFigmaComponentName(figmaComponentName);

      if (validation.valid && validation.mapping) {
        const dsComponent = getComponentByName(validation.mapping.dsComponent);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  valid: true,
                  figmaName: figmaComponentName,
                  dsComponent: validation.mapping.dsComponent,
                  mapping: {
                    defaultProps: validation.mapping.defaultProps,
                    propMappings: validation.mapping.propMappings,
                  },
                  componentInfo: dsComponent
                    ? {
                        description: dsComponent.description,
                        propsCount: Object.keys(dsComponent.props).length,
                        eventsCount: dsComponent.emits.length,
                        enriched: dsComponent.enriched,
                      }
                    : null,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                valid: false,
                figmaName: figmaComponentName,
                message: 'No mapping found for this component name',
                suggestions: validation.suggestions,
                hint: 'Use list-figma-mappings to see all available mappings',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Convert Figma frame to Vue component
  server.tool(
    'convert-figma-to-vue',
    'Convert a Figma frame/screen to Vue component code using Design System components',
    {
      frame: z.object({
        name: z.string().describe('Frame name'),
        id: z.string().describe('Frame ID'),
        node: z.any().describe('Figma node tree'),
      }).describe('Figma frame data'),
      options: z.object({
        componentName: z.string().optional().describe('Custom component name'),
        includeScript: z.boolean().optional().describe('Include script section (default: true)'),
        includeComments: z.boolean().optional().describe('Include helpful comments (default: true)'),
        scriptLang: z.enum(['js', 'ts']).optional().describe('Script language (default: ts)'),
      }).optional(),
    },
    async ({ frame, options }) => {
      try {
        const result = convertFigmaFrameToVue(frame as FigmaFrame, options);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  componentName: result.componentName,
                  code: result.code,
                  imports: result.imports,
                  warnings: result.warnings,
                  manualProps: result.manualProps,
                  stats: {
                    componentsUsed: result.imports.length,
                    warningsCount: result.warnings.length,
                    manualPropsCount: result.manualProps.length,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error.message,
                  stack: error.stack,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get DS component info for Figma component
  server.tool(
    'get-ds-for-figma',
    'Get Design System component information for a Figma component name',
    {
      figmaComponentName: z.string().describe('Figma component name'),
    },
    async ({ figmaComponentName }) => {
      const mapping = findMapping(figmaComponentName);

      if (!mapping) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  found: false,
                  figmaName: figmaComponentName,
                  message: 'No mapping found',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      const component = getComponentByName(mapping.dsComponent);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  found: false,
                  figmaName: figmaComponentName,
                  dsComponent: mapping.dsComponent,
                  message: 'Mapping found but DS component not in registry',
                },
                null,
                2
              ),
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
                found: true,
                figmaName: figmaComponentName,
                dsComponent: component,
                mapping: {
                  defaultProps: mapping.defaultProps,
                  propMappings: mapping.propMappings,
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

  // Generate code for single Figma component
  server.tool(
    'generate-figma-component',
    'Generate Vue code for a single Figma component with specific properties',
    {
      figmaComponentName: z.string().describe('Figma component name (e.g., "Button/Primary")'),
      instanceName: z.string().optional().describe('Instance name for ID generation'),
      properties: z.record(z.any()).optional().describe('Figma component properties'),
    },
    async ({ figmaComponentName, instanceName, properties = {} }) => {
      const mapping = findMapping(figmaComponentName);

      if (!mapping) {
        return {
          content: [
            {
              type: 'text',
              text: `No mapping found for "${figmaComponentName}"`,
            },
          ],
          isError: true,
        };
      }

      // Create a simple frame with single component
      const frame: FigmaFrame = {
        name: instanceName || 'Component',
        id: 'temp-id',
        node: {
          id: 'root',
          name: 'Root',
          type: 'FRAME',
          children: [
            {
              id: 'component-1',
              name: instanceName || figmaComponentName.split('/').join(' '),
              type: 'INSTANCE',
              componentName: figmaComponentName,
              properties,
            },
          ],
        },
      };

      const result = convertFigmaFrameToVue(frame, {
        includeScript: true,
        includeComments: false,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                figmaName: figmaComponentName,
                dsComponent: mapping.dsComponent,
                code: result.code,
                warnings: result.warnings,
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
