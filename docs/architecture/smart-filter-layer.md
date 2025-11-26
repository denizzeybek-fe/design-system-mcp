# 🧠 Smart Filter Layer

**Version:** 1.0
**Date:** 2025-11-26
**Status:** ✅ Production Ready

---

## 📋 Overview

The Smart Filter Layer is an intelligent enrichment filtering system that optimizes token usage by returning only relevant component metadata based on user context.

### Problem

Design System components can have extensive metadata (17k+ tokens):
- Props with enrichments (valueFormat, commonMistakes, migration guides)
- Events with payload types and handling patterns
- Examples, helper functions, performance notes
- Accessibility notes, related components

**Without filtering:** Every `get-component` call returns all metadata, wasting tokens.

### Solution

**Smart Filter Layer** analyzes user intent and returns only relevant enrichments:
- 🤖 **Auto Mode**: AI analyzes context to select enrichments
- 📋 **Preset Mode**: Use predefined strategies (minimal/standard/comprehensive)
- 🎯 **Manual Mode**: Explicitly choose enrichments

**Benefits:**
- 💰 Saves 30-70% tokens per request
- ⚡ Faster responses (smaller payloads)
- 🎯 More focused, relevant information

---

## 🏗️ Architecture

### System Flow

```
User Request
    ↓
┌─────────────────────────────────────────┐
│ MCP Tool: get-component                 │
│ • name: "InButtonV2"                    │
│ • context: "migrate from v1"            │
│ • enrichments: { strategy: "auto" }     │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Step 1: Load from combined.json         │
│ ComponentLoader.getComponentByName()    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Step 2: Adapt Format                    │
│ ComponentAdapter.adapt()                │
│ • CombinedComponent → Component         │
│ • props: Object → Prop[]                │
│ • emits: any[] → Event[]                │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Step 3: Analyze Intent (auto mode)      │
│ SmartEnrichmentSelector.analyzeIntent() │
│ • Extract keywords                      │
│ • Calculate intent scores               │
│ • Detect: migration, implementation,    │
│   debugging, learning, quick_lookup     │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Step 4: Select Categories               │
│ SmartEnrichmentSelector.select()        │
│ • migration → [props, events,           │
│   propEnrichments, eventEnrichments,    │
│   helperFunctions]                      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Step 5: Filter Component                │
│ EnrichmentFilter.filter()               │
│ • In-memory deep clone                  │
│ • Remove non-selected categories        │
│ • Strip enrichments from props/events   │
│ • Keep base metadata always             │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Step 6: Build Metadata                  │
│ • Calculate token estimates             │
│ • Calculate savings                     │
│ • Generate reasoning text               │
└──────────────────┬──────────────────────┘
                   ↓
Response with filtered component + metadata
```

---

## 🧩 Components

### 1. ComponentAdapter

**Location:** `src/services/component-adapter.ts`

**Purpose:** Convert `CombinedComponent` (from combined.json) to standardized `Component` type.

**Key Methods:**
```typescript
adapt(combined: CombinedComponent): Component
  • Converts props: Record<string,any> → Prop[]
  • Converts emits: any[] → Event[]
  • Merges enrichments into props/events
  • Generates standard imports
```

**Why needed?** `combined.json` uses a different format than our type system expects.

---

### 2. SmartEnrichmentSelector

**Location:** `src/services/smart-enrichment-selector.ts`

**Purpose:** AI-powered intent detection and enrichment selection.

**Key Methods:**

```typescript
analyzeIntent(context: AnalysisContext): Promise<Intent>
  • Extracts text from context
  • Detects keywords
  • Calculates intent scores
  • Returns: { type, confidence, reasoning, keywords }

selectEnrichments(context: AnalysisContext): Promise<EnrichmentCategory[]>
  • Analyzes intent
  • Maps to enrichment categories
  • Returns relevant categories
```

**Intent Types:**
- `migration` - Upgrading from v1 to v2
- `implementation` - Building new features
- `debugging` - Fixing issues
- `learning` - Understanding components
- `quick_lookup` - Fast prop/event info
- `comprehensive` - Everything (fallback)

**Keywords:**
```typescript
migration: ['migrate', 'migration', 'v1', 'v2', 'upgrade', 'convert']
implementation: ['implement', 'add', 'create', 'build', 'setup']
debugging: ['error', 'bug', 'not working', 'issue', 'fix']
learning: ['how to', 'example', 'learn', 'tutorial', 'guide']
quick_lookup: ['what is', 'type of', 'prop', 'event', 'quick']
```

---

### 3. EnrichmentFilter

**Location:** `src/services/enrichment-filter.ts`

**Purpose:** In-memory filtering of component metadata.

**Key Methods:**

