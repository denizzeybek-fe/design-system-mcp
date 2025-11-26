# Automated Enrichment Pipeline

Bu döküman MCP enrichment'larının **otomatik olarak** nasıl güncelleneceğini açıklar.

## 🎯 Problem

Component'ler design-system repo'sunda değiştiğinde (yeni prop, event, vs.), enrichment'lar manuel güncellenmezse **eski kalır**.

## ✅ Çözüm: Self-Updating Pipeline

```bash
npm run extract:all
```

Bu komut 3 adımı otomatik çalıştırır:

### 1️⃣ `extract:components` - Component Metadata Çıkar
Design System repo'sundaki tüm component'lerin props, events, slots'larını çıkarır.

**Output:** `data/components.json`

### 2️⃣ `extract:enrich` - Enrichment Güncellemelerini Tespit Et
Component metadata ile mevcut enrichment'ları karşılaştırır:

**Tespit eder:**
- ✅ Yeni props (Object/Array/Function)
- ✅ Yeni events
- ✅ Eksik critical sections (codeSnippets, styling, examples, bestPractices)
- ✅ Enrichment dosyası olmayan component'ler

**Output:** `scripts/.enrichment-queue.json` (güncellenmesi gereken component'ler)

**Ekrana basar:**
```
🔴 InChart [HIGH] - 3 new complex props: data, options, config
🟡 InButton [MEDIUM] - Missing sections: codeSnippets, styling
🟢 InAccordion [LOW] - 1 new event: toggle
```

### 3️⃣ `extract:merge` - Birleştir
Component metadata + enrichment'lar → `data/combined.json`

### 4️⃣ `build` - MCP Server Build Et
MCP server'ı yeniden build eder.

---

## 📋 Workflow

### A) Otomatik Tespit (Şu An)

```bash
# Design System değişti
cd /path/to/design-system
git pull

# MCP'de değişiklikleri kontrol et
cd /path/to/design-system-mcp
npm run extract:components  # Metadata güncelle
npm run extract:enrich       # Neyin değiştiğini tespit et

# Output:
# 🔴 5 component needs enrichment update
# 📋 See: scripts/.enrichment-queue.json
```

Script şunları gösterir:
1. Hangi component'lerin güncellenmesi gerektiği
2. Neyin değiştiği (yeni prop, event, vs.)
3. Priority (high/medium/low)
4. Her component için enrichment-maker agent'ına verilecek prompt

### B) Manuel Güncelleme

Script'in önerdiği her component için:

```bash
# enrichment-maker agent'ını çağır
claude --agent enrichment-maker

# Agent'a sor:
"Update enrichment for InChart. New props: data, options, config.
Add missing sections: codeSnippets, styling, examples."

# Agent çalışır:
# 1. MCP'den component detaylarını alır
# 2. InRibbons.json'u referans alır
# 3. Enrichment dosyasını günceller/oluşturur

# Merge ve build
npm run extract:merge
npm run build
```

### C) Semi-Automated (Gelecek - Önerilen)

```bash
# 1. Tüm pipeline'ı çalıştır
npm run extract:all

# 2. Script otomatik enrichment-maker agent'ını çağırır
# Her HIGH priority component için agent çalışır
# Dosyalar otomatik güncellenir

# 3. Human review (opsiyonel)
git diff src/registry/enrichments/
# Değişiklikleri incele, gerekirse düzelt

# 4. Commit
git add .
git commit -m "chore: auto-update enrichments after component changes"
```

### D) Fully Automated (Gelecek - CI/CD)

```yaml
# .github/workflows/auto-enrich.yml
name: Auto-Update Enrichments

on:
  schedule:
    - cron: '0 0 * * *'  # Her gün çalış
  workflow_dispatch:       # Manuel trigger

jobs:
  enrich:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check Design System for changes
        run: |
          cd /design-system
          git pull
          npm run extract:components

      - name: Detect enrichment updates
        run: npm run extract:enrich

      - name: Auto-enrich with Claude
        run: |
          # Claude Code CLI ile enrichment-maker agent'ını çağır
          # scripts/.enrichment-queue.json'daki her component için

      - name: Merge and build
        run: |
          npm run extract:merge
          npm run build

      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: auto-update enrichments"
          body: "Automated enrichment updates from component changes"
          branch: "auto-enrich-$(date +%s)"
```

---

## 🛠️ Commands Reference

### Basic Commands

```bash
# Check for enrichment updates
npm run extract:enrich

# Check specific component
npm run extract:enrich InButtonV2

# Full pipeline (recommended)
npm run extract:all
```

### Advanced Commands

```bash
# Extract everything (including storybook, usage)
npm run extract:full

# Only merge (skip detection)
npm run extract:merge

# Only build
npm run build
```

---

## 📊 Priority System

Script component'leri priority'ye göre sıralar:

### 🔴 HIGH Priority
- Enrichment dosyası yok
- 2+ yeni complex prop (Object/Array/Function)
- Critical sections tamamen eksik

**Action:** İlk önce bunları düzelt!

### 🟡 MEDIUM Priority
- 1 yeni complex prop
- 1+ yeni event
- Bazı critical sections eksik

**Action:** Zaman bulunca güncelle

### 🟢 LOW Priority
- Minor güncellemeler
- Simple prop değişiklikleri
- Optional section'lar eksik

**Action:** Boş zamanda ele al

---

## 🎯 Enrichment Queue Format

`scripts/.enrichment-queue.json`:

```json
[
  {
    "component": "InChart",
    "priority": "high",
    "reason": "3 new complex props: data, options, config | Missing sections: codeSnippets, styling",
    "prompt": "Update enrichment for InChart.\n\nNew props to document: data, options, config\nAdd missing sections: codeSnippets, styling\n\nFollow the enrichment-maker agent workflow:\n1. Use mcp__design-system__get-component to get full component details\n2. Read InRibbons.json as gold standard template\n3. Focus on codeSnippets, styling, examples, implementationPatterns, bestPractices\n4. Update or create enrichment file with new v2 schema"
  }
]
```

Bu dosyayı kullanarak:
- Manuel olarak her component'i enrichment-maker'a verebilirsin
- Automated script loop'layıp hepsini yapabilir
- CI/CD'de batch processing yapabilirsin

---

## 🚀 Best Practices

### 1. Regular Updates
```bash
# Haftada 1 kez çalıştır
npm run extract:all
```

### 2. Review Before Commit
```bash
# Agent sonrası değişiklikleri incele
git diff src/registry/enrichments/

# Mantıklı mı? Eksik var mı?
```

### 3. Test After Update
```bash
# Build başarılı mı?
npm run build

# MCP çalışıyor mu?
npm run test:production

# Claude ile test et
mcp__design-system__get-component InChart
# enriched: true olmalı
# Yeni sections görünmeli
```

### 4. Prioritize HIGH First
```
🔴 HIGH → Hemen düzelt (component bozuk/eksik)
🟡 MEDIUM → Bu hafta düzelt
🟢 LOW → Zamanın varsa düzelt
```

---

## 🐛 Troubleshooting

### "components.json not found"
```bash
# Design system'den extract et
npm run extract:components
```

### "No enrichments need updating"
```bash
# Zaten güncel demektir ✅
# Veya script yeni prop'ları tespit edememiştir
# Manual kontrol:
git diff data/components.json
```

### "Enrichment queue empty but should have items"
```bash
# Script sadece complex props'u flag'ler
# Simple String/Boolean prop'lar için manuel kontrol gerekir
cat data/components.json | jq '.components.InButton.props'
```

### "Agent updates but merge fails"
```bash
# JSON syntax hatası olabilir
npm run extract:merge
# Error'u oku, dosyayı düzelt
vim src/registry/enrichments/ComponentName.json
```

---

## 📚 Related Docs

- [ENRICHMENT_STRATEGY.md](./ENRICHMENT_STRATEGY.md) - Overall strategy
- [ENRICHMENT_TEMPLATE.md](./ENRICHMENT_TEMPLATE.md) - Template guide
- [../CLAUDE.md](../CLAUDE.md) - MCP usage for AI

---

## 🔮 Future Improvements

### Phase 1 (Current)
- ✅ Detect changes automatically
- ✅ Generate prompts for agent
- ⏳ Manual agent invocation

### Phase 2 (Next)
- [ ] CLI integration with enrichment-maker agent
- [ ] Batch process multiple components
- [ ] Progress tracking

### Phase 3 (Future)
- [ ] GitHub Actions workflow
- [ ] Automatic PR creation
- [ ] Human review + auto-merge
- [ ] Webhook from design-system repo

### Phase 4 (Dream)
- [ ] Real-time sync (watch mode)
- [ ] AI learns from code reviews
- [ ] Self-improving enrichments
- [ ] Auto-detect anti-patterns in components

---

**Status:** 🚧 Phase 1 - Manual Detection + Agent Invocation
**Next:** Phase 2 - CLI Integration for Batch Processing
