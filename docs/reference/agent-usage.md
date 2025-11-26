# 🤖 Agent Usage Guide

Guide for using Design System MCP agents and slash commands.

---

## 📂 Available Agents

### 1. enrichment-maker
**Purpose**: Create enrichment files for complex components

**Location**:
- Agent prompt: `.claude/agents/enrichment-maker.md`
- Slash command: `.claude/commands/enrichment-maker.md`

**When to use**:
- Adding detailed metadata for a new critical component
- Documenting complex prop structures (Object/Array types)
- Creating common mistakes documentation

### 2. migrate-ds-components-v1-v2
**Purpose**: Migrate Vue components from V1 to V2 Design System

**Location**:
- Agent prompt: `.claude/agents/migrate-ds-components-v1-v2.md`
- Slash command: `.claude/commands/migrate-v1-v2.md`

**When to use**:
- Upgrading V1 components to V2 equivalents
- Understanding breaking changes between versions
- Need transformation guides

---

## 🎯 How to Use

### Method 1: Slash Commands (Recommended)

Slash commands are the easiest way to use agents in Claude Code.

#### Usage:

```
/enrichment-maker InTooltipV2
```

```
/migrate-v1-v2
```

**How it works**:
1. Type `/` in Claude Code to see available commands
2. Select the command (e.g., `/enrichment-maker`)
3. Provide component name as argument
4. Claude reads the command file and follows instructions

**Example Session**:

```
User: /enrichment-maker InCheckBoxV2

Claude:
[Reads .claude/commands/enrichment-maker.md]
[Follows the workflow]
[Uses mcp__design-system__get-component("InCheckBoxV2")]
[Analyzes existing enrichments]
[Creates src/registry/enrichments/InCheckBoxV2.json]
[Provides summary and next steps]
```

---

### Method 2: Direct Request

You can also request agent usage directly:

```
User: "Use enrichment-maker to create enrichment for InCheckBoxV2"
```

```
User: "Use migrate-v1-v2 to migrate this component from V1 to V2:
<InDatePicker v-model="date" />"
```

**How it works**:
1. Claude reads the agent prompt from `.claude/agents/`
2. Follows the workflow defined in the agent
3. Uses MCP tools to get metadata
4. Creates files or provides migration guidance

---

## 📋 Detailed Command Usage

### /enrichment-maker [ComponentName]

**Purpose**: Create enrichment file for a component

**Arguments**:
- `ComponentName` (required): The V2 component to enrich (e.g., InTooltipV2)

**Workflow**:
1. Gets component metadata via MCP
2. Learns from existing enrichments (InButtonV2, InDatePickerV2, InSelect)
3. Identifies critical props (Object/Array/Function types)
4. Creates enrichment file in `src/registry/enrichments/`
5. Includes:
   - valueFormat for complex props
   - commonMistakes with severity levels
   - Real-world examples
   - Helper functions (if needed)

**Example**:
```
/enrichment-maker InCheckBoxV2
```

**Output**:
- File created: `src/registry/enrichments/InCheckBoxV2.json`
- Summary of enriched props
- Number of common mistakes documented
- Number of examples added

**Next Steps**:
```bash
npm run extract:merge
npm run build
```

---

### /migrate-v1-v2

**Purpose**: Migrate component code from V1 to V2

**Arguments**: None (works with pasted code in conversation)

**Workflow**:
1. Scans for V1 component usage
2. Uses MCP to get V2 component metadata
3. Checks for migration guides (e.g., InDatePicker-to-V2)
4. Reviews enrichment data for common mistakes
5. Provides migrated code with explanations

**Example**:
```
/migrate-v1-v2

<InDatePicker
  v-model="date"
  :min-date="minDate"
  :max-date="maxDate"
/>
```

**Output**:
- Identified V1 components
- Migrated V2 code for each
- Breaking changes explained
- Common mistakes highlighted
- Updated import statements

---

## 🎓 Best Practices

### When to Use enrichment-maker

✅ **DO use when**:
- Component has complex Object/Array props
- High usage or frequent confusion
- Auto-extracted metadata insufficient

❌ **DON'T use when**:
- Component has only simple props (String, Boolean, Number)
- Auto-extracted metadata is clear
- Low usage component

**Decision tree**:
```
Is component complex? (Object/Array props)
  └─ NO → ❌ Don't enrich

Is it heavily used or confusing?
  └─ NO → ❌ Don't enrich

Is auto-extracted insufficient?
  └─ NO → ❌ Don't enrich

ALL YES? → ✅ Use enrichment-maker!
```

### When to Use migrate-v1-v2

✅ **DO use when**:
- Upgrading legacy V1 code
- Need to understand V1→V2 changes
- Want migration best practices

❌ **DON'T use when**:
- Already using V2 components
- No V1 code to migrate

---

## 📊 Agent Workflow Comparison

### enrichment-maker Workflow

