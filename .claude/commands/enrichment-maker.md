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

## Step 2: Learn from Existing Enrichments

Read these files to understand patterns:
- `src/registry/enrichments/InButtonV2.json` (simple type mistakes)
- `src/registry/enrichments/InDatePickerV2.json` (complex structures)
- `src/registry/enrichments/InSelect.json` (options/value patterns)

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

## Step 5: Merge and Build

After creating the file:

```bash
npm run extract:merge
npm run build
```

## Step 6: Verify

Check that enrichment is loaded:

```bash
cat data/combined.json | jq '.components.{{arg1}}.enriched'
# Should output: true
```

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
