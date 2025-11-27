# InTabs

**Version:** v1

## Props

### `tabsList`

**Type:** `Array` | **Required**

### `useRouter`

**Type:** `Boolean` | **Default:** `true`

### `withSpacing`

**Type:** `String` | **Default:** `""`

### `dropdownTabs`

**Type:** `Boolean` | **Default:** `false`

### `dropdownVariationTabs`

**Type:** `Boolean` | **Default:** `false`

### `addNewTabActive`

**Type:** `Boolean` | **Default:** `false`

### `addTabDropdownSearchStatus`

**Type:** `Boolean` | **Default:** `true`

### `addTabDropdownOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `addNewTabFunctionality`

**Type:** `String` | **Default:** `"options"`

### `useEmitForRemove`

**Type:** `Boolean` | **Default:** `false`

### `dynamicDropdownTabs`

**Type:** `Boolean` | **Default:** `false`

### `addNewTabTooltipStatus`

**Type:** `Boolean` | **Default:** `false`

### `addNewTabTooltipText`

**Type:** `String` | **Default:** `""`

### `draggable`

**Type:** `Boolean` | **Default:** `false`

### `preventTabSelectionOnClick`

**Type:** `Boolean` | **Default:** `false`

### `boxStyle`

**Type:** `Boolean` | **Default:** `false`

### `renameOption`

**Type:** `Boolean` | **Default:** `false`

### `removeOption`

**Type:** `Boolean` | **Default:** `true`

### `duplicateOption`

**Type:** `Boolean` | **Default:** `false`

### `isDuplicateVisible`

**Type:** `Boolean` | **Default:** `false`

### `isMixedMode`

**Type:** `Boolean` | **Default:** `false`

### `isRenameDropdown`

**Type:** `Boolean` | **Default:** `false`

### `removeButtonText`

**Type:** `String` | **Default:** `"Remove"`

### `disableDragIconClick`

**Type:** `Boolean` | **Default:** `true`

### `maxTabDisplayTextLength`

**Type:** `Number` | **Default:** `0`

### `dropdownOffset`

**Type:** `Number` | **Default:** `0`

### `localizationOption`

**Type:** `Boolean` | **Default:** `false`

## Events

### `rename`

### `click`

### `removeTab`

### `addNewTab`

### `tabPercentageInput`

### `duplicate`

### `delete`

### `localization`

### `tabTextInputUpdate`

### `changeOrder`

## Examples

### Dashboard with Tab Navigation

Main dashboard with routed tabs and notification badges

```vue
<template>
  <div class="dashboard">
    <InTabs
      :tabsList="dashboardTabs"
      :useRouter="true"
      :dropdownTabs="true"
      :maxTabDisplayTextLength="25"
    />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotificationStore } from '@/stores/notifications';

const notificationStore = useNotificationStore();

const dashboardTabs = computed(() => [
  { 
    id: 'overview', 
    name: 'Overview', 
    route: '/dashboard/overview' 
  },
  { 
    id: 'campaigns', 
    name: 'Campaigns', 
    route: '/dashboard/campaigns',
    badge: notificationStore.pendingCampaigns
  },
  { 
    id: 'segments', 
    name: 'Audience Segments', 
    route: '/dashboard/segments' 
  },
  { 
    id: 'analytics', 
    name: 'Analytics & Reports', 
    route: '/dashboard/analytics',
    badge: notificationStore.newReports
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    route: '/dashboard/settings' 
  }
]);
</script>
```

### Customizable Widget Dashboard

Draggable tabs with add/remove/duplicate functionality

