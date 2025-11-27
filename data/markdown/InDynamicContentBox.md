# InDynamicContentBox

**Version:** v1

## Props

### `id`

**Type:** `String` | **Required**

### `fieldsConfig`

**Type:** `Object` | **Default:** `"[Function]"`

### `dynamicContent`

**Type:** `Object` | **Default:** `"[Function]"`

### `theme`

**Type:** `String` | **Default:** `"light"`

### `variant`

**Type:** `String` | **Default:** `"neutral"`

### `titleStatus`

**Type:** `Boolean` | **Default:** `true`

### `titleText`

**Type:** `String` | **Default:** `""`

### `descriptionStatus`

**Type:** `Boolean` | **Default:** `true`

### `descriptionText`

**Type:** `String` | **Default:** `""`

### `size`

**Type:** `String` | **Default:** `"large"`

### `fullWidthContentStatus`

**Type:** `Boolean` | **Default:** `false`

### `buttonOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `hasGroupLevelPartners`

**Type:** `Boolean` | **Default:** `false`

### `groupLevelPartners`

**Type:** `Array` | **Default:** `"[Function]"`

### `hasConstantEvent`

**Type:** `Boolean` | **Default:** `false`

### `hasConstantAttribute`

**Type:** `Boolean` | **Default:** `false`

### `constantEventInfoMessage`

**Type:** `String` | **Default:** `"defaultConstantEventInfoMessage"`

### `constantAttributeInfoMessage`

**Type:** `String` | **Default:** `"defaultConstantAttributeInfoMessage"`

### `constantSelectedAttributeInfoMessage`

**Type:** `String` | **Default:** `"defaultConstantSelectedAttributeInfoMessage"`

### `constantEventWarningMessage`

**Type:** `String` | **Default:** `"defaultConstantEventWarningMessage"`

### `constantAttributeWarningMessage`

**Type:** `String` | **Default:** `"defaultConstantAttributeWarningMessage"`

### `groupingEventWarningText`

**Type:** `String` | **Default:** `"defaultGroupEventsWarningMessage"`

### `groupEventsCheckboxLabel`

**Type:** `String` | **Default:** `"defaultGroupEventsCheckboxLabel"`

### `activateGroupingEvents`

**Type:** `Boolean` | **Default:** `false`

### `isGroupingEvents`

**Type:** `Boolean` | **Default:** `false`

### `groupEventsTooltip`

**Type:** `String` | **Default:** `"defaultGroupEventsTooltip"`

### `groupEventsDisabledTooltip`

**Type:** `String` | **Default:** `"defaultGroupEventsDisabledTooltip"`

### `groupedEvents`

**Type:** `Array` | **Default:** `"[Function]"`

### `maxChildHeight`

**Type:** `Number` | **Default:** `300`

### `lazyLoadChunkSize`

**Type:** `Number` | **Default:** `100`

### `preloadBunchSize`

**Type:** `Number` | **Default:** `10`

## Events

### `setEventAsGrouped`

### `updateGroupingEvents`

## Examples

### Complete Marketing Analytics Configurator

Advanced configuration interface for selecting events, attributes, and partners with grouping and constant fields

