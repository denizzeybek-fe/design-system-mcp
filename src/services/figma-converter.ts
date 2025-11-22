/**
 * Figma to Design System Code Conversion Service
 *
 * Converts Figma designs to Vue component code using Design System components
 */

import {
  FIGMA_COMPONENT_MAPPINGS,
  FigmaComponentMapping,
  findMapping,
  parseFigmaName,
  transformProps,
} from '../registry/figma-mappings.js';
import { getComponentByName } from '../registry/combined-loader.js';

export interface FigmaNode {
  /** Node ID from Figma */
  id: string;
  /** Node name (e.g., "Button/Primary" or "Save Button") */
  name: string;
  /** Node type (COMPONENT, INSTANCE, FRAME, etc.) */
  type: string;
  /** Component name if this is a component instance */
  componentName?: string;
  /** Properties/Variants from Figma */
  properties?: Record<string, any>;
  /** Child nodes */
  children?: FigmaNode[];
  /** Absolute bounding box */
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Text content (for TEXT nodes) */
  characters?: string;
  /** Fills, strokes, effects, etc. */
  styles?: Record<string, any>;
}

export interface FigmaFrame {
  /** Frame name */
  name: string;
  /** Frame ID */
  id: string;
  /** Root node */
  node: FigmaNode;
}

export interface ConversionResult {
  /** Generated Vue component code */
  code: string;
  /** Component name */
  componentName: string;
  /** Used Design System components */
  imports: string[];
  /** Conversion warnings/notes */
  warnings: string[];
  /** Props that need manual setup */
  manualProps: ManualProp[];
}

export interface ManualProp {
  componentId: string;
  componentName: string;
  propName: string;
  reason: string;
  suggestedValue?: string;
}

/**
 * Convert Figma frame to Vue component code
 */
export function convertFigmaFrameToVue(
  frame: FigmaFrame,
  options: ConversionOptions = {}
): ConversionResult {
  const {
    componentName = toPascalCase(frame.name),
    includeScript = true,
    includeComments = true,
    scriptLang = 'ts',
  } = options;

  const context: ConversionContext = {
    imports: new Set(),
    warnings: [],
    manualProps: [],
    idCounter: 1,
  };

  // Convert the frame's children to template
  const templateContent = convertNodeToTemplate(frame.node, context, includeComments);

  // Generate component code
  let code = '<template>\n';
  code += `  <div class="${kebabCase(componentName)}">\n`;
  code += templateContent
    .split('\n')
    .map(line => (line ? '    ' + line : ''))
    .join('\n');
  code += '\n  </div>\n';
  code += '</template>\n';

  if (includeScript) {
    code += '\n';
    code += generateScript(Array.from(context.imports), scriptLang, context);
  }

  return {
    code,
    componentName,
    imports: Array.from(context.imports),
    warnings: context.warnings,
    manualProps: context.manualProps,
  };
}

export interface ConversionOptions {
  /** Generated component name */
  componentName?: string;
  /** Include script section */
  includeScript?: boolean;
  /** Include helpful comments in code */
  includeComments?: boolean;
  /** Script language (js or ts) */
  scriptLang?: 'js' | 'ts';
}

interface ConversionContext {
  imports: Set<string>;
  warnings: string[];
  manualProps: ManualProp[];
  idCounter: number;
}

/**
 * Convert a Figma node to template code
 */
function convertNodeToTemplate(
  node: FigmaNode,
  context: ConversionContext,
  includeComments: boolean,
  indent: number = 0
): string {
  // Skip hidden nodes
  if (node.name.startsWith('_') || node.name.startsWith('.')) {
    return '';
  }

  // Handle component instances
  if (node.type === 'INSTANCE' && node.componentName) {
    return convertComponentInstance(node, context, includeComments, indent);
  }

  // Handle frames/groups as divs
  if (node.type === 'FRAME' || node.type === 'GROUP') {
    return convertFrameToDiv(node, context, includeComments, indent);
  }

  // Handle text nodes
  if (node.type === 'TEXT' && node.characters) {
    return convertTextNode(node, indent);
  }

  // Skip other node types for now
  return '';
}

/**
 * Convert Figma component instance to DS component
 */
function convertComponentInstance(
  node: FigmaNode,
  context: ConversionContext,
  includeComments: boolean,
  indent: number
): string {
  const componentName = node.componentName || node.name;
  const instanceName = node.name;

  // Find mapping
  const mapping = findMapping(componentName);

  if (!mapping) {
    context.warnings.push(
      `No mapping found for component "${componentName}". Using generic div instead.`
    );
    return convertUnmappedComponent(node, context, indent);
  }

  // Get DS component info
  const dsComponent = getComponentByName(mapping.dsComponent);

  if (!dsComponent) {
    context.warnings.push(
      `Design System component "${mapping.dsComponent}" not found in registry.`
    );
    return convertUnmappedComponent(node, context, indent);
  }

  // Add import
  context.imports.add(mapping.dsComponent);

  // Parse component name for variants
  const { variants } = parseFigmaName(componentName);

  // Build props from Figma properties and variants
  const figmaProps: Record<string, any> = { ...node.properties };

  // Add variants as properties
  variants.forEach((variant, index) => {
    figmaProps[`variant${index + 1}`] = variant;
  });

  // Transform to DS props
  const dsProps = transformProps(mapping, figmaProps);

  // Generate component ID from instance name
  const componentId = generateId(instanceName, context);
  dsProps.id = componentId;

  // Build component tag
  let code = '';

  if (includeComments) {
    code += `${' '.repeat(indent)}<!-- ${instanceName} -->\n`;
  }

  code += `${' '.repeat(indent)}<${mapping.dsComponent}`;

  // Add props
  const propsEntries = Object.entries(dsProps);

  if (propsEntries.length > 0) {
    code += '\n';
    propsEntries.forEach(([key, value]) => {
      const propLine = formatProp(key, value);
      code += `${' '.repeat(indent + 2)}${propLine}\n`;
    });
    code += `${' '.repeat(indent)}`;
  }

  // Check for required props
  checkRequiredProps(dsComponent, dsProps, componentId, instanceName, context);

  // Check if component has slots
  if (dsComponent.slots && dsComponent.slots.length > 0) {
    code += '>\n';

    // Add slot content or placeholder
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        const childCode = convertNodeToTemplate(child, context, includeComments, indent + 2);
        if (childCode) {
          code += childCode + '\n';
        }
      });
    } else if (includeComments) {
      code += `${' '.repeat(indent + 2)}<!-- Add content here -->\n`;
    }

    code += `${' '.repeat(indent)}</${mapping.dsComponent}>`;
  } else {
    code += ' />';
  }

  return code;
}

