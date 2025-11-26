# InDataTableV2

**Version:** v2

## Props

### `data`

**Type:** `Array` | **Default:** `"[Function]"`

### `totalData`

**Type:** `Number` | **Default:** `1`

### `columnOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `rowModelType`

**Type:** `String` | **Default:** `"clientSide"`

### `rowModelTypeServer`

**Type:** `String` | **Default:** `""`

### `fetchUrl`

**Type:** `String` | **Default:** `""`

### `rowsSelection`

**Type:** `Boolean` | **Default:** `false`

### `canSelectAllRows`

**Type:** `Boolean` | **Default:** `true`

### `defaultColumnMenuItems`

**Type:** `Boolean` | **Default:** `true`

### `customColumnMenuItems`

**Type:** `Array` | **Default:** `"[Function]"`

### `nestedTableFields`

**Type:** `Array` | **Default:** `"[Function]"`

### `nestedTableStatus`

**Type:** `Boolean` | **Default:** `false`

### `isTreeData`

**Type:** `Boolean` | **Default:** `false`

### `groupDataPath`

**Type:** `String` | **Default:** `"group"`

### `groupDefaultExpanded`

**Type:** `Number` | **Default:** `0`

### `paginationStatus`

**Type:** `Boolean` | **Default:** `false`

### `paginationInformationStatus`

**Type:** `Boolean` | **Default:** `true`

### `defaultItemPerPage`

**Type:** `Number` | **Default:** `10`

### `maxItemPerPage`

**Type:** `Number` | **Default:** `20`

### `minItemPerPage`

**Type:** `Number` | **Default:** `1`

### `rowHeight`

**Type:** `String` | **Default:** `"medium"`

### `horizontalScroll`

**Type:** `Boolean` | **Default:** `false`

### `maxPinnedColumns`

**Type:** `Number` | **Default:** `"null"`

### `autoHeight`

**Type:** `Boolean` | **Default:** `true`

### `fixedHeight`

**Type:** `Number` | **Default:** `300`

### `inContainerLayout`

**Type:** `Boolean` | **Default:** `false`

### `inContainerLayoutOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `noDataTitleText`

**Type:** `String` | **Default:** `""`

### `noDataDescriptionText`

**Type:** `String` | **Default:** `""`

### `noDataIcon`

**Type:** `String` | **Default:** `"no-personalization"`

### `loadingStatus`

**Type:** `Boolean` | **Default:** `false`

### `rowDragManaged`

**Type:** `Boolean` | **Default:** `true`

### `loadingType`

**Type:** `String` | **Default:** `"skeleton"`

### `loadingTitleText`

**Type:** `String` | **Default:** `""`

### `loadingDescriptionText`

**Type:** `String` | **Default:** `""`

### `loadingIcon`

**Type:** `String` | **Default:** `"email"`

### `horizontalSkeletonsCount`

**Type:** `Number` | **Default:** `6`

### `statusFilterStatus`

**Type:** `Boolean` | **Default:** `false`

### `statusFilterList`

**Type:** `Array` | **Default:** `"[Function]"`

### `searchFilterStatus`

**Type:** `Boolean` | **Default:** `false`

### `embedFullWidthRows`

**Type:** `Boolean` | **Default:** `false`

### `searchFilterPlaceholder`

**Type:** `String` | **Default:** `"Search"`

### `tableSearchParams`

**Type:** `Object` | **Default:** `"[Function]"`

### `httpMethod`

**Type:** `String` | **Default:** `"GET"`

### `alignHeaderTitle`

**Type:** `String` | **Default:** `""`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `hasBulkActions`

**Type:** `Boolean` | **Default:** `false`

### `bulkActionsOptions`

**Type:** `Object` | **Default:** `"[Function]"`

### `isUsDateFormat`

**Type:** `Boolean` | **Default:** `false`

### `enableCellTextSelection`

**Type:** `Boolean` | **Default:** `true`

### `suppressCopyRowsToClipboard`

**Type:** `Boolean` | **Default:** `true`

### `enableRangeSelection`

**Type:** `Boolean` | **Default:** `false`

### `isRowsPreselectEnabled`

**Type:** `Boolean` | **Default:** `true`

### `isResponsive`

**Type:** `Boolean` | **Default:** `false`

### `showingItemsStatus`

**Type:** `Boolean` | **Default:** `true`

### `visiblePaginationPages`

**Type:** `Boolean` | **Default:** `true`

### `itemsPerPageStatus`

**Type:** `Boolean` | **Default:** `true`

### `noDataOptions`

**Type:** `Object` | **Default:** `"[Function]"`

## Events

### `loadingStatus`

