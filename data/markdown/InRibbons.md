# InRibbons

**Version:** v1

## Props

### `text`

**Type:** `String` | **Required**

### `type`

**Type:** `String` | **Default:** `"default"`

### `status`

**Type:** `Boolean` | **Default:** `true`

### `icon`

**Type:** `String` | **Default:** `""`

### `withIcon`

**Type:** `Boolean` | **Default:** `true`

### `isClickableText`

**Type:** `Boolean` | **Default:** `false`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `leftSpace`

**Type:** `Boolean` | **Default:** `false`

## Events

### `close`

## Enums

### RIBBON_TYPES_ICONS

- `filled-info-circle`
- `filled-check-circle`
- `filled-caution-triangle`
- `filled-error-box`

## Examples

### Basic Info Ribbon

Default blue info ribbon with icon and close button

```vue
<InRibbons
  text="This is an information message"
  type="default"
  :status="showInfo"
  @close="showInfo = false"
/>
```

### Success Message

Green success ribbon for operation confirmations

```vue
<InRibbons
  text="Your changes have been saved successfully"
  type="success"
  :status="showSuccess"
  @close="showSuccess = false"
/>
```

### Warning Alert

Orange warning ribbon for cautionary messages

```vue
<InRibbons
  text="Please review your settings before proceeding"
  type="warning"
  :status="showWarning"
  @close="showWarning = false"
/>
```

### Error Notification

Red error ribbon for error messages

```vue
<InRibbons
  text="An error occurred while processing your request"
  type="error"
  :status="showError"
  @close="showError = false"
/>
```

### Clickable Ribbon

Ribbon with clickable text that triggers an action

```vue
<template>
  <InRibbons
    text="Click here to view details"
    :is-clickable-text="true"
    :status="showClickable"
    @click="handleRibbonClick"
    @close="showClickable = false"
  />
</template>

<script setup>
import { ref } from 'vue';

const showClickable = ref(true);

const handleRibbonClick = () => {
  console.log('Navigating to details...');
  // router.push('/details');
};
</script>
```

### Custom Icon Ribbon

Override default icon with custom icon

```vue
<InRibbons
  text="You have 3 new notifications"
  icon="line-notification"
  :status="hasNotifications"
  @close="dismissNotifications"
/>
```

### Text-Only Ribbon

Ribbon without icon

```vue
<InRibbons
  text="Simple text message without icon"
  :with-icon="false"
  :status="showTextOnly"
  @close="showTextOnly = false"
/>
```

### User-Generated Content (XSS Safe)

Displaying user input safely with XSS protection

```vue
<template>
  <InRibbons
    :text="userMessage"
    type="warning"
    :prevent-xss="true"
    :status="showUserMessage"
    @close="showUserMessage = false"
  />
</template>

<script setup>
import { ref } from 'vue';

const userMessage = ref('<script>alert("XSS")</script>User message');
const showUserMessage = ref(true);
</script>
```

### Ribbon with Sidebar Offset

Ribbon with left margin for fixed sidebar layouts

```vue
<InRibbons
  text="This ribbon accounts for left sidebar width"
  :left-space="true"
  :status="showWithOffset"
  @close="showWithOffset = false"
/>
```

## Common Mistakes

ℹ️ **Not handling @close event**

Ribbon always shows close button, but clicking it does nothing

**Wrong:**
```vue
<InRibbons text="Message" />
```

**Correct:**
```vue
<InRibbons text="Message" @close="showRibbon = false" />
```

ℹ️ **XSS vulnerability with user content**

Not sanitizing user-generated content in text prop

**Wrong:**
```vue
<InRibbons :text="userInput" />
```

**Correct:**
```vue
<InRibbons :text="userInput" :prevent-xss="true" />
```

ℹ️ **Clickable text without action**

Setting isClickableText=true but not handling click event

**Wrong:**
```vue
<InRibbons text="Click here" :is-clickable-text="true" />
```

**Correct:**
```vue
<InRibbons text="Click here" :is-clickable-text="true" @click="doAction" />
```

ℹ️ **Wrong type for message severity**

Using default type for error messages

**Wrong:**
```vue
<InRibbons text="Error occurred" type="default" />
```

**Correct:**
```vue
<InRibbons text="Error occurred" type="error" />
```

## Best Practices

- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined

