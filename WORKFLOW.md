# 🔄 Design System MCP - Workflow Guide

**For Developers**: Practical guide on when and how to use extraction scripts.

**Version**: 2.0 (Automated Extraction)
**Last Updated**: 2025-11-21

---

## 🎯 Quick Answer

**Who runs the extraction scripts?**
- ✅ **YOU (Developer)** - manually
- ❌ **MCP server** - NEVER (only reads combined.json)
- ❌ **Claude** - NEVER (only queries MCP server)

**When to run them?**
1. **First setup** (required)
2. **When Design System updates** (~2-3 times per month)
3. **When adding/updating enrichments** (~1-2 times per week)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Data Generation (DEVELOPER - Manual)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Design System changed?                                     │
│         ↓ YES                                               │
│  npm run extract:all        ← YOU RUN THIS                │
│         ↓                                                   │
│  data/combined.json updated                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Build (DEVELOPER - Manual)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  npm run build              ← YOU RUN THIS                 │
│         ↓                                                   │
│  dist/data/combined.json copied                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: Runtime (MCP SERVER - Automatic)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  node dist/index.js         ← Claude Desktop starts        │
│         ↓                                                   │
│  combined-loader.ts                                         │
│         ↓                                                   │
│  readFileSync('dist/data/combined.json')  ← ONLY READS     │
│         ↓                                                   │
│  MCP tools ready                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: Usage (CLAUDE - Automatic)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  user: "Get InButtonV2"                                     │
│         ↓                                                   │
│  mcp__design-system__get-component("InButtonV2")           │
│         ↓                                                   │
│  combined-loader.ts returns cached data                     │
│         ↓                                                   │
│  Claude gets enriched metadata                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Available Scripts

```json
{
  "extract:components": "Extract component metadata from Design System",
  "extract:storybook": "Extract examples from Storybook",
  "extract:usage": "Analyze real usage patterns from analytics-fe",
  "extract:merge": "Merge all data sources into combined.json",
  "extract:all": "Run all extraction steps"
}
```

### What Each Script Does

| Script | Input | Output | Duration |
|--------|-------|--------|----------|
| `extract:components` | Design System Vue files | `data/components.json` (148 KB) | ~2 min |
| `extract:storybook` | Storybook stories | `data/storybook.json` (1.6 KB) | ~30 sec |
| `extract:usage` | analytics-fe codebase | `data/usage.json` | ~2 min |
| `extract:merge` | All above + enrichments | `data/combined.json` (209 KB) | ~10 sec |
| **`extract:all`** | **All sources** | **Final combined.json** | **~5 min** |

---

## 🎬 Usage Scenarios

### Scenario 1: First Time Setup ⭐ (Required)

**When**: Installing Design System MCP for the first time

**Steps**:
```bash
# 1. Clone and install
git clone <repo>
cd design-system-mcp
npm install

# 2. ❌ No combined.json yet!
ls data/
# → Empty or outdated

# 3. ✅ Run first extraction
npm run extract:all
# Takes ~5 minutes
# OUTPUT:
#   ✅ Extracted 62 components
#   ✅ 1,087 props, 170 emits, 30 enums
#   ✅ Generated combined.json (209 KB)

# 4. Build
npm run build

# 5. Test
npm run test:production
# OUTPUT:
#   🎉 Production test passed!
#   ✅ MCP server loaded successfully
```

**Result**: MCP server ready to use with full metadata!

---

### Scenario 2: Design System Updated 🔄 (Regular)

**When**: Design System team releases new components or updates

**Frequency**: ~2-3 times per month

**Example**: New `InPagination` component added to Design System

**Steps**:
```bash
# 1. Update Design System
cd /path/to/insider-design-system
git pull
# → src/components/InPagination/InPagination.vue (NEW!)

# 2. Update MCP dataset
cd /path/to/design-system-mcp
npm run extract:all
# OUTPUT:
#   ✅ Extracted 63 components (was 62)
#   ✅ InPagination detected!
#   ✅ Props: 12, Emits: 3, Enums: 2

# 3. Rebuild
npm run build

# 4. Claude Desktop auto-reloads
# Now Claude can see InPagination!
```

