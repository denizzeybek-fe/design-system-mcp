# InDataTable

**Version:** v1

## Props

### `name`

**Type:** `String` | **Default:** `""`

### `placeholder`

**Type:** `String` | **Default:** `"Search"`

### `fetchUrl`

**Type:** `String` | **Default:** `""`

### `tableFields`

**Type:** `Array` | **Default:** `"[Function]"`

### `tableSearchParams`

**Type:** `Object` | **Default:** `"[Function]"`

### `actions`

**Type:** `Array` | **Default:** `"[Function]"`

### `paginationPath`

**Type:** `String` | **Default:** `""`

### `sortOrder`

**Type:** `Array` | **Default:** `"[Function]"`

### `apiMode`

**Type:** `Boolean` | **Default:** `true`

### `data`

**Type:** `Array` | **Default:** `"[Function]"`

### `perPage`

**Type:** `Number` | **Default:** `10`

### `isCollapsed`

**Type:** `Boolean` | **Default:** `true`

### `noDataTitle`

**Type:** `String` | **Default:** `""`

### `noDataDescription`

**Type:** `String` | **Default:** `""`

### `noDataIcon`

**Type:** `String` | **Default:** `"no-search-result"`

### `visiblePaginationOption`

**Type:** `Boolean` | **Default:** `false`

### `statusList`

**Type:** `Array` | **Default:** `"[Function]"`

### `withSearchFilter`

**Type:** `Boolean` | **Default:** `false`

### `withStatusFilter`

**Type:** `Boolean` | **Default:** `false`

### `isWrapperBox`

**Type:** `Boolean` | **Default:** `true`

### `loadingType`

**Type:** `String` | **Default:** `"skeleton"`

### `loadingTitle`

**Type:** `String` | **Default:** `""`

### `loadingDescription`

**Type:** `String` | **Default:** `""`

### `loadingIcon`

**Type:** `String` | **Default:** `"email"`

### `paginationStatus`

**Type:** `Boolean` | **Default:** `false`

### `apiModePaginationStatus`

**Type:** `Boolean` | **Default:** `true`

### `loadingStatus`

**Type:** `Boolean` | **Default:** `false`

### `httpFetch`

**Type:** `Function` | **Default:** `"null"`

### `horizontalScroll`

**Type:** `Boolean` | **Default:** `false`

### `fixFirstColumn`

**Type:** `Boolean` | **Default:** `false`

### `fixSecondColumn`

**Type:** `Boolean` | **Default:** `false`

### `fixLastColumn`

**Type:** `Boolean` | **Default:** `false`

### `showTableFilters`

**Type:** `Boolean` | **Default:** `false`

### `rowClass`

**Type:** `String | Function` | **Default:** `""`

### `pinnedRows`

**Type:** `Function` | **Default:** `"[Function]"`

### `isSearchWithEnter`

**Type:** `Boolean` | **Default:** `false`

### `trackBy`

**Type:** `String` | **Default:** `"id"`

### `detailRow`

**Type:** `String` | **Default:** `""`

### `httpOptions`

**Type:** `Object` | **Default:** `"[Function]"`

### `searchInputTheme`

**Type:** `String` | **Default:** `"white"`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `locale`

**Type:** `String` | **Default:** `"default"`

### `formatMapping`

**Type:** `Object` | **Default:** `"[Function]"`

## Events

### `setPaginationObject`

### `onLoad`

### `paginationCount`

### `perPage`

### `selectStatus`

## Examples

### Basic Client-Side Table

Simple table with local data and pagination

```vue
<template>
  <InDataTable
    name="users-table"
    :data="users"
    :table-fields="columns"
    :per-page="10"
    pagination-status
    track-by="id"
  />
</template>

<script setup>
import { ref } from 'vue';

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
]);

const columns = ref([
  { field: 'name', label: 'Name', sortable: true },
  { field: 'email', label: 'Email' },
  { field: 'status', label: 'Status' }
]);
</script>
```

### Server-Side Table with API

Table fetching data from API endpoint with authentication

