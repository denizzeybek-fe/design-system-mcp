# InToasts

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `""`

### `text`

**Type:** `String` | **Default:** `""`

### `type`

**Type:** `String` | **Default:** `"light"`

### `icon`

**Type:** `String` | **Default:** `""`

### `status`

**Type:** `Boolean` | **Default:** `false`

### `withIcon`

**Type:** `Boolean` | **Default:** `true`

### `withoutLeftMargin`

**Type:** `Boolean` | **Default:** `false`

### `actionButtonsConfig`

**Type:** `Array` | **Default:** `"[Function]"`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

## Examples

### Toast Manager with Queue

Manage multiple toasts with queuing system

```vue
<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <InToasts
        v-for="toast in activeToasts"
        :key="toast.id"
        :status="true"
        :text="toast.text"
        :type="toast.type"
        :actionButtonsConfig="toast.actions"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'light';
  duration?: number;
  actions?: Array<{ text: string; onClick: () => void }>;
}

const activeToasts = ref<Toast[]>([]);
let toastIdCounter = 0;

const showToast = (toast: Omit<Toast, 'id'>) => {
  const id = `toast-${toastIdCounter++}`;
  const duration = toast.duration || 3000;
  
  const newToast: Toast = {
    ...toast,
    id
  };
  
  activeToasts.value.push(newToast);
  
  // Auto-dismiss
  setTimeout(() => {
    removeToast(id);
  }, duration);
  
  return id;
};

const removeToast = (id: string) => {
  const index = activeToasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    activeToasts.value.splice(index, 1);
  }
};

// Expose methods
defineExpose({
  success: (text: string, actions?) => showToast({ text, type: 'success', actions }),
  error: (text: string, actions?) => showToast({ text, type: 'error', actions, duration: 5000 }),
  warning: (text: string, actions?) => showToast({ text, type: 'warning', actions }),
  info: (text: string, actions?) => showToast({ text, type: 'info', actions })
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
```

### Form Validation Toasts

Show validation errors and success messages

```vue
<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <!-- Form fields -->
      <button type="submit">Save</button>
    </form>
    
    <InToasts
      v-model:status="showSuccessToast"
      text="Form saved successfully"
      type="success"
    />
    
    <InToasts
      v-model:status="showErrorToast"
      :text="errorMessage"
      type="error"
      :actionButtonsConfig="[
        { text: 'Dismiss', onClick: () => showErrorToast = false }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showSuccessToast = ref(false);
const showErrorToast = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  try {
    // Validate
    const errors = validateForm();
    if (errors.length > 0) {
      errorMessage.value = `Please fix ${errors.length} error(s)`;
      showErrorToast.value = true;
      return;
    }
    
    // Save
    await api.save();
    
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 3000);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to save form';
    showErrorToast.value = true;
  }
};

const validateForm = () => {
  // Return validation errors
  return [];
};
</script>
```

### Background Task Notifications

Notify users about background operations completion

```vue
<template>
  <div>
    <button @click="startExport">Export Data</button>
    
    <InToasts
      v-model:status="showExportToast"
      :text="exportMessage"
      :type="exportStatus"
      :actionButtonsConfig="exportActions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const showExportToast = ref(false);
const exportMessage = ref('');
const exportStatus = ref<'success' | 'error' | 'info'>('info');
const downloadUrl = ref('');

const exportActions = computed(() => {
  if (exportStatus.value === 'success' && downloadUrl.value) {
    return [
      { 
        text: 'Download', 
        variant: 'primary',
        onClick: () => window.open(downloadUrl.value, '_blank')
      }
    ];
  }
  if (exportStatus.value === 'error') {
    return [
      { text: 'Retry', onClick: startExport }
    ];
  }
  return [];
});

const startExport = async () => {
  exportMessage.value = 'Exporting data...';
  exportStatus.value = 'info';
  showExportToast.value = true;
  
  try {
    const result = await api.exportData();
    
    exportMessage.value = 'Export completed successfully';
    exportStatus.value = 'success';
    downloadUrl.value = result.downloadUrl;
    
    // Keep toast open for download
    setTimeout(() => {
      showExportToast.value = false;
    }, 10000);
  } catch (error) {
    exportMessage.value = 'Export failed. Please try again.';
    exportStatus.value = 'error';
    
    setTimeout(() => {
      showExportToast.value = false;
    }, 5000);
  }
};
</script>
```

## Common Mistakes

ℹ️ **Not auto-dismissing toasts**

ℹ️ **Using toasts for critical information**

ℹ️ **Showing generic 'Success' or 'Error' messages**

ℹ️ **Not sanitizing user-generated content**

## Best Practices

- **Keep Messages Concise:** Toast messages should be 1-2 short sentences, max 60-80 characters
- **Use Appropriate Types for Context:** Match toast type to action result - success for confirmations, error for failures
- **Limit Action Buttons to 1-2 Maximum:** Too many buttons clutter toast and users can't click before auto-dismiss
- **Adjust Duration Based on Importance:** Critical errors stay longer, simple confirmations dismiss quickly

