import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

// Configuration
const DATA_DIR = resolve('data');
const ENRICHMENTS_DIR = resolve('src/registry/enrichments');
const MIGRATIONS_DIR = resolve('src/registry/migrations');
const OUTPUT_PATH = resolve('data/combined.json');

// Type definitions
interface ComponentData {
  name: string;
  title: string;
  description: string;
  version: 'v1' | 'v2';
  props: Record<string, any>;
  emits: any[];
  enums: any[];
  slots: string[];
  category?: string;
  hasStorybook?: boolean;
}

interface StorybookData {
  component: string;
  examples: any[];
  description?: string;
  categories?: string[];
}

interface UsageData {
  component: string;
  totalUsages: number;
  patterns: any[];
  commonMistakes: any[];
  mostUsedProps: any[];
  mostUsedEvents: any[];
}

interface EnrichmentData {
  propEnrichments?: Record<string, any>;
  eventEnrichments?: Record<string, any>;
  exampleEnrichments?: any[];
  helperFunctions?: any[];
  commonMistakes?: any[];
  performanceNotes?: any[];
  accessibilityNotes?: any[];
  migrationNotes?: any;
}

interface MigrationData {
  fromComponent: string;
  toComponent: string;
  transformations: any[];
  helperFunctions?: any[];
}

interface CombinedComponent {
  // Base component data
  name: string;
  title: string;
  description: string;
  version: 'v1' | 'v2';
  category?: string;

  // Props & Events
  props: Record<string, any>;
  emits: any[];
  slots: string[];
  enums: any[];

  // Storybook examples
  examples?: any[];
  storybookDescription?: string;
  storybookCategories?: string[];

  // Real usage data
  totalUsages?: number;
  usagePatterns?: any[];
  commonMistakes?: any[];
  mostUsedProps?: any[];
  mostUsedEvents?: any[];

  // Manual enrichments
  enriched?: boolean;
  propEnrichments?: Record<string, any>;
  eventEnrichments?: Record<string, any>;
  helperFunctions?: any[];
  performanceNotes?: any[];
  accessibilityNotes?: any[];
  migrationNotes?: any;

  // Migration info
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
  migrations: Record<string, MigrationData>;
}

/**
 * Loads JSON file safely
 */
function loadJSON(filePath: string): any {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return null;
  }

  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * Loads all enrichment files
 */
function loadEnrichments(): Record<string, EnrichmentData> {
  const enrichments: Record<string, EnrichmentData> = {};

  if (!existsSync(ENRICHMENTS_DIR)) {
    console.warn(`⚠️  Enrichments directory not found: ${ENRICHMENTS_DIR}`);
    return enrichments;
  }

  const files = readdirSync(ENRICHMENTS_DIR).filter((f: string) => f.endsWith('.json'));

  for (const file of files) {
    const componentName = file.replace('.json', '');
    const data = loadJSON(join(ENRICHMENTS_DIR, file));
    if (data) {
      enrichments[componentName] = data;
    }
  }

  console.log(`📝 Loaded ${Object.keys(enrichments).length} enrichments`);
  return enrichments;
}

/**
 * Loads all migration files
 */
function loadMigrations(): Record<string, MigrationData> {
  const migrations: Record<string, MigrationData> = {};

  if (!existsSync(MIGRATIONS_DIR)) {
    console.warn(`⚠️  Migrations directory not found: ${MIGRATIONS_DIR}`);
    return migrations;
  }

  const files = readdirSync(MIGRATIONS_DIR).filter((f: string) => f.endsWith('.json'));

  for (const file of files) {
    const migrationName = file.replace('.json', '');
    const data = loadJSON(join(MIGRATIONS_DIR, file));
    if (data) {
      migrations[migrationName] = data;
    }
  }

  console.log(`🔄 Loaded ${Object.keys(migrations).length} migrations`);
  return migrations;
}

/**
 * Merges component data with all sources
 */
