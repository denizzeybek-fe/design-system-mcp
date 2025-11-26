# MCP Enrichment Strategy & Implementation Plan

## 📊 Current Status (as of 2025-11-25)

- **Total Components:** 63
- **Enriched:** 19 (30%)
- **Unenriched:** 44 (70%)
- **With Examples:** 19
- **With Migrations:** 22

## 🎯 Goals

Claude'un feedback'ine göre MCP'nin şu konularda geliştirilmesi gerekiyor:

### ✅ Zaten İyi Çalışan Kısımlar
- Component varlığını doğrulama
- Prop ve event listeleme
- API dokümantasyonu

### ❌ İyileştirilmesi Gerekenler
1. **Source Code Visibility** - Template, script, style kodları gösterilmiyor
2. **CSS/SCSS Details** - Hizalama, positioning gibi kritik stil bilgileri eksik
3. **Implementation Details** - Component'in nasıl çalıştığına dair bilgi yok
4. **Usage Examples** - Gerçek kullanım örnekleri yetersiz
5. **Best Practices** - En iyi uygulamalar eksik

## 📋 Enrichment Priority Matrix

### Tier 1: Critical Components (Immediate Priority)
High complexity, frequently used, security-critical

| Component | Reason | Priority Score |
|-----------|--------|----------------|
| InChart | 17 complex props, data visualization | 🔴 HIGH (95) |
| InCodeSnippet | 10 complex props, security (XSS), editor | 🔴 HIGH (90) |
| InDynamicContentBox | 5 complex props, form builder | 🔴 HIGH (85) |

### Tier 2: Important Components (High Priority)
Moderate complexity, common use cases

| Component | Reason | Priority Score |
|-----------|--------|----------------|
| InBasicTextInput | 3 complex props, form fundamental | 🟡 MEDIUM (75) |
| InCustomDropDown | 3 complex props, common UI pattern | 🟡 MEDIUM (70) |
| InTabs | 2 complex props, navigation pattern | 🟡 MEDIUM (65) |
| InDrawer | Complex footer, modal pattern | 🟡 MEDIUM (65) |

### Tier 3: Standard Components (Medium Priority)
Simple but lack documentation

| Component | Reason | Priority Score |
|-----------|--------|----------------|
| InBulkActions | Action patterns | 🟢 LOW (50) |
| InSteps | Navigation/wizard | 🟢 LOW (50) |
| InTags | Simple but needs examples | 🟢 LOW (45) |
| InAccordion | Layout pattern | 🟢 LOW (40) |

### Tier 4: Specialized Components (Low Priority)
Niche use cases, simple structure

- InBreadcrumb, InIcons, InHeader, InInfoBox, InFormStatus, etc.

## 📚 Enrichment Structure (Based on InRibbons Success)

InRibbons enrichment'ı mükemmel bir şablon sunuyor. Her enrichment şunları içermeli:

### 1. propEnrichments
```json
{
  "propName": {
    "valueFormat": {
      "structure": "type description",
      "validValues": ["option1", "option2"],  // if enum
      "notes": "Important usage notes",
      "examples": ["example1", "example2"],   // if complex
      "typescript": "TypeScript type definition"
    },
    "relatedProps": ["prop1", "prop2"],
    "commonMistakes": [
      {
        "mistake": "Description",
        "impact": "What happens",
        "fix": "How to fix",
        "severity": "critical|high|medium|low"
      }
    ]
  }
}
```

### 2. eventEnrichments
```json
{
  "eventName": {
    "payloadFormat": {
      "structure": "payload type",
      "notes": "When/why emitted"
    },
    "commonMistakes": [...]
  }
}
```

### 3. codeSnippets ⭐ (Claude'un İstediği)
```json
{
  "template": {
    "basic": "<Component />",
    "advanced": "<Component :complex=\"true\" />"
  },
  "script": "import and setup code",
  "style": "CSS/SCSS with explanations"
}
```

