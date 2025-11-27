# InDropdownMenu

**Version:** v1

## Props

### `status`

**Type:** `Boolean` | **Default:** `false`

### `selectAllOptionStatus`

**Type:** `Boolean` | **Default:** `true`

### `selectionType`

**Type:** `String` | **Default:** `"single"`

### `searchStatus`

**Type:** `Boolean` | **Default:** `false`

### `options`

**Type:** `Array` | **Required**

### `preSelectedValues`

**Type:** `Array` | **Default:** `"[Function]"`

### `id`

**Type:** `String` | **Required**

### `boxWidth`

**Type:** `String` | **Default:** `"basedOnField"`

### `createButtonLabel`

**Type:** `String` | **Default:** `""`

### `minCharacterLimit`

**Type:** `Number | String` | **Default:** `1`

### `maxCharacterLimit`

**Type:** `Number | String` | **Default:** `10`

### `createOptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `buttonStatus`

**Type:** `Boolean` | **Default:** `false`

### `buttonIcon`

**Type:** `String` | **Default:** `""`

### `buttonLabel`

**Type:** `String` | **Default:** `""`

### `loadingState`

**Type:** `Boolean` | **Default:** `false`

### `dynamicPosition`

**Type:** `Boolean` | **Default:** `false`

### `dynamicChildPosition`

**Type:** `Boolean` | **Default:** `true`

### `bottomOffsetForDynamicPosition`

**Type:** `Number` | **Default:** `0`

### `fetchPage`

**Type:** `Number` | **Default:** `1`

### `staticPosition`

**Type:** `String` | **Default:** `"BOTTOM_LEFT"`

### `staticChildPosition`

**Type:** `String` | **Default:** `"BOTTOM_RIGHT"`

### `maxHeight`

**Type:** `Number` | **Default:** `240`

### `maxChildHeight`

**Type:** `Number` | **Default:** `480`

### `optionValidationType`

**Type:** `any` | **Default:** `"VALIDATIONS.All"`

### `optionValidationText`

**Type:** `String` | **Default:** `"Enter a valid value to continue."`

### `characterLimitValidationText`

**Type:** `String` | **Default:** `"Enter a value between 1 and 10 characters to continue."`

### `sameValueExistsValidationText`

**Type:** `String` | **Default:** `"Same values exists. Enter a different value."`

### `canSelectOption`

**Type:** `Boolean` | **Default:** `true`

### `lazyLoad`

**Type:** `Boolean` | **Default:** `false`

### `lazyLoadSearch`

**Type:** `Boolean` | **Default:** `false`

### `hasLimit`

**Type:** `Boolean` | **Default:** `false`

### `externalSearch`

**Type:** `String` | **Default:** `""`

### `searchTabIndex`

**Type:** `Number` | **Default:** `0`

### `preventFocus`

**Type:** `Boolean` | **Default:** `false`

### `isWrappedDescription`

**Type:** `Boolean` | **Default:** `false`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `allowAddAllCases`

**Type:** `Boolean` | **Default:** `true`

### `state`

**Type:** `String` | **Default:** `"default"`

### `stateMessage`

**Type:** `String` | **Default:** `""`

## Events

### `selectedDisabledValues`

### `endScroll`

### `clickOutside`

### `search`

### `addOption`

### `secondaryButtonClick`

### `selectAllOptions`

### `resetAllOptions`

### `optionClick`

## Enums

### PATTERNS



### KEY_KODE_ENUMS



## Examples

### Basic Dropdown Menu (Actions)

Simple action menu with icons

```vue
<InDropdownMenu
  id="action-menu"
  button-label="Actions"
  :options="[
    { text: 'Edit', value: 'edit', icon: 'pencil' },
    { text: 'Delete', value: 'delete', icon: 'trash' },
    { text: 'Share', value: 'share', icon: 'share' }
  ]"
  @optionClick="handleAction"
/>
```

### Multi-Select Dropdown Menu

Multiple selection with checkboxes

```vue
<InDropdownMenu
  id="filter-menu"
  button-label="Filter Columns"
  selection-type="multiple"
  :options="[
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Status', value: 'status' }
  ]"
  :pre-selected-values="['name', 'email']"
  select-all-option-status
  @optionClick="toggleColumn"
/>
```

### Dropdown Menu with Secondary Actions

Menu items with additional action buttons

```vue
<InDropdownMenu
  id="export-menu"
  button-label="Export"
  :options="[
    {
      text: 'Export as CSV',
      value: 'csv',
      icon: 'file',
      secondaryButton: { icon: 'download', action: 'quick-download' }
    },
    {
      text: 'Export as PDF',
      value: 'pdf',
      icon: 'file-pdf',
      secondaryButton: { icon: 'settings', action: 'configure' }
    }
  ]"
  @optionClick="handleExport"
  @secondaryButtonClick="handleSecondaryAction"
/>
```

### Searchable Dropdown Menu

Large menu with search functionality

```vue
<InDropdownMenu
  id="country-menu"
  button-label="Select Country"
  :options="countries"
  search-status
  @search="filterCountries"
  @optionClick="selectCountry"
/>
```

## Common Mistakes

ℹ️ **Using InDropdownMenu for data selection instead of InSelect/InMultiSelect**

ℹ️ **Not closing menu after action in selectionType='single'**

## Best Practices

- **Use Descriptive Button Labels:** Button label should clearly indicate menu purpose
- **Group Related Actions:** Organize menu items logically
- **Handle All Option Values:** Always handle every possible option value
- **Disable Unavailable Actions:** Use disabled property instead of hiding options

