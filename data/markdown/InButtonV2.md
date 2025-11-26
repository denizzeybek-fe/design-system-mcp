# InButtonV2

**Version:** v2

## Props

### `id`

**Type:** `String` | **Required**

### `styling`

**Type:** `String` | **Default:** `"STYLES.SOLID"`

### `type`

**Type:** `String` | **Default:** `"TYPES.PRIMARY"`

### `size`

**Type:** `String` | **Default:** `"SIZES.DEFAULT"`

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `selectedStatus`

**Type:** `Boolean` | **Default:** `false`

### `loadingStatus`

**Type:** `Boolean` | **Default:** `false`

### `successStatus`

**Type:** `Boolean` | **Default:** `false`

### `labelTextStatus`

**Type:** `Boolean` | **Default:** `true`

### `labelText`

**Type:** `String | Number` | **Default:** `"Label"`

### `leftIcon`

**Type:** `String` | **Default:** `""`

### `rightIcon`

**Type:** `String` | **Default:** `""`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `iconSize`

**Type:** `String` | **Default:** `"24"`

### `buttonGroupOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `iconClick`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `tooltipOptions`

**Type:** `Object` | **Default:** `"[Function]"`

## Events

### `click`

### `clickIcon`

## Enums

### STYLES

- `solid`
- `ghost`
- `text`

### TYPES

- `primary`
- `subtle-primary`
- `secondary`
- `danger`
- `warning`
- `smart`
- `subtle-smart`
- `inverse`

### SIZES

- `default`
- `small`

### DEFAULT_TOOLTIP_OPTIONS

- `tooltip`
- `top center`

## Examples

### Primary Button

Most common button variant for primary call-to-action

```vue
<InButtonV2
  id="save-btn"
  type="primary"
  label-text="Save Changes"
  @click="handleSave"
/>
```

### Secondary Button

For secondary actions or less prominent CTAs

```vue
<InButtonV2
  id="cancel-btn"
  type="secondary"
  label-text="Cancel"
  @click="handleCancel"
/>
```

### Danger Button

For destructive actions like delete, remove

```vue
<InButtonV2
  id="delete-btn"
  type="danger"
  label-text="Delete"
  @click="confirmDelete"
/>
```

### Ghost Button

Transparent background with border, lower visual weight

```vue
<InButtonV2
  id="learn-more-btn"
  type="primary"
  styling="ghost"
  label-text="Learn More"
  @click="showDetails"
/>
```

### Text Button

No background or border, minimal visual weight

```vue
<InButtonV2
  id="details-btn"
  type="primary"
  styling="text"
  label-text="View Details"
  @click="showDetails"
/>
```

### Loading State

Show async operations in progress with spinner

```vue
<template>
  <InButtonV2
    id="save-btn"
    type="primary"
    label-text="Save"
    :loading-status="isLoading"
    @click="handleSave"
  />
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(false);

const handleSave = async () => {
  isLoading.value = true;
  try {
    await api.save();
  } finally {
    isLoading.value = false;
  }
};
</script>
```

### Button with Icon

Add icon to the left of label text

```vue
<InButtonV2
  id="add-btn"
  type="primary"
  label-text="Add Item"
  left-icon="filled-plus"
  icon-size="24"
  @click="addItem"
/>
```

### Icon-Only Button

Show only icon without label text

```vue
<InButtonV2
  id="settings-btn"
  type="primary"
  styling="ghost"
  left-icon="filled-settings"
  :label-text-status="false"
  tooltip-text="Settings"
  @click="openSettings"
/>
```

### Button Group

Group related buttons together

```vue
<template>
  <InButtonV2
    id="period-selector"
    :button-group-options="periodOptions"
    @click="handlePeriodChange"
  />
</template>

<script setup>
import { ref } from 'vue';

const periodOptions = [
  { id: 'daily', type: 'secondary', styling: 'solid', labelText: 'Daily', selectedStatus: true },
  { id: 'weekly', type: 'secondary', styling: 'ghost', labelText: 'Weekly' },
  { id: 'monthly', type: 'secondary', styling: 'ghost', labelText: 'Monthly' }
];

const handlePeriodChange = (payload) => {
  console.log('Selected period:', payload.id);
};
</script>
```

## Common Mistakes

ℹ️ **Using buttonGroupOptions with single button props**

When buttonGroupOptions is provided, single button props (labelText, leftIcon, type, styling) are ignored

**Wrong:**
```vue
<InButtonV2
  :button-group-options="[...]"
  label-text="Click Me"
  left-icon="save"
/>
```

**Correct:**
```vue
// Button group mode (no single props)
<InButtonV2 :button-group-options="options" />

// OR single button mode (no buttonGroupOptions)
<InButtonV2 label-text="Click Me" left-icon="save" />
```

ℹ️ **Passing number for iconSize instead of string**

iconSize prop expects STRING not NUMBER

**Wrong:**
```vue
:icon-size="24"
```

**Correct:**
```vue
icon-size="24" or :icon-size="'24'"
```

ℹ️ **Not resetting loadingStatus in error handlers**

If async operation fails, loadingStatus stays true forever

**Wrong:**
```vue
async handleSave() {
  this.loadingStatus = true;
  await saveData(); // throws error
  this.loadingStatus = false; // never reached
}
```

**Correct:**
```vue
async handleSave() {
  this.loadingStatus = true;
  try {
    await saveData();
  } finally {
    this.loadingStatus = false; // always executes
  }
}
```

ℹ️ **Expecting payload.value in button group click handler**

Button group click payload doesn't have 'value' property

**Wrong:**
```vue
handleClick(payload) {
  console.log(payload.value); // undefined!
}
```

**Correct:**
```vue
handleClick(payload) {
  console.log(payload.id); // correct!
  console.log(payload.labelText); // correct!
}
```

ℹ️ **Using camelCase for type prop value**

Type values use kebab-case, not camelCase

**Wrong:**
```vue
type="subtlePrimary"
```

**Correct:**
```vue
type="subtle-primary"
```

ℹ️ **Icon-only button without accessible label**

Setting labelTextStatus=false without alternative text

**Wrong:**
```vue
<InButtonV2
  :label-text-status="false"
  left-icon="trash"
/>
```

**Correct:**
```vue
<InButtonV2
  :label-text-status="false"
  left-icon="trash"
  tooltip-text="Delete item"
/>
```

ℹ️ **Creating buttonGroupOptions inline**

Inline array creation causes unnecessary re-renders

**Wrong:**
```vue
<InButtonV2 :button-group-options="[{...}, {...}]" />
```

**Correct:**
```vue
// In data/computed
data() {
  return {
    tabOptions: [{...}, {...}]
  };
}

<InButtonV2 :button-group-options="tabOptions" />
```

## Best Practices

- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined

