/**
 * Registry Generator Script
 *
 * Extracts component metadata from Design System Vue files
 * and generates a comprehensive components.json registry.
 *
 * Usage: npm run generate-registry
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DS_PATH = process.env.DS_PATH || '/Users/deniz.zeybek/Documents/insider-projects/insider-design-system';
const OUTPUT_PATH = join(__dirname, '../src/registry/components.json');
const COMPONENTS_DIR = join(DS_PATH, 'src/components');

// Types
interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  validator?: string;
}

interface EventInfo {
  name: string;
  payload?: string;
  description: string;
}

interface SlotInfo {
  name: string;
  description: string;
}

interface ExampleInfo {
  title: string;
  description?: string;
  code: string;
  props?: Record<string, unknown>;
}

interface ComponentInfo {
  name: string;
  description: string;
  category: string;
  version: string;
  deprecated?: boolean;
  replacement?: string;
  props: PropInfo[];
  events: EventInfo[];
  slots: SlotInfo[];
  examples: ExampleInfo[];
  imports: string[];
}

interface Registry {
  version: string;
  lastUpdated: string;
  components: ComponentInfo[];
}

// V1 to V2 mapping based on migration docs
const V1_TO_V2_MAPPING: Record<string, string> = {
  'InBox': 'InContainer',
  'InButton': 'InButtonV2',
  'InCheckBox': 'InCheckBoxV2',
  'InCustomDropDown': 'InDropdownMenu',
  'InDataTable': 'InDataTableV2',
  'InDropDown': 'InSelect',
  'InMultiDropDown': 'InMultiSelect',
  'InSuperInput': 'InRichTextInput',
  'InTagsText': 'InChips',
  'InTooltip': 'InTooltipV2',
  'InModals': 'InModalV2',
  'InDatePicker': 'InDatePickerV2',
  'InSidebar': 'InSidebarV2',
};

// V2 components (preferred)
const V2_COMPONENTS = [
  'InButtonV2', 'InCheckBoxV2', 'InDataTableV2', 'InDatePickerV2',
  'InModalV2', 'InSidebarV2', 'InTooltipV2', 'InChips', 'InContainer',
  'InCreateButton', 'InDropdownMenu', 'InInfoBox', 'InMultiSelect',
  'InRichTextInput', 'InSelect'
];

/**
 * Parse props from Vue component content
 */
function parseProps(content: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Match props object in Options API or Composition API
  const propsMatch = content.match(/props:\s*\{([\s\S]*?)\n\s*\},?\s*(?:setup|data|computed|methods|watch|mounted|components)/);

  if (!propsMatch) {
    // Try alternative pattern for simpler components
    const altMatch = content.match(/props:\s*\{([\s\S]*?)\n\s{4}\}/);
    if (!altMatch) return props;
    return parsePropsContent(altMatch[1]);
  }

  return parsePropsContent(propsMatch[1]);
}

function parsePropsContent(propsContent: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Match individual prop definitions
  const propRegex = /(\w+):\s*\{([^}]+)\}/g;
  let match;

  while ((match = propRegex.exec(propsContent)) !== null) {
    const propName = match[1];
    const propDef = match[2];

    // Extract type
    const typeMatch = propDef.match(/type:\s*(\[?[\w\s|,]+\]?)/);
    let type = typeMatch ? typeMatch[1].trim() : 'any';
    type = type.replace(/\s+/g, ' ');

    // Extract required
    const requiredMatch = propDef.match(/required:\s*(true|false)/);
    const required = requiredMatch ? requiredMatch[1] === 'true' : false;

    // Extract default
    const defaultMatch = propDef.match(/default:\s*(?:(?:\(\)\s*=>|function\s*\(\)\s*\{?\s*return)\s*)?([^,\n]+)/);
    let defaultValue = defaultMatch ? defaultMatch[1].trim() : undefined;
    if (defaultValue) {
      // Clean up default value
      defaultValue = defaultValue.replace(/\s*\}\s*$/, '').replace(/^\(?\s*/, '').replace(/\s*\)?\s*$/, '');
    }

    // Extract validator info for description
    const validatorMatch = propDef.match(/validator:\s*\(?(?:value)?\)?\s*=>\s*([^}]+)/);
    const validator = validatorMatch ? validatorMatch[1].trim() : undefined;

    props.push({
      name: propName,
      type,
      required,
      default: defaultValue,
      description: generatePropDescription(propName, type, validator),
      validator
    });
  }

  return props;
}

/**
 * Generate prop description based on name and type
 */
