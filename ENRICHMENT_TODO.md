# Enrichment Schema Compliance TODO

**Last Updated**: 2025-11-27 (after cleanup)

## Summary

- **Total files**: 19
- **✅ Compliant**: 14 (73%)
- **❌ Non-compliant**: 5 (27%)

## Recent Changes

✅ Added `helperFunctions` to schema as optional field
✅ Removed `figmaMapping` from enrichment files (managed centrally in `src/registry/figma-mappings.ts`)
✅ Removed extra fields: `version`, `lastUpdated`, `migrationNotes`

## ✅ Compliant Files (14)

These files are fully compliant with the standard enrichment schema:

- [x] InButtonV2.json
- [x] InCheckBoxV2.json
- [x] InChips.json
- [x] InContainer.json
- [x] InDataTable.json
- [x] InDatePicker.json ⭐ *Fixed!*
- [x] InDatePickerV2.json
- [x] InDropdownMenu.json
- [x] InMultiSelect.json
- [x] InOnPageMessage.json
- [x] InRibbons.json
- [x] InSelect.json
- [x] InSidebarV2.json
- [x] InTooltipV2.json

## ❌ Non-Compliant Files (5)

All remaining issues are **incomplete propEnrichments** - missing `notes` and/or `typescript` fields.

### 1. InDataTableV2.json

**Priority**: Medium (complex component, many props)
**Main Issue**: Missing `notes` and `typescript` fields in ~40 propEnrichments

**Tasks**:
- [ ] Add missing `notes` to propEnrichments
- [ ] Add missing `typescript` to propEnrichments
- [ ] Complete incomplete `commonMistakes` entries

**Affected props** (examples):
- columnOptions, data, totalData, rowModelType, fetchUrl, httpMethod
- bulkActionsOptions, hasBulkActions, rowsSelection, canSelectAllRows
- paginationStatus, loadingStatus, skeletonStatus
- ...and 30+ more props

---

### 2. InDropDown.json

**Priority**: Medium (V1 component, widely used)
**Main Issue**: Missing `notes` and `typescript` in ~15 propEnrichments

**Tasks**:
- [ ] Add `notes` to: options, value, customOptionsKey, fetchUrl, responseKey, queryString, overriddenListPosition, type, buttonType, buttonSize, childOptionsLeftPosition, canRemoveSelectedItem, createOptionStatus
- [ ] Add `typescript` to all above props

---

### 3. InMultiDropDown.json

**Priority**: Medium (V1 component, widely used)
**Main Issue**: Missing `notes` and `typescript` in ~13 propEnrichments

**Tasks**:
- [ ] Add `notes` to: options, value, customOptionsKey, fetchUrl, responseKey, queryString, maxSelectableItem, addNewTagStatus, minimumNewTagCharacterLimit, maxNewTagCharacterLimit, hasTemporaryOptions, type, theme
- [ ] Add `typescript` to all above props
- [ ] Complete incomplete `commonMistakes` for: options, customOptionsKey

---

### 4. InRichTextInput.json

**Priority**: High (complex component, many props)
**Main Issue**: Missing `notes` and `typescript` in ~35 propEnrichments

**Tasks**:
- [ ] Add `notes` to: value, labelText, dynamicContentList, toolbarOptions, footerOptions, helperTextValidationConfig, helperTextValidationConfigStatus, states, stateMessage, characterCounterStatus, maxSelectableDynamicContent, isDynamicContentOnly, canOnlyReplaceDynamicContent, tipStatus, specialCharacters, isHighlightCharactersEnabled, isHighlightUrlEnabled, whatsappStylingSupport, emojiButtonStatus, isExtendedDynamicContent, dynamicContentBoxProps, usedDynamicContent, errorTags, warningTags, customCounter, footerLabel, urlPatternRegex, isUploadFallback, fallbackVisibility, disabledToolbarOptions, dynamicContentStates
- [ ] Add `typescript` to all above props
- [ ] Complete incomplete `commonMistakes` for: dynamicContentList

---

### 5. InSuperInput.json

**Priority**: High (complex component, many props)
**Main Issue**: Missing `notes` and `typescript` in ~18 propEnrichments

**Tasks**:
- [ ] Add `notes` to: value, attributeList, dynamicContentSupport, textValidateConfig, fallBackText, fallBackLabel, fallBackDisabledCharacters, delimiters, hasEmoji, isTagContainer, isCounter, tagsLimit, rowLength, dropDownType, createNewOptionStatus, strictAddMode, countDynamicContentForValidation
- [ ] Add `typescript` to all above props
- [ ] Complete incomplete `commonMistakes` for: attributeList

---

## Progress

### Completed ✅

- [x] Remove `helperFunctions` from schema ❌ → Changed to: Add as optional
- [x] Add `helperFunctions` to schema as optional field
- [x] Remove `figmaMapping` from enrichment files (2 files)
- [x] Remove `version` and `lastUpdated` extra fields (4 files)
- [x] Remove `migrationNotes` extra field (1 file)
- [x] Fix InDatePicker.json compliance

### In Progress 🔄

5 files need `propEnrichments` completion:
- InDataTableV2.json (~40 props)
- InDropDown.json (~15 props)
- InMultiDropDown.json (~13 props)
- InRichTextInput.json (~35 props)
- InSuperInput.json (~18 props)

**Total props to enrich**: ~121 props

---

## Implementation Strategy

### Approach 1: Bulk Fill (Fast but less detailed)

Create a script to auto-generate minimal `notes` and `typescript` from component metadata:

```typescript
// For each prop missing notes:
notes: `${propName} prop for InComponent. See component documentation for details.`

// For each prop missing typescript:
typescript: inferTypeFromPropDefinition(prop) // e.g., "string", "boolean", "number"
```

**Pros**: Fast, gets to 100% compliance quickly
**Cons**: Low-quality enrichments, minimal value

### Approach 2: Manual Enrichment (Slow but high-quality)

Manually add meaningful `notes` and accurate `typescript` for each prop:

```typescript
notes: "CRITICAL: columnOptions defines the table structure. Each column must have field, headerName, and type..."
typescript: "Array<{ field: string; headerName: string; type: 'text' | 'number' | 'date'; ... }>"
```

**Pros**: High-quality, valuable enrichments
**Cons**: Time-consuming (~2-3 hours for 121 props)

### Recommended: Hybrid Approach

1. **Auto-generate basic enrichments** for all props (get to 100% compliance)
2. **Manually enhance critical props** over time (focus on complex Object/Array types)
3. **Prioritize by usage**: InRichTextInput > InSuperInput > InDataTableV2 > V1 components

---

## Validation Command

After making changes, re-validate:

```bash
npx tsx scripts/validate-enrichments.ts
```

---

## Reference Files

Use these as examples when fixing non-compliant files:

- **InRibbons.json** - Gold standard with all fields
- **InButtonV2.json** - Simple props with complete enrichments
- **InCheckBoxV2.json** - Boolean props and related states
- **InDatePickerV2.json** - Complex Object/Array props
- **InSelect.json** - Options and value patterns
- **_TEMPLATE.json** - Canonical schema structure
- **enrichment-schema.ts** - TypeScript type definitions

---

## Notes

- `helperFunctions` is now **optional** in schema (can be used when needed)
- `figmaMapping` should **NOT** be in enrichment files (managed in `src/registry/figma-mappings.ts`)
- Use `_metadata.lastUpdated` instead of separate `version`/`lastUpdated` fields
- Migration notes should go in `src/registry/migrations/` instead of enrichment files
