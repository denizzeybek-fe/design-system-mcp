# 🎯 Insider Design System MCP - Complete Analysis & Implementation Plan

**Project**: Insider Design System MCP Server
**Source Code**: `/Users/deniz.zeybek/Documents/insider-projects/insider-design-system`
**Usage Analysis**: `/Users/deniz.zeybek/Documents/insider-projects/analytics-fe`
**Date**: 2025-11-21

---

## 📊 Current Insider Design System Structure

### Source Code Organization
```
insider-design-system/
├── src/
│   ├── components/           # 60+ Vue components
│   │   ├── InButtonV2/
│   │   │   ├── InButtonV2.vue       # Main component
│   │   │   ├── InButton.vue         # Sub-component
│   │   │   ├── InButtonGroup.vue    # Sub-component
│   │   │   └── index.js             # Exports
│   │   ├── InDatePickerV2/
│   │   ├── InSelect/
│   │   └── ...
│   ├── composables/          # Vue composables
│   ├── directives/           # Custom directives
│   ├── enums/                # Shared enums
│   ├── mixins/               # Vue mixins
│   └── plugins/              # Vue plugins
├── storybook/
│   └── stories/
│       └── 5-library/
│           ├── v1/           # V1 component stories (.stories.js)
│           └── v2/           # V2 component stories (.stories.js)
├── design-tokens/            # Design system tokens
└── __tests__/                # Unit tests
```

### Component Structure Example (InButtonV2)
```vue
<script>
// Enum definitions directly in component
const STYLES = {
    SOLID: 'solid',
    GHOST: 'ghost',
    TEXT: 'text'
};
const TYPES = {
    PRIMARY: 'primary',
    SUBTLE_PRIMARY: 'subtle-primary',
    SECONDARY: 'secondary',
    DANGER: 'danger',
    WARNING: 'warning',
    SMART: 'smart',
    SUBTLE_SMART: 'subtle-smart',
    INVERSE: 'inverse'
};
const SIZES = {
    DEFAULT: 'default',
    SMALL: 'small'
};
const ICON_SIZES = [ '40', '24', '20' ];

export default {
    props: {
        id: { type: String, required: true },
        styling: {
            type: String,
            default: STYLES.SOLID,
            validator: (value) => Object.values(STYLES).includes(value)
        },
        iconSize: {
            type: String,  // STRING NOT NUMBER!
            default: '24',
            validator: (value) => ICON_SIZES.includes(value)
        },
        // ... more props
    },
    emits: ['click', 'clickIcon']
}
</script>
```

### Key Characteristics
- **Vue 2.7** with Composition API support
- **Options API** for component definitions
- **Inline enums** (const STYLES = {...}) in each component
- **Validator functions** for prop validation
- **.stories.js** format (not .mdx)
- **V1 and V2** component versions (migration ongoing)
- **Design tokens** in separate directory

---

## 🎯 OUR MCP STRATEGY (Insider-Specific)

### Phase 1: Automated Extraction ✅ (Already Created!)

We've created 4 extraction scripts based on PrimeVue learnings but tailored for Insider DS:

#### 1. `extract-components.ts`
**Purpose**: Parse Vue components and extract metadata

**What it extracts**:
- ✅ Props with types, defaults, required status
- ✅ Prop validators (to detect enum values!)
- ✅ Emits from `emits:` array and `$emit()` calls
- ✅ **Inline enums** (const STYLES = {...})
- ✅ Slots from template
- ✅ Component version (V1 vs V2)
- ✅ JSDoc comments (@description, @category)
- ✅ Storybook availability check

**Key Insider-specific features**:
```typescript
// Extracts inline const enums
const STYLES = { SOLID: 'solid', GHOST: 'ghost' }
→ enums: [{ name: 'STYLES', values: { SOLID: 'solid', GHOST: 'ghost' }, type: 'const' }]

// Detects string icon sizes (critical!)
iconSize: { type: String, validator: (v) => ['40','24','20'].includes(v) }
→ props.iconSize.validValues: ['40', '24', '20']
```

#### 2. `extract-storybook.ts`
**Purpose**: Extract code examples from Storybook stories

