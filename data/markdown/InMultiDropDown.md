# InMultiDropDown

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `"qa-drop-down"`

### `options`

**Type:** `Array` | **Default:** `"[Function]"`

### `value`

**Type:** `Array` | **Default:** `"[Function]"`

### `label`

**Type:** `String` | **Default:** `""`

### `labelTooltip`

**Type:** `String | Boolean` | **Default:** `false`

### `disable`

**Type:** `Boolean` | **Default:** `false`

### `placeholder`

**Type:** `String` | **Required**

### `searchPlaceholder`

**Type:** `String` | **Default:** `"Search"`

### `searchStatus`

**Type:** `Boolean` | **Default:** `true`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `visibleLabel`

**Type:** `Boolean` | **Default:** `true`

### `type`

**Type:** `String` | **Default:** `"checkbox"`

### `addNewTagStatus`

**Type:** `Boolean` | **Default:** `true`

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `maxSelectableItem`

**Type:** `Number` | **Default:** `0`

### `warning`

**Type:** `Boolean` | **Default:** `false`

### `warningMessage`

**Type:** `String` | **Default:** `"Max number of selection is reached."`

### `invalid`

**Type:** `Boolean` | **Default:** `false`

### `invalidMessage`

**Type:** `String` | **Default:** `""`

### `minimumNewTagCharacterLimit`

**Type:** `Number` | **Default:** `2`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `customOptionsKey`

**Type:** `Array` | **Default:** `"[Function]"`

### `fetchUrl`

**Type:** `String` | **Default:** `""`

### `autoComplete`

**Type:** `Boolean` | **Default:** `false`

### `queryString`

**Type:** `String` | **Default:** `""`

### `responseHasData`

**Type:** `Boolean` | **Default:** `true`

### `responseKey`

**Type:** `String` | **Default:** `""`

### `maxNewTagCharacterLimit`

**Type:** `Number | String` | **Default:** `""`

### `newOptionIcon`

**Type:** `String` | **Default:** `"line-plus-netural"`

### `newOptionText`

**Type:** `String` | **Default:** `"Create:"`

### `noDataText`

**Type:** `String` | **Default:** `"No Data to Show"`

### `noSearchResultText`

**Type:** `String` | **Default:** `"No Search Result"`

### `bottomExtraSpace`

**Type:** `Number` | **Default:** `0`

### `hasTemporaryOptions`

**Type:** `Boolean` | **Default:** `false`

### `searchableContent`

**Type:** `String` | **Default:** `"VALIDATIONS.All"`

## Events

### `closeList`

### `change`

### `search`

### `addNewOption`

### `click`

## Examples

### Basic Multi-Select

Simple multi-select with static options

```vue
<InMultiDropDown
  id="categories"
  label="Categories"
  placeholder="Select categories"
  :options="[
    { label: 'Technology', value: 'tech' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' }
  ]"
  v-model="selectedCategories"
  @change="handleChange"
/>
```

### With API Fetch

Dynamic options from API

```vue
<InMultiDropDown
  id="users"
  label="Assign Users"
  fetch-url="/api/users"
  response-key="data.users"
  query-string="search"
  search-status
  search-placeholder="Search users..."
  v-model="assignedUsers"
  @search="handleSearch"
/>
```

### With New Tag Creation

Allow adding custom options

```vue
<InMultiDropDown
  id="tags"
  label="Tags"
  type="tags"
  :options="availableTags"
  v-model="selectedTags"
  add-new-tag-status
  :minimum-new-tag-character-limit="2"
  :max-new-tag-character-limit="30"
  new-option-text="Create tag"
  @add-new-option="createTag"
/>
```

## Common Mistakes

ℹ️ **Not setting responseKey for API fetch**

ℹ️ **Using disable instead of disabled in options**

ℹ️ **Forgetting v-model for two-way binding**

## Best Practices

- **undefined:** Enable search when options > 10 for better UX
- **undefined:** Prevent over-selection with clear limits
- **undefined:** Use warningMessage and invalidMessage for user feedback