**Example 2**: Existing component updated (new prop added)

```bash
# Design System: InButtonV2 got new 'tooltipText' prop
cd /path/to/insider-design-system
git pull
# InButtonV2.vue updated

# Re-extract
cd /path/to/design-system-mcp
npm run extract:all
# OUTPUT:
#   ✅ InButtonV2: 18 props (was 17)
#   ✅ New prop: tooltipText detected

npm run build
# Claude now sees tooltipText prop!
```

---

### Scenario 3: Added Manual Enrichment 📝 (Occasional)

**When**: You wrote detailed enrichment for a critical component

**Frequency**: ~1-2 times per week

**Example**: Added enrichment for InTooltipV2

**Steps**:
```bash
# 1. Create enrichment file
vim src/registry/enrichments/InTooltipV2.json
# Added:
#   - propEnrichments (valueFormat, examples)
#   - commonMistakes (positioning errors)
#   - helperFunctions

# 2. ✅ Only merge needed (no re-extraction!)
npm run extract:merge
# Fast! (~10 seconds)
# OUTPUT:
#   ✅ Loaded 4 enrichments (was 3)
#   ✅ InTooltipV2 enrichment merged

# 3. Build
npm run build

# Claude now has detailed InTooltipV2 metadata!
```

**Why only `extract:merge`?**
- Design System source didn't change
- Only enrichment overlay changed
- No need to re-parse Vue files (~4 minutes saved!)

---

### Scenario 4: Added Migration Guide 🔀 (Occasional)

**When**: You wrote a V1→V2 migration transformation guide

**Example**: Created InButton→InButtonV2 migration

**Steps**:
```bash
# 1. Create migration file
vim src/registry/migrations/InButton-to-V2.json
# Added:
#   - propMigrations (transformations)
#   - eventMigrations
#   - helperFunctions

# 2. Merge
npm run extract:merge
# OUTPUT:
#   ✅ Loaded 2 migrations (was 1)
#   ✅ InButton-to-V2 migration added

# 3. Build
npm run build

# Claude's migration agent now has InButton guide!
```

---

## 🚫 When NOT to Run Scripts

### ❌ Don't Run on Every Query

```bash
# Claude Desktop:
user: "Get InButtonV2 details"

# What happens:
# → MCP server reads combined.json (cached)
# → Returns metadata instantly
# → ❌ NO extraction runs!
```

### ❌ Don't Run at Runtime

```bash
# MCP server starting
node dist/index.js

# What it does:
# → Reads dist/data/combined.json
# → Caches in memory
# → ❌ Does NOT run extract scripts!
```

### ❌ Don't Run on Every Build

```bash
npm run build

# What it does:
# → Copies existing data/combined.json to dist/data/
# → ❌ Does NOT re-extract!
# → Uses already generated data
```

---

## ⏱️ Frequency Guide

| Trigger | Script | Frequency | Duration |
|---------|--------|-----------|----------|
| Design System release | `extract:all` | ~2-3 times/month | ~5 min |
| New enrichment added | `extract:merge` | ~1-2 times/week | ~10 sec |
| Migration guide added | `extract:merge` | Rarely | ~10 sec |
| **First setup** | **`extract:all`** | **Once** | **~5 min** |

---

## 🎯 Decision Tree

```
Did Design System source code change?
├─ YES → npm run extract:all (5 min)
│        └─ npm run build
│
└─ NO → Did you update enrichments/ or migrations/?
         ├─ YES → npm run extract:merge (10 sec)
         │        └─ npm run build
         │
         └─ NO → Nothing needed!
                  MCP server uses existing combined.json
```

---

## 📂 What Gets Generated

### After `npm run extract:components`
```
data/
└── components.json     148 KB   62 components with props/emits/enums
```

### After `npm run extract:storybook`
```
data/
├── components.json     148 KB
└── storybook.json      1.6 KB   Examples from stories
```

