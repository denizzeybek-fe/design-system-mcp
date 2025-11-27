# InModalV2

**Version:** v2

## Props

### `id`

**Type:** `String` | **Default:** `""`

### `status`

**Type:** `Boolean` | **Default:** `false`

### `state`

**Type:** `String` | **Default:** `"default"`

### `size`

**Type:** `String` | **Default:** `"small"`

### `titleText`

**Type:** `String` | **Default:** `"Modal title"`

### `descriptionStatus`

**Type:** `Boolean` | **Default:** `true`

### `descriptionText`

**Type:** `String` | **Default:** `""`

### `footerStatus`

**Type:** `Boolean` | **Default:** `true`

### `closeButtonStatus`

**Type:** `Boolean` | **Default:** `true`

### `closeOnOutsideClick`

**Type:** `Boolean` | **Default:** `true`

### `footerButtonGroupOptions`

**Type:** `Object` | **Default:** `"[Function]"`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `fullWidthContentStatus`

**Type:** `Boolean` | **Default:** `false`

## Events

### `onCloseEvent`

### `cancelOrBackButtonEvent`

### `secondaryButtonEvent`

### `primaryButtonEvent`

## Enums

### FOOTER_BUTTON_GROUP_OPTIONS

- `primary`
- `solid`
- `Primary`

### STATES

- `default`
- `primary`
- `warning`
- `danger`

## Examples

### Confirmation Dialog

Delete confirmation modal with danger state

```vue
<script setup>
import { ref } from 'vue';
import { InModalV2 } from '@useinsider/design-system-vue';

const showDeleteModal = ref(false);

const handleDelete = () => {
  // Perform delete
  console.log('Deleting...');
  showDeleteModal.value = false;
};

const footerButtons = {
  cancelButton: { labelText: 'Cancel' },
  primaryButton: { labelText: 'Delete', type: 'danger' }
};
</script>

<template>
  <InModalV2
    v-model:status="showDeleteModal"
    state="danger"
    size="small"
    title-text="Delete User"
    description-text="This action cannot be undone."
    :footer-button-group-options="footerButtons"
    :close-on-outside-click="false"
    @primaryButtonEvent="handleDelete"
    @cancelOrBackButtonEvent="showDeleteModal = false"
  >
    <p>Are you sure you want to delete this user?</p>
  </InModalV2>
</template>
```

### Form Modal with Loading State

Modal with form and loading state on submit

```vue
<script setup>
import { ref } from 'vue';
import { InModalV2 } from '@useinsider/design-system-vue';

const showModal = ref(false);
const loading = ref(false);
const formData = ref({ name: '', email: '' });

const handleSubmit = async () => {
  loading.value = true;
  try {
    await api.createUser(formData.value);
    showModal.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const footerButtons = computed(() => ({
  cancelButton: { labelText: 'Cancel' },
  primaryButton: {
    labelText: 'Create User',
    type: 'primary',
    loading: loading.value
  }
}));
</script>

<template>
  <InModalV2
    v-model:status="showModal"
    state="primary"
    size="medium"
    title-text="Create New User"
    :footer-button-group-options="footerButtons"
    @primaryButtonEvent="handleSubmit"
    @cancelOrBackButtonEvent="showModal = false"
  >
    <div class="form">
      <input v-model="formData.name" placeholder="Name" />
      <input v-model="formData.email" placeholder="Email" />
    </div>
  </InModalV2>
</template>
```

### Information Modal

Simple information modal with single close button

```vue
<script setup>
import { ref } from 'vue';
import { InModalV2 } from '@useinsider/design-system-vue';

const showInfo = ref(false);

const footerButtons = {
  primaryButton: { labelText: 'Got it', type: 'primary' }
};
</script>

<template>
  <InModalV2
    v-model:status="showInfo"
    size="small"
    title-text="Welcome!"
    description-text="Here are some tips to get started"
    :footer-button-group-options="footerButtons"
    @primaryButtonEvent="showInfo = false"
  >
    <ul>
      <li>Tip 1: Start with the dashboard</li>
      <li>Tip 2: Check your settings</li>
      <li>Tip 3: Invite team members</li>
    </ul>
  </InModalV2>
</template>
```

## Common Mistakes

ℹ️ **Forgetting v-model:status binding**

ℹ️ **Not handling button events**

ℹ️ **Using wrong state for destructive actions**

ℹ️ **Allowing outside click for critical actions**

## Best Practices

- **Use Appropriate State for Context:** Match modal state to action type for clear visual communication
- **Disable Primary Button During Async Operations:** Show loading state and disable button during API calls
- **Keep Modal Content Focused:** Use appropriate size and avoid overloading with content
- **Always Close Modal After Successful Action:** Update v-model:status to close modal after async operations complete