### 4. styling ⭐ (Claude'un İstediği)
```json
{
  "positioning": "static|absolute|fixed|relative",
  "layout": "flex|grid|block",
  "fullWidth": true|false,
  "zIndex": number|null,
  "customization": {
    "cssClasses": ["class1", "class2"],
    "cssVariables": ["--var1", "--var2"],
    "themeable": true|false,
    "notes": "How to customize"
  },
  "responsive": {
    "mobile": true,
    "tablet": true,
    "desktop": true,
    "notes": "Responsive behavior"
  }
}
```

### 5. examples ⭐ (Claude'un İstediği)
```json
[
  {
    "title": "Example Title",
    "description": "What this shows",
    "category": "basic|advanced|security|layout",
    "code": "Full component code",
    "language": "vue"
  }
]
```

### 6. implementationPatterns ⭐ (Claude'un İstediği)
```json
[
  {
    "pattern": "Pattern name",
    "when": "When to use",
    "code": "Implementation code",
    "notes": "Additional tips"
  }
]
```

### 7. useCases
Real-world scenarios

### 8. bestPractices ⭐ (Claude'un İstediği)
```json
[
  {
    "practice": "What to do",
    "why": "Reasoning",
    "example": "Good code",
    "antiPattern": "What to avoid"
  }
]
```

### 9. commonMistakes
Consolidated mistakes from props/events

### 10. performanceNotes
Performance considerations

### 11. accessibilityNotes
A11y guidelines

## 🔄 Enrichment Workflow

### Manual Enrichment Process
1. **Analyze Component** via MCP `get-component`
2. **Review Source Code** in design-system repo
3. **Check Storybook** for examples
4. **Create Enrichment JSON** using InRibbons as template
5. **Focus on:**
   - Complex Object/Array props (valueFormat with structure & examples)
   - Security props (XSS, validation)
   - Common mistakes (from support tickets/code reviews)
   - CSS/SCSS details (positioning, layout, classes)
   - Real code snippets (template, script, style)
6. **Test:** `npm run extract:merge && npm run build`

### Automated Enrichment (Future)
- Use `enrichment-maker` agent for complex components
- Agent reads MCP data + learns from existing enrichments
- Generates draft enrichment JSON
- Human review and refinement

## 📅 Implementation Phases (UPDATED 2025-11-25)

### Phase 0: Upgrade Existing Enrichments to v2 Schema (Week 1) 🔥 **PRIORITY**
**Goal:** Bring all 19 existing enrichments to 100% completeness

Currently enriched components need v2 schema updates:
- [ ] InButtonV2 - Add codeSnippets, styling sections
- [ ] InCheckBoxV2 - Add implementation patterns
- [ ] InChips - Add bestPractices, useCases
- [ ] InContainer - Add styling details
- [ ] InDataTable - Add codeSnippets, examples
- [ ] InDataTableV2 - Add implementation patterns
- [ ] InDatePicker - Add styling, bestPractices
- [ ] InDatePickerV2 - Verify completeness (may be complete)
- [ ] InDropDown - Add codeSnippets
- [ ] InDropdownMenu - Add examples
- [ ] InMultiDropDown - Add implementation patterns
- [ ] InMultiSelect - Add styling details
- [ ] InOnPageMessage - Add bestPractices
- [ ] InRibbons - ✅ **Gold Standard** (already 100%)
- [ ] InRichTextInput - Add codeSnippets, styling
- [ ] InSelect - Add implementation patterns
- [ ] InSidebarV2 - Add examples, styling
- [ ] InSuperInput - Add bestPractices
- [ ] InTooltipV2 - Add codeSnippets, examples

**How to execute:**
```bash
# Run auto-detection
npm run extract:enrich

# For each component flagged:
# 1. Use enrichment-maker agent
# 2. Reference InRibbons.json as template
# 3. Add missing v2 sections

# After each:
npm run extract:merge && npm run build
```

**Deliverable:** 19 enrichments at 100% (all have v2 sections)

### Phase 1: Critical Components (Week 2-3)
- [ ] InChart - Data visualization enrichment
- [ ] InCodeSnippet - Editor + security patterns
- [ ] InDynamicContentBox - Form builder patterns

