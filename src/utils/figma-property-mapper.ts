/**
 * Figma Property Mapper
 *
 * Maps Figma component properties to Design System component props
 * using convention-based rules with component-specific overrides.
 */

export type PropertyType = 'string' | 'boolean' | 'number' | 'enum';

export interface FigmaProperty {
  name: string;
  value: any;
  type: PropertyType;
}

export interface MappingResult {
  propName: string;
  propValue: any;
  source: 'override' | 'rule' | 'fallback';
  rule?: string;
}

export interface ComponentMapping {
  propertyOverrides?: Record<string, string>;
  valueOverrides?: Record<string, Record<string, any>>;
}

/**
 * Convert string to camelCase
 */
function camelCase(str: string): string {
  return str
    .split(' ')
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

/**
 * Generic mapping rules (applied in order)
 */
const GENERIC_RULES = [
  // Rule 1: Exact match (common prop names)
  {
    name: 'exact-match',
    test: (figmaProp: string) => /^(type|size|id|name|value)$/i.test(figmaProp),
    transform: (figmaProp: string) => figmaProp.toLowerCase()
  },

  // Rule 2: "xxx Text" → "xxxText"
  {
    name: 'text-suffix',
    test: (figmaProp: string) => / Text$/.test(figmaProp),
    transform: (figmaProp: string) => {
      const base = figmaProp.replace(' Text', '');
      return camelCase(base) + 'Text';
    }
  },

  // Rule 3: "xxx Status" → "xxxStatus"
  {
    name: 'status-suffix',
    test: (figmaProp: string) => / Status$/.test(figmaProp),
    transform: (figmaProp: string) => {
      const base = figmaProp.replace(' Status', '');
      return camelCase(base) + 'Status';
    }
  },

  // Rule 4: Boolean without "Status" → add "Status"
  {
    name: 'boolean-status',
    test: (figmaProp: string, type: PropertyType) =>
      type === 'boolean' && !/ Status$/.test(figmaProp),
    transform: (figmaProp: string) => camelCase(figmaProp) + 'Status'
  },

  // Rule 5: Default (camelCase)
  {
    name: 'default-camelcase',
    test: () => true, // Always matches (fallback)
    transform: (figmaProp: string) => camelCase(figmaProp)
  }
];

/**
 * Map Figma property name to DS prop name
 */
export function mapPropertyName(
  figmaProp: string,
  type: PropertyType,
  overrides?: Record<string, string>
): MappingResult {
  // 1. Check overrides first
  if (overrides?.[figmaProp]) {
    return {
      propName: overrides[figmaProp],
      propValue: undefined, // Will be set later
      source: 'override'
    };
  }

  // 2. Apply generic rules
  for (const rule of GENERIC_RULES) {
    if (rule.test(figmaProp, type)) {
      return {
        propName: rule.transform(figmaProp),
        propValue: undefined,
        source: 'rule',
        rule: rule.name
      };
    }
  }

  // 3. Fallback (should never reach here)
  return {
    propName: camelCase(figmaProp),
    propValue: undefined,
    source: 'fallback'
  };
}

/**
 * Map Figma property value to DS prop value
 */
export function mapPropertyValue(
  value: any,
  type: PropertyType,
  valueOverrides?: Record<string, any>
): any {
  // 1. Check value overrides
  if (valueOverrides && value in valueOverrides) {
    return valueOverrides[value];
  }

  // 2. Type-based transformations
  switch (type) {
    case 'enum':
    case 'string':
      // Figma: "Primary" → DS: "primary"
      return typeof value === 'string' ? value.toLowerCase() : value;

    case 'boolean':
      return Boolean(value);

    case 'number':
      return Number(value);

    default:
      return value;
  }
}

/**
 * Map all Figma properties to DS props
 */
export function mapProperties(
  figmaProperties: Record<string, any>,
  propertyTypes: Record<string, PropertyType>,
  componentMapping?: ComponentMapping
): Record<string, any> {
  const dsProps: Record<string, any> = {};

  for (const [figmaProp, figmaValue] of Object.entries(figmaProperties)) {
    const type = propertyTypes[figmaProp] || 'string';

    // Map property name
    const { propName } = mapPropertyName(
      figmaProp,
      type,
      componentMapping?.propertyOverrides
    );

    // Map property value
    const propValue = mapPropertyValue(
      figmaValue,
      type,
      componentMapping?.valueOverrides?.[figmaProp]
    );

    dsProps[propName] = propValue;
  }

  return dsProps;
}

/**
 * Generate Vue code from DS props
 */
export function generateVueCode(
  componentName: string,
  props: Record<string, any>,
  options: {
    omitFalse?: boolean;  // Don't include props with false value
    omitDefaults?: boolean; // Don't include default values (not implemented yet)
  } = {}
): string {
  const { omitFalse = true } = options;

  const propStrings: string[] = [];

  for (const [propName, propValue] of Object.entries(props)) {
    // Skip false booleans if omitFalse is true
    if (omitFalse && propValue === false) {
      continue;
    }

    // Format prop
    let propString: string;

    if (typeof propValue === 'boolean' && propValue === true) {
      // Boolean shorthand: label-status
      propString = toKebabCase(propName);
    } else if (typeof propValue === 'string') {
      // String: label-text="Export"
      propString = `:${toKebabCase(propName)}="${propValue}"`;
    } else if (typeof propValue === 'number') {
      // Number: :size="24"
      propString = `:${toKebabCase(propName)}="${propValue}"`;
    } else {
      // Other (object, array): :options="..."
      propString = `:${toKebabCase(propName)}="${JSON.stringify(propValue)}"`;
    }

    propStrings.push(propString);
  }

  if (propStrings.length === 0) {
    return `<${componentName} />`;
  }

  if (propStrings.length === 1) {
    return `<${componentName} ${propStrings[0]} />`;
  }

  // Multiline format
  return `<${componentName}\n  ${propStrings.join('\n  ')}\n/>`;
}

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Validate mapping result
 */
export function validateMapping(
  dsProps: Record<string, any>,
  expectedProps: string[]
): {
  valid: boolean;
  missing: string[];
  unexpected: string[];
} {
  const dsPropNames = Object.keys(dsProps);
  const missing = expectedProps.filter(prop => !dsPropNames.includes(prop));
  const unexpected = dsPropNames.filter(prop => !expectedProps.includes(prop));

  return {
    valid: missing.length === 0 && unexpected.length === 0,
    missing,
    unexpected
  };
}

/**
 * Example usage
 */
export const EXAMPLE_USAGE = {
  InButtonV2: {
    figmaProperties: {
      'Label': 'Export',
      'Style': 'Solid',
      'Type': 'Secondary',
      'Size': 'Default',
      'Disabled': false,
      'Loading Status': false,
      'Label Status': true
    },
    propertyTypes: {
      'Label': 'string' as PropertyType,
      'Style': 'enum' as PropertyType,
      'Type': 'enum' as PropertyType,
      'Size': 'enum' as PropertyType,
      'Disabled': 'boolean' as PropertyType,
      'Loading Status': 'boolean' as PropertyType,
      'Label Status': 'boolean' as PropertyType
    },
    componentMapping: {
      propertyOverrides: {
        'Label': 'labelText',
        'Style': 'styling'
      }
    },
    expectedOutput: {
      labelText: 'export',
      styling: 'solid',
      type: 'secondary',
      size: 'default',
      disableStatus: false,
      loadingStatus: false,
      labelStatus: true
    }
  },

  InOnPageMessage: {
    figmaProperties: {
      'Type': 'Error',
      'Size': 'Medium',
      'Link Button': false,
      'Title Status': true,
      'Title Text': 'Your title goes here.',
      'Description Text': 'Your message goes here.',
      'Content Slot Status': false
    },
    propertyTypes: {
      'Type': 'enum' as PropertyType,
      'Size': 'enum' as PropertyType,
      'Link Button': 'boolean' as PropertyType,
      'Title Status': 'boolean' as PropertyType,
      'Title Text': 'string' as PropertyType,
      'Description Text': 'string' as PropertyType,
      'Content Slot Status': 'boolean' as PropertyType
    },
    componentMapping: {
      // No overrides needed!
    },
    expectedOutput: {
      type: 'error',
      size: 'medium',
      linkButtonStatus: false,
      titleStatus: true,
      titleText: 'Your title goes here.',
      descriptionText: 'Your message goes here.',
      contentSlotStatus: false
    }
  }
};
