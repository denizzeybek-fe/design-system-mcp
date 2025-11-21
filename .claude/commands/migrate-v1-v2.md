---
description: Migrate a component from V1 to V2 Design System
---

Migrate the provided code from V1 to V2 Design System components using MCP metadata.

## Step 1: Scan for V1 Components

Identify all V1 component usage in the provided code.

Common V1 → V2 mappings:
- InButton → InButtonV2
- InDatePicker → InDatePickerV2
- InDropDown → InSelect
- InMultiDropDown → InMultiSelect
- InCustomDropDown → InDropdownMenu
- InCheckBox → InCheckBoxV2
- InTooltip → InTooltipV2
- InModals → InModalV2
- InBox → InContainer

## Step 2: Use MCP for Each V2 Component

For each V1 component found, get V2 metadata:

```
mcp__design-system__get-component("InButtonV2")
mcp__design-system__get-component("InDatePickerV2")
...
```

## Step 3: Check for Migration Guides

Check if migration guide exists:

```
mcp__design-system__get-migration("InDatePicker-to-V2")
```

Available migrations:
- InDatePicker-to-V2 (complete transformation guide)

## Step 4: Review Enrichment Data

From MCP response, check:
- `commonMistakes` array → pitfalls to avoid
- `propEnrichments` → critical prop details
- `validValues` → enum constraints
- `emits` → event name changes

## Step 5: Generate Migration Code

For each V1 component:

1. Show **current V1 usage**
2. Show **migrated V2 code** using real MCP metadata
3. Explain **breaking changes**
4. Highlight **common mistakes** from enrichment
5. Show **actual enum values** from MCP

## Step 6: Update Imports

```javascript
// V1
import { InButton, InDropDown } from '@useinsider/design-system-vue';

// V2
import { InButtonV2, InSelect } from '@useinsider/design-system-vue';
```

## Common V1 → V2 Patterns

### InButton → InButtonV2
```vue
<!-- V1 -->
<InButton type="primary" :loading="true">
  Click Me
</InButton>

<!-- V2 -->
<InButtonV2
  id="btn-1"
  styling="solid"
  type="primary"
  :loading-status="true"
  label-text="Click Me"
/>
```

**Key changes:**
- Add `id` (required)
- Add `styling` prop
- `loading` → `loadingStatus`
- Slot → `labelText` prop

### InDropDown → InSelect
```vue
<!-- V1 -->
<InDropDown
  :options="options"
  :value="selected"
  placeholder="Select"
  @change="handleChange"
/>

<!-- V2 -->
<InSelect
  id="select-1"
  :options="options"
  :value="selected"
  placeholder-text="Select"
  @select="handleChange"
/>
```

**Key changes:**
- Add `id` (required)
- `placeholder` → `placeholderText`
- `@change` → `@select`
- Options must have `text` not `label`!

### InDatePicker → InDatePickerV2
```vue
<!-- V1 -->
<InDatePicker
  v-model="date"
  :min-date="minDate"
/>

<!-- V2 -->
<InDatePickerV2
  id="date-1"
  name="date-picker"
  :value="[{ startDate: '01.12.2024', endDate: '20.12.2024' }]"
  :min-date="minDate"
  @apply="handleDateApply"
/>
```

**Key changes:**
- Add `id` and `name` (required)
- v-model → `:value` + `@apply`
- Value is ARRAY of objects (not single object!)
- Use migration guide for exact transformations

## Best Practices

1. **Always use MCP first** - Get real metadata, not static examples
2. **Check migration guides** - Some have complete transformations
3. **Review common mistakes** - Avoid known pitfalls
4. **Verify enum values** - Use MCP's validValues array
5. **Test thoroughly** - Especially complex components

## Error Prevention

MCP prevents:
- ❌ Wrong prop names
- ❌ Invalid enum values
- ❌ Missing required props
- ❌ Incorrect event names
- ❌ Type mismatches

## Output Format

Provide:
1. Summary of components migrated
2. Breaking changes for each
3. Common mistakes to avoid
4. Import statement updates
5. Any manual adjustments needed
