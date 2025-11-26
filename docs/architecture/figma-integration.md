# Figma Integration Guide

This guide explains how to use the Figma-to-Code integration with the Insider Design System MCP server.

## Overview

The Figma integration allows you to convert Figma designs directly to Vue component code using Insider Design System components. This dramatically speeds up the design-to-development workflow.

## Figma Design Requirements

### Component Naming Convention

Your Figma components must follow this naming pattern:

```
ComponentName/Variant1/Variant2
```

**Examples:**
- `Button/Primary`
- `Button/Secondary/Ghost`
- `DatePicker/Range`
- `DatePicker/Compare`
- `Input/Email`
- `Select/Multiple`

### Supported Components

| Figma Component | Design System Component | Variants Supported |
|----------------|------------------------|-------------------|
| `Button/*` | `InButtonV2` | Primary, Secondary, Danger, Warning, Smart, Subtle Primary, Subtle Smart, Inverse |
| `DatePicker/*` | `InDatePickerV2` | Default, Range, Compare, Single |
| `Input/*` | `InTextInput` | Text, Email, Password, Number, Tel, URL |
| `Select/*` | `InSelect` | Default, Multiple, Searchable |
| `MultiSelect/*` | `InMultiSelect` | Default, Creatable, Searchable |
| `Checkbox/*` | `InCheckBoxV2` | Default, Checked, Disabled |
| `Modal/*` | `InModalV2` | Small, Medium, Large, Full |
| `Tooltip/*` | `InTooltipV2` | Top, Bottom, Left, Right (+ corners) |

### Component Properties/Variants

Figma component properties should map to Design System props:

#### Button Properties

| Figma Property | Values | Maps to DS Prop | DS Values |
|---------------|---------|----------------|-----------|
| Type | Primary, Secondary, Danger, Warning, Smart | `type` | 'primary', 'secondary', 'danger', 'warning', 'smart' |
| Style | Solid, Ghost, Text | `styling` | 'solid', 'ghost', 'text' |
| Size | Default, Small | `size` | 'default', 'small' |
| State | Default, Disabled, Loading | `disabledStatus`, `loadingStatus` | boolean |

#### DatePicker Properties

| Figma Property | Values | Maps to DS Prop |
|---------------|---------|----------------|
| Mode | Single, Range | `singleDatePickerStatus`, `range` |
| Compare | True, False | `comparisonStatus` |

#### Input Properties

| Figma Property | Values | Maps to DS Prop |
|---------------|---------|----------------|
| Type | Text, Email, Password, Number | `type` |
| State | Default, Error, Success, Warning | `state` |
| Size | Small, Medium, Large | `size` |

### Instance Naming

Instance names in Figma become component IDs in the generated code:

```
Frame: "User Profile"
├── Button (Instance: "Save Button") → id="save-button-1"
├── Button (Instance: "Cancel Button") → id="cancel-button-2"
└── Input (Instance: "Email Input") → id="email-input-1"
```

## MCP Tools

### 1. list-figma-mappings

Lists all available Figma → Design System mappings.

**Usage:**
```typescript
// Via MCP
design-system - list-figma-mappings
```

**Response:**
```json
{
  "total": 8,
  "mappings": [
    {
      "figmaPattern": "/^(Button|Btn)\\/?/i",
      "dsComponent": "InButtonV2",
      "defaultProps": {
        "styling": "solid",
        "type": "primary",
        "size": "default"
      },
      "propMappings": [...]
    }
  ]
}
```

### 2. validate-figma-component

Validates if a Figma component name can be mapped.

**Usage:**
```typescript
design-system - validate-figma-component(figmaComponentName: "Button/Primary")
```

**Response:**
```json
{
  "valid": true,
  "figmaName": "Button/Primary",
  "dsComponent": "InButtonV2",
  "mapping": {
    "defaultProps": {...},
    "propMappings": [...]
  },
  "componentInfo": {
    "description": "",
    "propsCount": 45,
    "eventsCount": 2,
    "enriched": true
  }
}
```

### 3. convert-figma-to-vue

Converts an entire Figma frame to Vue component code.

**Usage:**
```typescript
design-system - convert-figma-to-vue(
  frame: {
    name: "Login Form",
    id: "frame-1",
    node: {...}
  },
  options: {
    componentName: "LoginForm",
    includeScript: true,
    includeComments: true,
    scriptLang: "ts"
  }
)
```

**Response:**
```json
{
  "success": true,
  "componentName": "LoginForm",
  "code": "<template>...</template><script setup lang=\"ts\">...</script>",
  "imports": ["InButtonV2", "InTextInput"],
  "warnings": [],
  "manualProps": [],
  "stats": {
    "componentsUsed": 2,
    "warningsCount": 0,
    "manualPropsCount": 0
  }
}
```

### 4. get-ds-for-figma

Get Design System component info for a Figma component.

**Usage:**
```typescript
design-system - get-ds-for-figma(figmaComponentName: "DatePicker/Range")
```

### 5. generate-figma-component

Generate code for a single Figma component.

