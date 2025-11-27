# InSkeleton

**Version:** v1

## Props

### `name`

**Type:** `String` | **Default:** `""`

### `status`

**Type:** `Boolean` | **Default:** `true`

### `sizing`

**Type:** `Object` | **Required**

## Examples

### Data Table Loading Skeleton

Show skeleton rows while table data loads

```vue
<template>
  <div class="data-table">
    <template v-if="isLoading">
      <div v-for="i in 5" :key="i" class="table-row-skeleton">
        <InSkeleton
          :status="true"
          :sizing="{ width: '100%', height: '48px', borderRadius: '4px' }"
          class="mb-2"
        />
      </div>
    </template>
    
    <InDataTableV2
      v-else
      :data="tableData"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const tableData = ref([]);

const columns = [
  { field: 'name', header: 'Name' },
  { field: 'status', header: 'Status' },
  { field: 'date', header: 'Date' }
];

onMounted(async () => {
  try {
    tableData.value = await fetchTableData();
  } finally {
    isLoading.value = false;
  }
});

const fetchTableData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return [
    { name: 'Campaign 1', status: 'Active', date: '2025-01-15' },
    { name: 'Campaign 2', status: 'Paused', date: '2025-01-10' }
  ];
};
</script>
```

### User Profile Card Skeleton

Detailed skeleton matching profile card layout

```vue
<template>
  <div class="profile-card">
    <template v-if="isLoading">
      <div class="profile-header">
        <!-- Avatar -->
        <InSkeleton
          :status="true"
          :sizing="{ width: '80px', height: '80px', borderRadius: '50%' }"
        />
        
        <div class="profile-info">
          <!-- Name -->
          <InSkeleton
            :status="true"
            :sizing="{ width: '150px', height: '24px', borderRadius: '4px' }"
          />
          <!-- Role -->
          <InSkeleton
            :status="true"
            :sizing="{ width: '100px', height: '16px', borderRadius: '4px' }"
            class="mt-2"
          />
        </div>
      </div>
      
      <div class="profile-stats">
        <div v-for="i in 3" :key="i" class="stat-item">
          <InSkeleton
            :status="true"
            :sizing="{ width: '60px', height: '20px', borderRadius: '4px' }"
          />
        </div>
      </div>
      
      <div class="profile-bio">
        <InSkeleton
          v-for="i in 3" :key="i"
          :status="true"
          :sizing="{ width: i === 3 ? '70%' : '100%', height: '14px', borderRadius: '4px' }"
          class="mb-2"
        />
      </div>
    </template>
    
    <template v-else>
      <div class="profile-header">
        <img :src="user.avatar" class="avatar" />
        <div class="profile-info">
          <h2>{{ user.name }}</h2>
          <p>{{ user.role }}</p>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <span>{{ user.campaigns }}</span> Campaigns
        </div>
        <div class="stat-item">
          <span>{{ user.followers }}</span> Followers
        </div>
        <div class="stat-item">
          <span>{{ user.engagement }}</span> Engagement
        </div>
      </div>
      <p class="profile-bio">{{ user.bio }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const user = ref(null);

onMounted(async () => {
  user.value = await fetchUserProfile();
  isLoading.value = false;
});
</script>

<style scoped>
.profile-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.profile-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}
</style>
```

### List Item Skeletons

Show multiple skeleton items in list view

```vue
<template>
  <div class="items-list">
    <template v-if="isLoading">
      <div v-for="i in skeletonCount" :key="i" class="list-item-skeleton">
        <InSkeleton
          :status="true"
          :sizing="{ width: '40px', height: '40px', borderRadius: '8px' }"
        />
        <div class="item-content">
          <InSkeleton
            :status="true"
            :sizing="{ width: '60%', height: '18px', borderRadius: '4px' }"
          />
          <InSkeleton
            :status="true"
            :sizing="{ width: '40%', height: '14px', borderRadius: '4px' }"
            class="mt-2"
          />
        </div>
      </div>
    </template>
    
    <div v-else v-for="item in items" :key="item.id" class="list-item">
      <img :src="item.thumbnail" class="thumbnail" />
      <div class="item-content">
        <h4>{{ item.title }}</h4>
        <p>{{ item.subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const items = ref([]);
const skeletonCount = 5; // Show 5 skeleton items

onMounted(async () => {
  items.value = await fetchItems();
  isLoading.value = false;
});
</script>

<style scoped>
.list-item-skeleton,
.list-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
}

.item-content {
  flex: 1;
}
</style>
```

## Common Mistakes

ℹ️ **Not hiding skeleton after data loads**

ℹ️ **Skeleton dimensions don't match content**

ℹ️ **Single skeleton for list of items**

ℹ️ **Overly complex skeleton animations**

## Best Practices

- **Match Skeleton Dimensions to Actual Content:** Measure and match skeleton sizes to prevent layout shift
- **Show Multiple Skeleton Items for Lists:** Display 3-5 skeleton items to indicate list/collection
- **Always Toggle status When Data Loads:** Set status=false or use v-if to hide skeleton when content ready
- **Use Appropriate Shapes for Content Type:** Circles for avatars, rectangles for text, rounded for cards