```
1. User invokes: /enrichment-maker InTooltipV2
         ↓
2. Get metadata: mcp__design-system__get-component("InTooltipV2")
         ↓
3. Learn patterns: Read InButtonV2, InDatePickerV2, InSelect enrichments
         ↓
4. Identify critical props: offset, tooltipAlignment, absolutePosition
         ↓
5. Create enrichment: src/registry/enrichments/InTooltipV2.json
         ↓
6. Output summary: 3 props enriched, 2 mistakes documented, 3 examples
```

### migrate-v1-v2 Workflow

```
1. User invokes: /migrate-v1-v2 + pastes V1 code
         ↓
2. Scan for V1: Found InDatePicker
         ↓
3. Get V2 metadata: mcp__design-system__get-component("InDatePickerV2")
         ↓
4. Get migration guide: mcp__design-system__get-migration("InDatePicker-to-V2")
         ↓
5. Review enrichment: Check commonMistakes for InDatePickerV2
         ↓
6. Generate V2 code: With explanations and warnings
```

---

## 🚀 Quick Start Examples

### Example 1: Create Enrichment for InCheckBoxV2

```
User: /enrichment-maker InCheckBoxV2

Claude:
✅ Getting InCheckBoxV2 metadata from MCP...
✅ Learning from existing enrichments...
✅ Identified 3 critical props:
   - options (Array)
   - state (any)
   - skeletonSizing (Object)
✅ Created src/registry/enrichments/InCheckBoxV2.json

Summary:
- 3 props enriched
- 4 common mistakes documented
- 3 examples added

Next steps:
$ npm run extract:merge
$ npm run build
```

### Example 2: Migrate InDatePicker to V2

```
User: /migrate-v1-v2

<InDatePicker
  v-model="date"
  :min-date="minDate"
  :max-date="maxDate"
/>

Claude:
✅ Found V1 component: InDatePicker
✅ Getting InDatePickerV2 metadata...
✅ Migration guide available: InDatePicker-to-V2
✅ Reviewing common mistakes...

Migrated Code:
<InDatePickerV2
  id="date-picker-1"
  name="date-picker"
  :value="[{ startDate: dateValue.startDate, endDate: dateValue.endDate }]"
  :min-date="minDate"
  :max-date="maxDate"
  @apply="handleDateApply"
/>

Breaking Changes:
1. Value is ARRAY of objects (not single object!)
2. v-model → :value + @apply
3. id and name are required

Common Mistakes to Avoid:
- ❌ Not wrapping value in array
- ❌ Using v-model
- ❌ Missing id/name props
```

---

## 🔧 Troubleshooting

### Slash command not found

**Issue**: `/enrichment-maker` doesn't appear in autocomplete

**Fix**:
1. Check file exists: `.claude/commands/enrichment-maker.md`
2. Restart Claude Code
3. Try typing `/` to refresh command list

### Agent not following instructions

**Issue**: Agent doesn't create expected files

**Check**:
1. Is component name correct? (e.g., InTooltipV2 not Tooltip)
2. Does component exist in combined.json?
3. Use MCP to verify: `mcp__design-system__get-component("ComponentName")`

### Enrichment file has errors

**Issue**: JSON syntax errors in created file

**Fix**:
1. Validate JSON: `cat src/registry/enrichments/InCheckBoxV2.json | jq`
2. Check for missing commas, quotes
3. Re-run command if needed

---

## 📚 Additional Resources

- **Agent Prompts**: `.claude/agents/` - Full agent instructions
- **Slash Commands**: `.claude/commands/` - Simplified command versions
- **Enrichment Analysis**: `ENRICHMENT_ANALYSIS.md` - Which components need enrichment
- **Enrichment Recommendations**: `ENRICHMENT_RECOMMENDATIONS.md` - Nice-to-have list
- **Workflow Guide**: `WORKFLOW.md` - When to run extraction scripts

---

## 💡 Pro Tips

1. **Use slash commands for quick access**: `/enrichment-maker` is faster than typing full request

2. **Check existing enrichments first**: Learn patterns before creating new ones
   ```bash
   ls src/registry/enrichments/
   cat src/registry/enrichments/InButtonV2.json
   ```

3. **Verify with MCP**: Always check component exists before enriching
   ```
   mcp__design-system__get-component("ComponentName")
   ```

4. **Test after enriching**: Ensure enrichment is loaded
   ```bash
   npm run extract:merge
   npm run build
   cat data/combined.json | jq '.components.ComponentName.enriched'
   ```

5. **Don't over-enrich**: 5-10 enrichments is optimal (current: 5)

---

## 🎯 Summary

**Two Ways to Use Agents**:
1. ✅ Slash commands: `/enrichment-maker InTooltipV2`
2. ✅ Direct request: "Use enrichment-maker to create enrichment for InTooltipV2"

**Available Commands**:
- `/enrichment-maker [ComponentName]` - Create enrichment
- `/migrate-v1-v2` - Migrate V1→V2 code

**Best Practice**: Use slash commands for quick, standardized workflows!
