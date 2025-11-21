import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { globby } from 'globby';

// Configuration
const ANALYTICS_FE_PATH = process.env.ANALYTICS_FE_PATH || '/Users/deniz.zeybek/Documents/insider-projects/analytics-fe';
const OUTPUT_PATH = resolve('data/usage.json');

// Type definitions
interface UsagePattern {
  file: string;
  lineNumber: number;
  code: string;
  props: Record<string, any>;
  events: string[];
}

interface CommonMistake {
  mistake: string;
  occurrences: number;
  examples: string[];
  fix: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface UsageData {
  component: string;
  totalUsages: number;
  patterns: UsagePattern[];
  commonMistakes: CommonMistake[];
  mostUsedProps: Array<{ prop: string; count: number }>;
  mostUsedEvents: Array<{ event: string; count: number }>;
}

type UsageMap = Record<string, UsageData>;

/**
 * Extracts component usage from a Vue file
 */
function extractComponentUsage(content: string, componentName: string, filePath: string): UsagePattern[] {
  const patterns: UsagePattern[] = [];

  // Create regex to find component tags
  const tagRegex = new RegExp(`<${componentName}([^>]*?)(?:\\/?>|>([\\s\\S]*?)<\\/${componentName}>)`, 'g');
  let match;

  while ((match = tagRegex.exec(content))) {
    const fullMatch = match[0];
    const attributes = match[1];
    const innerContent = match[2];

    // Calculate line number
    const beforeMatch = content.substring(0, match.index);
    const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

    // Extract props from attributes
    const props: Record<string, any> = {};
    const events: string[] = [];

    if (attributes) {
      // Extract v-bind and : props
      const propRegex = /(?:v-bind)?:(\w+(?:-\w+)*)=["']([^"']+)["']|:(\w+(?:-\w+)*)="([^"]+)"/g;
      let propMatch;

      while ((propMatch = propRegex.exec(attributes))) {
        const propName = propMatch[1] || propMatch[3];
        const propValue = propMatch[2] || propMatch[4];
        props[propName] = propValue;
      }

      // Extract regular props
      const regularPropRegex = /(\w+(?:-\w+)*)=["']([^"']+)["']/g;
      while ((propMatch = regularPropRegex.exec(attributes))) {
        const propName = propMatch[1];
        // Skip if it's an event or already captured
        if (!propName.startsWith('@') && !propName.startsWith('v-') && !props[propName]) {
          props[propName] = propMatch[2];
        }
      }

      // Extract events
      const eventRegex = /@(\w+(?:-\w+)*)=/g;
      let eventMatch;

      while ((eventMatch = eventRegex.exec(attributes))) {
        events.push(eventMatch[1]);
      }
    }

    patterns.push({
      file: filePath,
      lineNumber,
      code: fullMatch.substring(0, 200), // Limit code length
      props,
      events
    });
  }

  return patterns;
}

/**
 * Analyzes patterns to find common mistakes
 */
function analyzeCommonMistakes(patterns: UsagePattern[], componentName: string): CommonMistake[] {
  const mistakes: CommonMistake[] = [];

  // Mistake 1: Using 'label' instead of 'text' in InSelect
  if (componentName === 'InSelect') {
    const labelUsages = patterns.filter(p =>
      p.code.includes('label:') && !p.code.includes('text:')
    );

    if (labelUsages.length > 0) {
      mistakes.push({
        mistake: "Using 'label' instead of 'text' in options array",
        occurrences: labelUsages.length,
        examples: labelUsages.slice(0, 3).map(p => `${p.file}:${p.lineNumber}`),
        fix: "Change options array structure from { label: '...' } to { text: '...' }",
        severity: 'critical'
      });
    }
  }

  // Mistake 2: Not wrapping value in array
  if (['InSelect', 'InDatePickerV2'].includes(componentName)) {
    const nonArrayValues = patterns.filter(p =>
      p.props.value && !p.props.value.startsWith('[')
    );

    if (nonArrayValues.length > 0) {
      mistakes.push({
        mistake: 'Not wrapping value in array',
        occurrences: nonArrayValues.length,
        examples: nonArrayValues.slice(0, 3).map(p => `${p.file}:${p.lineNumber}`),
        fix: `Wrap value in array: :value="[${componentName === 'InSelect' ? 'selectedValue' : 'dateRange'}]"`,
        severity: 'high'
      });
    }
  }

  // Mistake 3: Using number for iconSize in InButtonV2
  if (componentName === 'InButtonV2') {
    const numericIconSize = patterns.filter(p =>
      p.props.iconSize && /^\d+$/.test(p.props.iconSize)
    );

    if (numericIconSize.length > 0) {
      mistakes.push({
        mistake: 'Using number instead of string for iconSize',
        occurrences: numericIconSize.length,
        examples: numericIconSize.slice(0, 3).map(p => `${p.file}:${p.lineNumber}`),
        fix: "Change icon-size=\"24\" to icon-size=\"'24'\" (string, not number)",
        severity: 'medium'
      });
    }
  }

  // Mistake 4: Missing required labelText in InButtonV2
  if (componentName === 'InButtonV2') {
    const missingLabel = patterns.filter(p => !p.props.labelText && !p.props['label-text']);

    if (missingLabel.length > patterns.length * 0.3) { // If more than 30% missing
      mistakes.push({
        mistake: 'Missing labelText prop (accessibility issue)',
        occurrences: missingLabel.length,
        examples: missingLabel.slice(0, 3).map(p => `${p.file}:${p.lineNumber}`),
        fix: 'Add label-text="Descriptive text for screen readers"',
        severity: 'medium'
      });
    }
  }

  return mistakes;
}

