import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('./data/combined.json', 'utf-8'));

const stats = {
  total: data._metadata.totalComponents,
  enriched: data._metadata.enrichedComponents,
  withExamples: data._metadata.componentsWithExamples,
  withMigrations: data._metadata.componentsWithMigrations,
  unenriched: data._metadata.totalComponents - data._metadata.enrichedComponents
};

console.log('📊 Component Statistics:');
console.log('========================');
console.log('Total Components:', stats.total);
console.log('Enriched:', stats.enriched, '(' + Math.round(stats.enriched/stats.total*100) + '%)');
console.log('With Examples:', stats.withExamples);
console.log('With Migrations:', stats.withMigrations);
console.log('Unenriched:', stats.unenriched);
console.log('');

// Find components with complex props (Object/Array types)
const complexComponents = [];
Object.entries(data.components).forEach(([name, comp]) => {
  if (!comp.enriched) {
    const complexProps = Object.entries(comp.props || {}).filter(([_, prop]) =>
      prop.type === 'Object' || prop.type === 'Array' || prop.type === 'Function'
    );
    if (complexProps.length > 0) {
      complexComponents.push({
        name,
        complexProps: complexProps.length,
        props: complexProps.map(([name]) => name).join(', '),
        hasEvents: (comp.emits || []).length > 0,
        hasSlots: (comp.slots || []).length > 0,
        version: comp.version,
        category: comp.category || 'Unknown'
      });
    }
  }
});

console.log('🎯 Priority Components (Complex Props, Not Enriched):');
console.log('====================================================');
complexComponents
  .sort((a, b) => b.complexProps - a.complexProps)
  .slice(0, 20)
  .forEach((c, i) => {
    console.log(`${i+1}. ${c.name} (${c.version}) [${c.category}]`);
    console.log(`   Complex props: ${c.complexProps} - ${c.props}`);
    console.log(`   Has events: ${c.hasEvents ? 'Yes' : 'No'} | Has slots: ${c.hasSlots ? 'Yes' : 'No'}`);
    console.log('');
  });

// List already enriched components
console.log('\n✅ Already Enriched Components:');
console.log('================================');
const enriched = Object.entries(data.components)
  .filter(([_, comp]) => comp.enriched)
  .map(([name]) => name);
console.log(enriched.join(', '));