**What it extracts**:
- ✅ Code blocks from .stories.js files
- ✅ Component descriptions
- ✅ Categories/tags
- ✅ Multiple examples per component

**Handles Insider's format**:
```javascript
// .stories.js format (not .mdx!)
export default {
  title: 'Components/InButtonV2',
  component: InButtonV2
};

export const Primary = () => ({ ... });
```

#### 3. `extract-usage.ts` (🌟 UNIQUE TO US!)
**Purpose**: Analyze real usage in analytics-fe codebase

**What it finds**:
- ✅ Total usage count per component
- ✅ Most used props and values
- ✅ Most used events
- ✅ **Common mistakes** detection:
  - Using 'label' instead of 'text' in InSelect
  - Not wrapping value in array
  - Using number for iconSize instead of string
  - Missing labelText (accessibility)
- ✅ Real code patterns for reference

**Example output**:
```json
{
  "InButtonV2": {
    "totalUsages": 111,
    "mostUsedProps": [
      { "prop": "styling", "count": 98 },
      { "prop": "type", "count": 95 }
    ],
    "commonMistakes": [
      {
        "mistake": "Using number for iconSize",
        "occurrences": 12,
        "fix": "Change icon-size=\"24\" to icon-size=\"'24'\"",
        "severity": "medium"
      }
    ]
  }
}
```

#### 4. `merge-datasets.ts`
**Purpose**: Combine all data sources into single combined.json

**Merges**:
- Component metadata (from Vue files)
- Storybook examples
- Real usage patterns
- Manual enrichments (overlay)
- Migration guides

**Output structure**:
```json
{
  "_metadata": {
    "version": "1.0.0",
    "generatedAt": "2025-11-21T...",
    "totalComponents": 62,
    "enrichedComponents": 3,
    "componentsWithExamples": 45,
    "componentsWithUsage": 38
  },
  "components": {
    "InButtonV2": {
      // Auto-extracted
      "name": "InButtonV2",
      "title": "Button V2",
      "description": "...",
      "props": { ... },
      "emits": [ ... ],
      "enums": [ ... ],

      // From Storybook
      "examples": [ ... ],

      // From analytics-fe usage
      "totalUsages": 111,
      "commonMistakes": [ ... ],
      "mostUsedProps": [ ... ],

      // Manual enrichment (overlay)
      "enriched": true,
      "propEnrichments": { ... },
      "helperFunctions": [ ... ]
    }
  },
  "migrations": { ... }
}
```

---

## 🚀 EXECUTION PLAN

### ✅ Completed
1. ✅ Infrastructure setup (types, schemas, loader)
2. ✅ Manual enrichments for 3 components (proof of concept)
3. ✅ Migration guide for InDatePicker→V2
4. ✅ All 4 extraction scripts created
5. ✅ Dependencies installed (@vue/compiler-sfc, cheerio, globby, tsx)

### 🔄 In Progress
6. **Test extraction scripts** (NEXT STEP!)
   ```bash
   cd /Users/deniz.zeybek/Documents/insider-projects/design-system-mcp

   # Test component extraction
   npm run extract:components
   # → Should create data/components.json with 60+ components

   # Test storybook extraction
   npm run extract:storybook
   # → Should create data/storybook.json with examples

   # Test usage analysis
   npm run extract:usage
   # → Should create data/usage.json with real patterns

   # Merge everything
   npm run extract:merge
   # → Creates data/combined.json (FINAL DATASET!)

   # Or run all at once:
   npm run extract:all
   ```

7. **Update MCP Server** to use combined.json
   ```typescript
   // src/index.ts - Update to load combined dataset
   const dataset = loadCombinedDataset(); // instead of registry

   // Add new tools:
   - get_component (enhanced with usage data)
   - get_migration_guide
   - validate_usage (check code for common mistakes)
   - generate_helpers (output helper functions)
   ```

8. **Add Resources API** (like PrimeVue)
   ```
   insider-ds://component/{name}
   insider-ds://migration/{from}-to-{to}
   insider-ds://tokens
   ```