**Usage:**
```typescript
design-system - generate-figma-component(
  figmaComponentName: "Button/Primary",
  instanceName: "Submit Button",
  properties: {
    Style: "Solid",
    Size: "Default"
  }
)
```

## Workflow

### Option 1: Using Figma Plugin (Recommended)

1. **Install Figma Plugin** (to be developed)
   - Exports frame data in the correct format
   - Sends to MCP server automatically

2. **Design in Figma**
   - Use Design System components
   - Follow naming conventions
   - Set properties/variants

3. **Convert**
   - Select frame
   - Click "Convert to Vue"
   - Copy generated code

### Option 2: Manual Integration

1. **Export Frame Data**
   ```javascript
   // In Figma plugin or API
   const frame = figma.currentPage.selection[0];
   const data = exportFrameData(frame);
   ```

2. **Call MCP Tool**
   ```typescript
   const result = await mcp.callTool('convert-figma-to-vue', {
     frame: data,
     options: { scriptLang: 'ts' }
   });
   ```

3. **Use Generated Code**
   ```vue
   <!-- Paste into your Vue file -->
   <template>
     <div class="login-form">
       <!-- Component from MCP -->
       <InTextInput
         id="email-input-1"
         type="email"
         theme="grey"
       />
       <InButtonV2
         id="submit-button-1"
         styling="solid"
         type="primary"
         label-text="Submit"
       />
     </div>
   </template>
   ```

## Best Practices

### 1. Consistent Naming

✅ **Good:**
```
Button/Primary
Button/Secondary/Ghost
DatePicker/Range
Input/Email
```

❌ **Bad:**
```
Primary Button
SecondaryGhost
Date-Picker-Range
email input
```

### 2. Use Variants

Create Figma variants that match DS props:

```
Component: Button
├── Type: Primary, Secondary, Danger
├── Style: Solid, Ghost, Text
└── Size: Default, Small
```

### 3. Meaningful Instance Names

Instance names become IDs:

```
✅ "Save Button" → id="save-button-1"
✅ "Email Input Field" → id="email-input-field-1"
❌ "Button 1" → id="button-1-1"
❌ "Component" → id="component-1"
```

### 4. Organize Frames

Structure your Figma file:

```
Page: Screens
├── Frame: Login Screen
│   ├── Header
│   ├── Form
│   └── Footer
└── Frame: Dashboard
    ├── Sidebar
    ├── Content
    └── Modals
```

Each frame can be converted separately.

### 5. Handle Unmapped Components

Components without mappings become divs with warnings:

```vue
<div class="custom-component">
  <!-- Warning: No mapping for "CustomWidget" -->
</div>
```

You'll need to manually implement these.

## Troubleshooting

### "No mapping found for component"

**Problem:** Your Figma component name doesn't match any pattern.

**Solution:**
1. Check `list-figma-mappings` for valid patterns
2. Rename your component to match
3. Or use `validate-figma-component` to see suggestions

### "Required prop missing"

**Problem:** Component requires props not set in Figma.

**Solution:**
1. Check `manualProps` in conversion result
2. Add those props to your Figma component
3. Or add them manually after generation

### "Component not in registry"

**Problem:** Mapping exists but DS component not found.

**Solution:**
1. Run `npm run extract:merge` to rebuild registry
2. Check if component exists in Design System
3. Update mapping if needed

## Examples

### Example 1: Simple Button

**Figma:**
- Component: `Button/Primary`
- Instance: "Submit Form"
- Properties: { Style: "Solid", Size: "Default" }

**Generated:**
```vue
<InButtonV2
  id="submit-form-1"
  styling="solid"
  type="primary"
  size="default"
/>
```

### Example 2: Login Form

**Figma Frame:**
```
Login Form
├── Input/Email (Instance: "Email Field")
├── Input/Password (Instance: "Password Field")
└── Button/Primary (Instance: "Login Button")
```

**Generated:**
```vue
<template>
  <div class="login-form">
    <InTextInput
      id="email-field-1"
      type="email"
      theme="grey"
    />
    <InTextInput
      id="password-field-2"
      type="password"
      theme="grey"
    />
    <InButtonV2
      id="login-button-1"
      styling="solid"
      type="primary"
    />
  </div>
</template>

<script setup lang="ts">
import { InTextInput, InButtonV2 } from '@useinsider/design-system-vue';
import '@useinsider/design-system-vue/dist/design-system-vue.css';
</script>
```

### Example 3: Date Range Picker

**Figma:**
- Component: `DatePicker/Range`
- Instance: "Report Date Range"
- Properties: { Compare: "True" }

**Generated:**
```vue
<InDatePickerV2
  id="report-date-range-1"
  :range="true"
  :comparison-status="true"
  theme="white"
  :quick-range-selection-status="true"
/>
```

## Future Enhancements

- [ ] Figma Plugin for one-click export
- [ ] Layout/spacing conversion (flex, grid)
- [ ] Style extraction (colors, fonts)
- [ ] Auto-wire event handlers
- [ ] Multi-frame conversion
- [ ] Component composition detection
- [ ] Responsive breakpoint handling

## Support

For issues or questions:
- Check this guide first
- Use `validate-figma-component` to debug
- Review enrichment data for components
- Check GitHub issues
