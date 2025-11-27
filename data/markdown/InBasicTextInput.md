# InBasicTextInput

**Version:** v1

## Props

### `id`

**Type:** `String` | **Required**

### `name`

**Type:** `String` | **Required**

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `value`

**Type:** `String | Number` | **Default:** `""`

### `labelStatus`

**Type:** `Boolean` | **Default:** `true`

### `labelText`

**Type:** `String` | **Default:** `""`

### `tooltipStatus`

**Type:** `Boolean` | **Default:** `true`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `type`

**Type:** `String` | **Default:** `"text"`

### `states`

**Type:** `String` | **Default:** `"default"`

### `placeholderText`

**Type:** `String` | **Required**

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `leftIconStatus`

**Type:** `Boolean` | **Default:** `false`

### `leftIconName`

**Type:** `String` | **Default:** `"search"`

### `rightIconStatus`

**Type:** `Boolean` | **Default:** `false`

### `rightIconName`

**Type:** `String` | **Default:** `"search"`

### `autoComplete`

**Type:** `String` | **Default:** `"off"`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `prefixStatus`

**Type:** `Boolean` | **Default:** `false`

### `prefixText`

**Type:** `String` | **Default:** `"%"`

### `actionablePrefixStatus`

**Type:** `Boolean` | **Default:** `false`

### `prefixDropdownOptions`

**Type:** `Object` | **Default:** `"[Function]"`

### `suffixStatus`

**Type:** `Boolean` | **Default:** `false`

### `suffixText`

**Type:** `String` | **Default:** `"%"`

### `actionableSuffixStatus`

**Type:** `Boolean` | **Default:** `false`

### `suffixDropdownOptions`

**Type:** `Object` | **Default:** `"[Function]"`

### `maxCharacterLength`

**Type:** `Number | String` | **Default:** `""`

### `minValue`

**Type:** `Number | String` | **Default:** `0`

### `maxValue`

**Type:** `Number | String` | **Default:** `""`

### `autoFocus`

**Type:** `Boolean` | **Default:** `false`

### `allowDecimal`

**Type:** `Boolean` | **Default:** `false`

### `allowComma`

**Type:** `Boolean` | **Default:** `true`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

### `helperMessageStatus`

**Type:** `Boolean` | **Default:** `true`

### `helperMessage`

**Type:** `String` | **Default:** `""`

### `stateMessage`

**Type:** `String` | **Default:** `""`

### `characterCounterStatus`

**Type:** `Boolean` | **Default:** `true`

### `characterCounterMaxValue`

**Type:** `Number` | **Default:** `20`

## Events

### `keyup`

### `enter`

### `focus`

### `blur`

### `click`

### `input`

### `change`

### `leftIconClick`

### `rightIconClick`

### `prefixClick`

### `suffixClick`

## Enums

### DEFAULT_PREFIX_OPTIONS

- `single`
- `option`
- `option`

### DEFAULT_SUFFIX_OPTIONS

- `single`
- `option`
- `option`

### KEY_KODE_ENUMS



### TYPES

- `text`
- `number`

## Examples

### Basic Text Input with Validation

Simple text input with label, placeholder, and error state

```vue
<InBasicTextInput
  id="username"
  name="username"
  label-text="Username"
  placeholder-text="Enter your username"
  v-model="username"
  :states="usernameError ? 'error' : 'default'"
  :state-message="usernameError"
  helper-message="3-20 characters, letters and numbers only"
  :max-character-length="20"
  :character-counter-status="true"
/>
```

### Number Input with Range Validation

Number input with min/max limits and decimal support

```vue
<InBasicTextInput
  id="price"
  name="price"
  type="number"
  label-text="Product Price"
  placeholder-text="0.00"
  v-model="price"
  :prefix-status="true"
  prefix-text="$"
  :allow-decimal="true"
  :allow-comma="true"
  :min-value="0"
  :max-value="999999"
  helper-message="Enter price in USD"
/>
```

### Search Input with Icon

Text input with search icon and clear button

```vue
<InBasicTextInput
  id="search"
  name="search"
  placeholder-text="Search products..."
  v-model="searchQuery"
  :left-icon-status="true"
  left-icon-name="search"
  :right-icon-status="!!searchQuery"
  right-icon-name="x"
  @right-icon-click="clearSearch"
  @enter="performSearch"
/>
```

### Currency Input with Dropdown

Number input with actionable currency prefix selector

```vue
<InBasicTextInput
  id="amount"
  name="amount"
  type="number"
  label-text="Amount"
  placeholder-text="0.00"
  v-model="amount"
  :prefix-status="true"
  :actionable-prefix-status="true"
  :prefix-dropdown-options="[
    { text: 'USD ($)', value: 'usd' },
    { text: 'EUR (€)', value: 'eur' },
    { text: 'GBP (£)', value: 'gbp' }
  ]"
  :allow-decimal="true"
  @prefix-click="handleCurrencyChange"
/>
```

### Password Input with Toggle

Password field with visibility toggle icon

```vue
<InBasicTextInput
  id="password"
  name="password"
  :type="showPassword ? 'text' : 'password'"
  label-text="Password"
  placeholder-text="Enter password"
  v-model="password"
  auto-complete="current-password"
  :right-icon-status="true"
  :right-icon-name="showPassword ? 'eye-off' : 'eye'"
  @right-icon-click="showPassword = !showPassword"
  helper-message="Min 8 characters, 1 uppercase, 1 number"
  :states="passwordError ? 'error' : 'default'"
  :state-message="passwordError"
/>
```

### Weight Input with Unit Selector

Number input with actionable unit suffix dropdown

```vue
<InBasicTextInput
  id="weight"
  name="weight"
  type="number"
  label-text="Weight"
  placeholder-text="0"
  v-model="weight"
  :suffix-status="true"
  :actionable-suffix-status="true"
  :suffix-dropdown-options="[
    { text: 'kg', value: 'kg' },
    { text: 'lb', value: 'lb' },
    { text: 'g', value: 'g' }
  ]"
  :allow-decimal="true"
  :min-value="0"
  @suffix-click="handleUnitChange"
/>
```

## Common Mistakes

ℹ️ **Using states='error' without stateMessage**

ℹ️ **Using minValue/maxValue with type='text'**

ℹ️ **Setting actionablePrefixStatus without prefixDropdownOptions**

ℹ️ **Disabling preventXss without server-side validation**

ℹ️ **Using autoFocus on multiple inputs**

ℹ️ **Setting maxCharacterLength without characterCounterStatus**

ℹ️ **Forgetting to handle @enter event for search inputs**

ℹ️ **Using allowDecimal with integer-only scenarios**

## Best Practices

- **undefined:** Provide clear stateMessage for error/warning/success states
- **undefined:** Show expected format before user makes mistakes
- **undefined:** Show remaining characters for tweets, SMS, bios
- **undefined:** Improve UX with browser autofill for common fields
- **undefined:** Use type='number' with min/max for numeric inputs
- **undefined:** Security first - only disable with strong justification