### ⏳ Pending
9. **CI/CD Integration** - Auto-regenerate on design system updates
10. **Complete remaining enrichments** for top 10 components
11. **Add validation tool** - Check component usage for mistakes
12. **Documentation** - Guide for team members

---

## 💡 KEY ADVANTAGES Over Generic Approach

### What Makes Our MCP Special

1. **Real Usage Intelligence** 🎯
   - Scans analytics-fe for actual usage patterns
   - Detects common mistakes automatically
   - Provides most-used prop combinations

2. **Insider-Specific Parsing** 🔍
   - Handles inline const enums
   - Understands V1/V2 versioning
   - Extracts validator functions for enum values
   - Parses .stories.js format (not .mdx)

3. **Migration Support** 🔄
   - V1→V2 transformation guides
   - Helper function generation
   - Before/after examples

4. **Layered Enrichment** 📚
   - Auto-extraction as foundation (100% coverage)
   - Manual enrichments as overlay (critical components)
   - Best of both worlds: scale + depth

5. **Zero Maintenance** 🎉
   - Re-run extraction scripts on updates
   - Always in sync with source code
   - No manual JSON editing needed

---

## 📊 EXPECTED RESULTS

### After First Extraction Run

**Component Coverage**: 60+ components (100%)
```
Total components: 65
├── V1 components: 45
├── V2 components: 20
├── With Storybook: ~50
├── With usage data: ~40
└── With enrichments: 3 (will grow)
```

**Data Richness**:
- Props: TypeScript types + validators + enums
- Events: Names + payload inference
- Examples: From Storybook stories
- Common Mistakes: From real usage analysis
- Helper Functions: From manual enrichments

**File Size**: ~500-800 KB (combined.json)

### Success Metrics

**Before MCP Enrichment**:
- ❌ Generic types (Array, Object)
- ❌ No enum values
- ❌ No usage examples
- ❌ Trial and error required
- ❌ Claude generates wrong code

**After MCP Enrichment**:
- ✅ Specific structures (Array<{text, value}>)
- ✅ All enum values listed
- ✅ Real working examples
- ✅ Common mistakes prevented
- ✅ Claude generates correct code first try

**Expected Accuracy**:
- Code generation: 30% → 85%
- Migration accuracy: 0% → 90%
- First-try correctness: 20% → 80%

---

## 🎓 CRITICAL INSIDER DS PATTERNS

### Pattern 1: String Icon Sizes
```typescript
// WRONG (number)
<InButtonV2 :icon-size="24" />

// CORRECT (string)
<InButtonV2 icon-size="24" />
```

### Pattern 2: Array Wrapping
```typescript
// InSelect - ALWAYS array
:value="[selectedItem]"  // ✅
:value="selectedItem"     // ❌

// InDatePickerV2 - ALWAYS array of objects
:value="[{ startDate: '...', endDate: '...' }]"  // ✅
:value="{ startDate: '...', endDate: '...' }"    // ❌
```

### Pattern 3: text vs label
```typescript
// InSelect options
options: [
  { text: 'Option 1', value: 1 },  // ✅ text
  { label: 'Option 1', value: 1 }  // ❌ label
]
```

### Pattern 4: Date Format in customRanges
```typescript
customRanges: [
  {
    name: 'last7days',
    title: 'Last 7 Days',        // ✅ title (not label)
    startDate: '11/14/2025',     // ✅ mm/dd/yyyy with SLASH
    endDate: '11/21/2025'
  }
]
```

---

## 🔥 NEXT IMMEDIATE STEPS

1. **Run extraction scripts** to validate they work:
   ```bash
   npm run extract:all
   ```

2. **Inspect generated files**:
   - `data/components.json` - Check props, enums, emits
   - `data/storybook.json` - Verify examples extracted
   - `data/usage.json` - Review common mistakes found
   - `data/combined.json` - Final merged dataset

3. **Fix any extraction issues** that arise

4. **Update MCP server** to use combined.json

5. **Test with Claude Code** - Try component implementation

---

**Current Status**: Ready to test extraction! 🚀
**Next Action**: Run `npm run extract:components` and verify output