**Deliverable:** 3 comprehensive enrichments

### Phase 2: High-Usage Components (Week 4-5)
- [ ] InBasicTextInput - Form input patterns
- [ ] InCustomDropDown - Dropdown patterns
- [ ] InTabs - Navigation patterns
- [ ] InDrawer - Modal/drawer patterns

**Deliverable:** 4 enrichments

### Phase 3: Standard Components (Week 6-7)
- [ ] InBulkActions
- [ ] InSteps
- [ ] InTags
- [ ] InAccordion
- [ ] InButton (V1)
- [ ] InCheckBox (V1)

**Deliverable:** 6 enrichments

### Phase 4: Remaining Components (Ongoing)
- [ ] All other unenriched components
- [ ] Continuous improvements to existing enrichments
- [ ] Monitor design-system changes via `npm run extract:all`

**Goal:** 80%+ enrichment coverage, 100% quality for enriched components

## 🎯 Quality Criteria

Each enrichment must include:

✅ **Required:**
- [ ] All complex props have valueFormat with structure & examples
- [ ] All security-sensitive props documented
- [ ] At least 3 commonMistakes with severity
- [ ] At least 5 codeSnippets (template variations)
- [ ] Complete styling section (positioning, classes, responsive)
- [ ] At least 3 examples (basic, advanced, edge case)
- [ ] At least 5 bestPractices
- [ ] CSS/SCSS code snippet with explanations

⭐ **Nice to Have:**
- [ ] implementationPatterns (at least 2)
- [ ] useCases (at least 3)
- [ ] performanceNotes
- [ ] accessibilityNotes
- [ ] helperFunctions (if applicable)

## 🛠️ Tools & Commands

```bash
# Analyze priorities
node scripts/analyze-enrichment-priorities.js

# Create new enrichment
touch src/registry/enrichments/InComponentName.json

# Validate and merge
npm run extract:merge

# Rebuild MCP server
npm run build

# Test with Claude
mcp__design-system__get-component InComponentName
```

## 📝 Template Files

- **Enrichment Template:** Use `InRibbons.json` as gold standard
- **Analysis Script:** `scripts/analyze-enrichment-priorities.js`
- **Merge Script:** `scripts/merge-datasets.ts`

## 🎓 Learning from InRibbons

InRibbons enrichment'ı şu açılardan örnek:

1. ✅ **Comprehensive prop documentation** - Her prop detaylı açıklanmış
2. ✅ **Security awareness** - XSS vulnerabilities vurgulanmış
3. ✅ **Real code snippets** - Template, script, style hepsi var
4. ✅ **CSS details** - Positioning, layout, classes documented
5. ✅ **Multiple examples** - 9 different use cases
6. ✅ **Implementation patterns** - 4 common patterns
7. ✅ **Best practices** - 7 practices with anti-patterns
8. ✅ **Severity levels** - Critical/high/medium/low labels

## 🚀 Next Steps

1. **Review this strategy** with team
2. **Start with InChart** (highest complexity)
3. **Iterate and improve** template based on feedback
4. **Automate where possible** using enrichment-maker agent
5. **Measure impact** - Track Claude's success rate with enriched components

## 📊 Success Metrics

- **Coverage:** 80%+ components enriched
- **Quality:** All Tier 1-2 components meet quality criteria
- **Developer Feedback:** Claude reports improvements in:
  - Source code visibility ✅
  - CSS/SCSS details ✅
  - Implementation patterns ✅
  - Usage examples ✅
  - Best practices ✅

## 🔗 Related Documents

- [CLAUDE.md](../CLAUDE.md) - MCP usage guide for AI assistants
- [InRibbons.json](../src/registry/enrichments/InRibbons.json) - Gold standard enrichment
- [merge-datasets.ts](../scripts/merge-datasets.ts) - Data pipeline

---

**Status:** 📝 Draft - Ready for review
**Last Updated:** 2025-11-25
**Next Review:** After Phase 1 completion
