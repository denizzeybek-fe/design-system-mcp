# InRichTextInput

**Version:** v1

## Props

### `id`

**Type:** `String` | **Required**

### `name`

**Type:** `String` | **Required**

### `value`

**Type:** `String` | **Required**

### `labelStatus`

**Type:** `Boolean` | **Default:** `true`

### `labelText`

**Type:** `String` | **Required**

### `tooltipStatus`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `placeholderText`

**Type:** `String` | **Required**

### `helperTextValidationConfigStatus`

**Type:** `Boolean` | **Default:** `true`

### `helperTextValidationConfig`

**Type:** `Object` | **Required**

### `fallBackText`

**Type:** `String` | **Required**

### `linkFallBackText`

**Type:** `String` | **Default:** `""`

### `fallBackLabel`

**Type:** `String` | **Required**

### `linkFallBackLabel`

**Type:** `String` | **Default:** `""`

### `fallBackPlaceholder`

**Type:** `String` | **Required**

### `fallbackImageSrc`

**Type:** `String` | **Default:** `""`

### `fallbackImageName`

**Type:** `String` | **Default:** `""`

### `fallBackUrlPlaceholder`

**Type:** `String` | **Default:** `""`

### `fallBackCloseButtonText`

**Type:** `String` | **Required**

### `fallBackSaveButtonText`

**Type:** `String` | **Required**

### `states`

**Type:** `String` | **Default:** `""`

### `stateMessage`

**Type:** `String` | **Default:** `""`

### `dynamicContentList`

**Type:** `Array | Object` | **Default:** `"[Function]"`

### `characterCounterStatus`

**Type:** `Boolean` | **Default:** `true`

### `disabledStatus`

**Type:** `Boolean` | **Default:** `true`

### `isDynamicContentOnly`

**Type:** `Boolean` | **Default:** `false`

### `canOnlyReplaceDynamicContent`

**Type:** `Boolean` | **Default:** `false`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `delimiters`

**Type:** `Array` | **Default:** `"[Function]"`

### `ignoreParagraphs`

**Type:** `Boolean` | **Default:** `true`

### `maxSelectableDynamicContent`

**Type:** `Number` | **Default:** `0`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

### `toolbarOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `footerOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `tipStatus`

**Type:** `Boolean` | **Default:** `false`

### `specialCharacters`

**Type:** `String` | **Default:** `""`

### `isHighlightCharactersEnabled`

**Type:** `Boolean` | **Default:** `false`

### `isHighlightUrlEnabled`

**Type:** `Boolean` | **Default:** `true`

### `isRequiredFooterTags`

**Type:** `Boolean` | **Default:** `false`

### `addDynamicContentText`

**Type:** `String` | **Default:** `"Add Dynamic Content"`

### `replaceDynamicContentText`

**Type:** `String` | **Default:** `"Replace Dynamic Content"`

### `customCounter`

**Type:** `String` | **Default:** `""`

### `footerLabel`

**Type:** `String` | **Default:** `""`

### `urlPatternRegex`

**Type:** `RegExp` | **Default:** `"[Function]"`

### `whatsappStylingSupport`

**Type:** `Boolean` | **Default:** `true`

### `customFooter`

**Type:** `Boolean` | **Default:** `false`

### `errorTags`

**Type:** `Array` | **Default:** `"[Function]"`

### `warningTags`

**Type:** `Array` | **Default:** `"[Function]"`

### `hasFooter`

**Type:** `Boolean` | **Default:** `true`

### `isExtendedDynamicContent`

**Type:** `Boolean` | **Default:** `false`

### `dynamicContentBoxProps`

**Type:** `Object` | **Default:** `"[Function]"`

### `usedDynamicContent`

**Type:** `Array` | **Default:** `"[Function]"`

### `fallBackStatusMessage`

**Type:** `String` | **Default:** `""`

### `disableDuplicateTags`

**Type:** `Boolean` | **Default:** `false`

### `fallBackDisabledCharacters`

**Type:** `Array` | **Default:** `"[Function]"`

### `fallBackDisabledCharactersMessage`

**Type:** `String` | **Default:** `""`

### `maxLimitTooltipMessage`

**Type:** `String` | **Default:** `""`

### `fallbackValidationMessage`

**Type:** `String` | **Default:** `""`

### `fallbackValidation`

**Type:** `Boolean` | **Default:** `false`

### `isUploadFallback`

**Type:** `Boolean` | **Default:** `false`

### `isDynamicFallbackPosition`

**Type:** `Boolean` | **Default:** `true`

### `fallbackVisibility`

**Type:** `Boolean` | **Default:** `true`

### `disabledToolbarOptions`

**Type:** `Array` | **Default:** `"[Function]"`

### `dynamicContentStates`

**Type:** `Array` | **Default:** `"[Function]"`

### `preventFallbackWithState`

