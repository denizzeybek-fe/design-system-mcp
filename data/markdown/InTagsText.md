# InTagsText

**Version:** v1

## Props

### `type`

**Type:** `String` | **Default:** `"default"`

### `text`

**Type:** `String` | **Required**

### `value`

**Type:** `String|Number` | **Required**

### `disable`

**Type:** `Boolean` | **Default:** `false`

### `withIcon`

**Type:** `Boolean` | **Default:** `true`

### `maxWidth`

**Type:** `Number` | **Default:** `"null"`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

## Events

### `click`

## Examples

### Status Tags in Data Table

Show campaign or item status with colored tags

```vue
<template>
  <InDataTableV2 :data="campaigns" :columns="columns">
    <template #status="{ row }">
      <InTagsText
        :text="row.statusText"
        :value="row.status"
        :type="getStatusType(row.status)"
        @click="filterByStatus"
      />
    </template>
  </InDataTableV2>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const campaigns = ref([
  { id: 1, name: 'Summer Sale', status: 'active', statusText: 'Active' },
  { id: 2, name: 'Black Friday', status: 'scheduled', statusText: 'Scheduled' },
  { id: 3, name: 'Old Campaign', status: 'paused', statusText: 'Paused' },
  { id: 4, name: 'Failed Test', status: 'failed', statusText: 'Failed' }
]);

const getStatusType = (status: string) => {
  const typeMap = {
    active: 'success',
    scheduled: 'info',
    paused: 'warning',
    failed: 'danger',
    draft: 'default'
  };
  return typeMap[status] || 'default';
};

const filterByStatus = (tag) => {
  console.log('Filter campaigns by status:', tag.value);
  // Apply filter
};
</script>
```

### Category Tags with Filtering

Show and filter by categories

```vue
<template>
  <div class="content-view">
    <div class="category-filters">
      <InTagsText
        v-for="category in categories"
        :key="category.id"
        :text="category.name"
        :value="category.id"
        :type="selectedCategory === category.id ? 'primary' : 'default'"
        @click="selectCategory"
      />
    </div>
    
    <div class="items-list">
      <!-- Filtered items -->
      <div v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const categories = ref([
  { id: 'all', name: 'All Items' },
  { id: 'tech', name: 'Technology' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'sales', name: 'Sales' }
]);

const selectedCategory = ref('all');
const items = ref([
  { id: 1, name: 'Item 1', category: 'tech' },
  { id: 2, name: 'Item 2', category: 'marketing' },
  { id: 3, name: 'Item 3', category: 'tech' }
]);

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') return items.value;
  return items.value.filter(item => item.category === selectedCategory.value);
});

const selectCategory = (tag) => {
  selectedCategory.value = tag.value;
};
</script>

<style scoped>
.category-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
</style>
```

### User Role Tags

Display user roles or permissions as tags

```vue
<template>
  <div class="user-card">
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
    
    <div class="user-roles">
      <InTagsText
        v-for="role in user.roles"
        :key="role.id"
        :text="role.name"
        :value="role.id"
        :type="getRoleType(role.level)"
        :disable="!canManageRoles"
        :maxWidth="100"
        @click="manageRole"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePermissions } from '@/composables/usePermissions';

const { hasPermission } = usePermissions();

const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  roles: [
    { id: 'admin', name: 'Administrator', level: 'high' },
    { id: 'editor', name: 'Content Editor', level: 'medium' },
    { id: 'viewer', name: 'Viewer', level: 'low' }
  ]
});

const canManageRoles = computed(() => 
  hasPermission('users.manage-roles')
);

const getRoleType = (level: string) => {
  const levelTypes = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  };
  return levelTypes[level] || 'default';
};

const manageRole = (tag) => {
  if (canManageRoles.value) {
    console.log('Manage role:', tag.value);
    // Open role management dialog
  }
};
</script>

<style scoped>
.user-roles {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
```

## Common Mistakes

ℹ️ **Not providing unique values for tags**

ℹ️ **Using inconsistent type colors for same status**

ℹ️ **Not handling long text**

ℹ️ **Making read-only tags look clickable**

## Best Practices

- **Use Semantic Type Colors Consistently:** Map tag types to consistent meanings across the app
- **Set maxWidth for User-Generated Content:** Prevent layout breaking from long category names
- **Disable Tags When Interaction Isn't Allowed:** Use disable prop when users shouldn't interact with tag
- **Keep preventXss=true for Safety:** Always sanitize user-generated tag text

