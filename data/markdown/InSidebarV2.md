# InSidebarV2

**Version:** v2

## Props

### `selectedRoute`

**Type:** `String` | **Required**

### `routes`

**Type:** `Array` | **Required**

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

### `recentSearches`

**Type:** `Array` | **Default:** `"[Function]"`

### `searchResults`

**Type:** `Array` | **Default:** `"[Function]"`

### `loadingStatus`

**Type:** `Boolean` | **Default:** `false`

### `mainPageRoute`

**Type:** `String` | **Default:** `"/"`

## Events

### `search`

### `opened`

### `clearRecentSearch`

### `removeFromFavorite`

### `addToFavorite`

## Examples

### Complete Sidebar with Navigation

Full example with routes, search, and navigation

```vue
<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { InSidebarV2 } from '@useinsider/design-system-vue';

const router = useRouter();
const route = useRoute();

const unreadCount = ref(5);
const navigationRoutes = computed(() => [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    path: '/', 
    icon: 'home',
    active: route.path === '/'
  },
  { 
    id: 'inbox', 
    label: 'Inbox', 
    path: '/inbox', 
    icon: 'mail',
    badge: unreadCount.value,
    active: route.path === '/inbox'
  },
  {
    id: 'admin',
    label: 'Administration',
    path: '/admin',
    icon: 'lock',
    children: [
      { id: 'users', label: 'Users', path: '/admin/users' },
      { id: 'settings', label: 'Settings', path: '/admin/settings' }
    ]
  }
]);

const handleNavigate = (routeObj) => {
  router.push(routeObj.path);
};
</script>

<template>
  <InSidebarV2 
    :routes="navigationRoutes"
    @navigate="handleNavigate"
  />
</template>
```

### Sidebar with Search Functionality

Sidebar with debounced search and recent searches

```vue
<script setup>
import { ref } from 'vue';
import { debounce } from 'lodash-es';

const searchQuery = ref('');
const searchResults = ref([]);
const recentSearches = ref(
  JSON.parse(localStorage.getItem('recentSearches') || '[]')
);

const performSearch = async (query) => {
  if (!query) {
    searchResults.value = [];
    return;
  }
  
  // Simulate API call
  const results = await api.search(query);
  searchResults.value = results.slice(0, 10);
  
  // Add to recent searches
  const updated = [query, ...recentSearches.value.filter(s => s !== query)].slice(0, 10);
  recentSearches.value = updated;
  localStorage.setItem('recentSearches', JSON.stringify(updated));
};

const debouncedSearch = debounce(performSearch, 300);

const handleSearch = (query) => {
  searchQuery.value = query;
  debouncedSearch(query);
};

const handleSearchResultClick = (result) => {
  router.push(result.path);
};
</script>

<template>
  <InSidebarV2 
    :routes="routes"
    :search-results="searchResults"
    :recent-searches="recentSearches"
    @search="handleSearch"
    @search-result-click="handleSearchResultClick"
  />
</template>
```

## Common Mistakes

ℹ️ **Not providing required routes prop**

routes is a required prop - sidebar cannot render without it

**Wrong:**
```vue
<InSidebarV2 />
```

**Correct:**
```vue
<InSidebarV2 :routes="navigationRoutes" />
```

ℹ️ **Missing 'id' in route objects**

Each route must have unique id for tracking and state management

**Wrong:**
```vue
:routes="[{ label: 'Home', path: '/' }]"
```

**Correct:**
```vue
:routes="[{ id: 'home', label: 'Home', path: '/' }]"
```

ℹ️ **Not handling route clicks**

Sidebar emits navigation events but doesn't navigate automatically

**Wrong:**
```vue
<InSidebarV2 :routes="routes" />
```

**Correct:**
```vue
<InSidebarV2 :routes="routes" @navigate="handleNavigation" />
```

ℹ️ **Re-creating routes array on every render**

Routes should be defined once, not recreated in template

**Wrong:**
```vue
<InSidebarV2 :routes="[{ id: 'home', label: 'Home', path: '/' }]" />
```

**Correct:**
```vue
<!-- Define routes in setup/data -->
const routes = ref([{ id: 'home', label: 'Home', path: '/' }]);
<InSidebarV2 :routes="routes" />
```

ℹ️ **Not debouncing search input**

Search should be debounced to avoid excessive API calls

**Wrong:**
```vue
@search="handleSearch"  <!-- fires on every keystroke -->
```

**Correct:**
```vue
// Use debounced search handler
const debouncedSearch = debounce(handleSearch, 300);
@search="debouncedSearch"
```

ℹ️ **Too many top-level routes (>10)**

Long lists of routes create cluttered sidebar

**Wrong:**
```vue
routes: [ /* 20 top-level routes */ ]
```

**Correct:**
```vue
// Group related routes under parent:
routes: [
  { id: 'admin', label: 'Admin', children: [/* related routes */] }
]
```

## Best Practices

- **Group Related Routes with Children:** Use nested routes to organize related pages and reduce clutter
- **Use Badges for Notifications:** Show unread counts or pending items with badge property
- **Implement Active Route Highlighting:** Mark current route as active for clear navigation context
- **Debounce Search for Performance:** Use debounced search to reduce API calls and improve performance
- **Persist Recent Searches in LocalStorage:** Save recent searches for better user experience across sessions