function generatePropDescription(name: string, type: string, validator?: string): string {
  const descriptions: Record<string, string> = {
    id: 'Unique identifier for the component',
    name: 'Name attribute for the component',
    disabled: 'Disable the component',
    disabledStatus: 'Disable the component',
    loading: 'Show loading state',
    loadingStatus: 'Show loading state',
    loadingState: 'Show loading state',
    skeleton: 'Show skeleton loader',
    skeletonStatus: 'Show skeleton loader',
    skeletonSizing: 'Skeleton dimensions configuration',
    status: 'Component status (success, warning, error)',
    state: 'Component state (default, success, warning, error)',
    stateMessage: 'Message to display for current state',
    size: 'Component size variant',
    theme: 'Visual theme variant',
    value: 'Current value',
    modelValue: 'v-model binding value',
    options: 'List of options',
    placeholder: 'Placeholder text',
    placeholderText: 'Placeholder text',
    label: 'Label text',
    labelText: 'Label text',
    labelStatus: 'Show/hide label',
    tooltip: 'Tooltip text',
    tooltipText: 'Tooltip text',
    tooltipStatus: 'Show/hide tooltip',
    searchStatus: 'Enable search functionality',
    clearSelectionButton: 'Show clear selection button',
    minDate: 'Minimum selectable date',
    maxDate: 'Maximum selectable date',
    comparisonStatus: 'Enable comparison mode',
    singleDatePickerStatus: 'Single date selection mode',
    quickRangeSelectionStatus: 'Show quick range selection buttons',
  };

  if (descriptions[name]) {
    return descriptions[name];
  }

  if (validator) {
    return `Allowed values: ${validator}`;
  }

  // Generate from name
  const words = name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Parse emits/events from Vue component content
 */
function parseEvents(content: string): EventInfo[] {
  const events: EventInfo[] = [];
  const eventNames = new Set<string>();

  // Match emit calls
  const emitRegex = /emit\(['"]([^'"]+)['"](?:,\s*([^)]+))?\)/g;
  let match;

  while ((match = emitRegex.exec(content)) !== null) {
    const eventName = match[1];
    if (eventNames.has(eventName)) continue;
    eventNames.add(eventName);

    const payload = match[2] ? match[2].trim() : undefined;

    events.push({
      name: eventName,
      payload: payload,
      description: generateEventDescription(eventName)
    });
  }

  // Also check $emit
  const $emitRegex = /\$emit\(['"]([^'"]+)['"](?:,\s*([^)]+))?\)/g;
  while ((match = $emitRegex.exec(content)) !== null) {
    const eventName = match[1];
    if (eventNames.has(eventName)) continue;
    eventNames.add(eventName);

    events.push({
      name: eventName,
      payload: match[2]?.trim(),
      description: generateEventDescription(eventName)
    });
  }

  return events;
}

/**
 * Generate event description based on name
 */
