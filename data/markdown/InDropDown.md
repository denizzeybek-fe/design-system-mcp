# InDropDown

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `"qa-drop-down"`

### `options`

**Type:** `Array` | **Default:** `"[Function]"`

### `customOptionsKey`

**Type:** `Array` | **Default:** `"[Function]"`

### `value`

**Type:** `String | Number| Boolean` | **Default:** `""`

### `label`

**Type:** `String` | **Default:** `""`

### `labelTooltip`

**Type:** `String | Boolean` | **Default:** `false`

### `searchStatus`

**Type:** `Boolean` | **Default:** `true`

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `disable`

**Type:** `Boolean` | **Default:** `false`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `fetchUrl`

**Type:** `String` | **Default:** `""`

### `autoComplete`

**Type:** `Boolean` | **Default:** `false`

### `visibleLabel`

**Type:** `Boolean` | **Default:** `true`

### `queryString`

**Type:** `String` | **Default:** `""`

### `invalid`

**Type:** `Boolean` | **Default:** `false`

### `invalidMessage`

**Type:** `String` | **Default:** `""`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `overriddenListPosition`

**Type:** `String` | **Default:** `""`

### `placeholder`

**Type:** `String` | **Default:** `""`

### `placeHolderStatus`

**Type:** `Boolean` | **Default:** `false`

### `createOptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `responseHasData`

**Type:** `Boolean` | **Default:** `true`

### `responseKey`

**Type:** `String` | **Default:** `""`

### `warning`

**Type:** `Boolean` | **Default:** `false`

### `warningMessage`

**Type:** `String` | **Default:** `""`

### `buttonType`

**Type:** `String` | **Default:** `"dropdown"`

### `canRemoveSelectedItem`

**Type:** `Boolean` | **Default:** `true`

### `type`

**Type:** `String` | **Default:** `"default"`

### `childOptionsLeftPosition`

**Type:** `String|Number` | **Default:** `""`

### `noDataText`

**Type:** `String` | **Default:** `"No Data to Show"`

### `noSearchResultText`

**Type:** `String` | **Default:** `"No Search Result"`

### `buttonSize`

**Type:** `String` | **Default:** `"default"`

### `attributeVisible`

**Type:** `Boolean` | **Default:** `false`

## Events

### `change`

### `openList`

### `closeList`

### `selectedInActiveOption`

### `select`

### `unSelect`

### `addNewOption`

### `loadingDropDownOptions`

## Examples

### Basic Select

Simple dropdown with static options

```vue
<InDropDown
  id="country"
  label="Country"
  placeholder="Select country"
  :options="[
    { label: 'USA', value: 'us' },
    { label: 'UK', value: 'uk' },
    { label: 'Germany', value: 'de' }
  ]"
  v-model="selectedCountry"
  @change="handleChange"
/>
```

### Searchable Select with API

Select with search and API fetching

```vue
<InDropDown
  id="users"
  label="Select User"
  fetch-url="/api/users"
  response-key="data"
  query-string="search"
  search-status
  placeholder="Search users..."
  v-model="selectedUser"
  @change="handleUserChange"
/>
```

### Select with Validation

Required select with error state

```vue
<InDropDown
  id="category"
  label="Category"
  :options="categories"
  v-model="selectedCategory"
  visible-label
  invalid
  invalid-message="Please select a category"
  can-remove-selected-item
/>
```

## Common Mistakes

ℹ️ **Not setting responseKey for API fetch**

ℹ️ **Using wrong event name @closeList**

ℹ️ **Forgetting v-model**

## Best Practices

- **undefined:** Enable search when options > 10
- **undefined:** Use invalid/warning with messages

