# InNoData

**Version:** v1

## Props

### `title`

**Type:** `String` | **Default:** `""`

### `description`

**Type:** `String` | **Default:** `""`

### `visibleIcon`

**Type:** `Boolean` | **Default:** `true`

### `icon`

**Type:** `String` | **Default:** `"no-data"`

### `buttonStatus`

**Type:** `Boolean` | **Default:** `false`

### `buttonText`

**Type:** `String` | **Default:** `""`

### `backgroundColorClass`

**Type:** `String` | **Default:** `"b-c-4"`

### `titleColorClass`

**Type:** `String` | **Default:** `"t-c-1"`

### `descriptionColorClass`

**Type:** `String` | **Default:** `"t-c-2"`

### `iconClass`

**Type:** `String` | **Default:** `"mb-3"`

### `parseAsHtml`

**Type:** `Boolean` | **Default:** `false`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `buttonType`

**Type:** `String` | **Default:** `"primary"`

### `isButtonDisabled`

**Type:** `Boolean` | **Default:** `false`

### `buttonTooltip`

**Type:** `String` | **Default:** `""`

### `buttonTooltipPosition`

**Type:** `String` | **Default:** `"top center"`

### `buttonProps`

**Type:** `Object` | **Default:** `"[Function]"`

## Examples

### Empty Table/List State

Show when data table or list has no items

```vue
<template>
  <div class="data-table-container">
    <InDataTableV2
      v-if="campaigns.length > 0"
      :data="campaigns"
      :columns="columns"
    />
    <InNoData
      v-else
      title="No campaigns found"
      :description="getEmptyStateDescription()"
      icon="campaign"
      :buttonStatus="canCreateCampaign"
      buttonText="Create Campaign"
      :buttonProps="{ variant: 'primary', icon: 'plus' }"
      @button-click="openCampaignCreator"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissions } from '@/composables/usePermissions';

const router = useRouter();
const { hasPermission } = usePermissions();

const campaigns = ref([]);
const hasFilters = ref(false);

const canCreateCampaign = computed(() => 
  hasPermission('campaigns.create')
);

const getEmptyStateDescription = () => {
  if (hasFilters.value) {
    return 'No campaigns match your current filters. Try adjusting your search criteria.';
  }
  return 'Create your first campaign to start reaching your audience.';
};

const openCampaignCreator = () => {
  router.push('/campaigns/create');
};
</script>
```

### Search No Results State

Show when search returns no results

```vue
<template>
  <div class="search-results">
    <div class="search-header">
      <InBasicTextInput
        v-model="searchQuery"
        placeholder="Search..."
        @input="handleSearch"
      />
    </div>
    
    <div v-if="isSearching" class="loading">
      <InProgress variant="indeterminate" />
    </div>
    
    <div v-else-if="hasSearched">
      <div v-if="results.length > 0" class="results-list">
        <!-- Show results -->
      </div>
      <InNoData
        v-else
        :title="`No results for \"${searchQuery}\"`"
        :description="searchSuggestions"
        :parseAsHtml="true"
        :preventXss="true"
        icon="search"
        :buttonStatus="true"
        buttonText="Clear Search"
        :buttonProps="{ variant: 'secondary' }"
        @button-click="clearSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const results = ref([]);
const isSearching = ref(false);
const hasSearched = ref(false);

const searchSuggestions = computed(() => `
  <p>Try:</p>
  <ul class="mt-2">
    <li>Using different keywords</li>
    <li>Checking for spelling errors</li>
    <li>Using more general terms</li>
  </ul>
`);

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  isSearching.value = true;
  hasSearched.value = true;
  
  try {
    results.value = await searchAPI(searchQuery.value);
  } finally {
    isSearching.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  results.value = [];
  hasSearched.value = false;
};
</script>
```

### Permission-Based Empty State

Different empty states based on user permissions

```vue
<template>
  <div class="dashboard">
    <InNoData
      v-if="!hasViewPermission"
      title="Access Restricted"
      description="You don't have permission to view this content. Contact your administrator to request access."
      icon="lock"
      :buttonStatus="false"
      backgroundColorClass="b-c-warning-light"
    />
    
    <InNoData
      v-else-if="data.length === 0 && !hasCreatePermission"
      title="No data available"
      description="There is no data to display. Contact your administrator to add content."
      icon="inbox-empty"
      :buttonStatus="false"
    />
    
    <InNoData
      v-else-if="data.length === 0 && hasCreatePermission"
      title="Get started"
      description="You haven't created any items yet. Create your first item to get started."
      icon="sparkles"
      :buttonStatus="true"
      buttonText="Create Item"
      :buttonProps="{ variant: 'primary', size: 'large' }"
      @button-click="createItem"
    />
    
    <!-- Show data if available -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePermissions } from '@/composables/usePermissions';

const { hasPermission } = usePermissions();
const data = ref([]);

const hasViewPermission = computed(() => 
  hasPermission('content.view')
);

const hasCreatePermission = computed(() => 
  hasPermission('content.create')
);

const createItem = () => {
  // Open creation modal/page
};
</script>
```

## Common Mistakes

ℹ️ **Using same generic empty state everywhere**

ℹ️ **Enabling parseAsHtml without preventXss for user content**

ℹ️ **Not handling filtered empty states differently**

ℹ️ **Showing action button when user lacks permission**

## Best Practices

- **Use Specific, Contextual Titles:** Avoid generic 'No data' - describe what's specifically missing
- **Provide Actionable Descriptions:** Guide users on what to do next, don't just state the problem
- **Show Action Buttons Strategically:** Only show action buttons when user can and should take action
- **Always Sanitize User-Generated HTML:** Use preventXss=true when parseAsHtml=true with any user input