function mergeComponentData(
  component: ComponentData,
  storybook: Record<string, StorybookData>,
  usage: Record<string, UsageData>,
  enrichments: Record<string, EnrichmentData>,
  migrations: Record<string, MigrationData>
): CombinedComponent {
  const componentName = component.name;

  // Start with base component data
  const combined: CombinedComponent = {
    name: component.name,
    title: component.title,
    description: component.description,
    version: component.version,
    category: component.category,
    props: component.props,
    emits: component.emits,
    slots: component.slots,
    enums: component.enums
  };

  // Merge Storybook data
  const storybookData = storybook[componentName];
  if (storybookData) {
    combined.examples = storybookData.examples;
    combined.storybookDescription = storybookData.description;
    combined.storybookCategories = storybookData.categories;
  }

  // Merge usage data
  const usageData = usage[componentName];
  if (usageData) {
    combined.totalUsages = usageData.totalUsages;
    combined.usagePatterns = usageData.patterns;
    combined.commonMistakes = usageData.commonMistakes;
    combined.mostUsedProps = usageData.mostUsedProps;
    combined.mostUsedEvents = usageData.mostUsedEvents;
  }

  // Merge enrichments
  const enrichment = enrichments[componentName];
  if (enrichment) {
    combined.enriched = true;
    combined.propEnrichments = enrichment.propEnrichments;
    combined.eventEnrichments = enrichment.eventEnrichments;
    combined.helperFunctions = enrichment.helperFunctions;
    combined.performanceNotes = enrichment.performanceNotes;
    combined.accessibilityNotes = enrichment.accessibilityNotes;
    combined.migrationNotes = enrichment.migrationNotes;

    // Merge enrichment examples with storybook examples
    if (enrichment.exampleEnrichments) {
      combined.examples = [
        ...(combined.examples || []),
        ...enrichment.exampleEnrichments
      ];
    }

    // Merge enrichment mistakes with usage mistakes
    if (enrichment.commonMistakes) {
      combined.commonMistakes = [
        ...(combined.commonMistakes || []),
        ...enrichment.commonMistakes
      ];
    }
  }

  // Check for migrations
  const migrationKey = Object.keys(migrations).find(key => {
    const migration = migrations[key];
    return migration.fromComponent === componentName || migration.toComponent === componentName;
  });

  if (migrationKey) {
    const migration = migrations[migrationKey];
    combined.migrationAvailable = true;

    if (migration.fromComponent === componentName) {
      combined.migrationTo = migration.toComponent;
    }
    if (migration.toComponent === componentName) {
      combined.migrationFrom = migration.fromComponent;
    }
  }

  return combined;
}

/**
 * Main execution function
 */
function main(): void {
  console.log('🚀 Starting dataset merge...\n');

  // Load all datasets
  console.log('📂 Loading datasets...');
  const components = loadJSON(join(DATA_DIR, 'components.json')) || {};
  const storybook = loadJSON(join(DATA_DIR, 'storybook.json')) || {};
  const usage = loadJSON(join(DATA_DIR, 'usage.json')) || {};
  const enrichments = loadEnrichments();
  const migrations = loadMigrations();

  console.log('\n📊 Loaded:');
  console.log(`   Components: ${Object.keys(components).length}`);
  console.log(`   Storybook: ${Object.keys(storybook).length}`);
  console.log(`   Usage: ${Object.keys(usage).length}`);
  console.log(`   Enrichments: ${Object.keys(enrichments).length}`);
  console.log(`   Migrations: ${Object.keys(migrations).length}`);

  // Merge all data
  console.log('\n🔄 Merging datasets...');
  const combinedComponents: Record<string, CombinedComponent> = {};

  for (const [name, component] of Object.entries(components) as [string, ComponentData][]) {
    combinedComponents[name] = mergeComponentData(
      component,
      storybook,
      usage,
      enrichments,
      migrations
    );
  }

  // Create final dataset
  const dataset: CombinedDataset = {
    _metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      sources: ['components', 'storybook', 'usage', 'enrichments', 'migrations'],
      totalComponents: Object.keys(combinedComponents).length,
      enrichedComponents: Object.values(combinedComponents).filter(c => c.enriched).length,
      componentsWithExamples: Object.values(combinedComponents).filter(c => c.examples && c.examples.length > 0).length,
      componentsWithUsage: Object.values(combinedComponents).filter(c => c.totalUsages && c.totalUsages > 0).length,
      componentsWithMigrations: Object.values(combinedComponents).filter(c => c.migrationAvailable).length
    },
    components: combinedComponents,
    migrations
  };

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(dataset, null, 2));

  console.log(`\n✅ Successfully merged datasets`);
  console.log(`📁 Output written to: ${OUTPUT_PATH}`);

  // Calculate stats
  const fileSize = (readFileSync(OUTPUT_PATH, 'utf-8').length / 1024).toFixed(2);

  console.log('\n📊 Final Statistics:');
  console.log(`   Total Components: ${dataset._metadata.totalComponents}`);
  console.log(`   Enriched: ${dataset._metadata.enrichedComponents}`);
  console.log(`   With Examples: ${dataset._metadata.componentsWithExamples}`);
  console.log(`   With Usage Data: ${dataset._metadata.componentsWithUsage}`);
  console.log(`   With Migrations: ${dataset._metadata.componentsWithMigrations}`);
  console.log(`   File Size: ${fileSize} KB`);

  // Top components by enrichment
  const topEnriched = Object.entries(combinedComponents)
    .filter(([, c]) => c.enriched)
    .slice(0, 5);

  if (topEnriched.length > 0) {
    console.log('\n   Top Enriched Components:');
    topEnriched.forEach(([name, comp]) => {
      const propCount = Object.keys(comp.propEnrichments || {}).length;
      const exampleCount = (comp.examples || []).length;
      console.log(`   - ${name}: ${propCount} enriched props, ${exampleCount} examples`);
    });
  }

  // Top components by usage
  const topUsage = Object.entries(combinedComponents)
    .filter(([, c]) => c.totalUsages)
    .sort(([, a], [, b]) => (b.totalUsages || 0) - (a.totalUsages || 0))
    .slice(0, 5);

  if (topUsage.length > 0) {
    console.log('\n   Top Used Components:');
    topUsage.forEach(([name, comp]) => {
      console.log(`   - ${name}: ${comp.totalUsages} usages`);
    });
  }
}

// Execute
main();