```typescript
filter(component, categories, strategy, intent):
  { component, metadata }
  • Deep clones component
  • Removes non-selected categories
  • Strips enrichments from props/events
  • Builds metadata

resolveCategories(options): EnrichmentCategory[]
  • Resolves preset strategies
  • Handles include/exclude lists
  • Returns final categories

estimateTokens(categories): number
  • Calculates token usage
  • Based on category costs
```

**Enrichment Categories (10 total):**

| Category | Tokens | Description |
|----------|--------|-------------|
| `props` | 2000 | Basic prop info |
| `events` | 1000 | Basic event info |
| `examples` | 2000 | Code examples |
| `helperFunctions` | 1000 | Helper utilities |
| `propEnrichments` | 3000 | valueFormat, commonMistakes, relatedProps |
| `eventEnrichments` | 2000 | payloadTypes, useCase, handlingPattern |
| `performanceNotes` | 600 | Performance tips |
| `accessibilityNotes` | 400 | A11y requirements |
| `relatedComponents` | 200 | Related components |
| `imports` | 100 | Import statements |

**Total:** ~12,300 tokens (comprehensive)

---

## 🎯 Usage Modes

### Auto Mode (Recommended)

AI analyzes context and selects enrichments automatically.

```typescript
await mcp.getComponent({
  name: "InDatePickerV2",
  context: "I need to migrate from InDatePicker v1 to v2",
  enrichments: { strategy: "auto" }
});

// AI detects "migration" intent
// Returns: props, events, propEnrichments, eventEnrichments, helperFunctions
// Tokens: ~9,000 (saved 3,300)
```

### Preset Mode

Use predefined strategies.

```typescript
// Minimal (fastest)
await mcp.getComponent({
  name: "InButtonV2",
  enrichments: { strategy: "minimal" }
});
// Returns: props, events only
// Tokens: ~3,000 (saved 9,300)

// Standard (balanced)
await mcp.getComponent({
  name: "InButtonV2",
  enrichments: { strategy: "standard" }
});
// Returns: props, events, examples, helperFunctions
// Tokens: ~6,000 (saved 6,300)

// Comprehensive (everything)
await mcp.getComponent({
  name: "InButtonV2",
  enrichments: { strategy: "comprehensive" }
});
// Returns: all categories
// Tokens: ~12,300 (no savings)
```

### Manual Mode

Explicitly choose enrichments.

```typescript
await mcp.getComponent({
  name: "InButtonV2",
  enrichments: {
    strategy: "manual",
    include: ["props", "propEnrichments", "examples"]
  }
});
// Returns: only specified categories
// Tokens: ~7,000

// With exclude
await mcp.getComponent({
  name: "InButtonV2",
  enrichments: {
    strategy: "standard",
    exclude: ["examples"]
  }
});
// Returns: standard minus examples
// Tokens: ~4,000
```

---

## 📊 Token Savings Examples

### Example 1: Migration Task

**Context:** "migrate from InDatePicker v1 to v2"

```
Without filtering: 17,100 tokens
With auto mode:     9,000 tokens
Savings:            8,100 tokens (47%)

Included:
✅ props (with migration guides)
✅ events (with migration notes)
✅ propEnrichments (migrationFromV1)
✅ eventEnrichments
✅ helperFunctions

Excluded:
❌ examples
❌ performanceNotes
❌ accessibilityNotes
❌ relatedComponents
```

### Example 2: Quick Lookup

**Context:** "what props does InButton have?"

```
Without filtering: 12,300 tokens
With auto mode:     3,000 tokens
Savings:            9,300 tokens (76%)

Included:
✅ props (basic info only)
✅ events (basic info only)

Excluded:
❌ All enrichments
❌ examples
❌ helperFunctions
❌ notes
```

### Example 3: Implementation

**Context:** "implement date picker with custom ranges"

```
Without filtering: 17,100 tokens
With auto mode:    11,000 tokens
Savings:            6,100 tokens (36%)

Included:
✅ props
✅ events
✅ examples (how to implement)
✅ propEnrichments (valueFormat, commonMistakes)
✅ helperFunctions

Excluded:
❌ eventEnrichments (not needed for implementation)
❌ performanceNotes
❌ accessibilityNotes
```

---

## 🔧 Configuration

### Preset Definitions

**Location:** `src/types/enrichment-options.ts`

```typescript
export const ENRICHMENT_PRESETS = {
  minimal: ['props', 'events'],

  standard: ['props', 'events', 'examples', 'helperFunctions'],

  comprehensive: [
    'props', 'events', 'examples', 'helperFunctions',
    'propEnrichments', 'eventEnrichments',
    'performanceNotes', 'accessibilityNotes',
    'relatedComponents', 'imports'
  ]
};
```

### Intent Mappings

```typescript
export const INTENT_ENRICHMENTS = {
  migration: [
    'props', 'events',
    'propEnrichments', 'eventEnrichments',
    'helperFunctions'
  ],

  implementation: [
    'props', 'events', 'examples',
    'helperFunctions', 'propEnrichments'
  ],

  debugging: [
    'props', 'propEnrichments',
    'eventEnrichments', 'helperFunctions'
  ],

  learning: ['props', 'events', 'examples'],

  quick_lookup: ['props', 'events'],

  comprehensive: ENRICHMENT_PRESETS.comprehensive
};
```

---

## ⚙️ Implementation Details

### Zero Data Change

The Smart Filter Layer does **NOT** modify `combined.json`:

```typescript
// ❌ Does NOT do this:
combined.json → Transform → New format → Save

// ✅ Does this instead:
combined.json → Load → Adapt in memory → Filter → Return
```

**Benefits:**
- No migration needed
- Works with existing extraction pipeline
- Easy to rollback
- No data consistency issues

### In-Memory Filtering

Filtering happens in memory (~2ms):

```typescript
private filterComponent(component: Component, categories: EnrichmentCategory[]): Component {
  // Deep clone to avoid mutation
  const filtered: Component = JSON.parse(JSON.stringify(component));

  // Filter categories
  if (!categories.includes('props')) {
    filtered.props = [];
  }

  if (!categories.includes('propEnrichments')) {
    filtered.props = filtered.props.map(prop => ({
      ...prop,
      valueFormat: undefined,
      commonMistakes: undefined
    }));
  }

  // ... more filtering

  return filtered;
}
```

### Base Metadata Always Included

Core component info is never filtered:

```typescript
// Always included:
- component.name
- component.description
- component.category
- component.version
```

---

## 🧪 Testing

### Manual Test

```bash
# Build
npm run build

# Test auto mode with context
echo '{
  "name": "InButtonV2",
  "context": "migrate from v1 to v2",
  "enrichments": { "strategy": "auto" }
}' | node dist/index.js

# Should return migration-focused enrichments
```

### Unit Tests

```bash
npm test src/services/__tests__/enrichment-filter.test.ts
npm test src/services/__tests__/smart-enrichment-selector.test.ts
```

---

## 📝 Metadata Response

Every filtered response includes metadata:

```json
{
  "component": { /* filtered component */ },
  "metadata": {
    "strategy": "auto",
    "detectedIntent": {
      "type": "migration",
      "confidence": 0.92,
      "reasoning": "Detected migration task (keywords: migrate, v1, v2)...",
      "detectedKeywords": ["migrate", "v1", "v2"]
    },
    "selectedEnrichments": [
      "props", "events", "propEnrichments",
      "eventEnrichments", "helperFunctions"
    ],
    "includedCategories": [...],
    "excludedCategories": [...],
    "estimatedTokens": 9000,
    "tokensSaved": 8100,
    "reasoning": "Detected migration task. Including prop/event mappings..."
  }
}
```

---

## 🚀 Future Enhancements

### Planned Features

1. **Conversation History Integration**
   - Currently: Single context string
   - Future: Full conversation context from Claude Code

2. **Multi-turn Clarification**
   - Currently: Single-shot decision
   - Future: "Low confidence. Are you migrating or implementing?"

3. **Usage Pattern Learning**
   - Currently: Static keyword matching
   - Future: Learn from past requests to improve accuracy

4. **Component-Specific Defaults**
   - Currently: Same rules for all components
   - Future: InDatePickerV2 migration → auto-include date helpers

### Limitations (MCP Protocol)

- **No conversation history**: MCP tools are stateless
  - Workaround: Claude Code can summarize conversation into `context` string
- **No multi-turn**: Can't ask clarifying questions
  - Workaround: Return low confidence + reasoning in metadata
- **No persistence**: Can't learn from usage
  - Workaround: External analytics to tune keyword weights

---

## 📚 Related Documentation

- [How It Works](how-it-works.md) - Overall system architecture
- [Enrichment Strategy](../guides/enrichment-strategy.md) - How to create enrichments
- [Developer Workflow](../guides/workflow.md) - Day-to-day usage

---

## 🤝 Contributing

To modify filtering logic:

1. **Add new intent type:** Edit `src/types/enrichment-options.ts`
2. **Add keywords:** Update `smart-enrichment-selector.ts:77-97`
3. **Update mappings:** Modify `INTENT_ENRICHMENTS`
4. **Test:** Add test cases to `__tests__/`
5. **Document:** Update this file

---

**Last Updated:** 2025-11-26
**Maintained By:** Design System Team
