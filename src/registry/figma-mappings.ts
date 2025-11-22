/**
 * Figma to Design System Component Mappings
 *
 * This file defines how Figma components and their variants
 * map to Design System components and props.
 */

export interface FigmaComponentMapping {
  /** Design System component name */
  dsComponent: string;
  /** Figma component name pattern (supports wildcards) */
  figmaPattern: string | RegExp;
  /** Default props for this component */
  defaultProps?: Record<string, any>;
  /** Mapping of Figma properties/variants to DS props */
  propMappings?: FigmaPropMapping[];
  /** Examples of usage */
  examples?: FigmaExample[];
}

export interface FigmaPropMapping {
  /** Figma property name (e.g., "Type", "Style", "Size") */
  figmaProperty: string;
  /** DS prop name */
  dsProp: string;
  /** Value transformation function or mapping object */
  transform?: Record<string, any> | ((value: any) => any);
  /** Whether this is required */
  required?: boolean;
}

export interface FigmaExample {
  figmaName: string;
  expectedOutput: string;
  description: string;
}

/**
 * Component mappings from Figma to Design System
 */
export const FIGMA_COMPONENT_MAPPINGS: FigmaComponentMapping[] = [
  // ==================== BUTTON ====================
  {
    dsComponent: 'InButtonV2',
    figmaPattern: /^(Button|Btn)\/?/i,
    defaultProps: {
      styling: 'solid',
      type: 'primary',
      size: 'default',
    },
    propMappings: [
      {
        figmaProperty: 'Type',
        dsProp: 'type',
        transform: {
          'Primary': 'primary',
          'Secondary': 'secondary',
          'Danger': 'danger',
          'Warning': 'warning',
          'Smart': 'smart',
          'Subtle Primary': 'subtle-primary',
          'Subtle Smart': 'subtle-smart',
          'Inverse': 'inverse',
        },
        required: false,
      },
      {
        figmaProperty: 'Style',
        dsProp: 'styling',
        transform: {
          'Solid': 'solid',
          'Ghost': 'ghost',
          'Text': 'text',
        },
      },
      {
        figmaProperty: 'Size',
        dsProp: 'size',
        transform: {
          'Default': 'default',
          'Small': 'small',
        },
      },
      {
        figmaProperty: 'State',
        dsProp: 'disabledStatus',
        transform: (value: string) => value === 'Disabled',
      },
      {
        figmaProperty: 'Loading',
        dsProp: 'loadingStatus',
        transform: (value: string) => value === 'True' || value === true,
      },
    ],
    examples: [
      {
        figmaName: 'Button/Primary',
        expectedOutput: '<InButtonV2 styling="solid" type="primary" />',
        description: 'Primary solid button',
      },
      {
        figmaName: 'Button/Secondary/Ghost',
        expectedOutput: '<InButtonV2 styling="ghost" type="secondary" />',
        description: 'Secondary ghost button',
      },
    ],
  },

  // ==================== DATE PICKER ====================
  {
    dsComponent: 'InDatePickerV2',
    figmaPattern: /^DatePicker\/?/i,
    defaultProps: {
      theme: 'white',
      quickRangeSelectionStatus: true,
    },
    propMappings: [
      {
        figmaProperty: 'Mode',
        dsProp: 'singleDatePickerStatus',
        transform: (value: string) => value === 'Single',
      },
      {
        figmaProperty: 'Range',
        dsProp: 'range',
        transform: (value: string) => value === 'True' || value === true,
      },
      {
        figmaProperty: 'Compare',
        dsProp: 'comparisonStatus',
        transform: (value: string) => value === 'True' || value === true,
      },
    ],
    examples: [
      {
        figmaName: 'DatePicker/Range',
        expectedOutput: '<InDatePickerV2 :range="true" />',
        description: 'Date range picker',
      },
      {
        figmaName: 'DatePicker/Compare',
        expectedOutput: '<InDatePickerV2 :comparison-status="true" />',
        description: 'Date picker with comparison',
      },
    ],
  },

  // ==================== INPUT ====================
  {
    dsComponent: 'InTextInput',
    figmaPattern: /^(Input|TextField)\/?/i,
    defaultProps: {
      theme: 'grey',
    },
    propMappings: [
      {
        figmaProperty: 'Type',
        dsProp: 'type',
        transform: {
          'Text': 'text',
          'Email': 'email',
          'Password': 'password',
          'Number': 'number',
          'Tel': 'tel',
          'URL': 'url',
        },
      },
      {
        figmaProperty: 'State',
        dsProp: 'state',
        transform: {
          'Default': 'default',
          'Error': 'error',
          'Success': 'success',
          'Warning': 'warning',
        },
      },
      {
        figmaProperty: 'Size',
        dsProp: 'size',
        transform: {
          'Small': 'small',
          'Medium': 'medium',
          'Large': 'large',
        },
      },
    ],
  },

  // ==================== SELECT/DROPDOWN ====================
  {
    dsComponent: 'InSelect',
    figmaPattern: /^(Select|Dropdown)\/?/i,
    defaultProps: {
      theme: 'grey',
    },
    propMappings: [
      {
        figmaProperty: 'Search',
        dsProp: 'searchStatus',
        transform: (value: string) => value === 'True' || value === true,
      },
      {
        figmaProperty: 'State',
        dsProp: 'state',
        transform: {
          'Default': 'default',
          'Error': 'error',
          'Success': 'success',
          'Warning': 'warning',
        },
      },
    ],
  },

  // ==================== MULTI SELECT ====================
  {
    dsComponent: 'InMultiSelect',
    figmaPattern: /^MultiSelect\/?/i,
    defaultProps: {
      theme: 'grey',
    },
    propMappings: [
      {
        figmaProperty: 'Search',
        dsProp: 'searchStatus',
        transform: (value: string) => value === 'True' || value === true,
      },
      {
        figmaProperty: 'CreateOption',
        dsProp: 'createOptionStatus',
        transform: (value: string) => value === 'True' || value === true,
      },
    ],
  },

  // ==================== CHECKBOX ====================
  {
    dsComponent: 'InCheckBoxV2',
    figmaPattern: /^(Checkbox|CheckBox)\/?/i,
    propMappings: [
      {
        figmaProperty: 'State',
        dsProp: 'checked',
        transform: (value: string) => value === 'Checked' || value === 'True',
      },
      {
        figmaProperty: 'Disabled',
        dsProp: 'disable',
        transform: (value: string) => value === 'True' || value === true,
      },
    ],
  },

  // ==================== MODAL ====================
  {
    dsComponent: 'InModalV2',
    figmaPattern: /^(Modal|Dialog)\/?/i,
    defaultProps: {
      theme: 'grey',
    },
    propMappings: [
      {
        figmaProperty: 'Size',
        dsProp: 'size',
        transform: {
          'Small': 'small',
          'Medium': 'medium',
          'Large': 'large',
          'Full': 'full',
        },
      },
    ],
  },

  // ==================== TOOLTIP ====================
  {
    dsComponent: 'InTooltipV2',
    figmaPattern: /^Tooltip\/?/i,
    propMappings: [
      {
        figmaProperty: 'Position',
        dsProp: 'staticPosition',
        transform: {
          'Top': 'top center',
          'Bottom': 'bottom center',
          'Left': 'left center',
          'Right': 'right center',
          'Top Left': 'top left',
          'Top Right': 'top right',
          'Bottom Left': 'bottom left',
          'Bottom Right': 'bottom right',
        },
      },
    ],
  },
];