**Type:** `Boolean` | **Default:** `false`

### `dynamicContentSpacingStatus`

**Type:** `Boolean` | **Default:** `true`

### `emojiButtonStatus`

**Type:** `Boolean` | **Default:** `false`

### `saveButtonCallback`

**Type:** `Function` | **Default:** `"null"`

### `validateTagsWithFallback`

**Type:** `Boolean` | **Default:** `true`

### `notExistingAttributeHasErrorState`

**Type:** `Boolean` | **Default:** `false`

### `notExistingAttributeWhiteListRegExp`

**Type:** `RegExp` | **Default:** `"[Function]"`

### `uploadTriggerWords`

**Type:** `Array` | **Default:** `"[Function]"`

## Events

### `generate`

### `markedTags`

### `purify`

### `purifyObject`

### `updateFallBackOptions`

### `charactersHighlighted`

### `closeAllEmojiPickers`

### `onShortenUrlClick`

### `onAlternativeTextChange`

### `saveUrlOption`

### `saveFallBackOption`

### `saveFallBackOptionObject`

### `onDynamicContentCancel`

### `updateEventPersistent`

### `updateProductAttributePersistent`

### `addDynamicAttribute`

### `selectedInActiveOption`

### `closeFallBackOption`

## Enums

### ACTION_KEYS



### SUPPORT_KEYS



### TEXT_STYLE_BUTTONS

- `bold-button`
- `italic-button`
- `strikethrough-button`
- `monospace-button`

### STATUS_ICONS

- `filled-caution-triangle-colored`
- `filled-error-box-colored`
- `filled-caution-triangle-colored`

### STATUS_COLORS

- `E7AB29`
- `DC2A2A`
- `DC2A2A`

### TEXT_FORMATS

- `b`
- `*`

### PADDING



## Examples

### Basic Rich Text Editor

Simple editor with toolbar and dynamic content

```vue
<InRichTextInput
  id="message"
  label-status
  label-text="Message Content"
  placeholder-text="Enter your message..."
  v-model="content"
  :dynamic-content-list="[
    { label: 'First Name', value: 'first_name', category: 'User' },
    { label: 'Email', value: 'email', category: 'User' }
  ]"
  :toolbar-options="['bold', 'italic', 'link', 'emoji', 'dynamicContent']"
  :footer-options="['counter']"
  character-counter-status
  @purify="handlePurify"
/>
```

### SMS Editor with Validation

SMS message editor with character limits

```vue
<InRichTextInput
  id="sms"
  label-status
  label-text="SMS Message"
  v-model="smsContent"
  :dynamic-content-list="attributes"
  helper-text-validation-config-status
  :helper-text-validation-config="{ maxLength: 160, segmentLength: 160 }"
  character-counter-status
  :footer-options="['counter', 'tags']"
  :max-selectable-dynamic-content="5"
  states="warning"
  state-message="Message will be split into multiple segments"
  @purify="handlePurify"
  @marked-tags="handleTags"
/>
```

### WhatsApp Message Editor

Editor with WhatsApp formatting support

```vue
<InRichTextInput
  id="whatsapp"
  label-status
  label-text="WhatsApp Message"
  v-model="waContent"
  :dynamic-content-list="attributes"
  whatsapp-styling-support
  emoji-button-status
  is-highlight-url-enabled
  :toolbar-options="['bold', 'italic', 'emoji', 'dynamicContent']"
  tip-status
  @purify="handlePurify"
/>
```

### Advanced Editor with Fallbacks

Full-featured editor with fallback handling

```vue
<InRichTextInput
  id="email"
  label-status
  label-text="Email Content"
  v-model="emailContent"
  :dynamic-content-list="attributes"
  is-extended-dynamic-content
  :dynamic-content-box-props="{ searchable: true, grouped: true }"
  fall-back-label="Default Value"
  fall-back-placeholder="Enter default..."
  is-upload-fallback
  fallback-visibility="onHover"
  :error-tags="invalidAttributes"
  :warning-tags="deprecatedAttributes"
  @purify-object="handlePurifyObject"
  @save-fall-back-option="handleSaveFallback"
  @add-dynamic-attribute="handleAddAttribute"
/>
```

## Common Mistakes

ℹ️ **Using attributeList instead of dynamicContentList**

ℹ️ **Using textValidateConfig instead of helperTextValidationConfig**

ℹ️ **Using invalid/warning booleans**

ℹ️ **Using isCounter instead of characterCounterStatus**

ℹ️ **Using hasEmoji instead of emojiButtonStatus**

ℹ️ **Not handling @purify event**

## Best Practices

- **undefined:** Only show relevant toolbar buttons for the use case
- **undefined:** Use @save-fall-back-option to persist fallback values
- **undefined:** Mark deprecated or invalid tags with visual feedback
- **undefined:** Show users validation feedback in real-time

