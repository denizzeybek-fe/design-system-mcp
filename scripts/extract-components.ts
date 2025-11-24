import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { parse as parseVue } from '@vue/compiler-sfc';
import ts from 'typescript';

// Configuration
const DS_PATH = process.env.DS_PATH || '/Users/deniz.zeybek/Documents/insider-projects/insider-design-system';
const COMPONENTS_DIR = join(DS_PATH, 'src/components');
const OUTPUT_PATH = resolve('data/components.json');

// Type definitions
interface PropDefinition {
  type: string;
  required?: boolean;
  default?: any;
  validator?: string;
  description?: string;
}

interface EmitDefinition {
  name: string;
  payload?: string;
  description?: string;
}

interface EnumDefinition {
  name: string;
  values: Record<string, string>;
  type: 'const' | 'enum';
}

interface ComponentData {
  name: string;
  title: string;
  description: string;
  version: 'v1' | 'v2';
  props: Record<string, PropDefinition>;
  emits: EmitDefinition[];
  enums: EnumDefinition[];
  slots: string[];
  category?: string;
  hasStorybook?: boolean;
}

type ComponentsMap = Record<string, ComponentData>;

/**
 * Extracts enum/const definitions from script content
 */
function extractEnums(scriptContent: string): EnumDefinition[] {
  const enums: EnumDefinition[] = [];

  // Pattern 1: const STYLES = { SOLID: 'solid', GHOST: 'ghost' }
  const constEnumRegex = /(?:export\s+)?const\s+([A-Z_]+)\s*=\s*\{([^}]+)\}/g;
  let match;

  while ((match = constEnumRegex.exec(scriptContent))) {
    const enumName = match[1];
    const enumBody = match[2];

    const values: Record<string, string> = {};
    const pairs = enumBody.match(/(\w+):\s*['"]([^'"]+)['"]/g);

    if (pairs) {
      pairs.forEach(pair => {
        const pairMatch = pair.match(/(\w+):\s*['"]([^'"]+)['"]/);
        if (pairMatch) {
          values[pairMatch[1]] = pairMatch[2];
        }
      });
    }

    enums.push({ name: enumName, values, type: 'const' });
  }

  // Pattern 2: enum STYLES { SOLID = 'solid', GHOST = 'ghost' }
  const tsEnumRegex = /(?:export\s+)?enum\s+([A-Z_]\w*)\s*\{([^}]+)\}/g;

  while ((match = tsEnumRegex.exec(scriptContent))) {
    const enumName = match[1];
    const enumBody = match[2];

    const values: Record<string, string> = {};
    const pairs = enumBody.match(/(\w+)\s*=\s*['"]([^'"]+)['"]/g);

    if (pairs) {
      pairs.forEach(pair => {
        const pairMatch = pair.match(/(\w+)\s*=\s*['"]([^'"]+)['"]/);
        if (pairMatch) {
          values[pairMatch[1]] = pairMatch[2];
        }
      });
    }

    enums.push({ name: enumName, values, type: 'enum' });
  }

  return enums;
}

/**
 * Extracts props from Vue SFC script using TypeScript AST
 */