/**
 * Find DS component mapping from Figma component name
 */
export function findMapping(figmaName: string): FigmaComponentMapping | null {
  for (const mapping of FIGMA_COMPONENT_MAPPINGS) {
    if (typeof mapping.figmaPattern === 'string') {
      if (figmaName.startsWith(mapping.figmaPattern)) {
        return mapping;
      }
    } else if (mapping.figmaPattern.test(figmaName)) {
      return mapping;
    }
  }
  return null;
}

/**
 * Parse Figma component name and extract variants
 * Examples:
 *   "Button/Primary" -> { base: "Button", variants: ["Primary"] }
 *   "Button/Primary/Ghost" -> { base: "Button", variants: ["Primary", "Ghost"] }
 */
export function parseFigmaName(figmaName: string): {
  base: string;
  variants: string[];
} {
  const parts = figmaName.split('/').map(p => p.trim());
  return {
    base: parts[0],
    variants: parts.slice(1),
  };
}

/**
 * Transform Figma properties to DS props using mapping
 */
export function transformProps(
  mapping: FigmaComponentMapping,
  figmaProps: Record<string, any>
): Record<string, any> {
  const dsProps: Record<string, any> = { ...mapping.defaultProps };

  if (!mapping.propMappings) {
    return dsProps;
  }

  for (const propMapping of mapping.propMappings) {
    const figmaValue = figmaProps[propMapping.figmaProperty];

    if (figmaValue === undefined) {
      continue;
    }

    let dsValue: any;

    if (typeof propMapping.transform === 'function') {
      dsValue = propMapping.transform(figmaValue);
    } else if (propMapping.transform) {
      dsValue = propMapping.transform[figmaValue] ?? figmaValue;
    } else {
      dsValue = figmaValue;
    }

    dsProps[propMapping.dsProp] = dsValue;
  }

  return dsProps;
}
