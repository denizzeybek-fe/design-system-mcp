import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load combined.json
const COMBINED_PATH = resolve('data/combined.json');
const combinedData = JSON.parse(readFileSync(COMBINED_PATH, 'utf-8'));

interface PropAnalysis {
  component: string;
  prop: string;
  type: string;
  hasEnrichment: boolean;
  default?: any;
}

interface ComponentAnalysis {
  component: string;
  version: 'v1' | 'v2';
  complexProps: PropAnalysis[];
  hasEnrichment: boolean;
  priority: 'high' | 'medium' | 'low';
}

const results: ComponentAnalysis[] = [];

// Analyze each component
for (const [componentName, component] of Object.entries(combinedData.components) as any) {
  const complexProps: PropAnalysis[] = [];

  // Check each prop
  for (const [propName, propData] of Object.entries(component.props || {}) as any) {
    const type = propData.type || '';

    // Check if prop is Array or Object
    if (type.includes('Array') || type.includes('Object')) {
      const hasEnrichment = component.enriched &&
                           component.propEnrichments &&
                           component.propEnrichments[propName];

      complexProps.push({
        component: componentName,
        prop: propName,
        type: type,
        hasEnrichment: !!hasEnrichment,
        default: propData.default
      });
    }
  }

  if (complexProps.length > 0) {
    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'low';

    // High priority: V2 components with multiple complex props
    if (component.version === 'v2' && complexProps.length >= 2) {
      priority = 'high';
    }
    // Medium priority: V2 components with 1 complex prop or V1 with multiple
    else if (component.version === 'v2' || complexProps.length >= 2) {
      priority = 'medium';
    }

    results.push({
      component: componentName,
      version: component.version,
      complexProps: complexProps,
      hasEnrichment: !!component.enriched,
      priority: priority
    });
  }
}

// Sort by priority and unenriched first
results.sort((a, b) => {
  // Priority order
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }

  // Unenriched first
  if (a.hasEnrichment !== b.hasEnrichment) {
    return a.hasEnrichment ? 1 : -1;
  }

  // More complex props first
  return b.complexProps.length - a.complexProps.length;
});

// Print results
console.log('================================================================================');
console.log('📊 COMPONENT ANALYSIS: Complex Props (Array/Object)');
console.log('================================================================================\n');

console.log(`Total Components: ${Object.keys(combinedData.components).length}`);
console.log(`Components with Complex Props: ${results.length}`);
console.log(`Already Enriched: ${results.filter(r => r.hasEnrichment).length}`);
console.log(`Need Enrichment: ${results.filter(r => !r.hasEnrichment).length}\n`);

// Group by priority
const needEnrichment = results.filter(r => !r.hasEnrichment);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔴 HIGH PRIORITY (V2 components with multiple complex props)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const highPriority = needEnrichment.filter(r => r.priority === 'high');
highPriority.forEach((result, index) => {
  console.log(`${index + 1}. ${result.component} (${result.version})`);
  result.complexProps.forEach(prop => {
    const status = prop.hasEnrichment ? '✅' : '❌';
    console.log(`   ${status} ${prop.prop}: ${prop.type}`);
  });
  console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🟡 MEDIUM PRIORITY (V2 with 1 complex prop or V1 with multiple)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const mediumPriority = needEnrichment.filter(r => r.priority === 'medium');
mediumPriority.forEach((result, index) => {
  console.log(`${index + 1}. ${result.component} (${result.version})`);
  result.complexProps.forEach(prop => {
    const status = prop.hasEnrichment ? '✅' : '❌';
    console.log(`   ${status} ${prop.prop}: ${prop.type}`);
  });
  console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('⚪ LOW PRIORITY (V1 components with single complex prop)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const lowPriority = needEnrichment.filter(r => r.priority === 'low');
console.log(`${lowPriority.length} components (showing first 10):\n`);
lowPriority.slice(0, 10).forEach((result, index) => {
  console.log(`${index + 1}. ${result.component} (${result.version})`);
  result.complexProps.forEach(prop => {
    const status = prop.hasEnrichment ? '✅' : '❌';
    console.log(`   ${status} ${prop.prop}: ${prop.type}`);
  });
  console.log('');
});

if (lowPriority.length > 10) {
  console.log(`... and ${lowPriority.length - 10} more\n`);
}

// Summary table
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Priority | Need Enrichment | Total Complex Props');
console.log('---------|-----------------|-------------------');
console.log(`High     | ${highPriority.length.toString().padEnd(15)} | ${highPriority.reduce((sum, r) => sum + r.complexProps.length, 0)}`);
console.log(`Medium   | ${mediumPriority.length.toString().padEnd(15)} | ${mediumPriority.reduce((sum, r) => sum + r.complexProps.length, 0)}`);
console.log(`Low      | ${lowPriority.length.toString().padEnd(15)} | ${lowPriority.reduce((sum, r) => sum + r.complexProps.length, 0)}`);
console.log(`---------|-----------------|-------------------`);
console.log(`TOTAL    | ${needEnrichment.length.toString().padEnd(15)} | ${needEnrichment.reduce((sum, r) => sum + r.complexProps.length, 0)}`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 RECOMMENDATIONS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('1. Focus on HIGH PRIORITY components first (V2 components)');
console.log('2. Use enrichment-maker agent for each component:');
console.log('   "Use enrichment-maker agent to create enrichment for ComponentName"\n');

if (highPriority.length > 0) {
  console.log('3. Start with these components:');
  highPriority.slice(0, 5).forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.component}`);
  });
}

console.log('\n4. After creating enrichments:');
console.log('   npm run extract:merge');
console.log('   npm run build\n');

// Generate command list for high priority
if (highPriority.length > 0) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 AGENT COMMANDS (Copy-paste ready)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('HIGH PRIORITY:\n');
  highPriority.slice(0, 5).forEach(r => {
    console.log(`Use the enrichment-maker agent to create enrichment for ${r.component}`);
  });
}

// Export JSON for programmatic use
const outputData = {
  summary: {
    totalComponents: Object.keys(combinedData.components).length,
    withComplexProps: results.length,
    alreadyEnriched: results.filter(r => r.hasEnrichment).length,
    needEnrichment: needEnrichment.length,
    byPriority: {
      high: highPriority.length,
      medium: mediumPriority.length,
      low: lowPriority.length
    }
  },
  highPriority: highPriority.map(r => ({
    component: r.component,
    version: r.version,
    complexProps: r.complexProps.map(p => p.prop)
  })),
  mediumPriority: mediumPriority.map(r => ({
    component: r.component,
    version: r.version,
    complexProps: r.complexProps.map(p => p.prop)
  })),
  lowPriority: lowPriority.map(r => ({
    component: r.component,
    version: r.version,
    complexProps: r.complexProps.map(p => p.prop)
  }))
};

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('data/complex-props-analysis.json', JSON.stringify(outputData, null, 2));
console.log('\n📁 Detailed analysis saved to: data/complex-props-analysis.json\n');