function generateEventDescription(name: string): string {
  const descriptions: Record<string, string> = {
    click: 'Emitted when component is clicked',
    input: 'Emitted when input value changes',
    change: 'Emitted when value changes',
    focus: 'Emitted when component receives focus',
    blur: 'Emitted when component loses focus',
    select: 'Emitted when option is selected',
    search: 'Emitted when search input changes',
    open: 'Emitted when component opens',
    close: 'Emitted when component closes',
    apply: 'Emitted when selection is applied',
    cancel: 'Emitted when action is cancelled',
    'update:modelValue': 'Emitted for v-model binding',
    openList: 'Emitted when dropdown list opens',
    endScroll: 'Emitted when scroll reaches end (for lazy loading)',
    addOption: 'Emitted when new option is added',
    unSelect: 'Emitted when option is unselected',
    periodSelected: 'Emitted when date period is selected',
    comparisonPeriodSelected: 'Emitted when comparison period is selected',
    dateRangeUpdated: 'Emitted when date range is updated',
    dateComparedRangeUpdated: 'Emitted when comparison date range is updated',
    openComparison: 'Emitted when comparison mode is opened',
    closeComparison: 'Emitted when comparison mode is closed',
    rangeSelected: 'Emitted when range is selected',
    clearSelection: 'Emitted when selection is cleared',
    clickIcon: 'Emitted when icon is clicked',
  };

  return descriptions[name] || `Emitted on ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
}

/**
 * Parse slots from Vue component template
 */
function parseSlots(content: string): SlotInfo[] {
  const slots: SlotInfo[] = [];
  const slotNames = new Set<string>();

  // Match named slots
  const slotRegex = /<slot\s+name="([^"]+)"/g;
  let match;

  while ((match = slotRegex.exec(content)) !== null) {
    const slotName = match[1];
    if (slotNames.has(slotName)) continue;
    slotNames.add(slotName);

    slots.push({
      name: slotName,
      description: generateSlotDescription(slotName)
    });
  }

  // Check for default slot
  if (content.includes('<slot>') || content.includes('<slot />')) {
    slots.push({
      name: 'default',
      description: 'Default slot content'
    });
  }

  return slots;
}

/**
 * Generate slot description based on name
 */
function generateSlotDescription(name: string): string {
  const descriptions: Record<string, string> = {
    default: 'Default slot content',
    header: 'Header content',
    footer: 'Footer content',
    icon: 'Custom icon',
    trigger: 'Trigger element',
    content: 'Main content',
    actions: 'Action buttons',
    prefix: 'Content before main element',
    suffix: 'Content after main element',
    triggerElement: 'Element that triggers the component',
  };

  return descriptions[name] || `${name.charAt(0).toUpperCase() + name.slice(1)} slot`;
}

/**
 * Get component category based on name and functionality
 */
function getCategory(name: string): string {
  const formComponents = ['Button', 'Input', 'Select', 'Checkbox', 'Radio', 'Toggle', 'DatePicker', 'TimePicker', 'TextArea', 'Slider', 'Upload', 'ColorPicker'];
  const feedbackComponents = ['Modal', 'Toast', 'Tooltip', 'Progress', 'Loading', 'Skeleton', 'InfoBox', 'OnPageMessage'];
  const dataComponents = ['Table', 'DataTable', 'Chart', 'Tags', 'Chips', 'CodeSnippet'];
  const navigationComponents = ['Tabs', 'Breadcrumb', 'Steps', 'Sidebar', 'Header', 'Links', 'Accordion', 'Drawer'];
  const layoutComponents = ['Container', 'Box', 'Segments', 'Ribbons'];

  const lowerName = name.toLowerCase();

  if (formComponents.some(c => lowerName.includes(c.toLowerCase()))) return 'Form';
  if (feedbackComponents.some(c => lowerName.includes(c.toLowerCase()))) return 'Feedback';
  if (dataComponents.some(c => lowerName.includes(c.toLowerCase()))) return 'Data Display';
  if (navigationComponents.some(c => lowerName.includes(c.toLowerCase()))) return 'Navigation';
  if (layoutComponents.some(c => lowerName.includes(c.toLowerCase()))) return 'Layout';

  return 'Other';
}

/**
 * Generate basic usage example
 */
function generateExample(name: string, props: PropInfo[]): ExampleInfo {
  const requiredProps = props.filter(p => p.required);
  const propsString = requiredProps
    .map(p => {
      if (p.type.includes('String')) return `${p.name}="example"`;
      if (p.type.includes('Boolean')) return `:${p.name}="true"`;
      return `:${p.name}="value"`;
    })
    .join('\n    ');

  const code = propsString
    ? `<${name}\n    ${propsString}\n/>`
    : `<${name} />`;

  return {
    title: 'Basic Usage',
    description: `Basic ${name} example`,
    code,
    props: {}
  };
}

/**
 * Parse a single Vue component file
 */
function parseComponent(dirName: string): ComponentInfo | null {
  const componentPath = join(COMPONENTS_DIR, dirName, `${dirName}.vue`);

  if (!existsSync(componentPath)) {
    console.log(`  Skipping ${dirName} - no main Vue file found`);
    return null;
  }

  try {
    const content = readFileSync(componentPath, 'utf-8');

    const props = parseProps(content);
    const events = parseEvents(content);
    const slots = parseSlots(content);

    const isV1 = V1_TO_V2_MAPPING[dirName] !== undefined;
    const isV2 = V2_COMPONENTS.includes(dirName) || dirName.endsWith('V2');

    const component: ComponentInfo = {
      name: dirName,
      description: `${dirName} component`,
      category: getCategory(dirName),
      version: isV2 ? 'v2' : isV1 ? 'v1' : 'v1',
      deprecated: isV1,
      replacement: V1_TO_V2_MAPPING[dirName],
      props,
      events,
      slots,
      examples: [generateExample(dirName, props)],
      imports: [dirName]
    };

    console.log(`  ✓ ${dirName}: ${props.length} props, ${events.length} events, ${slots.length} slots`);

    return component;
  } catch (error) {
    console.error(`  ✗ Error parsing ${dirName}:`, error);
    return null;
  }
}

/**
 * Main generator function
 */
async function generateRegistry(): Promise<void> {
  console.log('🔍 Generating component registry...\n');
  console.log(`Source: ${COMPONENTS_DIR}`);
  console.log(`Output: ${OUTPUT_PATH}\n`);

  if (!existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    console.log('\nMake sure the Design System project is in the correct location.');
    process.exit(1);
  }

  // Get all component directories
  const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('In'))
    .map(dirent => dirent.name)
    .sort();

  console.log(`Found ${componentDirs.length} components\n`);

  const components: ComponentInfo[] = [];
  let v1Count = 0;
  let v2Count = 0;

  for (const dirName of componentDirs) {
    const component = parseComponent(dirName);
    if (component) {
      components.push(component);
      if (component.version === 'v2') v2Count++;
      else v1Count++;
    }
  }

  // Sort: V2 first, then alphabetically
  components.sort((a, b) => {
    if (a.version === 'v2' && b.version !== 'v2') return -1;
    if (a.version !== 'v2' && b.version === 'v2') return 1;
    return a.name.localeCompare(b.name);
  });

  // Create registry
  const registry: Registry = {
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    components
  };

  // Write to file
  writeFileSync(OUTPUT_PATH, JSON.stringify(registry, null, 2));

  console.log(`\n✅ Registry generated successfully!`);
  console.log(`   Total: ${components.length} components`);
  console.log(`   V2: ${v2Count} | V1: ${v1Count}`);
  console.log(`   Output: ${OUTPUT_PATH}`);
}

// Run generator
generateRegistry().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
