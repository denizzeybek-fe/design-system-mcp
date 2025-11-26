# Enrichment Template Guide

Bu döküman yeni bir component enrichment dosyası oluştururken kullanılacak şablonu ve her bir bölümün nasıl doldurulacağını açıklar.

## 📋 Template Structure

```json
{
  "component": "ComponentName",
  "propEnrichments": { ... },
  "eventEnrichments": { ... },
  "codeSnippets": { ... },
  "styling": { ... },
  "examples": [ ... ],
  "implementationPatterns": [ ... ],
  "useCases": [ ... ],
  "bestPractices": [ ... ],
  "commonMistakes": [ ... ],
  "performanceNotes": [ ... ],
  "accessibilityNotes": [ ... ],
  "helperFunctions": [ ... ]
}
```

## 1️⃣ propEnrichments

Her **complex prop** (Object, Array, Function) ve **critical prop** (security, validation) için:

```json
"propName": {
  "valueFormat": {
    "structure": "String | Object | Array | ...",
    "validValues": ["option1", "option2"],  // Only for enums
    "notes": "REQUIRED/SECURITY/Important notes",
    "examples": [
      "{ key: 'value' }",
      "[item1, item2]"
    ],
    "typescript": "'type1' | 'type2' | CustomType"
  },
  "relatedProps": ["prop1", "prop2"],  // Props that work together
  "commonMistakes": [
    {
      "mistake": "What developers do wrong",
      "impact": "What breaks or goes wrong",
      "fix": "How to fix it (with code example)",
      "severity": "critical|high|medium|low"
    }
  ]
}
```

### Priority Guidelines:
- ✅ **Always document:** Object, Array, Function props
- ✅ **Always document:** Props with validators (enums)
- ✅ **Always document:** Security props (preventXss, sanitize, etc.)
- ✅ **Always document:** Props with non-obvious defaults
- ❌ **Skip:** Simple String/Boolean/Number props without validators

### Severity Levels:
- **critical:** Security vulnerabilities, data loss, app crashes
- **high:** Major UX issues, confusing behavior
- **medium:** Minor UX issues, styling problems
- **low:** Best practice violations, performance hints

## 2️⃣ eventEnrichments

Her **event** için:

```json
"eventName": {
  "payloadFormat": {
    "structure": "void | { key: type } | CustomType",
    "notes": "When is this emitted? What does payload contain?"
  },
  "commonMistakes": [
    {
      "mistake": "Not handling this event",
      "impact": "Button shows but does nothing",
      "fix": "@eventName=\"handleEvent\"",
      "severity": "high"
    }
  ]
}
```

### Focus On:
- Events that **must** be handled (close, submit, etc.)
- Events with complex payloads
- Events that work together (update:modelValue + change)

## 3️⃣ codeSnippets ⭐ CRITICAL

```json
"codeSnippets": {
  "template": {
    "basic": "<Component\n  prop1=\"value\"\n  :prop2=\"true\"\n/>",
    "advanced": "More complex example",
    "withEvents": "Example with event handlers",
    "withSlots": "Example with slots",
    "conditional": "v-if/v-show patterns",
    "looped": "v-for patterns"
  },
  "script": "import { ref } from 'vue';\nimport Component from '@useinsider/design-system-vue';\n\nconst value = ref('initial');\n\nconst handleEvent = () => {\n  // Event handler logic\n};",
  "style": "/* Component-specific styling */\n.component-wrapper {\n  /* Layout */\n  position: relative;\n  display: flex;\n}\n\n/* Custom classes */\n.component__element {\n  /* Styles */\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .component-wrapper {\n    /* Mobile adjustments */\n  }\n}"
}
```

### Requirements:
- **template:** At least 3-5 variations (basic, advanced, common use cases)
- **script:** Complete setup code with imports, refs, handlers
- **style:** CSS classes, positioning, responsive, customization

## 4️⃣ styling ⭐ CRITICAL

