# InCheckBoxV2

**Version:** v2

## Props

### `id`

**Type:** `String` | **Default:** `""`

### `name`

**Type:** `String | Number` | **Default:** `""`

### `labelText`

**Type:** `String` | **Default:** `""`

### `descriptionText`

**Type:** `String` | **Default:** `""`

### `stateMessage`

**Type:** `String` | **Default:** `""`

### `tooltipStatus`

**Type:** `Boolean` | **Default:** `false`

### `descriptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `labelStatus`

**Type:** `Boolean` | **Default:** `true`

### `boldLabel`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `indeterminate`

**Type:** `Boolean` | **Default:** `false`

### `checked`

**Type:** `Boolean` | **Default:** `false`

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `options`

**Type:** `Array` | **Default:** `"[Function]"`

### `state`

**Type:** `any` | **Default:** `"default"`

## Events

### `click`

## Examples

### Basic Single Checkbox

Simple checkbox with label for terms acceptance

```vue
<template>
  <InCheckBoxV2
    id="terms"
    name="terms"
    label-text="I accept the terms and conditions"
    :checked="accepted"
    @click="accepted = $event"
  />
</template>

<script setup>
import { ref } from 'vue';

const accepted = ref(false);
</script>
```

### Checkbox with Description

Checkbox with additional description text for context

```vue
<template>
  <InCheckBoxV2
    id="newsletter"
    name="newsletter"
    label-text="Subscribe to newsletter"
    description-text="Receive weekly updates about new features and products"
    :description-status="true"
    :checked="subscribed"
    @click="subscribed = $event"
  />
</template>

<script setup>
import { ref } from 'vue';

const subscribed = ref(false);
</script>
```

### Indeterminate State (Select All)

Master checkbox showing partial selection state

```vue
<template>
  <div>
    <InCheckBoxV2
      id="select-all"
      label-text="Select all items"
      :checked="allSelected"
      :indeterminate="someSelected"
      @click="toggleAll"
    />
    
    <div v-for="item in items" :key="item.id">
      <InCheckBoxV2
        :id="`item-${item.id}`"
        :label-text="item.name"
        :checked="selectedItems.includes(item.id)"
        @click="toggleItem(item.id, $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
];

const selectedItems = ref([1]);

const allSelected = computed(() => 
  selectedItems.value.length === items.length
);

const someSelected = computed(() => 
  selectedItems.value.length > 0 && !allSelected.value
);

const toggleAll = (checked) => {
  selectedItems.value = checked ? items.map(i => i.id) : [];
};

const toggleItem = (id, checked) => {
  if (checked) {
    selectedItems.value.push(id);
  } else {
    selectedItems.value = selectedItems.value.filter(i => i !== id);
  }
};
</script>
```

### Checkbox Group with Options

Multiple checkboxes rendered from options array

```vue
<template>
  <InCheckBoxV2
    id="preferences"
    name="preferences"
    label-text="Select your preferences"
    :options="preferences"
    @click="handlePreferences"
  />
  
  <p>Selected: {{ selectedPreferences }}</p>
</template>

<script setup>
import { ref } from 'vue';

const preferences = [
  { id: 'email', label: 'Email notifications', value: 'email', checked: true },
  { id: 'sms', label: 'SMS notifications', value: 'sms', checked: false },
  { id: 'push', label: 'Push notifications', value: 'push', checked: false }
];

const selectedPreferences = ref(['email']);

const handlePreferences = (selected) => {
  selectedPreferences.value = selected;
  console.log('Preferences updated:', selected);
};
</script>
```

### Form Validation with Error State

Required checkbox with validation and error message

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <InCheckBoxV2
      id="terms"
      name="terms"
      label-text="I accept the terms and conditions"
      :checked="formData.termsAccepted"
      :state="errors.terms ? 'danger' : 'default'"
      :state-message="errors.terms"
      @click="formData.termsAccepted = $event; validateTerms();"
    />
    
    <button type="submit" :disabled="!formData.termsAccepted">
      Continue
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';

const formData = reactive({
  termsAccepted: false
});

const errors = ref({});

const validateTerms = () => {
  if (!formData.termsAccepted) {
    errors.value.terms = 'You must accept the terms to continue';
  } else {
    delete errors.value.terms;
  }
};

const handleSubmit = () => {
  validateTerms();
  if (Object.keys(errors.value).length === 0) {
    console.log('Form submitted!');
  }
};
</script>
```

### Disabled Checkbox

Checkbox that cannot be interacted with

```vue
<template>
  <InCheckBoxV2
    id="locked"
    name="locked"
    label-text="This feature is locked"
    :checked="true"
    :disabled-status="true"
  />