/**
 * Calculates most used props and events
 */
function calculateMostUsed(patterns: UsagePattern[]): {
  mostUsedProps: Array<{ prop: string; count: number }>;
  mostUsedEvents: Array<{ event: string; count: number }>;
} {
  const propCounts: Record<string, number> = {};
  const eventCounts: Record<string, number> = {};

  patterns.forEach(pattern => {
    Object.keys(pattern.props).forEach(prop => {
      propCounts[prop] = (propCounts[prop] || 0) + 1;
    });

    pattern.events.forEach(event => {
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
  });

  const mostUsedProps = Object.entries(propCounts)
    .map(([prop, count]) => ({ prop, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const mostUsedEvents = Object.entries(eventCounts)
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { mostUsedProps, mostUsedEvents };
}

/**
 * Processes a single component's usage across analytics-fe
 */
async function analyzeComponentUsage(componentName: string): Promise<UsageData | null> {
  // Find all Vue files
  const files = await globby([
    `${ANALYTICS_FE_PATH}/src/**/*.vue`,
    `!${ANALYTICS_FE_PATH}/node_modules/**`,
    `!${ANALYTICS_FE_PATH}/dist/**`
  ]);

  const allPatterns: UsagePattern[] = [];

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');

      // Check if component is used
      if (content.includes(`<${componentName}`)) {
        const patterns = extractComponentUsage(content, componentName, file.replace(ANALYTICS_FE_PATH, ''));
        allPatterns.push(...patterns);
      }
    } catch (error) {
      // Silently skip files that can't be read
    }
  }

  if (allPatterns.length === 0) {
    return null;
  }

  const commonMistakes = analyzeCommonMistakes(allPatterns, componentName);
  const { mostUsedProps, mostUsedEvents } = calculateMostUsed(allPatterns);

  return {
    component: componentName,
    totalUsages: allPatterns.length,
    patterns: allPatterns.slice(0, 50), // Keep top 50 examples
    commonMistakes,
    mostUsedProps,
    mostUsedEvents
  };
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting usage analysis...\n');
  console.log(`📂 Analytics FE Path: ${ANALYTICS_FE_PATH}\n`);

  if (!existsSync(ANALYTICS_FE_PATH)) {
    console.error(`❌ Analytics FE directory not found: ${ANALYTICS_FE_PATH}`);
    console.error('Please set ANALYTICS_FE_PATH environment variable');
    process.exit(1);
  }

  // Load components list from extracted components
  const componentsPath = resolve('data/components.json');
  if (!existsSync(componentsPath)) {
    console.error('❌ Please run extract:components first');
    process.exit(1);
  }

  const componentsData = JSON.parse(readFileSync(componentsPath, 'utf-8'));
  const componentNames = Object.keys(componentsData);

  console.log(`🔍 Analyzing ${componentNames.length} components...\n`);

  const usage: UsageMap = {};

  for (const componentName of componentNames) {
    console.log(`🔍 Analyzing: ${componentName}`);

    const usageData = await analyzeComponentUsage(componentName);

    if (usageData) {
      usage[componentName] = usageData;
      console.log(`  ✅ Found ${usageData.totalUsages} usages, ${usageData.commonMistakes.length} common mistakes`);
    } else {
      console.log(`  ℹ️  No usages found`);
    }
  }

  // Write results
  writeFileSync(OUTPUT_PATH, JSON.stringify(usage, null, 2));

  console.log(`\n✅ Successfully analyzed usage for ${Object.keys(usage).length} components`);
  console.log(`📁 Output written to: ${OUTPUT_PATH}`);

  // Stats
  const totalUsages = Object.values(usage).reduce((sum, u) => sum + u.totalUsages, 0);
  const totalMistakes = Object.values(usage).reduce((sum, u) => sum + u.commonMistakes.length, 0);
  const mostUsed = Object.entries(usage)
    .sort((a, b) => b[1].totalUsages - a[1].totalUsages)
    .slice(0, 5);

  console.log('\n📊 Statistics:');
  console.log(`   Components with usage: ${Object.keys(usage).length}`);
  console.log(`   Total usages: ${totalUsages}`);
  console.log(`   Common mistakes found: ${totalMistakes}`);
  console.log('\n   Top 5 most used components:');
  mostUsed.forEach(([name, data], i) => {
    console.log(`   ${i + 1}. ${name}: ${data.totalUsages} usages`);
  });
}

// Execute
main().catch(console.error);