```json
"styling": {
  "positioning": "static|absolute|fixed|relative|sticky",
  "layout": "flex|grid|block|inline-block",
  "fullWidth": true|false,
  "zIndex": null|number,
  "customization": {
    "cssClasses": [
      "component-wrapper",
      "component__element",
      "component--modifier"
    ],
    "cssVariables": [
      "--component-color",
      "--component-size"
    ],
    "themeable": true|false,
    "notes": "How to override styles, theme integration"
  },
  "responsive": {
    "mobile": true|false,
    "tablet": true|false,
    "desktop": true|false,
    "notes": "Breakpoints, mobile-specific behavior"
  }
}
```

### How to Find Info:
1. Check component's `.vue` file `<style>` section
2. Look for CSS classes in template
3. Check Storybook for responsive examples
4. Test component in DevTools to see layout

## 5️⃣ examples ⭐ CRITICAL

```json
"examples": [
  {
    "title": "Basic Usage",
    "description": "Simplest possible implementation",
    "category": "basic",
    "code": "<Component />",
    "language": "vue"
  },
  {
    "title": "With Props",
    "description": "Common configuration",
    "category": "basic",
    "code": "<Component :prop=\"value\" />",
    "language": "vue"
  },
  {
    "title": "Advanced Pattern",
    "description": "Complex real-world scenario",
    "category": "advanced",
    "code": "<template>\n  <Component\n    v-model=\"data\"\n    @event=\"handler\"\n  >\n    <template #slot>\n      Content\n    </template>\n  </Component>\n</template>\n\n<script setup>\nimport { ref } from 'vue';\nconst data = ref(null);\nconst handler = () => {};\n</script>",
    "language": "vue"
  },
  {
    "title": "Security Example",
    "description": "Safe handling of user input",
    "category": "security",
    "code": "XSS-safe example",
    "language": "vue"
  }
]
```

### Categories:
- **basic:** Simple, common use cases
- **advanced:** Complex scenarios, multiple features
- **security:** XSS, validation, sanitization
- **layout:** Positioning, responsive
- **variants:** Different visual/functional variants
- **integration:** With forms, routers, stores

### Requirements:
- At least **5-10 examples**
- Cover all major use cases
- Include full `<template>` + `<script setup>` when needed
- Show both good and complex scenarios

## 6️⃣ implementationPatterns ⭐ IMPORTANT

```json
"implementationPatterns": [
  {
    "pattern": "Auto-dismiss notification",
    "when": "Temporary success/info messages",
    "code": "const show = ref(true);\n\nconst save = async () => {\n  await api.save();\n  show.value = true;\n  setTimeout(() => show.value = false, 5000);\n};",
    "notes": "Good for non-critical notifications"
  },
  {
    "pattern": "Form validation errors",
    "when": "Displaying multiple validation errors",
    "code": "const errors = ref([]);\nconst errorMessage = computed(() => {\n  return errors.value.join(', ');\n});",
    "notes": "Clear errors when user starts typing"
  }
]
```

### Focus On:
- Common integration patterns (forms, lists, modals)
- State management patterns
- Performance optimizations
- Error handling patterns

## 7️⃣ useCases

```json
"useCases": [
  {
    "useCase": "Search field with autocomplete",
    "description": "Input with live search suggestions",
    "implementation": "<Component\n  v-model=\"query\"\n  @input=\"fetchSuggestions\"\n/>",
    "notes": "Debounce input to avoid excessive API calls"
  }
]
```

### Examples:
- Form fields
- Navigation menus
- Data display
- User interactions
- System notifications

## 8️⃣ bestPractices ⭐ CRITICAL

```json
"bestPractices": [
  {
    "practice": "Always validate user input",
    "why": "Prevents invalid data and improves UX",
    "example": ":validator=\"validateEmail\"",
    "antiPattern": "Accepting any input without validation"
  },
  {
    "practice": "Use v-model for two-way binding",
    "why": "Cleaner code, standard Vue pattern",
    "example": "v-model=\"value\"",
    "antiPattern": ":value=\"val\" @input=\"val = $event\""
  }
]
```

### Requirements:
- At least **5-7 practices**
- Cover security, performance, UX, accessibility
- Show both ✅ correct and ❌ incorrect approaches

## 9️⃣ commonMistakes

Consolidated list from all propEnrichments and eventEnrichments:

