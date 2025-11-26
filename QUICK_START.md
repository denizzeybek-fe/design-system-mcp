# Quick Start Guide - Enrichment Pipeline

## 🎯 Goal
Keep MCP enrichments **automatically synced** with Design System component changes.

## 🚀 Quick Commands

```bash
# Full auto-update pipeline
npm run extract:all

# Individual steps
npm run extract:components  # Get latest component metadata
npm run extract:enrich      # Detect what needs updating
npm run extract:merge       # Merge enrichments into combined.json
npm run build               # Build MCP server

# Check specific component
npm run extract:enrich InButtonV2
```

## 📋 Daily Workflow

### Design System Changed?

```bash
# 1. Update component metadata
cd /path/to/design-system-mcp
npm run extract:components

# 2. Check for enrichment updates needed
npm run extract:enrich
```

**Output:**
```
🔍 Analyzing components for enrichment updates...

📋 Found 3 component(s) needing enrichment:

1. 🔴 InChart [HIGH]
   3 new complex props: data, options, config

2. 🟡 InButton [MEDIUM]
   Missing sections: codeSnippets, styling

3. 🟢 InAccordion [LOW]
   1 new event: toggle
```

### Update Enrichments

For each flagged component:

```bash
# Use enrichment-maker agent
# (In Claude Code CLI or UI)

> Use enrichment-maker agent to update InChart enrichment.
> New props: data, options, config
> Add missing sections: codeSnippets, styling, examples

# Agent will:
# 1. Get component metadata from MCP
# 2. Read InRibbons.json as template
# 3. Update/create enrichment file

# After agent finishes:
npm run extract:merge && npm run build
```

## 📚 Key References

### Gold Standard Template
```bash
cat src/registry/enrichments/InRibbons.json
```
This is the PERFECT example. Copy its structure for new enrichments.

### Must-Have Sections (v2 Schema)
- ✅ `propEnrichments` - Complex props with valueFormat
- ✅ `eventEnrichments` - Events with payloads
- ⭐ `codeSnippets` - Template, script, style code
- ⭐ `styling` - CSS classes, positioning, layout
- ⭐ `examples` - 5-10 real usage examples
- ⭐ `implementationPatterns` - Common patterns
- ⭐ `bestPractices` - Do's and don'ts
- ✅ `commonMistakes` - With severity levels

### Documentation
- `docs/ENRICHMENT_STRATEGY.md` - Master plan & priorities
- `docs/ENRICHMENT_TEMPLATE.md` - Section-by-section guide
- `docs/AUTOMATED_ENRICHMENT.md` - Pipeline details

## 🎯 Current Priority

### Phase 0: Upgrade Existing 19 Enrichments
**Before adding new components**, bring existing ones to 100%:

1. InButtonV2 ← Start here (high usage)
2. InDatePickerV2
3. InSelect
4. InMultiSelect
5. ... (see ENRICHMENT_STRATEGY.md for full list)

Each needs:
- codeSnippets section
- styling section
- implementationPatterns
- useCases
- bestPractices (with anti-patterns)

## 🔧 Troubleshooting

### "All enrichments are up to date"
Mevcut enrichment'lar script tarafından "complete" görünüyor, ama v2 schema'ya upgrade gerekebilir. Manuel kontrol:

```bash
# InRibbons ile karşılaştır
diff <(jq 'keys' src/registry/enrichments/InRibbons.json) \
     <(jq 'keys' src/registry/enrichments/InButtonV2.json)
```

### "Component not found"
```bash
# Extract components first
npm run extract:components
```

### "Build fails after enrichment"
```bash
# Check JSON syntax
npm run extract:merge
# If error, fix the JSON file and retry
```

## 📞 Need Help?

1. Check `docs/ENRICHMENT_TEMPLATE.md` for section details
2. Look at `InRibbons.json` for examples
3. Use enrichment-maker agent (it knows the structure)
4. See `CLAUDE.md` for MCP usage tips

---

**TL;DR:**
```bash
# Component changed? Run this:
npm run extract:all

# See what needs updating, then use enrichment-maker agent
# Rinse and repeat!
```