```vue
<template>
  <div class="analytics-configurator">
    <h1>Analytics Configuration</h1>
    
    <InDynamicContentBox
      id="analytics-config"
      v-model:dynamicContent="config"
      v-model:isGroupingEvents="groupingEnabled"
      :fieldsConfig="fieldsConfig"
      :hasGroupLevelPartners="true"
      :groupLevelPartners="analyticsPartners"
      :hasConstantEvent="true"
      :hasConstantAttribute="true"
      :activateGroupingEvents="true"
      :groupedEvents="groupedEvents"
      :buttonOptions="actionButtons"
      :maxChildHeight="400"
      :lazyLoadChunkSize="100"
      theme="light"
      variant="primary"
      size="large"
      titleText="Configure Analytics Tracking"
      descriptionText="Select events and attributes to track across your analytics platforms"
      constantEventInfoMessage="These events are tracked automatically on all pages"
      constantAttributeInfoMessage="These attributes are included with every event"
      constantEventWarningMessage="Removing constant events may break existing reports"
      constantAttributeWarningMessage="Removing constant attributes may affect data quality"
      groupEventsCheckboxLabel="Enable event grouping for better organization"
      groupEventsTooltip="Group similar events together to simplify your analytics setup"
      groupingEventWarningText="Grouped events will be combined in reports"
      @setEventAsGrouped="handleEventGrouping"
      @updateGroupingEvents="handleGroupingToggle"
    />

    <!-- Summary -->
    <div class="config-summary">
      <h3>Configuration Summary</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <label>Selected Events:</label>
          <span>{{ config.selectedEvents?.length || 0 }}</span>
        </div>
        <div class="summary-item">
          <label>Selected Attributes:</label>
          <span>{{ config.selectedAttributes?.length || 0 }}</span>
        </div>
        <div class="summary-item">
          <label>Active Partners:</label>
          <span>{{ config.selectedPartners?.length || 0 }}</span>
        </div>
        <div class="summary-item">
          <label>Grouped Events:</label>
          <span>{{ groupedEvents.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { InDynamicContentBox } from '@useinsider/design-system-vue';

interface DynamicContent {
  selectedEvents?: string[];
  selectedAttributes?: string[];
  selectedPartners?: string[];
}

const config = ref<DynamicContent>({
  selectedEvents: ['page_view', 'session_start'],
  selectedAttributes: ['user.id', 'user.email'],
  selectedPartners: ['google_analytics']
});

const groupingEnabled = ref(false);
const groupedEvents = ref<string[]>([]);

const analyticsPartners = [
  {
    id: 'google_analytics',
    name: 'google_analytics',
    label: 'Google Analytics 4',
    logo: '/logos/ga4.png',
    enabled: true
  },
  {
    id: 'facebook_pixel',
    name: 'facebook_pixel',
    label: 'Meta Pixel',
    logo: '/logos/meta.png',
    enabled: true
  },
  {
    id: 'mixpanel',
    name: 'mixpanel',
    label: 'Mixpanel',
    logo: '/logos/mixpanel.png',
    enabled: true
  },
  {
    id: 'amplitude',
    name: 'amplitude',
    label: 'Amplitude',
    logo: '/logos/amplitude.png',
    enabled: false
  }
];

const fieldsConfig = {
  events: [
    // Page Events
    {
      id: 'page_view',
      name: 'page_view',
      label: 'Page View',
      category: 'Page Events',
      isConstant: true
    },
    {
      id: 'session_start',
      name: 'session_start',
      label: 'Session Start',
      category: 'Page Events',
      isConstant: true
    },
    {
      id: 'scroll',
      name: 'scroll',
      label: 'Scroll Depth',
      category: 'Page Events'
    },
    
    // Product Events
    {
      id: 'product_view',
      name: 'product_view',
      label: 'Product View',
      category: 'Product Events'
    },
    {
      id: 'add_to_cart',
      name: 'add_to_cart',
      label: 'Add to Cart',
      category: 'Product Events'
    },
    {
      id: 'remove_from_cart',
      name: 'remove_from_cart',
      label: 'Remove from Cart',
      category: 'Product Events'
    },
    
    // Conversion Events
    {
      id: 'begin_checkout',
      name: 'begin_checkout',
      label: 'Begin Checkout',
      category: 'Conversion Events'
    },
    {
      id: 'purchase',
      name: 'purchase',
      label: 'Purchase',
      category: 'Conversion Events'
    },
    {
      id: 'refund',
      name: 'refund',
      label: 'Refund',
      category: 'Conversion Events'
    },
    
    // User Events
    {
      id: 'login',
      name: 'login',
      label: 'Login',
      category: 'User Events'
    },
    {
      id: 'sign_up',
      name: 'sign_up',
      label: 'Sign Up',
      category: 'User Events'
    },
    {
      id: 'profile_update',
      name: 'profile_update',
      label: 'Profile Update',
      category: 'User Events'
    },
    
    // Engagement Events
    {
      id: 'search',
      name: 'search',
      label: 'Search',
      category: 'Engagement'
    },
    {
      id: 'share',
      name: 'share',
      label: 'Share',
      category: 'Engagement'
    },
    {
      id: 'video_play',
      name: 'video_play',
      label: 'Video Play',
      category: 'Engagement'
    }
  ],
  
  attributes: [
    // User Attributes (Constant)
    {
      id: 'user.id',
      name: 'user.id',
      label: 'User ID',
      category: 'User',
      type: 'string',
      isConstant: true
    },
    {
      id: 'user.email',
      name: 'user.email',
      label: 'Email',
      category: 'User',
      type: 'string',
      isConstant: true
    },
    {
      id: 'user.name',
      name: 'user.name',
      label: 'Name',
      category: 'User',
      type: 'string'
    },
    {
      id: 'user.country',
      name: 'user.country',
      label: 'Country',
      category: 'User',
      type: 'string'
    },
    
    // Product Attributes
    {
      id: 'product.id',
      name: 'product.id',
      label: 'Product ID',
      category: 'Product',
      type: 'string'
    },
    {
      id: 'product.name',
      name: 'product.name',
      label: 'Product Name',
      category: 'Product',
      type: 'string'
    },
    {
      id: 'product.price',
      name: 'product.price',
      label: 'Price',
      category: 'Product',
      type: 'number'
    },
    {
      id: 'product.category',
      name: 'product.category',
      label: 'Category',
      category: 'Product',
      type: 'string'
    },
    
    // Transaction Attributes
    {
      id: 'transaction.id',
      name: 'transaction.id',
      label: 'Transaction ID',
      category: 'Transaction',
      type: 'string'
    },
    {
      id: 'transaction.revenue',
      name: 'transaction.revenue',
      label: 'Revenue',
      category: 'Transaction',
      type: 'number'
    },
    {
      id: 'transaction.tax',
      name: 'transaction.tax',
      label: 'Tax',
      category: 'Transaction',
      type: 'number'
    },
    {
      id: 'transaction.shipping',
      name: 'transaction.shipping',
      label: 'Shipping Cost',
      category: 'Transaction',
      type: 'number'
    },
    
    // Page Attributes
    {
      id: 'page.url',
      name: 'page.url',
      label: 'Page URL',
      category: 'Page',
      type: 'string'
    },
    {
      id: 'page.title',
      name: 'page.title',
      label: 'Page Title',
      category: 'Page',
      type: 'string'
    },
    {
      id: 'page.referrer',
      name: 'page.referrer',
      label: 'Referrer',
      category: 'Page',
      type: 'string'
    }
  ]
};

const actionButtons = [
  {
    label: 'Save Configuration',
    variant: 'primary' as const,
    disabled: false,
    callback: async () => {
      console.log('Saving configuration:', config.value);
      try {
        // API call to save
        await saveAnalyticsConfig(config.value);
        alert('Configuration saved successfully!');
      } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save configuration');
      }
    }
  },
  {
    label: 'Reset to Defaults',
    variant: 'secondary' as const,
    callback: () => {
      if (confirm('Reset to default configuration?')) {
        config.value = {
          selectedEvents: ['page_view', 'session_start'],
          selectedAttributes: ['user.id', 'user.email'],
          selectedPartners: ['google_analytics']
        };
        groupedEvents.value = [];
        groupingEnabled.value = false;
      }
    }
  },
  {
    label: 'Clear All',
    variant: 'danger' as const,
    callback: () => {
      if (confirm('Clear all selections?')) {
        config.value = {
          selectedEvents: [],
          selectedAttributes: [],
          selectedPartners: []
        };
        groupedEvents.value = [];
      }
    }
  }
];

const handleEventGrouping = (event: { eventId: string; isGrouped: boolean }) => {
  console.log('Event grouping changed:', event);
  
  if (event.isGrouped) {
    if (!groupedEvents.value.includes(event.eventId)) {
      groupedEvents.value.push(event.eventId);
    }
  } else {
    groupedEvents.value = groupedEvents.value.filter(id => id !== event.eventId);
  }
};

const handleGroupingToggle = (enabled: boolean) => {
  console.log('Grouping', enabled ? 'enabled' : 'disabled');
  
  if (!enabled) {
    // Clear grouped events when grouping is disabled
    groupedEvents.value = [];
  }
};

const saveAnalyticsConfig = async (config: DynamicContent) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Config saved:', config);
      resolve(true);
    }, 1000);
  });
};

// Watch for changes
watch(config, (newConfig) => {
  console.log('Configuration updated:', newConfig);
}, { deep: true });
</script>

<style scoped>
.analytics-configurator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.analytics-configurator h1 {
  margin-bottom: 24px;
}

.config-summary {
  margin-top: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.config-summary h3 {
  margin: 0 0 16px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: white;
  border-radius: 4px;
}

.summary-item label {
  font-weight: 500;
  color: #666;
}

.summary-item span {
  font-weight: 600;
  color: #333;
}
</style>
```

## Common Mistakes

ℹ️ **Using duplicate IDs for events or attributes**

ℹ️ **Not enabling lazy loading for large datasets**

ℹ️ **Missing categories for events and attributes**

ℹ️ **Not handling button callbacks properly**

ℹ️ **Forgetting to sync dynamicContent with v-model**

## Best Practices

- **Use Unique IDs for All Items:** Ensure every event, attribute, and partner has a unique identifier to prevent selection conflicts
- **Enable Lazy Loading for Large Datasets:** Use lazyLoadChunkSize and preloadBunchSize when dealing with hundreds of events or attributes
- **Mark Critical Fields as Constant:** Use isConstant flag for events/attributes that must always be tracked for data integrity
- **Provide Clear Action Buttons:** Configure buttonOptions with clear labels and appropriate variants for user actions