```json
"commonMistakes": [
  {
    "category": "security|ux|performance|api|type",
    "severity": "critical|high|medium|low",
    "title": "Short mistake title",
    "description": "Detailed explanation",
    "wrong": "// Bad code",
    "correct": "// Good code",
    "impact": "What breaks or causes issues"
  }
]
```

## 🔟 performanceNotes

```json
"performanceNotes": [
  {
    "note": "Use v-show instead of v-if for frequent toggles",
    "recommendation": "v-show=\"visible\" avoids component destroy/recreate"
  },
  {
    "note": "Debounce search input",
    "recommendation": "Use _.debounce or custom debounce to limit API calls"
  }
]
```

## 1️⃣1️⃣ accessibilityNotes

```json
"accessibilityNotes": [
  {
    "note": "Component handles keyboard navigation",
    "recommendation": "Tab, Enter, Escape keys work out of the box"
  },
  {
    "note": "Provide descriptive labels",
    "recommendation": "Use aria-label or label prop for screen readers"
  }
]
```

## 1️⃣2️⃣ helperFunctions (Optional)

```json
"helperFunctions": [
  {
    "name": "formatDate",
    "purpose": "Format date for display",
    "code": "const formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n};",
    "usage": "{{ formatDate(data.createdAt) }}"
  }
]
```

---

## 🎯 Enrichment Checklist

Before submitting enrichment, verify:

### Required (Must Have):
- [ ] All complex props documented (Object/Array/Function)
- [ ] Security props highlighted (XSS, sanitization)
- [ ] At least 3 commonMistakes with severity levels
- [ ] Complete codeSnippets section (template, script, style)
- [ ] Complete styling section (positioning, classes, responsive)
- [ ] At least 5 examples covering major use cases
- [ ] At least 5 bestPractices with anti-patterns
- [ ] All events with payload documentation

### Optional (Nice to Have):
- [ ] At least 2 implementationPatterns
- [ ] At least 3 useCases
- [ ] performanceNotes
- [ ] accessibilityNotes
- [ ] helperFunctions

### Quality Checks:
- [ ] Code examples are syntactically correct
- [ ] TypeScript types are accurate
- [ ] No typos or grammar errors
- [ ] Examples match component API
- [ ] Severity levels are appropriate

---

## 🔍 Research Checklist

Where to find information:

1. **Component API:**
   - `mcp__design-system__get-component ComponentName`
   - Design System repo: `src/components/ComponentName/`

2. **Source Code:**
   - Check `.vue` file for props, events, slots
   - Read `<style>` section for CSS classes
   - Look for validators, defaults

3. **Storybook:**
   - Examples and variations
   - Props playground
   - Visual documentation

4. **Existing Enrichments:**
   - Similar components (InRibbons, InButtonV2, InDatePickerV2)
   - Copy structure and adapt

5. **Common Issues:**
   - Support tickets
   - Code reviews
   - Known bugs/limitations

---

## 💡 Pro Tips

1. **Start with InRibbons.json** - Copy and adapt structure
2. **Focus on "why"** - Don't just list props, explain when/why to use them
3. **Show mistakes** - Developers learn more from wrong examples
4. **Be specific** - "Prevents XSS attacks" > "For security"
5. **Use real code** - Copy actual working examples from Storybook
6. **Think like Claude** - What would AI need to implement this correctly?
7. **Test examples** - Verify code snippets actually work
8. **Security first** - Always highlight XSS, validation, sanitization
9. **CSS matters** - Positioning/layout issues are common mistakes
10. **Iterate** - Start simple, improve based on feedback

---

## 📚 Reference

- [InRibbons.json](../src/registry/enrichments/InRibbons.json) - Gold standard example
- [ENRICHMENT_STRATEGY.md](./ENRICHMENT_STRATEGY.md) - Overall strategy
- [CLAUDE.md](../CLAUDE.md) - MCP usage guide

---

**Ready to create your first enrichment?** 🚀

```bash
# 1. Copy template
cp src/registry/enrichments/InRibbons.json src/registry/enrichments/InYourComponent.json

# 2. Edit and fill in sections
# Use this guide + InRibbons as reference

# 3. Test merge
npm run extract:merge

# 4. Build MCP
npm run build

# 5. Test with Claude
# Ask Claude to implement something with your component
```