### After `npm run extract:merge`
```
data/
├── components.json     148 KB
├── storybook.json      1.6 KB
└── combined.json       209 KB   ⭐ FINAL DATASET (merged)
```

### After `npm run build`
```
dist/
├── index.js            Bundled MCP server
└── data/
    └── combined.json   209 KB   ⭐ RUNTIME DATASET
```

---

## 🔍 Debugging

### Check if extraction is needed

```bash
# Check combined.json age
ls -lh data/combined.json
stat -f "%Sm" data/combined.json

# Check Design System last update
cd /path/to/insider-design-system
git log --oneline -1
```

### Verify extraction worked

```bash
# Check metadata
cat data/combined.json | jq '._metadata'
# OUTPUT:
# {
#   "totalComponents": 62,
#   "enrichedComponents": 3,
#   "generatedAt": "2025-11-21T22:38:00.000Z"
# }

# Check specific component
cat data/combined.json | jq '.components.InButtonV2 | {props: .props | keys | length, enriched}'
# OUTPUT:
# {
#   "props": 17,
#   "enriched": true
# }
```

### Test MCP server

```bash
# Test with production build
npm run test:production
# Should output:
#   ✅ MCP server loaded successfully
#   ✅ Dataset loaded from dist/data/combined.json
```

---

## 💡 Best Practices

### 1. Run `extract:all` after Design System updates
```bash
# Set up a routine
# - Subscribe to Design System release notifications
# - Run extraction after each release
# - Test with Claude Desktop
```

### 2. Use `extract:merge` for enrichment updates
```bash
# Faster workflow
# - Edit enrichment JSON files (or use enrichment-maker agent!)
# - Only merge (no re-extraction)
# - Save ~4 minutes!
```

**💡 Tip**: Use the `enrichment-maker` agent to automatically generate enrichment files:
```bash
# In Claude Code:
# "Use enrichment-maker agent to create enrichment for InTooltipV2"

# Agent will:
# 1. Analyze component metadata from combined.json
# 2. Learn patterns from existing enrichments
# 3. Generate src/registry/enrichments/InTooltipV2.json
# 4. Include valueFormat, commonMistakes, examples

# Then you just merge:
npm run extract:merge && npm run build
```

### 3. Commit combined.json to Git
```bash
# Why: Team members get latest metadata
git add data/combined.json
git commit -m "chore: update component metadata"
git push
```

### 4. Check extraction logs
```bash
npm run extract:all 2>&1 | tee extraction.log
# Review for errors or warnings
```

---

## 🚀 Quick Commands

### Complete Update
```bash
npm run extract:all && npm run build && npm run test:production
```

### Fast Enrichment Update
```bash
npm run extract:merge && npm run build
```

### Check Status
```bash
echo "Combined.json age:" && stat -f "%Sm" data/combined.json
echo "Total components:" && cat data/combined.json | jq '._metadata.totalComponents'
```

---

## 🎓 Summary

**Key Points**:

1. **Extraction scripts are YOUR tools** (not MCP's)
2. **Run manually when Design System changes** (~5 min)
3. **MCP server only READS combined.json** (never extracts)
4. **Use `extract:merge` for enrichment updates** (~10 sec)
5. **First setup requires `extract:all`** (required once)

**Mental Model**:
```
YOU (Developer):
  → npm run extract:all    (when Design System changes)
  → npm run build          (after extraction)

MCP SERVER:
  → node dist/index.js     (reads combined.json)
  → ❌ Never runs extract scripts

CLAUDE:
  → Queries MCP server     (gets cached data)
  → ❌ Never touches scripts
```

**Before vs After**:
```
❌ BEFORE (Manual):
- Analyze components manually
- Write components.json by hand
- 2-3 hours per update
- Prone to errors

✅ NOW (Automated):
- npm run extract:all
- 5 minutes automated extraction
- Always accurate
- Zero manual work
```

---

**Questions?** Check:
- README.md - Project overview
- HOW_IT_WORKS.md - Architecture deep dive
- COMPLETION_REPORT.md - Full project report
