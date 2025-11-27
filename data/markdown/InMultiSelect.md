# InMultiSelect

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `"qa-select"`

### `options`

**Type:** `Array` | **Default:** `"[Function]"`

### `value`

**Type:** `Array` | **Default:** `"[Function]"`

### `loadingState`

**Type:** `Boolean` | **Default:** `false`

### `labelStatus`

**Type:** `Boolean` | **Default:** `true`

### `labelText`

**Type:** `String` | **Default:** `""`

### `tooltipStatus`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `dropdownMenuStatus`

**Type:** `Boolean` | **Default:** `false`

### `searchStatus`

**Type:** `Boolean` | **Default:** `false`

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `buttonType`

**Type:** `String` | **Default:** `"dropdown"`

### `placeholderText`

**Type:** `String` | **Default:** `""`

### `staticPosition`

**Type:** `String` | **Default:** `"BOTTOM_LEFT"`

### `dynamicPosition`

**Type:** `Boolean` | **Default:** `false`

### `dynamicChildPosition`

**Type:** `Boolean` | **Default:** `true`

### `staticChildPosition`

**Type:** `String` | **Default:** `"BOTTOM_RIGHT"`

### `createButtonLabel`

**Type:** `String` | **Default:** `""`

### `createOptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `buttonStatus`

**Type:** `Boolean` | **Default:** `true`

### `buttonIcon`

**Type:** `String` | **Default:** `""`

### `buttonLabel`

**Type:** `String` | **Default:** `""`

### `state`

**Type:** `String` | **Default:** `"default"`

### `stateMessage`

**Type:** `String` | **Default:** `"State Message"`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `optionValidationType`

**Type:** `any` | **Default:** `"VALIDATIONS.All"`

### `minCharacterLimit`

**Type:** `Number | String` | **Default:** `1`

### `maxCharacterLimit`

**Type:** `Number | String` | **Default:** `10`

### `optionValidationText`

**Type:** `String` | **Default:** `"Enter a valid value to continue."`

### `characterLimitValidationText`

**Type:** `String` | **Default:** `"Enter a value between 1 and 10 characters to continue."`

### `bottomOffsetForDynamicPosition`

**Type:** `Number` | **Default:** `0`

### `maxHeight`

**Type:** `Number` | **Default:** `240`

### `maxChildHeight`

**Type:** `Number` | **Default:** `480`

### `fetchPage`

**Type:** `Number` | **Default:** `1`

### `maxSelectableItem`

**Type:** `Number` | **Default:** `0`

### `lazyLoad`

**Type:** `Boolean` | **Default:** `false`

### `lazyLoadSearch`

**Type:** `Boolean` | **Default:** `false`

### `selectAllOptionStatus`

**Type:** `Boolean` | **Default:** `true`

### `tooltipMaxHeight`

**Type:** `Number` | **Default:** `320`

### `helperMessageStatus`

**Type:** `Boolean` | **Default:** `false`

### `helperMessage`

**Type:** `String` | **Default:** `""`

### `staticTagTooltipPosition`

**Type:** `String` | **Default:** `"top center"`

### `dynamicTagTooltipPosition`

**Type:** `Boolean` | **Default:** `false`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

### `allowAddAllCases`

**Type:** `Boolean` | **Default:** `true`

### `preventFocus`

**Type:** `Boolean` | **Default:** `false`

### `sameValueExistsValidationText`

**Type:** `String` | **Default:** `"This value already exists."`

## Events

### `openList`

### `close`

### `change`

### `select`

### `search`

### `endScroll`

### `secondaryButtonClick`

### `selectAllOptions`

### `resetAllOptions`

### `onRemoveTag`

## Enums

### KEY_KODE_ENUMS



## Examples

### Basic Multi-Select

Simple multi-select with predefined options

```vue
<InMultiSelect
  id="multi-select-1"
  label-text="Select Countries"
  :options="[
    { text: 'Turkey', value: 'TR' },
    { text: 'USA', value: 'US' },
    { text: 'UK', value: 'GB' }
  ]"
  :value="selectedCountries"
  @change="selectedCountries = $event"
/>
```

### Multi-Select with Search

Multi-select with search functionality

```vue
<InMultiSelect
  id="multi-select-2"
  label-text="Select Tags"
  :options="tags"
  :value="selectedTags"
  search-status
  @search="filterTags"
  @change="selectedTags = $event"
/>
```

### Multi-Select with Limit and Select All

Limited selection with select all feature

```vue
<InMultiSelect
  id="multi-select-3"
  label-text="Select up to 3 Categories"
  :options="categories"
  :value="selectedCategories"
  :max-selectable-item="3"
  select-all-option-status
  @change="selectedCategories = $event"
  @selectAllOptions="handleSelectAll"
  @resetAllOptions="selectedCategories = []"
/>
```

### Multi-Select with Create Option

Allow creating new options on the fly

```vue
<InMultiSelect
  id="multi-select-4"
  label-text="Add Custom Tags"
  :options="existingTags"
  :value="selectedTags"
  create-option-status
  option-validation-type="text"
  create-button-label="Add Tag"
  @change="selectedTags = $event"
/>
```

## Common Mistakes

ℹ️ **Using InMultiSelect like InSelect (single selection)**

ℹ️ **Not providing feedback on selection limit**

## Best Practices

- **Provide Clear Label and Placeholder:** Help users understand what to select
- **Use Select All for Long Lists:** Enable select-all for lists with 5+ items
- **Set Reasonable Limits:** Prevent overwhelming selections
- **Handle Empty States:** Guide users when no options available