</template>
```

### Skeleton Loading State

Shows skeleton loader while checkbox data loads

```vue
<template>
  <InCheckBoxV2
    id="loading"
    name="loading"
    :skeleton-status="isLoading"
    :skeleton-sizing="{ width: 120, height: 24 }"
    label-text="Loading option..."
    :checked="value"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const value = ref(false);

onMounted(async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  isLoading.value = false;
});
</script>
```

### Settings Panel

Multiple checkboxes for user preferences

```vue
<template>
  <div class="settings-panel">
    <h3>Privacy Settings</h3>
    
    <InCheckBoxV2
      id="public-profile"
      name="public-profile"
      label-text="Make profile public"
      description-text="Your profile will be visible to all users"
      :description-status="true"
      :checked="settings.publicProfile"
      @click="settings.publicProfile = $event"
    />
    
    <InCheckBoxV2
      id="email-notifications"
      name="email-notifications"
      label-text="Email notifications"
      description-text="Receive updates via email"
      :description-status="true"
      :checked="settings.emailNotifications"
      @click="settings.emailNotifications = $event"
    />
    
    <InCheckBoxV2
      id="show-activity"
      name="show-activity"
      label-text="Show activity status"
      description-text="Let others see when you're online"
      :description-status="true"
      :checked="settings.showActivity"
      @click="settings.showActivity = $event"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive({
  publicProfile: true,
  emailNotifications: false,
  showActivity: true
});
</script>

<style scoped>
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

### Data Table Row Selection

Checkboxes for bulk row selection in tables

```vue
<template>
  <div>
    <InCheckBoxV2
      id="select-all-rows"
      label-text="Select all"
      :checked="allRowsSelected"
      :indeterminate="someRowsSelected"
      @click="toggleAllRows"
    />
    
    <table>
      <tr v-for="row in tableData" :key="row.id">
        <td>
          <InCheckBoxV2
            :id="`row-${row.id}`"
            :label-text="row.name"
            :checked="selectedRows.includes(row.id)"
            @click="toggleRow(row.id, $event)"
          />
        </td>
      </tr>
    </table>
    
    <p>Selected: {{ selectedRows.length }} / {{ tableData.length }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const tableData = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' }
];

const selectedRows = ref([1, 3]);

const allRowsSelected = computed(() => 
  selectedRows.value.length === tableData.length
);

const someRowsSelected = computed(() => 
  selectedRows.value.length > 0 && !allRowsSelected.value
);

const toggleAllRows = (checked) => {
  selectedRows.value = checked 
    ? tableData.map(r => r.id) 
    : [];
};

const toggleRow = (id, checked) => {
  if (checked) {
    selectedRows.value.push(id);
  } else {
    selectedRows.value = selectedRows.value.filter(r => r !== id);
  }
};
</script>
```

## Common Mistakes

ℹ️ **Using simple string array for options**

options prop requires array of objects, not strings

**Wrong:**
```vue
:options="['Option 1', 'Option 2', 'Option 3']"
```

**Correct:**
```vue
:options="[{ id: 'opt1', label: 'Option 1', value: 'value1' }, { id: 'opt2', label: 'Option 2', value: 'value2' }]"
```

ℹ️ **Not handling click event**

Checkbox state must be tracked with @click handler

**Wrong:**
```vue
<InCheckBoxV2 id="checkbox" label-text="Accept" />
```

**Correct:**
```vue
<InCheckBoxV2 id="checkbox" label-text="Accept" :checked="accepted" @click="accepted = $event" />
```

ℹ️ **Mixing single checkbox with options array**

Either use single checkbox mode OR checkbox group mode, not both

**Wrong:**
```vue
<InCheckBoxV2 label-text="Single" :options="[...]" />
```

**Correct:**
```vue
<!-- Single: -->
<InCheckBoxV2 label-text="Accept Terms" />
<!-- OR Group: -->
<InCheckBoxV2 :options="[...]" />
```

ℹ️ **Not providing accessible labels**

Each checkbox should have clear, descriptive label

**Wrong:**
```vue
label-text="Yes"
```

**Correct:**
```vue
label-text="I agree to the Terms and Conditions"
```

ℹ️ **Using @change instead of @click**

InCheckBoxV2 uses click event, not change

**Wrong:**
```vue
@change="handleChange"
```

**Correct:**
```vue
@click="handleClick"
```

ℹ️ **Setting indeterminate without proper logic**

Indeterminate state should only show for partial selection

**Wrong:**
```vue
:indeterminate="true"
```

**Correct:**
```vue
:indeterminate="selectedCount > 0 && selectedCount < totalCount"
```

## Best Practices

- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined

