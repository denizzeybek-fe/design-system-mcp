# Component Enrichments

Component enrichment dosyaları, otomatik extraction ile bulunamayan **developer experience** bilgilerini içerir.

---

## 📊 Combined.json vs Enrichment Dosyaları

### Kısa Açıklama

**combined.json** = Otomatik extraction (script'lerle çıkarılan)
**enrichment files** = Manuel curation (AI/developer eklemesi gereken)

### Detaylı Karşılaştırma

#### combined.json İçeriği (Otomatik):
```javascript
{
  "InButtonV2": {
    "props": { "id": { type: "String", required: true } },  // ← .vue'den extract
    "emits": ["click", "clickIcon"],                         // ← .vue'den extract
    "enums": { "STYLES": {...} },                           // ← .vue'den extract
    "examples": "...",                                       // ← Storybook'tan extract
  }
}
```
✅ Script otomatik bulur
❌ Ama "nasıl kullanılır", "yaygın hatalar", "best practices" bilmiyor

#### enrichment.json İçeriği (Manuel):
```json
{
  "buttonGroupOptions": {
    "valueFormat": {
      "structure": "Array<ButtonGroupOption>",
      "objectShape": "{ id, type, styling, labelText, ... }",  // ← Manuel yazıldı
      "notes": "Creates button group when provided"             // ← Manuel yazıldı
    },
    "commonMistakes": [
      {
        "mistake": "Expecting ['Option 1', 'Option 2']",       // ← Manuel yazıldı
        "fix": "Use array of objects with id, type, styling",  // ← Manuel yazıldı
        "severity": "critical"
      }
    ],
    "relatedProps": ["selectedStatus", "type"]                 // ← Manuel yazıldı
  }
}
```
✅ Developer experience insights
✅ Yaygın hatalar (production'da gördüklerimiz)
✅ Complex prop'ların internal yapısı
✅ Best practices

### Neden İkisi de Gerekli?

| combined.json | enrichment.json |
|---------------|-----------------|
| **Ne var?** (What) | **Nasıl kullanılır?** (How) |
| Prop adı, tipi, default | Prop'un internal yapısı, örnek değerler |
| Event isimleri | Event'in ne zaman fire olduğu |
| Script'le bulunabilir | Sadece experience ile bilinir |
| Tüm componentler için | Sadece complex componentler için |

---

## 🎯 Hangi Componentlerde Enrichment Gerekli?

### ✅ Enrichment Gerekli:

1. **Complex Object/Array propları olan componentler**
   - Örnek: `InDatePickerV2` (comparisonStatus, singleDatePickerStatus)
   - Örnek: `InButtonV2` (buttonGroupOptions, tooltipOptions)
   - Örnek: `InSelect` (options array)

2. **Yaygın hatalar yapılan componentler**
   - Örnek: `InDatePickerV2` (comparisonStatus + singleDatePickerStatus birlikte kullanılması)
   - Örnek: `InButtonV2` (loadingStatus reset edilmemesi)

3. **Validator'ları anlaşılması zor olanlar**
   - Enum referansları olan proplar
   - Object shape validation gerektiren proplar

### ❌ Enrichment Gereksiz:

1. **Sadece String/Boolean/Number propları olanlar**
   - Basit input componentleri
   - Minimal UI componentleri

2. **Self-explanatory olanlar**
   - Prop adı ve tipi yeterli
   - Yaygın hata yapılmayan componentler

---

## 🔧 Yeni Enrichment Oluşturma

### Yöntem 1: Enrichment-Maker Agent Kullanma (Önerilen)

**enrichment-maker agent** otomatik olarak enrichment dosyası oluşturur.

#### Kullanım:

Claude Code'da:
```
Use the enrichment-maker agent to create enrichment for InTooltipV2
```

#### Agent Ne Yapar?

1. ✅ Component metadata'yı combined.json'dan alır
2. ✅ Critical propları (Object/Array) belirler
3. ✅ Mevcut enrichment dosyalarından pattern öğrenir (InButtonV2, InDatePickerV2, InSelect)
4. ✅ `InTooltipV2.json` dosyası oluşturur:
   - valueFormat (structure, examples, typescript)
   - commonMistakes (severity levels)
   - bestPractices
   - Real-world usage examples

#### Agent Çıktısı:

```json
{
  "component": "InTooltipV2",
  "propEnrichments": {
    "tooltipOptions": {
      "valueFormat": {
        "structure": "TooltipOptions object",
        "objectShape": "{ id, dynamicPosition, staticPosition, ... }",
        "examples": [...],
        "typescript": "TooltipOptions"
      },
      "commonMistakes": [...]
    }
  },
  "commonMistakes": [...],
  "bestPractices": [...]
}
```

#### Agent'tan Sonra Yapılacaklar:

```bash
# 1. Enrichment dosyası oluşturuldu
# src/registry/enrichments/InTooltipV2.json

# 2. Combined dataset'e merge et
npm run extract:merge

# 3. MCP server'ı rebuild et
npm run build

# 4. Test et
npm start
```

---

### Yöntem 2: Manuel Oluşturma

Eğer agent kullanmak istemiyorsan, manuel olarak da oluşturabilirsin.

#### Template:

```json
{
  "component": "ComponentName",
  "propEnrichments": {
    "complexPropName": {
      "valueFormat": {
        "structure": "Type description",
        "objectShape": "{ key1: type1, key2: type2 }",
        "notes": "Additional usage notes",
        "examples": [
          {
            "scenario": "Common use case",
            "value": "example value",
            "code": "code snippet"
          }
        ],
        "typescript": "TypeScript type"
      },
      "relatedProps": ["prop1", "prop2"],
      "commonMistakes": [
        {
          "mistake": "What developers do wrong",
          "impact": "What happens",
          "fix": "How to fix it",
          "severity": "critical|high|medium|low"
        }
      ]
    }
  },
  "commonMistakes": [
    {
      "category": "prop-usage|prop-combination|state-management|event-handling",
      "severity": "critical|high|medium|low",
      "title": "Brief title",
      "description": "Detailed description",
      "wrong": "code example (wrong)",
      "correct": "code example (correct)",
      "impact": "What happens if not fixed"
    }
  ],
  "bestPractices": [
    {
      "title": "Practice title",
      "description": "Why this is important",
      "code": "code example",
      "benefit": "What you gain"
    }
  ],
  "eventEnrichments": {
    "eventName": {
      "when": "When this event fires",
      "payload": "Payload structure",
      "commonMistakes": [...]
    }
  }
}
```

#### Adım Adım:

1. **Mevcut enrichment'lara bak (pattern öğren):**
   ```bash
   cat InButtonV2.json
   cat InDatePickerV2.json
   cat InSelect.json
   ```

2. **Component'i incele:**
   ```bash
   # Combined.json'da component'e bak
   cat ../../data/combined.json | jq '.ComponentName'
   ```

3. **Critical propları belirle:**
   - Object/Array proplar
   - Validator'lı proplar
   - Yaygın hata yapılan proplar

4. **Enrichment dosyası oluştur:**
   ```bash
   vim ComponentName.json
   # Template'i kullan ve doldur
   ```

5. **Validate et:**
   ```bash
   # JSON syntax check
   cat ComponentName.json | jq .
   ```

6. **Merge ve build:**
   ```bash
   npm run extract:merge
   npm run build
   ```

---

## 📚 Enrichment Önceliklendirmesi

### Yüksek Öncelikli (Önce bunlar):

1. ✅ **InDatePickerV2** - Complex comparison logic
2. ✅ **InButtonV2** - buttonGroupOptions, multiple states
3. ✅ **InSelect** - options array, multiple modes
4. ⏳ **InMultiSelect** - Complex selection logic
5. ⏳ **InTooltipV2** - tooltipOptions object
6. ⏳ **InCheckboxV2** - State management
7. ⏳ **InModalV2** - modalOptions object
8. ⏳ **InDropdownMenu** - menuItems array

### Düşük Öncelikli (Basit componentler):

- InInput (simple string prop)
- InIcon (simple props)
- InBadge (simple props)

---

## 🎯 Enrichment Kalite Kriterleri

### İyi Bir Enrichment İçerir:

✅ **valueFormat** for complex props
- Structure açıklaması
- Object shape
- Real-world examples
- TypeScript type

✅ **commonMistakes** (en az 3-5 tane)
- Production'da görülen hatalar
- Severity levels (critical, high, medium, low)
- Before/after code examples
- Impact açıklaması

✅ **bestPractices** (en az 2-3 tane)
- Önerilen kullanım patterns
- Code examples
- Benefits açıklaması

✅ **relatedProps** linkler
- Birlikte kullanılan proplar
- Mutually exclusive proplar

---

## 🔄 Enrichment Workflow

```
1. Component seç
   ↓
2. Agent'ı çalıştır veya manuel oluştur
   ↓
3. Review et (production experience ekle)
   ↓
4. Extract & merge (npm run extract:merge)
   ↓
5. Build (npm run build)
   ↓
6. Test et (Claude Code ile dene)
   ↓
7. Commit
```

---

## 📖 Mevcut Enrichment Dosyaları

### ✅ Tamamlanmış:

| Component | Props Enriched | Common Mistakes | Best Practices | Status |
|-----------|----------------|-----------------|----------------|--------|
| InButtonV2 | 13 | 7 | 5 | ✅ Complete |
| InDatePickerV2 | 8 | 5 | 3 | ✅ Complete |
| InSelect | 5 | 4 | 2 | ✅ Complete |
| InMultiSelect | 4 | 3 | 2 | ✅ Complete |
| InDropdownMenu | 3 | 2 | 2 | ✅ Complete |

### ⏳ Yapılacak (Öncelik Sırasına Göre):

1. InTooltipV2
2. InCheckboxV2
3. InModalV2
4. InRadioButtonV2
5. InToggleV2

---

## 🚀 Hızlı Başlangıç

### Yeni Enrichment Eklemek İçin:

```bash
# 1. Agent kullan (önerilen)
# Claude Code'da:
# "Use enrichment-maker agent to create enrichment for InTooltipV2"

# 2. Merge et
cd /path/to/design-system-mcp
npm run extract:merge

# 3. Build et
npm run build

# 4. Test et
npm start
# Claude Code'da: "Get InTooltipV2 component details"
```

### Mevcut Enrichment'i Güncellemek İçin:

```bash
# 1. Dosyayı düzenle
vim InButtonV2.json

# 2. Validate et
cat InButtonV2.json | jq .

# 3. Merge et
npm run extract:merge

# 4. Build et
npm run build
```

---

## ❓ Sık Sorulan Sorular

### "Her component için enrichment gerekli mi?"
Hayır. Sadece complex propları olan veya yaygın hata yapılan componentler için.

### "Enrichment olmadan MCP çalışır mı?"
Evet, ama AI daha az faydalı cevaplar verir. Enrichment olmadan AI:
- Prop'un ne olduğunu bilir ama nasıl kullanılacağını bilmez
- Common mistakes gösteremez
- Best practices öneremez

### "Enrichment güncellemek gerekir mi?"
Evet, component değiştiğinde:
- Yeni prop eklendiyse → enrichment ekle
- Behavior değiştiyse → commonMistakes güncelle
- Breaking change varsa → migration guide ekle

### "Agent her zaman kullanılmalı mı?"
Hayır. Agent başlangıç için iyi, ama:
- Production experience manuel eklenmeli
- Real-world hatalar manuel eklenmeli
- Best practices gerçek kullanımdan gelir

---

## 📝 Notlar

- Enrichment dosyaları **combined.json'a merge edilir** (npm run extract:merge)
- MCP server **combined.json'u okur**, enrichment dosyalarını doğrudan değil
- Enrichment değişikliği → **merge + build gerektirir**
- **Version control:** Enrichment dosyaları git'te tutulmalı

---

## 🔗 İlgili Dosyalar

- **Agent Spec:** `../../.claude/agents/enrichment-maker.md`
- **Merge Script:** `../../scripts/merge-datasets.ts`
- **Combined Output:** `../../data/combined.json`
- **Examples:** `InButtonV2.json`, `InDatePickerV2.json`, `InSelect.json`

---

**Son Güncelleme:** 23 Kasım 2025
**Mevcut Enrichment Sayısı:** 5 component
**Hedef:** 25+ component (tüm V2 componentler)
