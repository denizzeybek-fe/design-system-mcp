import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types for combined dataset
interface CombinedComponent {
  name: string;
  title: string;
  description: string;
  version: 'v1' | 'v2';
  category?: string;
  props: Record<string, any>;
  emits: any[];
  slots: string[];
  enums: any[];
  examples?: any[];
  totalUsages?: number;
  usagePatterns?: any[];
  commonMistakes?: any[];
  mostUsedProps?: any[];
  mostUsedEvents?: any[];
  enriched?: boolean;
  propEnrichments?: Record<string, any>;
  eventEnrichments?: Record<string, any>;
  helperFunctions?: any[];
  performanceNotes?: any[];
  accessibilityNotes?: any[];
  migrationAvailable?: boolean;
  migrationTo?: string;
  migrationFrom?: string;
}

interface CombinedDataset {
  _metadata: {
    version: string;
    generatedAt: string;
    sources: string[];
    totalComponents: number;
    enrichedComponents: number;
    componentsWithExamples: number;
    componentsWithUsage: number;
    componentsWithMigrations: number;
  };
  components: Record<string, CombinedComponent>;
  migrations: Record<string, any>;
}

// Cache for the combined dataset
let cachedDataset: CombinedDataset | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in development

/**
 * Loads the combined dataset from combined.json
 */
function loadCombinedDataset(): CombinedDataset {
  const isDev = process.env.NODE_ENV !== 'production';
  const now = Date.now();

  // Return cached dataset if still valid (except in dev mode)
  if (cachedDataset && !isDev && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedDataset;
  }

  // Path to combined.json
  // When running from built dist/index.js: dist -> data/combined.json
  // When running from source (unlikely): use relative path
  const dataPath = existsSync(join(__dirname, 'data/combined.json'))
    ? join(__dirname, 'data/combined.json')
    : join(__dirname, '../data/combined.json');

  if (!existsSync(dataPath)) {
    console.error(`❌ Combined dataset not found at: ${dataPath}`);
    console.error('Please run: npm run extract:all');

    // Return empty dataset
    return {
      _metadata: {
        version: '0.0.0',
        generatedAt: new Date().toISOString(),
        sources: [],
        totalComponents: 0,
        enrichedComponents: 0,
        componentsWithExamples: 0,
        componentsWithUsage: 0,
        componentsWithMigrations: 0
      },
      components: {},
      migrations: {}
    };
  }

  try {
    const content = readFileSync(dataPath, 'utf-8');
    cachedDataset = JSON.parse(content);
    cacheTimestamp = now;

    console.error(`✅ Loaded combined dataset: ${Object.keys(cachedDataset!.components).length} components`);
    console.error(`   Generated: ${cachedDataset!._metadata.generatedAt}`);
    console.error(`   Enriched: ${cachedDataset!._metadata.enrichedComponents} components`);
    console.error(`   With examples: ${cachedDataset!._metadata.componentsWithExamples} components`);
    console.error(`   With usage data: ${cachedDataset!._metadata.componentsWithUsage} components`);

    return cachedDataset!;
  } catch (error) {
    console.error('❌ Failed to load combined dataset:', error);
    throw error;
  }
}

/**
 * Get all components
 */
export function getAllComponents(): CombinedComponent[] {
  const dataset = loadCombinedDataset();
  return Object.values(dataset.components);
}

/**
 * Get component by name
 */
export function getComponentByName(name: string): CombinedComponent | null {
  const dataset = loadCombinedDataset();
  const component = dataset.components[name];

  if (!component) {
    return null;
  }

  // Enrich props with enum values
  if (component.enums && component.enums.length > 0) {
    Object.keys(component.props).forEach(propName => {
      const prop = component.props[propName];

      // If prop has validValues pointing to enum, resolve it
      if (prop.validValues && prop.validValues[0]?.startsWith('<from ')) {
        const enumName = prop.validValues[0].match(/<from (\w+)>/)?.[1];
        if (enumName) {
          const enumDef = component.enums.find(e => e.name === enumName);
          if (enumDef) {
            prop.validValues = Object.values(enumDef.values);
            prop.enumReference = enumName;
          }
        }
      }
    });
  }

  return component;
}

/**
 * Search components by query
 */
export function searchComponents(query: string): CombinedComponent[] {
  const dataset = loadCombinedDataset();
  const lowerQuery = query.toLowerCase();

  return Object.values(dataset.components).filter(component =>
    component.name.toLowerCase().includes(lowerQuery) ||
    component.title.toLowerCase().includes(lowerQuery) ||
    component.description.toLowerCase().includes(lowerQuery) ||
    component.category?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): CombinedComponent[] {
  const dataset = loadCombinedDataset();
  const lowerCategory = category.toLowerCase();

  return Object.values(dataset.components).filter(component =>
    component.category?.toLowerCase() === lowerCategory
  );
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const dataset = loadCombinedDataset();
  const categories = new Set<string>();

  Object.values(dataset.components).forEach(component => {
    if (component.category) {
      categories.add(component.category);
    }
  });

  return Array.from(categories).sort();
}

/**
 * Get migration guide
 */
export function getMigration(fromComponent: string, toComponent?: string): any | null {
  const dataset = loadCombinedDataset();

  // Search migrations
  for (const [_key, migration] of Object.entries(dataset.migrations)) {
    if (migration.fromComponent === fromComponent) {
      if (!toComponent || migration.toComponent === toComponent) {
        return migration;
      }
    }
  }

  return null;
}

/**
 * Get component usage statistics
 */
export function getComponentUsageStats(name: string): any | null {
  const component = getComponentByName(name);

  if (!component || !component.totalUsages) {
    return null;
  }

  return {
    totalUsages: component.totalUsages,
    mostUsedProps: component.mostUsedProps || [],
    mostUsedEvents: component.mostUsedEvents || [],
    commonMistakes: component.commonMistakes || [],
    patterns: component.usagePatterns?.slice(0, 10) || [] // Top 10 patterns
  };
}

/**
 * Get dataset metadata
 */
export function getMetadata(): any {
  const dataset = loadCombinedDataset();
  return dataset._metadata;
}

/**
 * Get components with migration available
 */
export function getComponentsWithMigration(): CombinedComponent[] {
  const dataset = loadCombinedDataset();
  return Object.values(dataset.components).filter(c => c.migrationAvailable);
}

/**
 * Map Figma component name to Design System component
 * (Legacy function for compatibility)
 */
export function mapFigmaComponent(figmaName: string): CombinedComponent | null {
  // Simple name mapping
  const mappings: Record<string, string> = {
    'Button': 'InButtonV2',
    'Input': 'InTextInput',
    'Dropdown': 'InSelect',
    'DatePicker': 'InDatePickerV2',
    'Checkbox': 'InCheckBoxV2',
    'Tooltip': 'InTooltipV2'
  };

  const dsName = mappings[figmaName] || figmaName;
  return getComponentByName(dsName);
}
