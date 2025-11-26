# InOnPageMessage

**Version:** v1

## Props

### `type`

**Type:** `String` | **Required**

### `text`

**Type:** `String` | **Required**

### `icon`

**Type:** `String` | **Default:** `""`

### `linkStatus`

**Type:** `Boolean` | **Default:** `false`

### `linkText`

**Type:** `String` | **Default:** `""`

### `linkTarget`

**Type:** `String` | **Default:** `""`

### `visibleDefaultMessageArea`

**Type:** `Boolean` | **Default:** `true`

### `size`

**Type:** `String` | **Default:** `"medium"`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `titleText`

**Type:** `String` | **Default:** `""`

## Examples

### Error Message with Action

Show error with helpful link

```vue
<script setup>
import { InOnPageMessage } from '@useinsider/design-system-vue';

const openSupport = () => {
  window.open('https://support.example.com', '_blank');
};
</script>

<template>
  <InOnPageMessage
    type="error"
    size="medium"
    title-status
    title-text="Connection failed"
    description-text="Unable to connect to server. Please check your internet connection."
    link-button-status
    link-button-text="Contact Support"
    @link-click="openSupport"
  />
</template>
```

### Success Message

Simple success confirmation

```vue
<InOnPageMessage
  type="success"
  size="medium"
  title-status
  title-text="Changes saved"
  description-text="Your profile has been updated successfully."
/>
```

## Common Mistakes

ℹ️ **Not providing descriptive title and description**

Messages should have clear, actionable text

**Wrong:**
```vue
<InOnPageMessage type="error" />
```

**Correct:**
```vue
<InOnPageMessage type="error" title-text="Error occurred" description-text="Please check your input and try again" />
```

ℹ️ **Not using appropriate message types**

Type should match message severity for accessibility

**Wrong:**
```vue
<InOnPageMessage type="info" title-text="Critical error" />
```

**Correct:**
```vue
<InOnPageMessage type="error" title-text="Critical error" />
```

## Best Practices

- **Use Clear, Actionable Messages:** Messages should tell users what happened and what to do next
- **Match Message Type to Severity:** Use appropriate type for each situation

