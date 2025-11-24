import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseVue } from '@vue/compiler-sfc';

// Configuration
const DS_PATH = process.env.DS_PATH || '/Users/deniz.zeybek/Documents/insider-projects/insider-design-system';
const COMPONENTS_DIR = join(DS_PATH, 'src/components');

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description?: string;
}

interface SyncResult {
  component: string;
  changes: string[];
  errors: string[];
}

/**
 * Extracts props from Vue component with full details
 */
function extractPropsFromVue(componentPath: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  if (!existsSync(componentPath)) {
    return props;
  }

  const source = readFileSync(componentPath, 'utf-8');
  const { descriptor } = parseVue(source);

  if (!descriptor.script && !descriptor.scriptSetup) {
    return props;
  }

  const scriptContent = (descriptor.scriptSetup?.content || descriptor.script?.content) || '';
  const lines = scriptContent.split('\n');

  // Find props block
  const propsStartMatch = scriptContent.match(/props:\s*\{/);
  if (!propsStartMatch) return props;

  const startIndex = propsStartMatch.index! + propsStartMatch[0].length;
  let braceCount = 1;
  let endIndex = startIndex;

  for (let i = startIndex; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') braceCount++;
    if (scriptContent[i] === '}') braceCount--;
    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  const propsBlock = scriptContent.substring(startIndex, endIndex);
  const propLines = propsBlock.split('\n').filter(line => line.trim());

  for (let i = 0; i < propLines.length; i++) {
    const line = propLines[i].trim();
    const propNameMatch = line.match(/^(\w+):\s*\{/);

    if (!propNameMatch) continue;

    const propName = propNameMatch[1];

    // Collect full prop definition
    let propDef = line;
    let propBraceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

    while (propBraceCount > 0 && i < propLines.length - 1) {
      i++;
      propDef += ' ' + propLines[i].trim();
      propBraceCount += (propLines[i].match(/\{/g) || []).length;
      propBraceCount -= (propLines[i].match(/\}/g) || []).length;
    }

    // Extract type
    const typeMatch = propDef.match(/type:\s*(\w+(?:\s*\|\s*\w+)*)/);
    const type = typeMatch ? typeMatch[1].replace(/\s+/g, ' | ') : 'any';

    // Extract required
    const requiredMatch = propDef.match(/required:\s*(true|false)/);
    const required = requiredMatch ? requiredMatch[1] === 'true' : false;

    // Extract default
    let defaultValue: any = undefined;
    const defaultMatch = propDef.match(/default:\s*(.+?)(?:,|\})/);
    if (defaultMatch) {
      const defVal = defaultMatch[1].trim();
      if (defVal.startsWith('()') || defVal.startsWith('function')) {
        defaultValue = '[Function]';
      } else if (defVal === 'true' || defVal === 'false') {
        defaultValue = defVal === 'true';
      } else if (!isNaN(Number(defVal)) && defVal !== '') {
        defaultValue = Number(defVal);
      } else {
        defaultValue = defVal.replace(/['"]/g, '');
      }
    }

    // Find JSDoc comment above prop
    const propLineIndex = scriptContent.indexOf(line);
    const linesBefore = scriptContent.substring(0, propLineIndex).split('\n').length;

    let description = '';
    for (let j = Math.max(0, linesBefore - 15); j < linesBefore; j++) {
      const checkLine = lines[j];
      // Extract first sentence from JSDoc
      const descMatch = checkLine.match(/\*\s+([A-Z][^.]+\.)/);
      if (descMatch && !description) {
        description = descMatch[1].trim();
        break;
      }
    }

    props.push({
      name: propName,
      type,
      required,
      default: defaultValue,
      description
    });
  }

  return props;
}

/**
 * Syncs README props table
 */
function syncReadmeProps(componentDir: string, componentName: string, props: PropDefinition[]): string[] {
  const changes: string[] = [];
  const readmePath = join(componentDir, 'README.md');

  if (!existsSync(readmePath)) {
    console.log(`  ℹ️  README.md doesn't exist, skipping sync`);
    return changes;
  }

  const readmeContent = readFileSync(readmePath, 'utf-8');
  const lines = readmeContent.split('\n');

  // Find props table section
  const propsHeaderIndex = lines.findIndex(line => line.match(/^##\s+Props/i));

  if (propsHeaderIndex === -1) {
    console.log(`  ℹ️  Props section not found in README, skipping sync`);
    return changes;
  }

  // Find the table
  let tableStartIndex = -1;
  for (let i = propsHeaderIndex; i < Math.min(propsHeaderIndex + 20, lines.length); i++) {
    if (lines[i].includes('| Prop |') || lines[i].includes('| prop |')) {
      tableStartIndex = i;
      break;
    }
  }

  if (tableStartIndex === -1) {
    console.log(`  ℹ️  Props table not found in README, skipping sync`);
    return changes;
  }

  // Find table end
  let tableEndIndex = tableStartIndex + 2; // Skip header and separator
  while (tableEndIndex < lines.length && lines[tableEndIndex].trim().startsWith('|')) {
    tableEndIndex++;
  }

  // Check which props are missing
  const tableContent = lines.slice(tableStartIndex, tableEndIndex).join('\n');
  const missingProps = props.filter(prop => {
    const propRegex = new RegExp(`\`${prop.name}\``, 'i');
    return !propRegex.test(tableContent);
  });

  if (missingProps.length === 0) {
    console.log(`  ✅ All props already in README`);
    return changes;
  }

  // Add missing props to table
  const newRows = missingProps.map(prop => {
    const requiredText = prop.required ? '**required**' : `\`${prop.default ?? 'undefined'}\``;
    const typeText = `\`${prop.type}\``;
    const descText = prop.description || 'TODO: Add description';
    return `| \`${prop.name}\` | ${typeText} | ${requiredText} | ${descText} |`;
  });

  // Insert new rows before table end
  lines.splice(tableEndIndex, 0, ...newRows);

  // Write back
  writeFileSync(readmePath, lines.join('\n'));
  changes.push(`Added ${missingProps.length} missing props to README table: ${missingProps.map(p => p.name).join(', ')}`);

  return changes;
}

/**
 * Syncs TypeScript definition file
 */
function syncDtsFile(componentDir: string, componentName: string, props: PropDefinition[]): string[] {
  const changes: string[] = [];
  const dtsPath = join(componentDir, `${componentName}.d.ts`);

  if (!existsSync(dtsPath)) {
    console.log(`  ℹ️  .d.ts file doesn't exist, skipping sync`);
    return changes;
  }

  const dtsContent = readFileSync(dtsPath, 'utf-8');
  const lines = dtsContent.split('\n');

  // Find Props interface
  const propsInterfaceRegex = new RegExp(`interface ${componentName}Props\\s*\\{`, 'i');
  const interfaceStartIndex = lines.findIndex(line => propsInterfaceRegex.test(line));

  if (interfaceStartIndex === -1) {
    console.log(`  ℹ️  ${componentName}Props interface not found, skipping sync`);
    return changes;
  }

  // Find interface end
  let braceCount = 0;
  let interfaceEndIndex = interfaceStartIndex;
  let startCounting = false;

  for (let i = interfaceStartIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) {
      startCounting = true;
      braceCount += (line.match(/\{/g) || []).length;
    }
    if (line.includes('}')) {
      braceCount -= (line.match(/\}/g) || []).length;
    }
    if (startCounting && braceCount === 0) {
      interfaceEndIndex = i;
      break;
    }
  }

  // Extract existing props in interface
  const interfaceContent = lines.slice(interfaceStartIndex, interfaceEndIndex + 1).join('\n');
  const existingProps = new Set<string>();

  const propRegex = /\s+(\w+)[?:]:/g;
  let match;
  while ((match = propRegex.exec(interfaceContent))) {
    existingProps.add(match[1]);
  }

  // Find missing props
  const missingProps = props.filter(prop => !existingProps.has(prop.name));

  if (missingProps.length === 0) {
    console.log(`  ✅ All props already in .d.ts`);
    return changes;
  }

  // Generate TypeScript type from Vue type
  const mapVueTypeToTs = (vueType: string): string => {
    const typeMap: Record<string, string> = {
      'String': 'string',
      'Number': 'number',
      'Boolean': 'boolean',
      'Array': 'any[]',
      'Object': 'Record<string, any>',
      'Function': '(...args: any[]) => any',
      'Date': 'Date'
    };

    // Handle union types
    if (vueType.includes('|')) {
      return vueType.split('|').map(t => typeMap[t.trim()] || t.trim()).join(' | ');
    }

    return typeMap[vueType] || 'any';
  };

  // Add missing props to interface (before closing brace)
  const newProps = missingProps.map(prop => {
    const tsType = mapVueTypeToTs(prop.type);
    const optional = !prop.required ? '?' : '';
    const comment = prop.description ? `  /**\n   * ${prop.description}\n   */\n` : '';
    return `${comment}  ${prop.name}${optional}: ${tsType};`;
  });

  // Insert before closing brace
  lines.splice(interfaceEndIndex, 0, ...newProps);

  // Write back
  writeFileSync(dtsPath, lines.join('\n'));
  changes.push(`Added ${missingProps.length} missing props to .d.ts interface: ${missingProps.map(p => p.name).join(', ')}`);

  return changes;
}

/**
 * Syncs documentation for a single component
 */
function syncComponent(componentDir: string, componentName: string): SyncResult {
  const result: SyncResult = {
    component: componentName,
    changes: [],
    errors: []
  };

  try {
    const componentPath = join(componentDir, `${componentName}.vue`);

    // Extract props
    const props = extractPropsFromVue(componentPath);

    if (props.length === 0) {
      result.errors.push('No props found in component');
      return result;
    }

    console.log(`  📝 Found ${props.length} props`);

    // Sync README
    const readmeChanges = syncReadmeProps(componentDir, componentName, props);
    result.changes.push(...readmeChanges);

    // Sync .d.ts
    const dtsChanges = syncDtsFile(componentDir, componentName, props);
    result.changes.push(...dtsChanges);

    if (result.changes.length === 0) {
      console.log(`  ✅ No changes needed - documentation already in sync`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`Error syncing component: ${errorMessage}`);
    console.error(`  ❌ Error: ${errorMessage}`);
  }

  return result;
}

/**
 * Syncs documentation for all components or specific components
 */
function syncComponents(specificComponents?: string[]): SyncResult[] {
  const results: SyncResult[] = [];

  if (!existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    console.error('Please set DS_PATH environment variable to your design system path');
    process.exit(1);
  }

  const entries = readdirSync(COMPONENTS_DIR);

  for (const entry of entries) {
    const entryPath = join(COMPONENTS_DIR, entry);

    if (!statSync(entryPath).isDirectory()) continue;

    const componentName = entry;

    // Skip if specific components requested and this isn't one of them
    if (specificComponents && !specificComponents.includes(componentName)) {
      continue;
    }

    console.log(`\n🔧 Syncing: ${componentName}`);

    const result = syncComponent(entryPath, componentName);
    results.push(result);
  }

  return results;
}

/**
 * Prints sync summary
 */
function printSummary(results: SyncResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(80));

  const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const componentsWithChanges = results.filter(r => r.changes.length > 0).length;

  console.log(`\n📦 Total Components: ${results.length}`);
  console.log(`✏️  Components Modified: ${componentsWithChanges}`);
  console.log(`✅ Total Changes: ${totalChanges}`);
  console.log(`❌ Total Errors: ${totalErrors}`);

  if (componentsWithChanges > 0) {
    console.log('\n📝 Changes Made:');
    results
      .filter(r => r.changes.length > 0)
      .forEach(r => {
        console.log(`\n  📦 ${r.component}:`);
        r.changes.forEach(change => {
          console.log(`     ✅ ${change}`);
        });
      });
  }

  if (totalErrors > 0) {
    console.log('\n❌ Errors:');
    results
      .filter(r => r.errors.length > 0)
      .forEach(r => {
        console.log(`\n  📦 ${r.component}:`);
        r.errors.forEach(error => {
          console.log(`     ❌ ${error}`);
        });
      });
  }

  console.log('\n' + '='.repeat(80));

  if (totalErrors > 0) {
    console.log('⚠️  Sync completed with errors');
  } else if (totalChanges > 0) {
    console.log('✅ Sync completed successfully');
  } else {
    console.log('✅ All documentation already in sync - no changes needed');
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Review the changes: git diff');
  console.log('   2. Run validation: npm run validate:docs');
  console.log('   3. Test components still work');
  console.log('   4. Commit changes: git add . && git commit');
}

/**
 * Main execution function
 */
function main(): void {
  console.log('🚀 Starting documentation sync...\n');
  console.log(`📂 Design System Path: ${DS_PATH}`);
  console.log(`📂 Components Directory: ${COMPONENTS_DIR}`);

  // Check for specific component argument
  const specificComponents = process.argv.slice(2);

  if (specificComponents.length > 0) {
    console.log(`🎯 Syncing specific components: ${specificComponents.join(', ')}`);
  } else {
    console.log(`⚠️  Warning: This will sync ALL components`);
    console.log(`   Use: npm run sync:docs ComponentName1 ComponentName2 to sync specific components`);
  }

  const results = syncComponents(specificComponents.length > 0 ? specificComponents : undefined);

  printSummary(results);
}

// Execute
main();