/**
 * Convert unmapped component to div
 */
function convertUnmappedComponent(
  node: FigmaNode,
  context: ConversionContext,
  indent: number
): string {
  return `${' '.repeat(indent)}<div class="${kebabCase(node.name)}">\n` +
    `${' '.repeat(indent + 2)}<!-- Unmapped: ${node.name} -->\n` +
    `${' '.repeat(indent)}</div>`;
}

/**
 * Convert frame/group to div
 */
function convertFrameToDiv(
  node: FigmaNode,
  context: ConversionContext,
  includeComments: boolean,
  indent: number
): string {
  let code = `${' '.repeat(indent)}<div class="${kebabCase(node.name)}">\n`;

  if (node.children) {
    node.children.forEach(child => {
      const childCode = convertNodeToTemplate(child, context, includeComments, indent + 2);
      if (childCode) {
        code += childCode + '\n';
      }
    });
  }

  code += `${' '.repeat(indent)}</div>`;
  return code;
}

/**
 * Convert text node
 */
function convertTextNode(node: FigmaNode, indent: number): string {
  const text = node.characters || '';
  return `${' '.repeat(indent)}<span>${escapeHtml(text)}</span>`;
}

/**
 * Format prop for template
 */
function formatProp(key: string, value: any): string {
  const kebabKey = kebabCase(key);

  if (typeof value === 'boolean') {
    return value ? `:${kebabKey}="true"` : `:${kebabKey}="false"`;
  }

  if (typeof value === 'string') {
    return `${kebabKey}="${value}"`;
  }

  if (typeof value === 'number') {
    return `:${kebabKey}="${value}"`;
  }

  if (Array.isArray(value) || typeof value === 'object') {
    return `:${kebabKey}='${JSON.stringify(value)}'`;
  }

  return `${kebabKey}="${String(value)}"`;
}

/**
 * Check for required props
 */
function checkRequiredProps(
  component: any,
  providedProps: Record<string, any>,
  componentId: string,
  instanceName: string,
  context: ConversionContext
): void {
  if (!component.props) return;

  for (const [propName, propDef] of Object.entries(component.props)) {
    if ((propDef as any).required && !(propName in providedProps)) {
      context.manualProps.push({
        componentId,
        componentName: instanceName,
        propName,
        reason: 'Required prop missing',
      });
    }
  }
}

/**
 * Generate script section
 */
function generateScript(
  imports: string[],
  scriptLang: 'js' | 'ts',
  context: ConversionContext
): string {
  let code = `<script setup${scriptLang === 'ts' ? ' lang="ts"' : ''}>\n`;

  // Imports
  if (imports.length > 0) {
    code += `import { ${imports.join(', ')} } from '@useinsider/design-system-vue';\n`;
    code += `import '@useinsider/design-system-vue/dist/design-system-vue.css';\n`;
  }

  // Add reactive state for manual props if any
  if (context.manualProps.length > 0) {
    code += '\n// TODO: Setup these required props:\n';
    context.manualProps.forEach(mp => {
      code += `// ${mp.componentId}: ${mp.propName} - ${mp.reason}\n`;
    });
  }

  code += '</script>\n';
  return code;
}

/**
 * Generate unique ID from name
 */
function generateId(name: string, context: ConversionContext): string {
  const base = kebabCase(name);
  const id = `${base}-${context.idCounter}`;
  context.idCounter++;
  return id;
}

/**
 * Utility: Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Utility: Convert string to kebab-case
 */
function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Utility: Escape HTML
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Get all available Figma mappings
 */
export function getAllMappings(): FigmaComponentMapping[] {
  return FIGMA_COMPONENT_MAPPINGS;
}

/**
 * Validate Figma component name
 */
export function validateFigmaComponentName(name: string): {
  valid: boolean;
  mapping?: FigmaComponentMapping;
  suggestions?: string[];
} {
  const mapping = findMapping(name);

  if (mapping) {
    return { valid: true, mapping };
  }

  // Find similar mappings
  const suggestions = FIGMA_COMPONENT_MAPPINGS
    .filter(m => {
      const pattern = typeof m.figmaPattern === 'string'
        ? m.figmaPattern
        : m.figmaPattern.source;
      return name.toLowerCase().includes(pattern.toLowerCase().replace(/\^|\$|\//gi, ''));
    })
    .map(m => m.dsComponent);

  return {
    valid: false,
    suggestions: suggestions.slice(0, 3),
  };
}
