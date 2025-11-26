# InSuperInput

**Version:** v1

## Props

### `id`

**Type:** `String` | **Required**

### `name`

**Type:** `String` | **Required**

### `value`

**Type:** `String` | **Required**

### `label`

**Type:** `String` | **Required**

### `placeholderText`

**Type:** `String` | **Required**

### `smsText`

**Type:** `String` | **Default:** `""`

### `fallBackStatusMessage`

**Type:** `String` | **Default:** `""`

### `textValidateConfig`

**Type:** `Object` | **Required**

### `tagButtonText`

**Type:** `String` | **Required**

### `fallBackText`

**Type:** `String` | **Required**

### `fallBackLabel`

**Type:** `String` | **Required**

### `fallBackDisableInput`

**Type:** `Boolean` | **Default:** `false`

### `fallBackPlaceholder`

**Type:** `String` | **Required**

### `fallBackCloseButtonText`

**Type:** `String` | **Required**

### `fallBackSaveButtonText`

**Type:** `String` | **Required**

### `fallBackDisabledCharacters`

**Type:** `Array` | **Default:** `"[Function]"`

### `fallBackDisabledCharactersMessage`

**Type:** `String` | **Default:** `""`

### `invalid`

**Type:** `Boolean` | **Default:** `false`

### `invalidMessage`

**Type:** `String` | **Default:** `""`

### `warning`

**Type:** `Boolean` | **Default:** `false`

### `warningMessage`

**Type:** `String` | **Default:** `""`

### `warningMessageCustomClass`

**Type:** `String` | **Default:** `""`

### `hasEmoji`

**Type:** `Boolean` | **Default:** `false`

### `attributeList`

**Type:** `Array | Object` | **Default:** `"[Function]"`

### `dynamicContentSupport`

**Type:** `Boolean` | **Default:** `true`

### `isTagContainer`

**Type:** `Boolean` | **Default:** `true`

### `isCounter`

**Type:** `Boolean` | **Default:** `true`

### `messageWithoutCounter`

**Type:** `Boolean` | **Default:** `false`

### `disable`

**Type:** `Boolean` | **Default:** `true`

### `disableAddAttribute`

**Type:** `Boolean` | **Default:** `false`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `delimiters`

**Type:** `Array` | **Default:** `"[Function]"`

### `rowLength`

**Type:** `Number` | **Default:** `1`

### `showLabel`

**Type:** `Boolean` | **Default:** `true`

### `dropDownType`

**Type:** `String` | **Default:** `"text"`

### `createNewOptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `createNewOptionText`

**Type:** `String` | **Default:** `"Label"`

### `isSearchVisible`

**Type:** `Boolean` | **Default:** `true`

### `isMultiSpaces`

**Type:** `Boolean` | **Default:** `false`

### `enableAddAttribute`

**Type:** `Boolean` | **Default:** `true`

### `tagsLimit`

**Type:** `Number` | **Default:** `0`

### `applyTagsLimit`

**Type:** `Boolean` | **Default:** `false`

### `customTooltipMessage`

**Type:** `String` | **Default:** `""`

### `strictAddMode`

**Type:** `Boolean` | **Default:** `true`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

### `countDynamicContentForValidation`

**Type:** `Boolean` | **Default:** `true`

### `disableDuplicateTags`

**Type:** `Boolean` | **Default:** `false`

### `searchCustomDynamicAttributeFirst`

**Type:** `Boolean` | **Default:** `false`

## Events

### `purify`

## Examples

### Basic Rich Text with Dynamic Content

Text input with attribute insertion

```vue
<InSuperInput
  id="message"
  label="Message"
  placeholder-text="Enter your message..."
  v-model="messageContent"
  dynamic-content-support
  :attribute-list="[
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Email', value: 'email' }
  ]"
  is-counter
  :text-validate-config="{ maxLength: 500 }"
  @purify="handlePurify"
/>
```

### SMS Input with Fallbacks

SMS message with dynamic content and fallbacks

```vue
<InSuperInput
  id="sms"
  label="SMS Message"
  sms-text="SMS"
  v-model="smsContent"
  dynamic-content-support
  :attribute-list="attributes"
  :delimiters="['{{', '}}']"
  fall-back-label="Default Value"
  fall-back-placeholder="Enter default..."
  is-counter
  :text-validate-config="{ maxLength: 160 }"
  count-dynamic-content-for-validation
/>
```

### Tag Container Mode

Display as tag-based input

```vue
<InSuperInput
  id="tags"
  label="Tags"
  v-model="tagContent"
  is-tag-container
  :tags-limit="10"
  :attribute-list="tagOptions"
  create-new-option-status
  create-new-option-text="Add new tag"
  disable-duplicate-tags
/>
```

## Common Mistakes

ℹ️ **Not providing attributeList with dynamicContentSupport**

ℹ️ **Wrong delimiter format**

ℹ️ **Using invalid without invalidMessage**

ℹ️ **Not handling @purify event**

## Best Practices

- **undefined:** Centralize validation rules in config object
- **undefined:** Help users understand what fallback values are for
- **undefined:** Prevent users from adding arbitrary attributes

