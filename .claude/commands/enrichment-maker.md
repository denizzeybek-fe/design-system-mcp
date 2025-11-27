---
description: Create enrichment file for a Design System component
---

Create a comprehensive enrichment file for the specified component.

**Component**: {{arg1}}

Follow these steps:

## Step 1: Get Component Metadata

Use MCP to analyze the component:
```
mcp__design-system__get-component("{{arg1}}")
```

## Step 2: Learn the Standard Schema and Patterns

**First, understand the structure:**
1. `src/registry/enrichments/_TEMPLATE.json` - Canonical schema (MUST follow)
2. `src/registry/enrichments/InRibbons.json` - Gold standard implementation
3. `src/types/enrichment-schema.ts` - TypeScript type definitions

**Then, learn from real examples:**
- `InButtonV2.json` - Simple props with severity levels
- `InDatePickerV2.json` - Complex Object/Array props
- `InSelect.json` - Options and value patterns
- `InCheckBoxV2.json` - Boolean props and related states

**CRITICAL**: All enrichments MUST match _TEMPLATE.json structure.
Use examples only for content patterns, not structure.

## Step 3: Identify Critical Props

Focus on:
- Complex types (Object, Array, Function, any)
- Props with validators (enum references)
- Commonly misused props
- Non-obvious formats

## Step 4: Create Enrichment File

Write to: `src/registry/enrichments/{{arg1}}.json`

Include:

```json
{
  "component": "{{arg1}}",
  "propEnrichments": {
    "propName": {
      "valueFormat": {
        "structure": "Type signature",
        "examples": ["concrete example 1", "concrete example 2"],
        "notes": "CRITICAL details and gotchas",
        "typescript": "TypeScript type definition"
      },
      "relatedProps": ["prop1", "prop2"],
      "commonMistakes": [
        {
          "mistake": "Description of error",
          "impact": "What happens",
          "fix": "How to fix",
          "severity": "critical | high | medium | low"
        }
      ]
    }
  },
  "eventEnrichments": {
    "eventName": {
      "payloadTypes": [...],
      "useCase": "When this event fires",
      "handlingPattern": "Code example"
    }
  },
  "examples": [
    {
      "title": "Example title",
      "description": "What this demonstrates",
      "code": "<{{arg1}}\n  prop=\"value\"\n/>",
      "language": "vue"
    }
  ],
  "helperFunctions": [...],
  "commonMistakes": [...],
  "performanceNotes": [...],
  "accessibilityNotes": [...]
}
```

## Step 5: Merge, Generate Markdown, and Build

After creating the enrichment file, run these commands in order:

```bash
# 1. Merge enrichment into combined.json
npm run extract:merge

# 2. Generate Markdown format (77% token savings!)
npm run generate:markdown

# 3. Build MCP server
npm run build
```

**Why this order matters:**
1. `extract:merge` - Combines enrichment with component metadata
2. `generate:markdown` - Creates optimized Markdown docs from merged data
3. `build` - Packages everything for MCP server

## Step 6: Test the MCP Server

After building, test that the enrichment works:

```bash
# Quick test with MCP tool
mcp__design-system__get-component("{{arg1}}")

# Should return Markdown format with:
# - Your enriched prop descriptions
# - Common mistakes you added
# - Code examples
# - Token savings displayed
```

**Expected output:**
- Format: Markdown (not JSON)
- Contains your propEnrichments
- Shows token savings percentage
- All enrichments visible in readable format

## Guidelines

- ✅ Use concrete examples (not placeholders)
- ✅ Focus on 2-5 critical props only
- ✅ Document common mistakes with severity
- ✅ Include TypeScript types
- ✅ Link related props
- ❌ Don't over-document simple String/Boolean props
- ❌ Don't use generic examples

## Output Summary

After completion, provide:
1. Summary of enriched props
2. Number of common mistakes documented
3. Number of examples added
4. Next steps (merge and build commands)