### `dataLoaded`

### `perPageSelected`

### `fetchData`

### `copied`

### `dataReady`

### `nestedDataReady`

### `firstDataRendered`

### `gridSizeChanged`

### `paginationChanged`

### `selectStatus`

### `setSearchValue`

### `rowsUpdated`

### `rowGroupStatusChanged`

### `sortingChanged`

### `maxColumnsPinned`

### `columnPinned`

### `refreshed`

### `rowDragEnter`

### `rowDragEnd`

### `rowDragMove`

### `rowDragLeave`

### `rowDragCancel`

### `rowDragStopped`

### `filterChanged`

### `rowSelected`

### `cellHovered`

### `allRowsSelected`

### `cellClicked`

### `bulkAction`

## Enums

### SORTING_ICONS

- `filled-sorting-ascending`
- `filled-sorting-descending`
- `filled-sorting-default`

### CELL_RENDERERS

- `InActions`
- `InStatus`
- `InStatuses`
- `InText`
- `InText`
- `InLink`
- `InButton`
- `InMenu`
- `InPreview`
- `InTags`
- `InToggle`
- `InRadioButton`
- `InProgress`
- `InText`
- `InIcon`
- `InIconsGroup`
- `agGroupCellRenderer`
- `InLoadingCell`

### GRID_MODE_TYPES

- `viewport`
- `clientSide`
- `clientSide`

### PAGINATION_RENDERERS

- `InPaginationPerPage`
- `InPaginationPages`
- `InPaginationCount`

### ROW_HEIGHT



### DEFAULT_SEARCH_PARAMS



### MULTIPLIERS



### ARROW_ALIGNMENT

- `start`
- `center`
- `end`

## Examples

### Basic Client-Side Table

Simple table with local data

```vue
<InDataTableV2
  :data="users"
  :column-options="[
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'status', headerName: 'Status' }
  ]"
  :default-item-per-page="10"
  pagination-status
  items-per-page-status
/>
```

### Server-Side Table with API

Table fetching data from API

```vue
<InDataTableV2
  row-model-type="serverSide"
  fetch-url="/api/users"
  http-method="GET"
  :column-options="columns"
  :total-data="totalCount"
  :default-item-per-page="25"
  pagination-status
  search-filter-status
  search-filter-placeholder="Search users..."
  status-filter-status
  :status-filter-list="statusOptions"
  @data-loaded="handleLoad"
  @pagination-changed="handlePagination"
/>
```

### Table with Bulk Actions and Selection

Multi-select table with bulk operations

```vue
<InDataTableV2
  :data="data"
  :column-options="columns"
  rows-selection="multiple"
  can-select-all-rows
  has-bulk-actions
  :bulk-actions-options="[
    { id: 'export', label: 'Export', icon: 'download' },
    { id: 'delete', label: 'Delete', icon: 'trash', variant: 'danger' }
  ]"
  @select-status="handleSelection"
  @bulk-action="handleBulkAction"
/>
```

### Table in Container with Header

Table wrapped in styled container

```vue
<InDataTableV2
  :data="data"
  :column-options="columns"
  in-container-layout
  :in-container-layout-options="{
    headerStatus: true,
    title: 'User Management',
    border: true
  }"
  pagination-status
  showing-items-status
/>
```

### Tree Data Table

Hierarchical data display

```vue
<InDataTableV2
  :data="hierarchicalData"
  :column-options="columns"
  is-tree-data
  :group-data-path="data => data.orgHierarchy"
  :group-default-expanded="1"
  auto-height
/>
```

### Nested Expandable Tables

Table with expandable nested rows

```vue
<InDataTableV2
  :data="orders"
  :column-options="orderColumns"
  nested-table-status
  :nested-table-fields="orderItemColumns"
  @nested-data-ready="loadNestedData"
/>
```

## Common Mistakes

ℹ️ **Using tableFields instead of columnOptions**

ℹ️ **Using 'label' instead of 'headerName' in columns**

ℹ️ **Using api-mode boolean instead of row-model-type**

ℹ️ **Using perPage instead of defaultItemPerPage**

ℹ️ **Using withSearchFilter instead of searchFilterStatus**

ℹ️ **Expecting @onLoad event**

ℹ️ **Not handling AG Grid column definition format**

## Best Practices

- **undefined:** V2 is built on AG Grid - leverage its column features
- **undefined:** Use skeleton-status for initial load, loading-status for refreshes
- **undefined:** Wrap table in container for better visual consistency
- **undefined:** Use @bulk-action event with action ID and selected rows
- **undefined:** clientSide for <1000 rows, serverSide for larger datasets

