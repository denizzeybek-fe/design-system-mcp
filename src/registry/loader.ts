import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Registry, RegistrySchema, Component, FigmaMapping } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cachedRegistry: Registry | null = null;

/**
 * Load the component registry from JSON file
 */
export function loadRegistry(): Registry {
  if (cachedRegistry) {
    return cachedRegistry;
  }

  try {
    const registryPath = join(__dirname, 'components.json');
    const rawData = readFileSync(registryPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Validate against schema
    cachedRegistry = RegistrySchema.parse(data);
    return cachedRegistry;
  } catch (error) {
    // Return empty registry if file doesn't exist yet
    console.error('Failed to load registry:', error);
    return {
      version: '0.0.0',
      lastUpdated: new Date().toISOString(),
      components: [],
    };
  }
}

/**
 * Get all components from registry
 */
export function getAllComponents(): Component[] {
  const registry = loadRegistry();
  return registry.components;
}

/**
 * Get component by name
 */
export function getComponentByName(name: string): Component | undefined {
  const components = getAllComponents();
  return components.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Search components by query
 */
export function searchComponents(query: string): Component[] {
  const components = getAllComponents();
  const lowerQuery = query.toLowerCase();

  return components.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): Component[] {
  const components = getAllComponents();
  return components.filter(
    (c) => c.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const components = getAllComponents();
  const categories = new Set(components.map((c) => c.category));
  return Array.from(categories).sort();
}

/**
 * Figma component name to DS component mapping
 */
const figmaMappings: FigmaMapping[] = [
  { figmaName: 'Button/Primary', component: 'InButton', defaultProps: { variant: 'primary' } },
  { figmaName: 'Button/Secondary', component: 'InButton', defaultProps: { variant: 'secondary' } },
  { figmaName: 'Button/Ghost', component: 'InButton', defaultProps: { variant: 'ghost' } },
  { figmaName: 'Input/Text', component: 'InInput', defaultProps: { type: 'text' } },
  { figmaName: 'Input/Password', component: 'InInput', defaultProps: { type: 'password' } },
  { figmaName: 'DatePicker/Single', component: 'InDatePickerV2', defaultProps: { range: false } },
  { figmaName: 'DatePicker/Range', component: 'InDatePickerV2', defaultProps: { range: true } },
  { figmaName: 'DatePicker/Compare', component: 'InDatePickerV2', defaultProps: { compare: true } },
  { figmaName: 'Select/Single', component: 'InSelect', defaultProps: { multiple: false } },
  { figmaName: 'Select/Multiple', component: 'InSelect', defaultProps: { multiple: true } },
  { figmaName: 'Checkbox', component: 'InCheckbox', defaultProps: {} },
  { figmaName: 'Radio', component: 'InRadio', defaultProps: {} },
  { figmaName: 'Toggle', component: 'InToggle', defaultProps: {} },
  { figmaName: 'Modal', component: 'InModal', defaultProps: {} },
  { figmaName: 'Toast', component: 'InToast', defaultProps: {} },
  { figmaName: 'Tooltip', component: 'InTooltip', defaultProps: {} },
  { figmaName: 'Table', component: 'InTable', defaultProps: {} },
  { figmaName: 'Tabs', component: 'InTabs', defaultProps: {} },
];

/**
 * Map Figma component name to DS component
 */
export function mapFigmaComponent(figmaName: string): FigmaMapping | undefined {
  // Exact match first
  let mapping = figmaMappings.find(
    (m) => m.figmaName.toLowerCase() === figmaName.toLowerCase()
  );

  if (mapping) return mapping;

  // Partial match
  mapping = figmaMappings.find(
    (m) => figmaName.toLowerCase().includes(m.figmaName.toLowerCase().split('/')[0])
  );

  return mapping;
}

/**
 * Clear cached registry (useful for testing or hot-reload)
 */
export function clearRegistryCache(): void {
  cachedRegistry = null;
}
