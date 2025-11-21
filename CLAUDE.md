# CLAUDE.md

This file provides guidance to Claude Code and other AI assistants when using the Insider Design System MCP server.

## Overview

This MCP server provides tools and resources for working with the Insider Design System - a Vue 2.7 component library. Use this server to:

- Discover available components
- Get detailed component documentation (props, events, slots)
- Generate Vue component code with proper imports
- Map Figma components to Design System components

## Available Tools

### Discovery Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `list-components` | List all components, optionally by category | Starting a new feature, exploring available components |
| `search-components` | Search by name/description | Looking for specific functionality |
| `get-component` | Get full component details | Need complete documentation for implementation |

### Documentation Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `get-props` | Get all props with types and defaults | Configuring a component |
| `get-events` | Get all emitted events | Setting up event handlers |
| `get-examples` | Get usage code examples | Need implementation reference |

### Code Generation Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `generate-code` | Generate Vue component code | Implementing a component with specific props |
| `map-figma-component` | Map Figma name to DS component | Implementing from Figma designs |

## Usage Patterns

### Pattern 1: Implementing a Component

```
1. get-component("InDatePickerV2")     → Understand all props/events
2. generate-code("InDatePickerV2", { compare: true, range: true })
3. Add generated code to Vue file
```

### Pattern 2: Implementing from Figma

```
1. map-figma-component("DatePicker/Compare")  → Get DS component + default props
2. get-component("InDatePickerV2")            → Get full documentation
3. generate-code with merged props
```

### Pattern 3: Finding the Right Component

```
1. search-components("date")           → Find date-related components
2. list-components({ category: "Form" }) → Browse by category
3. get-component for detailed info
```

## Example Prompts

### Basic Implementation

User: "Add a DatePicker with compare feature"

```
1. Call get-component("InDatePickerV2")
2. Call generate-code("InDatePickerV2", { compare: true, range: true })
3. Insert code into user's file
4. Add necessary imports
```

### From Figma Design

User: "Implement this Figma frame" (contains Button/Primary)

```
1. Call map-figma-component("Button/Primary")
   → Returns: { dsComponent: "InButton", defaultProps: { variant: "primary" } }
2. Call generate-code("InButton", { variant: "primary" })
3. Insert code
```

### Discovery

User: "What form components are available?"

```
1. Call list-components({ category: "Form" })
2. Present list to user
3. Offer to show details for specific components
```

## Important Notes

### Import Pattern
Always use this import pattern for Design System components:

```javascript
import { ComponentName } from '@useinsider/design-system-vue';
import '@useinsider/design-system-vue/dist/design-system-vue.css';
```

### Vue Version
Components are built for Vue 2.7 with Composition API support. Use `<script setup>` syntax.

### Props Naming
- Boolean props: `disabled`, `loading`, `skeleton`
- v-model: Use `modelValue` and `update:modelValue`

### Common Props
Most components support:
- `disabled` / `disable` - Disable state
- `loading` / `loadingStatus` - Loading spinner
- `skeleton` / `skeletonStatus` - Skeleton loader
- `status` - Validation status (success, warning, error)
- `size` - Component size (small, medium, large)

## Resources

Access these resources for quick reference:

- `ds://components` - All components list
- `ds://registry` - Registry version info
- `ds://component/{name}` - Individual component details
- `ds://categories` - Component categories

## Figma Mapping Reference

| Figma Name | DS Component | Default Props |
|------------|--------------|---------------|
| Button/Primary | InButton | `{ variant: "primary" }` |
| Button/Secondary | InButton | `{ variant: "secondary" }` |
| DatePicker/Range | InDatePickerV2 | `{ range: true }` |
| DatePicker/Compare | InDatePickerV2 | `{ compare: true }` |
| Input/Text | InInput | `{ type: "text" }` |
| Select/Multiple | InSelect | `{ multiple: true }` |

## Best Practices

1. **Always check props first** - Use `get-props` before implementing
2. **Use generate-code** - Don't manually write boilerplate
3. **Include CSS import** - Always import the CSS file
4. **Check events** - Use `get-events` to set up proper handlers
5. **Use examples** - Reference `get-examples` for complex implementations

## Troubleshooting

### Component Not Found
- Check spelling (components use PascalCase: `InButton`, not `in-button`)
- Use `search-components` to find similar names
- Check if it's a V2 component (e.g., `InDatePickerV2`)

### Props Not Working
- Verify prop name with `get-props`
- Check if prop requires `:` binding for non-string values
- Some props may be `disable` vs `disabled`

### Missing Styles
Ensure CSS is imported:
```javascript
import '@useinsider/design-system-vue/dist/design-system-vue.css';
```

## Development Tools

### Available Agents

This project includes specialized agents for specific tasks:

#### 1. enrichment-maker Agent
**Purpose**: Generate enrichment files for complex components

**When to use**:
- Adding detailed metadata for a new critical component
- Documenting complex prop structures (Object/Array types)
- Creating common mistakes documentation
- Need valueFormat examples

**How to invoke**:
```
User: "Use enrichment-maker agent to create enrichment for InTooltipV2"
```

**What it does**:
1. Analyzes component metadata from combined.json via MCP
2. Identifies critical props needing enrichment (complex types)
3. Learns patterns from existing enrichments (InButtonV2, InDatePickerV2, InSelect)
4. Generates `src/registry/enrichments/InTooltipV2.json` with:
   - valueFormat for complex props (structure, examples, typescript)
   - commonMistakes with severity levels
   - Real-world usage examples
   - Helper functions (if needed)

**After agent completes**:
```bash
npm run extract:merge  # Merge enrichment into combined.json
npm run build           # Rebuild MCP server
```

#### 2. migrate-ds-components-v1-v2 Agent
**Purpose**: Migrate Vue components from V1 to V2 Design System components

**When to use**:
- Upgrading V1 components to V2 equivalents
- Need transformation guides (e.g., InDatePicker → InDatePickerV2)
- Understanding breaking changes

**How to invoke**:
```
User: "Migrate this component from InDatePicker V1 to V2"
```

**What it does**:
1. Uses MCP to get V2 component metadata
2. Checks for migration guides (e.g., InDatePicker-to-V2)
3. Reviews enrichment data for common mistakes
4. Provides mapped V2 code with proper props/events

### When to Use Agents

| Task | Agent | Use Case |
|------|-------|----------|
| Create enrichment | enrichment-maker | Adding metadata for InTooltipV2, InMultiSelect, etc. |
| V1→V2 migration | migrate-ds-components-v1-v2 | Upgrading InDatePicker to V2 |
| Implementation | (use MCP tools directly) | Implementing new components |
| Discovery | (use MCP tools directly) | Finding components |

### Enrichment Priority

Focus enrichments on components with:
- ✅ Complex Object/Array props
- ✅ Validators with enum references
- ✅ Common developer mistakes
- ✅ Non-obvious value formats
- ❌ Skip simple String/Boolean/Number props

**Recommended enrichments**: InTooltipV2, InMultiSelect, InCheckBoxV2, InModalV2, InDropdownMenu