function extractProps(scriptContent: string, sourceFile?: ts.SourceFile): Record<string, PropDefinition> {
  const props: Record<string, PropDefinition> = {};

  // Pattern 1: defineProps<{ ... }>() (Composition API)
  const definePropsTypeRegex = /defineProps<\{([^}]+)\}>\(\)/s;
  const typeMatch = scriptContent.match(definePropsTypeRegex);

  if (typeMatch) {
    const propsBody = typeMatch[1];
    const propLines = propsBody.split(/[,\n]/).filter(line => line.trim());

    propLines.forEach(line => {
      const propMatch = line.match(/(\w+)(\?)?:\s*(.+)/);
      if (propMatch) {
        const [, name, optional, type] = propMatch;
        props[name] = {
          type: type.trim(),
          required: !optional
        };
      }
    });
    return props;
  }

  // Pattern 2: props: { ... } (Options API)
  // Use simple line-by-line parsing for Options API
  const propsStartMatch = scriptContent.match(/props:\s*\{/);
  if (!propsStartMatch) return props;

  const startIndex = propsStartMatch.index! + propsStartMatch[0].length;
  let braceCount = 1;
  let endIndex = startIndex;

  // Find matching closing brace
  for (let i = startIndex; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') braceCount++;
    if (scriptContent[i] === '}') braceCount--;
    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  const propsBlock = scriptContent.substring(startIndex, endIndex);

  // Parse each prop (line by line approach for single-line props)
  const propLines = propsBlock.split('\n').filter(line => line.trim());

  for (let i = 0; i < propLines.length; i++) {
    const line = propLines[i].trim();

    // Match prop name at start of line: propName: { ... }
    const propNameMatch = line.match(/^(\w+):\s*\{/);
    if (!propNameMatch) continue;

    const propName = propNameMatch[1];

    // Collect full prop definition (might span multiple lines)
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
    const type = typeMatch ? typeMatch[1].replace(/\s+/g, ' ') : 'any';

    // Extract required
    const requiredMatch = propDef.match(/required:\s*(true|false)/);
    const required = requiredMatch ? requiredMatch[1] === 'true' : false;

    // Extract default value
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

    // Extract validator to find enum values
    let validValues: string[] | undefined;
    const validatorMatch = propDef.match(/validator:\s*\(.*?\)\s*=>\s*(.+?)(?:,|\})/);
    if (validatorMatch) {
      const validatorExpr = validatorMatch[1];
      // Match array literals: ['a', 'b'] or ["a", "b"]
      const arrayMatch = validatorExpr.match(/\[(.*?)\]/);
      if (arrayMatch) {
        validValues = arrayMatch[1].split(',').map(v => v.trim().replace(/['"]/g, ''));
      }
      // Match Object.values(ENUM)
      const enumMatch = validatorExpr.match(/Object\.values\((\w+)\)/);
      if (enumMatch) {
        // We'll link this to enum later
        validValues = [`<from ${enumMatch[1]}>`];
      }
    }

    props[propName] = {
      type,
      required,
      default: defaultValue,
      validator: validatorMatch ? validatorMatch[0] : undefined
    };

    // Add valid values if found
    if (validValues && validValues.length > 0) {
      (props[propName] as any).validValues = validValues;
    }
  }

  return props;
}

/**
 * Extracts emits from Vue SFC script
 */
function extractEmits(scriptContent: string): EmitDefinition[] {
  const emits: EmitDefinition[] = [];
  const emitSet = new Set<string>();

  // Pattern 1: defineEmits<{ ... }>()
  const defineEmitsTypeRegex = /defineEmits<\{([^}]+)\}>\(\)/s;
  const typeMatch = scriptContent.match(defineEmitsTypeRegex);

  if (typeMatch) {
    const emitsBody = typeMatch[1];
    const emitLines = emitsBody.split(/[,\n]/).filter(line => line.trim());

    emitLines.forEach(line => {
      const emitMatch = line.match(/['"]?(\w+)['"]?:\s*\[([^\]]+)\]/);
      if (emitMatch) {
        const [, name, payload] = emitMatch;
        if (!emitSet.has(name)) {
          emitSet.add(name);
          emits.push({ name, payload: payload.trim() });
        }
      }
    });
  }

  // Pattern 2: $emit('event-name', payload)
  const emitCallRegex = /\$emit\(['"]([^'"]+)['"]/g;
  let emitMatch;

  while ((emitMatch = emitCallRegex.exec(scriptContent))) {
    const name = emitMatch[1];
    if (!emitSet.has(name)) {
      emitSet.add(name);
      emits.push({ name });
    }
  }

  // Pattern 3: emit('event-name', payload)
  const emitFnRegex = /\bemit\(['"]([^'"]+)['"]/g;

  while ((emitMatch = emitFnRegex.exec(scriptContent))) {
    const name = emitMatch[1];
    if (!emitSet.has(name)) {
      emitSet.add(name);
      emits.push({ name });
    }
  }

  return emits;
}

/**
 * Extracts slots from Vue SFC template
 */
function extractSlots(templateContent: string): string[] {
  const slots = new Set<string>();

  // Pattern: <slot name="slotName" />
  const slotRegex = /<slot\s+name=["']([^"']+)["']/g;
  let match;

  while ((match = slotRegex.exec(templateContent))) {
    slots.add(match[1]);
  }

  // Check for default slot
  if (templateContent.includes('<slot')) {
    slots.add('default');
  }

  return Array.from(slots);
}

/**
 * Determines component version from name
 */
function getComponentVersion(name: string): 'v1' | 'v2' {
  return name.endsWith('V2') ? 'v2' : 'v1';
}

/**
 * Extracts component title from JSDoc or name
 */
function extractTitle(scriptContent: string, componentName: string): string {
  const titleMatch = scriptContent.match(/@title\s+(.+)/);
  if (titleMatch) return titleMatch[1].trim();

  // Remove V2 suffix and add spaces before capitals
  return componentName
    .replace(/V2$/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

/**
 * Extracts component description from JSDoc
 */
function extractDescription(scriptContent: string): string {
  const descMatch = scriptContent.match(/@description\s+(.+)/);
  return descMatch ? descMatch[1].trim() : '';
}

/**
 * Extracts component category from JSDoc
 */
function extractCategory(scriptContent: string): string | undefined {
  const categoryMatch = scriptContent.match(/@category\s+(.+)/);
  return categoryMatch ? categoryMatch[1].trim() : undefined;
}

/**
 * Checks if component has Storybook stories
 */
function hasStorybookStories(componentName: string): boolean {
  const storybookPath = join(DS_PATH, 'storybook/stories');
  if (!existsSync(storybookPath)) return false;

  const searchName = componentName.replace(/V2$/, '');
  const files = readdirSync(storybookPath, { recursive: true });

  return files.some(file =>
    typeof file === 'string' &&
    file.toLowerCase().includes(searchName.toLowerCase()) &&
    file.endsWith('.stories.mdx')
  );
}

/**
 * Processes a single Vue component file
 */
function processComponent(componentDir: string, componentName: string): ComponentData | null {
  let componentFile = join(componentDir, `${componentName}.vue`);

  // If file not found and folder ends with V2, try without V2 suffix
  // e.g., InDataTableV2/InDataTable.vue
  if (!existsSync(componentFile) && componentName.endsWith('V2')) {
    const baseNameFile = join(componentDir, `${componentName.replace(/V2$/, '')}.vue`);
    if (existsSync(baseNameFile)) {
      componentFile = baseNameFile;
      console.log(`  📝 Using ${componentName.replace(/V2$/, '')}.vue for ${componentName}`);
    }
  }

  if (!existsSync(componentFile)) {
    console.warn(`⚠️  Component file not found: ${componentFile}`);
    return null;
  }

  try {
    const source = readFileSync(componentFile, 'utf-8');
    const { descriptor } = parseVue(source);

    if (!descriptor.script && !descriptor.scriptSetup) {
      console.warn(`⚠️  No script found in: ${componentName}`);
      return null;
    }

    const scriptContent = (descriptor.scriptSetup?.content || descriptor.script?.content) || '';
    const templateContent = descriptor.template?.content || '';

    const props = extractProps(scriptContent);
    const emits = extractEmits(scriptContent);
    const enums = extractEnums(scriptContent);
    const slots = extractSlots(templateContent);

    return {
      name: componentName,
      title: extractTitle(scriptContent, componentName),
      description: extractDescription(scriptContent),
      version: getComponentVersion(componentName),
      props,
      emits,
      enums,
      slots,
      category: extractCategory(scriptContent),
      hasStorybook: hasStorybookStories(componentName)
    };
  } catch (error) {
    console.error(`❌ Error processing ${componentName}:`, error);
    return null;
  }
}

/**
 * Scans the design system components directory
 */
function scanComponents(): ComponentsMap {
  const components: ComponentsMap = {};

  if (!existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    console.error('Please set DS_PATH environment variable to your design system path');
    process.exit(1);
  }

  const entries = readdirSync(COMPONENTS_DIR);

  for (const entry of entries) {
    const entryPath = join(COMPONENTS_DIR, entry);

    // Skip non-directories
    if (!statSync(entryPath).isDirectory()) continue;

    // Component directory name is the component name
    const componentName = entry;

    console.log(`🔍 Processing: ${componentName}`);

    const componentData = processComponent(entryPath, componentName);

    if (componentData) {
      components[componentName] = componentData;
      console.log(`  ✅ Extracted ${Object.keys(componentData.props).length} props, ${componentData.emits.length} emits, ${componentData.enums.length} enums`);
    }
  }

  return components;
}

/**
 * Main execution function
 */
function main(): void {
  console.log('🚀 Starting component extraction...\n');
  console.log(`📂 Design System Path: ${DS_PATH}`);
  console.log(`📂 Components Directory: ${COMPONENTS_DIR}\n`);

  const components = scanComponents();

  // Write results
  writeFileSync(OUTPUT_PATH, JSON.stringify(components, null, 2));

  console.log(`\n✅ Successfully extracted ${Object.keys(components).length} components`);
  console.log(`📁 Output written to: ${OUTPUT_PATH}`);

  // Stats
  const stats = {
    total: Object.keys(components).length,
    v1: Object.values(components).filter(c => c.version === 'v1').length,
    v2: Object.values(components).filter(c => c.version === 'v2').length,
    withStorybook: Object.values(components).filter(c => c.hasStorybook).length,
    totalProps: Object.values(components).reduce((sum, c) => sum + Object.keys(c.props).length, 0),
    totalEmits: Object.values(components).reduce((sum, c) => sum + c.emits.length, 0),
    totalEnums: Object.values(components).reduce((sum, c) => sum + c.enums.length, 0)
  };

  console.log('\n📊 Statistics:');
  console.log(`   Total Components: ${stats.total}`);
  console.log(`   V1 Components: ${stats.v1}`);
  console.log(`   V2 Components: ${stats.v2}`);
  console.log(`   With Storybook: ${stats.withStorybook}`);
  console.log(`   Total Props: ${stats.totalProps}`);
  console.log(`   Total Emits: ${stats.totalEmits}`);
  console.log(`   Total Enums: ${stats.totalEnums}`);
}

// Execute
main();