```vue
<template>
  <InDataTable
    name="api-table"
    api-mode
    fetch-url="/api/users"
    :table-search-params="searchParams"
    :table-fields="columns"
    :http-options="httpOptions"
    pagination-path="meta.pagination"
    :per-page="25"
    with-search-filter
    with-status-filter
    :status-list="statusOptions"
    @on-load="handleLoad"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const authToken = ref('Bearer your-token-here');
const tenantId = ref('tenant-123');

const httpOptions = computed(() => ({
  headers: {
    'Authorization': authToken.value,
    'X-Tenant-ID': tenantId.value
  }
}));

const searchParams = computed(() => ({
  tenant: tenantId.value
}));

const columns = ref([
  { field: 'id', label: 'ID', width: 80 },
  { field: 'name', label: 'Name', sortable: true },
  { field: 'email', label: 'Email', sortable: true },
  { field: 'status', label: 'Status' }
]);

const statusOptions = ref([
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' }
]);

const handleLoad = (payload) => {
  console.log(`Loaded ${payload.data.length} rows`);
};
</script>
```

### Custom HTTP Client with Axios

Using custom HTTP client for advanced request handling

```vue
<template>
  <InDataTable
    name="axios-table"
    api-mode
    fetch-url="/api/data"
    :http-fetch="axiosClient"
    :table-fields="columns"
    :per-page="20"
  />
</template>

<script setup>
import axios from 'axios';

const axiosClient = async (url, options) => {
  try {
    const response = await axios.get(url, {
      params: options?.params,
      headers: options?.headers,
      timeout: 10000 // 10 second timeout
    });
    
    // Convert axios response to fetch Response
    return new Response(JSON.stringify(response.data), {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const columns = ref([
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name', sortable: true }
]);
</script>
```

### Table with Row Actions

Action buttons for each row with handlers

```vue
<template>
  <InDataTable
    name="actions-table"
    :data="items"
    :table-fields="columns"
    :actions="rowActions"
    track-by="id"
  />
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1', status: 'active' },
  { id: 2, name: 'Item 2', status: 'inactive' }
]);

const columns = ref([
  { field: 'id', label: 'ID', width: 80 },
  { field: 'name', label: 'Name' },
  { field: 'status', label: 'Status' }
]);

const rowActions = ref([
  {
    name: 'edit',
    icon: 'line-edit',
    label: 'Edit',
    handler: (row) => {
      console.log('Edit:', row.id);
      // Navigate to edit page
    }
  },
  {
    name: 'delete',
    icon: 'line-trash',
    label: 'Delete',
    handler: async (row) => {
      if (confirm(`Delete ${row.name}?`)) {
        // await deleteItem(row.id);
        console.log('Deleted:', row.id);
      }
    }
  }
]);
</script>
```

### Wide Table with Fixed Columns

Horizontal scrolling with fixed first and last columns

```vue
<InDataTable
  name="wide-table"
  :data="data"
  :table-fields="manyColumns"
  horizontal-scroll
  fix-first-column
  fix-last-column
  :per-page="15"
/>
```

### Formatted Values

Custom formatting for dates, currency, and status

```vue
<template>
  <InDataTable
    name="formatted-table"
    :data="transactions"
    :table-fields="columns"
    :format-mapping="formatters"
  />
</template>

<script setup>
import { ref } from 'vue';

const transactions = ref([
  { id: 1, amount: 1234.56, createdAt: '2025-01-15T10:30:00Z', status: 'completed' }
]);

const columns = ref([
  { field: 'id', label: 'ID' },
  { field: 'amount', label: 'Amount' },
  { field: 'createdAt', label: 'Date' },
  { field: 'status', label: 'Status' }
]);

const formatters = ref({
  amount: (value) => `$${parseFloat(value).toFixed(2)}`,
  createdAt: (value) => new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }),
  status: (value) => value.charAt(0).toUpperCase() + value.slice(1)
});
</script>
```

### Conditional Row Styling

Dynamic row classes based on row data

