# InDrawer

**Version:** v1

## Props

### `closeButtonStatus`

**Type:** `Boolean` | **Default:** `true`

### `closeOnOutsideClick`

**Type:** `Boolean` | **Default:** `true`

### `fullWidthContentStatus`

**Type:** `Boolean` | **Default:** `false`

### `descriptionStatus`

**Type:** `Boolean` | **Default:** `true`

### `descriptionText`

**Type:** `String` | **Default:** `""`

### `footerStatus`

**Type:** `Boolean` | **Default:** `true`

### `id`

**Type:** `String` | **Default:** `""`

### `overlayStatus`

**Type:** `Boolean` | **Default:** `true`

### `size`

**Type:** `String` | **Required**

### `state`

**Type:** `String` | **Default:** `"default"`

### `status`

**Type:** `Boolean` | **Default:** `true`

### `titleText`

**Type:** `String` | **Required**

### `footerButtonGroupOptions`

**Type:** `Object` | **Default:** `"[Function]"`

## Events

### `onCloseEvent`

## Enums

### STATES

- `default`
- `danger`
- `warning`

### SIZES

- `small`
- `medium`
- `large`

## Examples

### Multi-Step Wizard Drawer

Drawer with stepped workflow and navigation

```vue
<template>
  <InDrawer
    v-model:status="showWizard"
    size="medium"
    :titleText="currentStep.title"
    :descriptionText="currentStep.description"
    :closeButtonStatus="false"
    :closeOnOutsideClick="false"
    :footerButtonGroupOptions="footerButtons"
  >
    <template #contentSlot>
      <!-- Step indicator -->
      <div class="wizard-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          :class="{ active: currentStepIndex === index, completed: currentStepIndex > index }"
          class="step"
        >
          {{ step.title }}
        </div>
      </div>
      
      <!-- Step content -->
      <component :is="currentStep.component" v-model="formData" />
    </template>
  </InDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const showWizard = ref(false);
const currentStepIndex = ref(0);
const formData = ref({});

const steps = [
  { title: 'Basic Info', description: 'Enter campaign details', component: BasicInfoStep },
  { title: 'Target Audience', description: 'Select audience segments', component: AudienceStep },
  { title: 'Content', description: 'Design campaign content', component: ContentStep },
  { title: 'Review', description: 'Review and confirm', component: ReviewStep }
];

const currentStep = computed(() => steps[currentStepIndex.value]);

const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1);

const footerButtons = computed(() => ({
  primaryButton: {
    text: isLastStep.value ? 'Create Campaign' : 'Next',
    onClick: isLastStep.value ? handleSubmit : nextStep
  },
  secondaryButton: isFirstStep.value ? {
    text: 'Cancel',
    onClick: () => showWizard.value = false
  } : {
    text: 'Back',
    onClick: prevStep
  }
}));

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  }
};

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const handleSubmit = async () => {
  await api.createCampaign(formData.value);
  showWizard.value = false;
};
</script>
```

### Filter Panel Drawer

Drawer for complex filtering with apply/reset

```vue
<template>
  <InDrawer
    v-model:status="showFilters"
    size="small"
    titleText="Filters"
    descriptionText="Refine your search results"
    :footerButtonGroupOptions="{
      primaryButton: { text: 'Apply Filters', onClick: applyFilters },
      secondaryButton: { text: 'Reset', onClick: resetFilters }
    }"
  >
    <template #contentSlot>
      <div class="filter-section">
        <h4>Status</h4>
        <InCheckBoxV2
          v-for="status in statusOptions"
          :key="status.value"
          v-model="filters.status"
          :value="status.value"
          :label="status.label"
        />
      </div>
      
      <div class="filter-section">
        <h4>Date Range</h4>
        <InDatePickerV2
          v-model="filters.dateRange"
          range
        />
      </div>
      
      <div class="filter-section">
        <h4>Category</h4>
        <InMultiSelect
          v-model="filters.categories"
          :options="categoryOptions"
          placeholder="Select categories"
        />
      </div>
    </template>
  </InDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showFilters = ref(false);
const filters = ref({
  status: [],
  dateRange: null,
  categories: []
});

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' }
];

const categoryOptions = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push Notification' }
];

const applyFilters = () => {
  // Apply filters to main view
  emit('filtersApplied', filters.value);
  showFilters.value = false;
};

const resetFilters = () => {
  filters.value = {
    status: [],
    dateRange: null,
    categories: []
  };
};
</script>
```

### Detail View Drawer

Read-only drawer showing entity details

```vue
<template>
  <InDrawer
    v-model:status="showDetails"
    size="medium"
    :titleText="user.name"
    :descriptionText="user.email"
    :footerStatus="false"
  >
    <template #headerRightSlot>
      <InButton
        variant="secondary"
        size="small"
        @click="editUser"
      >
        Edit
      </InButton>
    </template>
    
    <template #contentSlot>
      <div class="detail-section">
        <h3>Profile Information</h3>
        <div class="detail-row">
          <span class="label">Role:</span>
          <InTagsText :text="user.role" type="primary" />
        </div>
        <div class="detail-row">
          <span class="label">Department:</span>
          <span>{{ user.department }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Joined:</span>
          <span>{{ formatDate(user.joinedDate) }}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>Permissions</h3>
        <InTagsText
          v-for="permission in user.permissions"
          :key="permission"
          :text="permission"
          type="info"
          class="mr-2"
        />
      </div>
      
      <div class="detail-section">
        <h3>Recent Activity</h3>
        <InDataTableV2
          :data="user.recentActivity"
          :columns="activityColumns"
        />
      </div>
    </template>
  </InDrawer>
</template>
```

## Common Mistakes

ℹ️ **Not using v-model:status for two-way binding**

ℹ️ **Using large drawer for simple content**

ℹ️ **Not handling close event cleanup**

ℹ️ **Allowing outside click close for critical actions**

## Best Practices

- **Use v-model:status for Two-Way Binding:** Always use v-model:status to sync drawer state when user closes it
- **Choose Appropriate Size for Content:** Match drawer size to content complexity
- **Use Danger State for Destructive Actions:** Set state='danger' for delete/destructive confirmations
- **Disable Close for Critical Workflows:** Prevent accidental closure during important processes

