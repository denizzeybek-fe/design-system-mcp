#!/usr/bin/env tsx
/**
 * Auto-Enrich Script
 *
 * Automatically updates enrichment files when components change.
 *
 * Usage:
 *   npm run extract:enrich              # Check all components
 *   npm run extract:enrich InButtonV2   # Check specific component
 *
 * What it does:
 * 1. Compares data/components.json with existing enrichments
 * 2. Detects changes in props/events
 * 3. Generates prompts for enrichment-maker agent
 * 4. Optionally invokes Claude Code to update enrichments
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

interface Component {
  name: string;
  props: Record<string, any>;
  emits: any[];
  enriched: boolean;
}

interface EnrichmentMetadata {
  lastUpdated: string;
  propsHash: string;
  eventsHash: string;
  propCount: number;
  eventCount: number;
  componentVersion?: string;
}

interface EnrichmentFile {
  component: string;
  _metadata?: EnrichmentMetadata;
  propEnrichments?: Record<string, any>;
  eventEnrichments?: Record<string, any>;
  codeSnippets?: {
    template?: Record<string, string> | string;
    script?: string;
    style?: string;
  };
  styling?: Record<string, any>;
  examples?: any[];
  implementationPatterns?: any[];
  useCases?: any[];
  bestPractices?: any[];
  [key: string]: any;
}

// Paths
const COMPONENTS_PATH = resolve('data/components.json');
const ENRICHMENTS_DIR = resolve('src/registry/enrichments');
const OUTPUT_PATH = resolve('scripts/.enrichment-queue.json');

// Calculate hash for object
function calculateHash(obj: any): string {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  return createHash('sha256').update(str).digest('hex').substring(0, 12);
}

// Generate metadata for component
function generateMetadata(component: Component): EnrichmentMetadata {
  return {
    lastUpdated: new Date().toISOString(),
    propsHash: calculateHash(component.props),
    eventsHash: calculateHash(component.emits),
    propCount: Object.keys(component.props).length,
    eventCount: component.emits.length
  };
}

// Load component metadata
function loadComponents(): Record<string, Component> {
  if (!existsSync(COMPONENTS_PATH)) {
    console.error('❌ components.json not found. Run: npm run extract:components');
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(COMPONENTS_PATH, 'utf-8'));
  // components.json is direct object, not wrapped in { components: {} }
  return data;
}

// Load existing enrichment
function loadEnrichment(componentName: string): EnrichmentFile | null {
  const enrichmentPath = resolve(ENRICHMENTS_DIR, `${componentName}.json`);
  if (!existsSync(enrichmentPath)) {
    return null;
  }
  return JSON.parse(readFileSync(enrichmentPath, 'utf-8'));
}

// Detect what changed in a component
function detectChanges(
  component: Component,
  existingEnrichment: EnrichmentFile | null
): {
  hasChanges: boolean;
  reasons: string[];
  newProps: string[];
  changedProps: string[];
  newEvents: string[];
  missingEnrichments: string[];
  metadataOutdated: boolean;
} {
  const result = {
    hasChanges: false,
    reasons: [] as string[],
    newProps: [] as string[],
    changedProps: [] as string[],
    newEvents: [] as string[],
    missingEnrichments: [] as string[],
    metadataOutdated: false
  };

  if (!existingEnrichment) {
    // No enrichment exists - everything is "new"
    result.hasChanges = true;
    result.reasons.push('No enrichment file exists');
    result.missingEnrichments = Object.keys(component.props);
    return result;
  }

  // Generate current metadata
  const currentMetadata = generateMetadata(component);
  const existingMetadata = existingEnrichment._metadata;

  // Check metadata-based changes (HYBRID APPROACH)
  if (existingMetadata) {
    // 1. Hash-based detection (most reliable)
    if (existingMetadata.propsHash !== currentMetadata.propsHash) {
      result.hasChanges = true;
      result.metadataOutdated = true;
      result.reasons.push(`Props changed (hash: ${existingMetadata.propsHash} → ${currentMetadata.propsHash})`);
    }

    if (existingMetadata.eventsHash !== currentMetadata.eventsHash) {
      result.hasChanges = true;
      result.metadataOutdated = true;
      result.reasons.push(`Events changed (hash: ${existingMetadata.eventsHash} → ${currentMetadata.eventsHash})`);
    }

    // 2. Count-based detection (quick check)
    if (existingMetadata.propCount !== currentMetadata.propCount) {
      result.hasChanges = true;
      result.reasons.push(`Prop count changed: ${existingMetadata.propCount} → ${currentMetadata.propCount}`);
    }

    if (existingMetadata.eventCount !== currentMetadata.eventCount) {
      result.hasChanges = true;
      result.reasons.push(`Event count changed: ${existingMetadata.eventCount} → ${currentMetadata.eventCount}`);
    }
  } else {
    // No metadata - old enrichment format, needs update
    result.hasChanges = true;
    result.metadataOutdated = true;
    result.reasons.push('Missing _metadata (old enrichment format)');
  }

  const enrichedProps = Object.keys(existingEnrichment.propEnrichments || {});
  const enrichedEvents = Object.keys(existingEnrichment.eventEnrichments || {});

  // Check for new props (specific detection)
  for (const propName of Object.keys(component.props)) {
    if (!enrichedProps.includes(propName)) {
      const prop = component.props[propName];
      // Only flag complex props as needing enrichment
      if (prop.type === 'Object' || prop.type === 'Array' || prop.type === 'Function') {
        result.newProps.push(propName);
        result.hasChanges = true;
      }
    }
  }

  // Check for new events
  for (const event of component.emits) {
    const eventName = typeof event === 'string' ? event : event.name;
    if (!enrichedEvents.includes(eventName)) {
      result.newEvents.push(eventName);
      result.hasChanges = true;
    }
  }

  // Check for missing critical sections (v2 schema)
  const criticalSections: Array<keyof EnrichmentFile> = [
    'codeSnippets',
    'styling',
    'examples',
    'bestPractices',
    'implementationPatterns'
  ];

  for (const section of criticalSections) {
    const value = existingEnrichment[section];
    const isEmpty = !value ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0);

    if (isEmpty) {
      result.missingEnrichments.push(section as string);
      result.hasChanges = true;
    }
  }

  // Add specific reasons for what's missing
  if (result.newProps.length > 0) {
    result.reasons.push(`${result.newProps.length} new complex props: ${result.newProps.join(', ')}`);
  }
  if (result.newEvents.length > 0) {
    result.reasons.push(`${result.newEvents.length} new events: ${result.newEvents.join(', ')}`);
  }
  if (result.missingEnrichments.length > 0) {
    result.reasons.push(`Missing sections: ${result.missingEnrichments.join(', ')}`);
  }

  return result;
}

// Generate enrichment task
function generateTask(
  componentName: string,
  component: Component,
  changes: ReturnType<typeof detectChanges>
): {
  component: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  prompt: string;
  metadata: EnrichmentMetadata;
} {
  let priority: 'high' | 'medium' | 'low' = 'low';

  // Priority logic
  if (!existsSync(resolve(ENRICHMENTS_DIR, `${componentName}.json`))) {
    priority = 'high';
  } else if (changes.metadataOutdated || changes.newProps.length > 1) {
    priority = 'high';
  } else if (changes.newProps.length > 0 || changes.newEvents.length > 0 || changes.missingEnrichments.length > 2) {
    priority = 'medium';
  }

  const prompt = generatePrompt(componentName, changes);
  const metadata = generateMetadata(component);

  return {
    component: componentName,
    priority,
    reason: changes.reasons.join(' | '),
    prompt,
    metadata
  };
}

// Generate prompt for enrichment-maker agent
function generatePrompt(
  componentName: string,
  changes: ReturnType<typeof detectChanges>
): string {
  const parts: string[] = [];

  if (!existsSync(resolve(ENRICHMENTS_DIR, `${componentName}.json`))) {
    parts.push(`Create comprehensive enrichment for ${componentName}.`);
  } else {
    parts.push(`Update enrichment for ${componentName}.`);
  }

  // Add specific change details
  if (changes.metadataOutdated) {
    parts.push(`\n⚠️  Component props/events have changed - enrichment is OUTDATED!`);
  }

  if (changes.newProps.length > 0) {
    parts.push(`\nNew props to document: ${changes.newProps.join(', ')}`);
  }

  if (changes.newEvents.length > 0) {
    parts.push(`\nNew events to document: ${changes.newEvents.join(', ')}`);
  }

  if (changes.missingEnrichments.length > 0) {
    parts.push(`\nAdd missing v2 sections: ${changes.missingEnrichments.join(', ')}`);
  }

  parts.push('\nFollow the enrichment-maker agent workflow:');
  parts.push('1. Use mcp__design-system__get-component to get full component details');
  parts.push('2. Read InRibbons.json as gold standard template');
  parts.push('3. Focus on codeSnippets, styling, examples, implementationPatterns, bestPractices');
  parts.push('4. Update or create enrichment file with new v2 schema');
  parts.push('5. IMPORTANT: Add _metadata section with current props/events hash');

  return parts.join('\n');
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const specificComponent = args[0];

  console.log('🔍 Analyzing components for enrichment updates...\n');

  const components = loadComponents();
  const tasks: Array<ReturnType<typeof generateTask>> = [];

  console.log(`📦 Found ${Object.keys(components).length} components to analyze\n`);

  for (const [name, component] of Object.entries(components)) {
    // Skip if specific component requested and this isn't it
    if (specificComponent && name !== specificComponent) {
      continue;
    }

    const existingEnrichment = loadEnrichment(name);
    const changes = detectChanges(component, existingEnrichment);

    if (changes.hasChanges) {
      const task = generateTask(name, component, changes);
      tasks.push(task);
    }
  }

  if (tasks.length === 0) {
    console.log('✅ All enrichments are up to date!');
    return;
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  console.log(`📋 Found ${tasks.length} component(s) needing enrichment:\n`);

  // Display summary
  tasks.forEach((task, i) => {
    const emoji = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
    console.log(`${i + 1}. ${emoji} ${task.component} [${task.priority.toUpperCase()}]`);
    console.log(`   Reason: ${task.reason}`);
    console.log(`   Metadata: ${task.metadata.propCount} props, ${task.metadata.eventCount} events`);
    console.log(`   Hash: props=${task.metadata.propsHash.substring(0, 8)}... events=${task.metadata.eventsHash.substring(0, 8)}...`);
    console.log('');
  });

  // Save queue for manual/automated processing
  writeFileSync(OUTPUT_PATH, JSON.stringify(tasks, null, 2));
  console.log(`💾 Enrichment queue saved to: ${OUTPUT_PATH}\n`);

  // Generate manual commands
  console.log('📝 Manual Process (run these commands):');
  console.log('─────────────────────────────────────');
  tasks.forEach((task, i) => {
    console.log(`\n# ${i + 1}. ${task.component}`);
    console.log(`echo "${task.prompt.replace(/"/g, '\\"')}" | claude`);
    console.log(`npm run extract:merge && npm run build`);
  });

  console.log('\n\n🤖 Or use automated enrichment (if Claude Code CLI available):');
  console.log('─────────────────────────────────────────────────────────');
  console.log('npm run extract:enrich:auto');

  console.log('\n\n💡 Tips:');
  console.log('• Focus on HIGH priority components first');
  console.log('• Reference InRibbons.json for complete examples');
  console.log('• Run "npm run extract:merge && npm run build" after each enrichment');
}

main();