```vue
<template>
  <div class="widget-dashboard">
    <InTabs
      :tabsList="widgets"
      :draggable="true"
      :addNewTabActive="true"
      :addNewTabFunctionality="'options'"
      :addTabDropdownOptions="widgetTypes"
      :renameOption="true"
      :removeOption="true"
      :duplicateOption="true"
      :useRouter="false"
      @click="selectWidget"
      @changeOrder="saveWidgetOrder"
      @addNewTab="addWidget"
      @removeTab="removeWidget"
      @rename="showRenameDialog"
      @duplicate="duplicateWidget"
    />
    <div class="widget-content">
      <component :is="currentWidget.component" v-if="currentWidget" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const widgets = ref([
  { id: 1, name: 'Sales Chart', type: 'chart' },
  { id: 2, name: 'User Stats', type: 'stats' }
]);

const widgetTypes = [
  { label: 'Add Chart', value: 'chart', icon: 'chart-line' },
  { label: 'Add Table', value: 'table', icon: 'table' },
  { label: 'Add Stats', value: 'stats', icon: 'calculator' }
];

const currentWidget = ref(widgets.value[0]);
let nextWidgetId = 3;

const selectWidget = (widget) => {
  currentWidget.value = widget;
};

const saveWidgetOrder = ({ newOrder }) => {
  widgets.value = newOrder;
  localStorage.setItem('widgetOrder', JSON.stringify(newOrder));
};

const addWidget = (option) => {
  const newWidget = {
    id: nextWidgetId++,
    name: `New ${option.label}`,
    type: option.value
  };
  widgets.value.push(newWidget);
  currentWidget.value = newWidget;
};

const removeWidget = ({ id }) => {
  const index = widgets.value.findIndex(w => w.id === id);
  widgets.value.splice(index, 1);
  if (currentWidget.value.id === id) {
    currentWidget.value = widgets.value[0];
  }
};

const duplicateWidget = ({ id, name }) => {
  const original = widgets.value.find(w => w.id === id);
  const duplicate = {
    ...original,
    id: nextWidgetId++,
    name: `${name} (Copy)`
  };
  widgets.value.push(duplicate);
};

const showRenameDialog = ({ id }) => {
  // Show rename modal/prompt
  console.log('Rename widget:', id);
};
</script>
```

### Box-Style Progress Tabs

Progress indicator tabs with percentage tracking

```vue
<template>
  <div class="onboarding">
    <InTabs
      :tabsList="steps"
      :boxStyle="true"
      :useRouter="false"
      :preventTabSelectionOnClick="true"
      @click="goToStep"
    />
    <div class="step-content">
      <component :is="currentStepComponent" @complete="completeStep" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const currentStepIndex = ref(0);

const steps = computed(() => [
  { 
    id: 'account', 
    name: 'Account Setup', 
    percentage: currentStepIndex.value > 0 ? 100 : 0,
    disabled: false
  },
  { 
    id: 'profile', 
    name: 'Profile Info', 
    percentage: currentStepIndex.value > 1 ? 100 : (currentStepIndex.value === 1 ? 50 : 0),
    disabled: currentStepIndex.value < 1
  },
  { 
    id: 'preferences', 
    name: 'Preferences', 
    percentage: currentStepIndex.value > 2 ? 100 : 0,
    disabled: currentStepIndex.value < 2
  },
  { 
    id: 'complete', 
    name: 'Complete', 
    percentage: currentStepIndex.value === 3 ? 100 : 0,
    disabled: currentStepIndex.value < 3
  }
]);

const goToStep = (step) => {
  const index = steps.value.findIndex(s => s.id === step.id);
  if (!step.disabled && index <= currentStepIndex.value) {
    currentStepIndex.value = index;
  }
};

const completeStep = () => {
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++;
  }
};
</script>
```

## Common Mistakes

ℹ️ **Using array index as tab ID**

ℹ️ **Forgetting to handle changeOrder event**

ℹ️ **Using useRouter=true without route property**

ℹ️ **Not truncating long tab names**

## Best Practices

- **Limit Active Tab Count:** Keep visible tabs to 5-7 maximum, use dropdownTabs for overflow
- **Always Provide Unique IDs:** Use stable, unique identifiers for tab IDs, not array indices
- **Disable Navigation During Loading:** Temporarily disable tabs during async operations to prevent race conditions
- **Use Badge Numbers Sparingly:** Only show badges for actionable notifications, not just counts