```vue
<template>
  <InDataTable
    name="styled-table"
    :data="items"
    :table-fields="columns"
    :row-class="getRowClass"
  />
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1', status: 'error', priority: 'high' },
  { id: 2, name: 'Item 2', status: 'success', priority: 'low' }
]);

const columns = ref([
  { field: 'name', label: 'Name' },
  { field: 'status', label: 'Status' },
  { field: 'priority', label: 'Priority' }
]);

const getRowClass = (row) => {
  if (row.status === 'error') return 'bg-red-50 text-red-900';
  if (row.status === 'success') return 'bg-green-50';
  if (row.priority === 'high') return 'font-bold';
  return '';
};
</script>

<style scoped>
.bg-red-50 { background-color: #ffebee; }
.text-red-900 { color: #b71c1c; }
.bg-green-50 { background-color: #e8f5e9; }
</style>
```

### Loading States

Skeleton loading for better UX

```vue
<template>
  <InDataTable
    name="loading-table"
    api-mode
    fetch-url="/api/data"
    :table-fields="columns"
    :loading-status="isLoading"
    loading-type="skeleton"
    @on-load="handleLoad"
  />
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(false);

const columns = ref([
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name' }
]);

const handleLoad = () => {
  isLoading.value = false;
};
</script>
```

### Table with Search and Status Filters

Built-in search and dropdown filters

```vue
<InDataTable
  name="filtered-table"
  api-mode
  fetch-url="/api/items"
  :table-fields="columns"
  with-search-filter
  placeholder="Search items..."
  with-status-filter
  :status-list="[
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]"
/>
```

## Common Mistakes

ℹ️ **Using fetchUrl without apiMode=true**

Table needs apiMode enabled to fetch from URL

**Wrong:**
```vue
<InDataTable fetch-url="/api/users" :table-fields="columns" />
```

**Correct:**
```vue
<InDataTable api-mode fetch-url="/api/users" :table-fields="columns" />
```

ℹ️ **Missing 'field' property in tableFields**

Each column definition must have 'field' matching data key

**Wrong:**
```vue
:table-fields="[{ label: 'Name' }]"
```

**Correct:**
```vue
:table-fields="[{ field: 'name', label: 'Name' }]"
```

ℹ️ **httpFetch not returning Promise<Response>**

Custom HTTP client must return proper Response object

**Wrong:**
```vue
:http-fetch="(url) => axios.get(url)"
```

**Correct:**
```vue
:http-fetch="async (url, opts) => { const res = await axios.get(url); return new Response(JSON.stringify(res.data), { status: res.status }); }"
```

ℹ️ **Missing Authorization header for protected APIs**

Authenticated endpoints require auth headers in httpOptions

**Wrong:**
```vue
<InDataTable api-mode fetch-url="/api/protected" />
```

**Correct:**
```vue
<InDataTable api-mode fetch-url="/api/protected" :http-options="{ headers: { 'Authorization': authToken } }" />
```

ℹ️ **Wrong paginationPath for API response**

Path must match your API's pagination data location

**Wrong:**
```vue
pagination-path="pagination" for API response { meta: { pagination: {...} } }
```

**Correct:**
```vue
pagination-path="meta.pagination"
```

ℹ️ **Using 'title' instead of 'label' in tableFields**

V1 uses 'label' property for column headers

**Wrong:**
```vue
:table-fields="[{ field: 'name', title: 'Name' }]"
```

**Correct:**
```vue
:table-fields="[{ field: 'name', label: 'Name' }]"
```

ℹ️ **Loading large datasets client-side**

Client-side mode not suitable for > 1000 rows

**Wrong:**
```vue
:data="tenThousandRows"
```

**Correct:**
```vue
api-mode fetch-url="/api/data" with server-side pagination
```

ℹ️ **Complex logic in rowClass function**

rowClass called for every row on every render

**Wrong:**
```vue
:row-class="row => expensiveCalculation(row)"
```

**Correct:**
```vue
:row-class="row => row.status === 'error' ? 'error-row' : ''"
```

## Best Practices

- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined

