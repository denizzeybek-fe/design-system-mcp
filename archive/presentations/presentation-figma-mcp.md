# 🎨 Figma MCP + Design System MCP Integration

**Figma → Code Workflow için AI-Powered Çözüm**

---

## 📋 İçindekiler

1. [Mevcut Durum](#mevcut-durum)
2. [Sorun Analizi](#sorun-analizi)
3. [Figma MCP Nedir?](#figma-mcp-nedir)
4. [Entegrasyon Vizyonu](#entegrasyon-vizyonu)
5. [Teknik Mimari](#teknik-mimari)
6. [Feature Breakdown](#feature-breakdown)
7. [Implementation Roadmap](#implementation-roadmap)
8. [ROI & Impact](#roi--impact)

---

## 🎯 Mevcut Durum

### Design System MCP (Bizim)
✅ **Ne Var:**
- 62 Vue component metadata
- Props, events, slots documentation
- Code generation (generate-code tool)
- Basic Figma mapping (manuel)
- Enrichment system (common mistakes, best practices)
- Migration guides (V1→V2)

❌ **Ne Yok:**
- Figma dosyalarına gerçek erişim
- Otomatik Figma → DS component mapping
- Design token sync
- Real-time Figma değişiklik takibi

### Figma MCP (Anthropic Official)
✅ **Ne Var:**
- Figma API entegrasyonu
- Dosya okuma/yazma
- Component inspection
- Design token extraction
- Node hierarchy traversal

❌ **Ne Yok:**
- Design System specific bilgi
- Vue component knowledge
- Insider DS prop mapping
- Code generation

### Şu Anki Workflow (Manual)
```
1. Designer → Figma'da tasarım yapar
2. Designer → Figma comment ile developer'a bildirir
3. Developer → Figma'yı açar, bakarak component'i anlamaya çalışır
4. Developer → Hangi DS component kullanacağını tahmin eder
5. Developer → Props'ları manuel çıkarır
6. Developer → Code yazar
7. Developer → Designer'a review atar
8. Designer → Pixel-perfect check yapar
9. 🔄 Geri dönüş varsa başa dön
```

**Sorunlar:**
- 🐢 Yavaş (her component için 15-30 dakika)
- 🎲 Hata oranı yüksek (yanlış component, yanlış props)
- 😫 Manuel, tekrarlayan iş
- 🔄 Çok iteration gerekir

---

## 🔥 Sorun Analizi

### Problem #1: Design-to-Code Friction
**Scenario:**
```
Figma: Button/Primary/Large/With Icon/Loading
Developer: "Bu hangi component? InButton mı InButtonV2 mi?"
Developer: "variant ne olmalı? primary mi solid mi?"
Developer: "loading prop'u var mı?"
Developer: "icon nasıl eklerim?"
```

**Sonuç:** 30 dakika component araştırma + trial & error

### Problem #2: Design Token Mismatch
**Scenario:**
```
Figma: spacing-lg = 24px
CSS: --spacing-large = 32px (eski değer)
Developer: Figma'ya bakarak 24px kullanır
Designer: "Neden 32px değil?" (design system güncel değildi)
```

**Sonuç:** Inconsistency, re-work

### Problem #3: Component Prop Mapping
**Scenario:**
```
Figma:
  - Component: "Button"
  - Variant: "Primary"
  - State: "Disabled"
  - Has Icon: true
  - Icon Position: "left"

Developer ne yazmalı?
  <InButton ??? />  // Hangi proplar?
```

**Sonuç:** Documentation'a bakarak 10-15 dakika harcama

### Problem #4: Design Değişiklik Takibi
**Scenario:**
```
Designer: Button'un corner radius'unu 8px → 12px değiştirdim
Developer: (3 gün sonra fark eder)
Developer: Tüm button'ları günceller (50+ dosya)
```

**Sonuç:** Delayed implementation, inconsistency

---

## 🤖 Figma MCP Nedir?

Anthropic'in resmi Figma entegrasyonu. Claude'a Figma dosyalarını okuma/yazma yetkisi verir.

### Figma MCP Capabilities

```typescript
// 1. File Reading
figma.getFile(fileKey: string)
  → File metadata, pages, frames, components

// 2. Node Inspection
figma.getNode(nodeId: string)
  → Properties, styles, constraints

// 3. Component Analysis
figma.getComponents()
  → All components in file

// 4. Style Extraction
figma.getStyles()
  → Colors, typography, effects

// 5. Design Token Export
figma.getVariables()
  → Design tokens (Figma Variables API)
```

### Figma MCP ile Yapabileceklerimiz (Tek Başına)

✅ Figma dosyasını okuyabilir
✅ Component'leri listeler
✅ Style'ları extract eder
✅ Layout bilgisini alır

❌ Hangi DS component kullanılacağını bilmez
❌ Vue kodu generate edemez
❌ Insider DS props bilmez
❌ Common mistakes'leri gösteremez

---

## 🚀 Entegrasyon Vizyonu

### Hedef Workflow (AI-Powered)

```
1. Designer → Figma'da tasarım yapar
2. Designer → "Ready for dev" tag'i ekler
3. 🤖 AI → Figma MCP ile değişiklikleri algılar
4. 🤖 AI → DS MCP ile component mapping yapar
5. 🤖 AI → Vue kodu generate eder
6. 🤖 AI → PR oluşturur / developer'a önerir
7. Developer → Review eder, approve eder
8. ✅ Done (10 dakika vs 30 dakika)
```

**Kazanç:**
- ⚡ 3x daha hızlı implementation
- 🎯 %90+ doğruluk oranı
- 😊 Daha az frustration
- 🔄 Daha az iteration

---

## 🏗️ Teknik Mimari

### Mevcut Durum (2 Ayrı MCP)

```
┌─────────────────┐         ┌──────────────────┐
│  Figma MCP      │         │  DS MCP (Bizim)  │
├─────────────────┤         ├──────────────────┤
│ - Read Figma    │         │ - DS Components  │
│ - Get Styles    │         │ - Generate Code  │
│ - Extract Nodes │         │ - Enrichments    │
└─────────────────┘         └──────────────────┘
         ↓                           ↓
    ┌────────────────────────────────────┐
    │         Claude Code                │
    │  (Manuel olarak ikisini kullanır)  │
    └────────────────────────────────────┘
```

**Sorun:** Claude her seferinde iki MCP'yi ayrı ayrı çağırmalı, manuel mapping yapmalı.

### Hedef Durum (Entegre Workflow)

```
┌─────────────────────────────────────────────────────┐
│         Figma-DS Bridge (Yeni Katman)               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────┐        ┌──────────────────┐   │
│  │  Figma MCP      │◄──────►│  DS MCP (Bizim)  │   │
│  └─────────────────┘        └──────────────────┘   │
│           ↕                          ↕              │
│  ┌──────────────────────────────────────────────┐  │
│  │         Intelligent Mapper                   │  │
│  │  - Component matching (AI-powered)           │  │
│  │  - Prop extraction                           │  │
│  │  - Design token sync                         │  │
│  │  - Code generation                           │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
              ┌──────────────────┐
              │   Claude Code    │
              │  (Single call)   │
              └──────────────────┘
```

**Avantaj:** Claude tek bir tool call'la Figma → Code dönüşümü yapabilir.

---

## 🎨 Feature Breakdown

### Feature 1: Smart Component Mapping
**Problem:** Figma component → DS component mapping manuel

**Çözüm:**
```typescript
// Tool: figma-to-ds-component
Input: Figma node ID
Output: {
  dsComponent: "InButtonV2",
  confidence: 0.95,
  props: {
    variant: "primary",
    size: "lg",
    disabled: false,
    iconName: "arrow-right",
    iconPosition: "right"
  },
  reasoning: "Detected Button/Primary/Large variant with trailing icon"
}
```

**Mapping Algorithm:**
1. Figma component adını parse et (Button/Primary/Large)
2. DS component library'de ara
3. Variant/state/modifier'ları prop'lara çevir
4. Enrichment data ile validate et
5. Confidence score hesapla

**Example:**
```
Figma: "Button/Primary/Large/Disabled/With Icon"

AI Analysis:
  Component type: Button
  → DS Component: InButtonV2 (v2 preferred)

  Variant: Primary
  → variant="primary"

  Size: Large
  → size="lg"

  State: Disabled
  → disabled={true}

  Has Icon: true
  → iconStatus={true}
  → iconName="..." (extract from Figma icon name)

Generated Code:
<InButtonV2
  variant="primary"
  size="lg"
  disabled
  icon-status
  icon-name="arrow-right"
>
  Button Text
</InButtonV2>
```

---

### Feature 2: Design Token Sync
**Problem:** Figma design tokens ↔ CSS variables sync manuel

**Çözüm:**
```typescript
// Tool: sync-design-tokens
Input: Figma file key
Output: {
  tokens: {
    colors: {
      "primary-500": "#4F46E5",
      "gray-100": "#F3F4F6"
    },
    spacing: {
      "xs": "4px",
      "sm": "8px",
      "md": "16px"
    },
    typography: {
      "heading-1": {
        fontSize: "32px",
        fontWeight: 700,
        lineHeight: "40px"
      }
    }
  },
  diff: {
    changed: ["primary-500"],
    added: ["primary-400"],
    removed: []
  }
}
```

**Workflow:**
1. Figma Variables API'den token'ları çek
2. Mevcut CSS variables ile compare et
3. Diff oluştur
4. CSS dosyası güncelle (PR oluştur)

---

### Feature 3: Prop Extraction from Figma Properties
**Problem:** Figma properties → Vue props manuel mapping

**Çözüm:**
```typescript
// Figma Component Properties:
{
  "variant": "Primary",        // → variant="primary"
  "size": "Large",            // → size="lg"
  "disabled": false,          // → :disabled="false"
  "hasIcon": true,            // → :icon-status="true"
  "iconPosition": "Left"      // → icon-position="left"
}

// Auto-generated Vue props:
<InButtonV2
  variant="primary"
  size="lg"
  :disabled="false"
  icon-status
  icon-position="left"
/>
```

**Mapping Rules:**
- Boolean properties → Boolean props
- Enum properties → String props (lowercase)
- Number properties → Number props
- Text properties → String props

---

### Feature 4: Layout-to-Code Generation
**Problem:** Figma layout → Vue template structure

**Çözüm:**
```typescript
// Figma Frame:
Frame "User Card" {
  Direction: Vertical,
  Gap: 16px,
  Padding: 24px,
  Children: [
    Image (avatar),
    Text (name),
    Text (email),
    Button (edit)
  ]
}

// Generated Vue:
<div class="user-card" style="display: flex; flex-direction: column; gap: 16px; padding: 24px;">
  <img :src="avatar" alt="User avatar" />
  <h3>{{ name }}</h3>
  <p>{{ email }}</p>
  <InButtonV2 variant="primary">Edit Profile</InButtonV2>
</div>
```

**Layout Detection:**
- Auto-layout → Flexbox/Grid
- Constraints → CSS positioning
- Responsive variants → Media queries
- Component instances → DS component usage

---

### Feature 5: Real-time Change Detection
**Problem:** Figma değişikliklerini takip etmek zor

**Çözüm:**
```typescript
// Tool: watch-figma-changes
Input: {
  fileKey: "xyz",
  watchedNodes: ["node-id-1", "node-id-2"],
  onChangeCallback: handleFigmaChange
}

// Webhook/Polling:
Figma değişikliği algılandı:
  - Button/Primary color changed (#4F46E5 → #6366F1)
  - Spacing updated (16px → 20px)
  - New component added: "Alert/Success"

// Notification:
📢 Figma Update Detected:
  - 3 components modified
  - 1 new component
  - 2 design tokens changed

🤖 AI Suggestion:
  - Update InButtonV2 primary color
  - Regenerate spacing variables
  - Create new InAlert component

👉 Review changes? [Yes] [No]
```

---

### Feature 6: Figma Comment → Code Issue Mapping
**Problem:** Figma comment'leri ile kod arasında bağlantı yok

**Çözüm:**
```typescript
// Figma Comment:
"Button'un padding'i 12px olmalı, şu an 16px"

// AI Analysis:
1. Comment'i parse et
2. Button component'ini bul (Figma node)
3. Code'da karşılık gelen component'i bul
4. GitHub issue oluştur / direkt düzelt

// GitHub Issue:
Title: "Fix button padding (Figma feedback)"
Body:
  Designer feedback from Figma:
  "Button'un padding'i 12px olmalı, şu an 16px"

  Figma Link: [link]
  Affected Component: InButtonV2
  File: src/components/UserProfile.vue:42

  Suggested Fix:
  - Change padding from 16px to 12px
  - Update design token: --button-padding-md
```

---

### Feature 7: Design QA Automation
**Problem:** Pixel-perfect check manuel

**Çözüm:**
```typescript
// Tool: validate-implementation
Input: {
  figmaNodeId: "node-123",
  implementedCode: "<InButtonV2 variant='primary' size='lg'>Click me</InButtonV2>"
}

Output: {
  matches: true,
  confidence: 0.92,
  issues: [
    {
      type: "spacing",
      expected: "16px",
      actual: "12px",
      severity: "medium",
      suggestion: "Update padding to match Figma"
    }
  ]
}
```

**Validation Checks:**
- ✅ Doğru component kullanıldı mı?
- ✅ Props doğru mu?
- ✅ Spacing matched mı?
- ✅ Colors matched mı?
- ✅ Typography matched mı?

---

### Feature 8: Bi-directional Sync
**Problem:** DS'de yapılan değişiklikler Figma'ya yansımıyor

**Çözüm:**
```typescript
// Code Change:
InButtonV2 → new prop: "rounded" added

// Figma Sync:
🔄 Syncing to Figma...
  - Added "rounded" property to Button component
  - Updated component variants
  - Notified designers via Figma comment

✅ Figma updated successfully
📢 3 designers notified
```

---

## 🛠️ Implementation Roadmap

### Phase 1: Foundation (1-2 ay)
**Goal:** Basic Figma → DS component mapping

**Tasks:**
- [ ] Figma MCP setup & authentication
- [ ] Component name parser (Button/Primary/Large → structure)
- [ ] Basic mapping logic (Figma component → DS component)
- [ ] Simple prop extraction
- [ ] Code generation integration

**Deliverable:**
```typescript
// Tool: figma-to-code (MVP)
Input: Figma node ID
Output: Vue code with DS component
```

**Success Metric:** %70+ accuracy for simple components (Button, Input)

---

### Phase 2: Smart Mapping (2-3 ay)
**Goal:** AI-powered intelligent mapping

**Tasks:**
- [ ] AI model training (component matching)
- [ ] Confidence scoring
- [ ] Enrichment data integration
- [ ] Multi-variant support (Primary/Large/Disabled)
- [ ] Icon mapping

**Deliverable:**
```typescript
// Enhanced tool with AI
Input: Figma node ID
Output: {
  code: "...",
  confidence: 0.95,
  alternatives: [...],
  reasoning: "..."
}
```

**Success Metric:** %90+ accuracy, %95+ for common components

---

### Phase 3: Design Token Sync (1-2 ay)
**Goal:** Otomatik design token sync

**Tasks:**
- [ ] Figma Variables API integration
- [ ] CSS variable extraction
- [ ] Diff detection
- [ ] Auto-PR generation
- [ ] Token validation

**Deliverable:**
```bash
# CLI tool
ds-sync tokens --figma-file xyz
  → Synced 42 tokens
  → 3 changed, 2 added
  → PR created: #1234
```

**Success Metric:** Zero manual token updates

---

### Phase 4: Real-time Monitoring (2-3 ay)
**Goal:** Figma değişiklik takibi

**Tasks:**
- [ ] Webhook setup (Figma → Server)
- [ ] Change detection algorithm
- [ ] Notification system
- [ ] Auto-regeneration
- [ ] Developer approval flow

**Deliverable:**
```
Figma Update Alert:
  - Component: Button/Primary
  - Change: Color updated
  - Affected files: 12
  - Action: [Auto-update] [Review] [Ignore]
```

**Success Metric:** <1 hour delay for design changes

---

### Phase 5: Layout Generation (3-4 ay)
**Goal:** Full page layout generation

**Tasks:**
- [ ] Auto-layout parsing
- [ ] Flexbox/Grid generation
- [ ] Responsive breakpoints
- [ ] Component composition
- [ ] State management suggestions

**Deliverable:**
```
Input: Figma page
Output: Complete Vue page with:
  - Layout structure
  - Component instances
  - Responsive design
  - Suggested data bindings
```

**Success Metric:** %80+ layout accuracy

---

### Phase 6: Bi-directional Sync (4-6 ay)
**Goal:** DS ↔ Figma sync

**Tasks:**
- [ ] Code → Figma API
- [ ] Component creation in Figma
- [ ] Property sync
- [ ] Version control integration
- [ ] Designer notification system

**Deliverable:**
```
DS Component Update → Figma Update
  - New prop added
  - Figma component updated
  - Designers notified
  - Documentation synced
```

**Success Metric:** 100% DS → Figma coverage

---

## 💰 ROI & Impact

### Time Savings (Per Component)

**Before (Manual):**
```
1. Figma'yı aç ve incele: 5 min
2. Hangi DS component?: 5 min
3. Documentation'a bak: 10 min
4. Code yaz: 10 min
5. Test et: 5 min
6. Designer review: 10 min
7. Iteration (ortalama 2x): 20 min
────────────────────────────────
Total: ~65 min per component
```

**After (AI-Powered):**
```
1. Figma node ID'yi ver: 30 sec
2. AI kod generate eder: 10 sec
3. Review & approve: 5 min
4. Test et: 5 min
────────────────────────────────
Total: ~10 min per component
```

**Kazanç:** 55 min per component (85% time reduction)

### Scale Impact

**Scenario:** Ortalama sprint'te 20 component implementation

**Before:**
```
20 components × 65 min = 1,300 min (~22 hours)
2-3 developer = 1 week
```

**After:**
```
20 components × 10 min = 200 min (~3.5 hours)
1 developer = Half day
```

**Team Impact (Annual):**
- 50 sprints/year
- 1,000 components/year
- **55,000 minutes saved** (~917 hours)
- **~23 weeks of developer time** saved

**Cost Savings:**
- Developer time: ~€100,000/year
- Faster delivery: Increased revenue
- Better quality: Reduced bugs/rework

---

### Quality Improvements

**Before:**
- ⚠️ %30 component mismatch rate
- ⚠️ %40 prop error rate
- ⚠️ %50 design token mismatch
- 😫 3-4 iteration ortalama

**After:**
- ✅ %95+ component accuracy
- ✅ %90+ prop accuracy
- ✅ %100 design token accuracy (otomatik sync)
- 😊 1-2 iteration (çoğu sadece review)

---

### Developer Experience

**Before:**
```
Developer: "Figma'da 30 dakika harcadım,
            hangi component olduğunu anlamaya çalıştım.
            Sonra documentation'a baktım.
            Yine yanlış prop kullanmışım.
            Designer reddetti, yeniden yapıyorum."

😫 Frustration Level: 8/10
```

**After:**
```
Developer: "AI bana doğru component'i ve
            tüm propları verdi.
            5 dakikada review edip approve ettim.
            Designer da approve etti, done!"

😊 Happiness Level: 9/10
```

---

### Designer Experience

**Before:**
```
Designer: "Developer yanlış component kullanmış,
           spacing'ler yanlış,
           color'lar match etmiyor.
           3. kez geri gönderdim."

😫 Frustration Level: 9/10
```

**After:**
```
Designer: "Kod Figma'ya %95 uygun.
           Sadece minor feedback verdim.
           1 iteration'da bitti!"

😊 Happiness Level: 9/10
```

---

## 🎯 Success Metrics

### Phase 1 (Foundation)
- [ ] %70+ component matching accuracy
- [ ] <5 min average generation time
- [ ] Support for 10+ DS components

### Phase 2 (Smart Mapping)
- [ ] %90+ component matching accuracy
- [ ] %85+ prop accuracy
- [ ] Confidence scoring implemented

### Phase 3 (Design Tokens)
- [ ] 100% token coverage
- [ ] <1 hour sync delay
- [ ] Zero manual token updates

### Phase 4 (Real-time)
- [ ] <1 hour change detection
- [ ] Auto-regeneration working
- [ ] Developer approval flow

### Phase 5 (Layout)
- [ ] %80+ layout accuracy
- [ ] Full page generation
- [ ] Responsive support

### Phase 6 (Bi-directional)
- [ ] DS → Figma sync working
- [ ] Designer notifications
- [ ] 100% component coverage

---

## 🔧 Technical Requirements

### Infrastructure
- [ ] Figma API access (OAuth token)
- [ ] Webhook server (for real-time updates)
- [ ] AI model hosting (component matching)
- [ ] Database (mapping cache, history)
- [ ] Queue system (background jobs)

### Integrations
- [ ] Figma MCP (Anthropic official)
- [ ] DS MCP (bizim)
- [ ] GitHub API (PR creation)
- [ ] Slack/Teams (notifications)
- [ ] CI/CD (auto-deployment)

### Security
- [ ] Figma API token management
- [ ] Access control (who can sync)
- [ ] Audit logging
- [ ] Rate limiting

---

## 📚 Reference Materials

### Figma API Documentation
- [Figma REST API](https://www.figma.com/developers/api)
- [Figma Variables API](https://www.figma.com/developers/api#variables)
- [Figma Webhooks](https://www.figma.com/developers/api#webhooks)

### Anthropic MCP
- [Figma MCP Server](https://github.com/anthropics/mcp-servers/tree/main/figma)
- [MCP Protocol Spec](https://modelcontextprotocol.io/docs/specification)

### Design Systems
- [Insider Design System Docs](https://design.useinsider.com)
- [Design Tokens Spec](https://design-tokens.github.io/community-group/)

---

## 🚀 Next Steps

### Immediate (This Week)
1. [ ] Figma MCP setup & test
2. [ ] Access token alınması
3. [ ] Basic component reading demo
4. [ ] Proof of concept: Single button mapping

### Short-term (This Month)
1. [ ] Component name parser implementation
2. [ ] Basic mapping algorithm
3. [ ] Code generation integration
4. [ ] 5-10 component support

### Medium-term (This Quarter)
1. [ ] AI-powered mapping
2. [ ] Design token sync MVP
3. [ ] Developer testing & feedback
4. [ ] 30+ component support

---

## ❓ FAQ

### Q: Figma MCP zaten varsa neden yeni tool gerekiyor?
**A:** Figma MCP generic - tüm Figma dosyaları için. Bizim tool Insider DS specific - component mapping, prop extraction, enrichment data integration.

### Q: AI training gerekiyor mu?
**A:** Başlangıç için rule-based (Button/Primary → variant="primary"). Daha sonra AI fine-tuning ile accuracy artırılır.

### Q: Designer'lar Figma'da değişiklik yapınca otomatik code mu değişir?
**A:** Hayır, safety için developer approval gerekir. AI öneri yapar, developer approve eder.

### Q: Tüm Figma component'leri map edilebilir mi?
**A:** Hayır, sadece DS component'leri. Custom Figma component'leri için "closest match" önerilir.

### Q: Performance impact?
**A:** Minimal. Background job'lar async çalışır. Developer'ı bloklamaz.

### Q: Mevcut code'a etkisi?
**A:** Yok. Sadece yeni component'ler için kullanılır. Mevcut kod değişmez.

---

## 📊 Appendix: Comparison Matrix

| Feature | Manuel | Figma MCP Only | DS MCP Only | **Entegre Çözüm** |
|---------|--------|----------------|-------------|-------------------|
| Component Mapping | ❌ Manuel | 🟡 Generic | 🟡 Yarı-otomatik | ✅ Tam otomatik |
| Prop Extraction | ❌ Manuel | 🟡 Figma props | ✅ DS props | ✅ Tam otomatik |
| Code Generation | ❌ Manuel | ❌ Yok | 🟡 Template | ✅ Smart generation |
| Design Token Sync | ❌ Manuel | 🟡 Export only | ❌ Yok | ✅ Bi-directional |
| Change Detection | ❌ Manuel | 🟡 Webhook | ❌ Yok | ✅ Real-time |
| Validation | ❌ Manuel | ❌ Yok | 🟡 Props only | ✅ Full validation |
| Time per component | 65 min | 30 min | 20 min | **10 min** |
| Accuracy | %60 | %70 | %80 | **%95** |
| Developer happiness | 😫 | 🙂 | 😊 | **🤩** |

---

## 🎨 Figma Naming Convention Recommendations

### 📸 Actual Figma Component Analysis

Gerçek Figma component'lerini inceledik (InButtonV2, InOnPageMessage). İşte bulgular:

#### ✅ İyi Taraflar (Keep These!)

1. **Consistent Boolean Pattern:**
   ```
   Loading Status → loadingStatus ✅
   Disabled Status → disabledStatus ✅ (Not just "Disabled")
   Title Status → titleStatus ✅
   Icon Status → iconStatus ✅
   ```
   **Why good:** AI otomatik map ediyor, override gerekmez.

2. **Text Properties with " Text" Suffix:**
   ```
   Label Text → labelText ✅
   Title Text → titleText ✅
   Description Text → descriptionText ✅
   ```
   **Why good:** Convention match %100, zero override.

3. **Common Props Exact Match:**
   ```
   Type → type ✅
   Size → size ✅
   ```
   **Why good:** Standard prop names, herkes biliyor.

4. **State Props Ayrılmış:**
   ```
   Hover, Pressed, Selected → Preview only
   ```
   **Why good:** AI bunları skip ediyor, gereksiz kod yok.

---

#### ⚠️ İyileştirme Alanları

1. **"Label" vs "Label Text" Inconsistency**

   **Mevcut:**
   ```
   InButtonV2:
     Label → labelText (override gerekli!)
     Label Status → labelStatus ✅ (convention match)
   ```

   **Öneri:**
   ```
   Label Text → labelText ✅ (convention match)
   Label Status → labelStatus ✅ (zaten doğru)
   ```

   **Impact:** 1 override azaltır, convention compliance %5 artar.

2. **"Style" vs "styling" Mismatch**

   **Mevcut:**
   ```
   InButtonV2:
     Style → styling (override gerekli!)
   ```

   **Öneri:**
   ```
   Option A: Style → style (convention match, DS'de "styling" → "style" rename)
   Option B: Styling → styling (Figma'da "Styling" kullan)
   ```

   **Impact:** 1 override azaltır veya DS'de prop name refactor.

3. **Icon Name Property Eksik**

   **Mevcut:**
   ```
   InButtonV2:
     Right Icon Status: True/False
     ??? Icon Name yoksa nasıl gösterilecek?
   ```

   **Öneri:**
   ```
   Right Icon Status → rightIconStatus
   Right Icon Name → rightIconName (YENİ!)

   // Ya da:
   Icon Name → iconName (tek property, status ayrı)
   Icon Position → iconPosition (left/right)
   ```

   **Impact:** Icon component'leri proper implement edilebilir.

---

### 📋 Design Team Action Items

#### Immediate (Bu Sprint):

- [ ] **InButtonV2 Component Güncelle:**
  - [ ] "Label" → "Label Text" rename
  - [ ] "Right Icon Name" property ekle
  - [ ] "Left Icon Name" property ekle
  - [ ] Test et: Figma → MCP → Code

- [ ] **Component Description Şablonu Ekle:**
  ```
  🎨 Design System Component: InButtonV2
  📚 Documentation: https://design.useinsider.com/InButtonV2
  📖 Storybook: InButtonV2
  🤖 MCP Mapping: Supported
  ⚠️ DO NOT DETACH!
  ```

#### Short-term (Bu Ay):

- [ ] **Tüm V2 Component'leri Review Et:**
  - [ ] InDatePickerV2
  - [ ] InSelect
  - [ ] InTooltipV2
  - [ ] InCheckBoxV2
  - [ ] InMultiSelect

- [ ] **Naming Convention Document:**
  - [ ] [FIGMA_DESIGN_GUIDELINES.md](./FIGMA_DESIGN_GUIDELINES.md) okuyun
  - [ ] Convention'a uymayan component'leri listeleyin
  - [ ] Migration plan oluşturun

#### Long-term (Bu Çeyrek):

- [ ] **Figma Variables → Design Tokens:**
  - [ ] Tüm color'ları Figma Variables'a taşı
  - [ ] Spacing'leri Figma Variables'a taşı
  - [ ] Typography'yi Figma Variables'a taşı

- [ ] **Component Variant Standardization:**
  - [ ] Enum values consistent (Primary, Secondary, Danger)
  - [ ] Size values consistent (Small, Medium, Large)
  - [ ] Multi-word values (Subtle Primary, Subtle Smart)

---

### 🎯 Convention Adoption Metrics

| Metric | Current | Target (3 mo) |
|--------|---------|---------------|
| Properties following convention | %85 | %95+ |
| Components with description | %30 | %100 |
| Override per component | 2.5 avg | <1 avg |
| Figma → Code accuracy | %70 | %95+ |
| Time per component | 30 min | 10 min |

---

### 💬 Design Team Feedback Template

**Figma Component Review Form:**

```markdown
Component: ___________
Review Date: ___________

✅ Checklist:
- [ ] All text properties have " Text" suffix
- [ ] All boolean properties have " Status" suffix
- [ ] Enum values are Capitalized (not lowercase/CAPS)
- [ ] No camelCase property names
- [ ] No underscore in property names
- [ ] Component description includes DS name
- [ ] Storybook link included
- [ ] Icon properties complete (name + status)
- [ ] State props (Hover, Pressed) in separate group

Override Count: ___
Convention Compliance: ___%

Notes:
___________________________________________
```

---

### 📚 Reference: Convention Rules

**Quick Reference Card for Designers:**

```
✅ DO:
  Label Text → labelText
  Loading Status → loadingStatus
  Type: Primary → type="primary"
  Size: Medium → size="medium"

❌ DON'T:
  labelText → (use spaces!)
  label_text → (no underscores!)
  Loading → (add "Status"!)
  Type: primary → (capitalize!)
```

**Detailed Guide:** [FIGMA_DESIGN_GUIDELINES.md](./FIGMA_DESIGN_GUIDELINES.md)

---

### 🤝 Designer-Developer Sync

**Weekly Sync Topics:**

1. New component designs → Convention review
2. Property naming conflicts → Resolution
3. Override count trend → Improvement actions
4. Mapping accuracy feedback → Convention updates
5. MCP feature requests → Prioritization

**Monthly Review:**

1. Convention compliance metrics
2. Override elimination progress
3. Time-to-code improvements
4. Designer satisfaction survey
5. Convention updates (if needed)

---

## 📊 Real-World Comparison

### InButtonV2 (Needs Minor Fixes)

**Figma Properties:**
```
Label → labelText (override needed)
Style → styling (override needed)
Type → type ✅
Size → size ✅
Disabled Status → disabledStatus ✅ (but convention suggests "Disabled Status")
Loading Status → loadingStatus ✅
Label Status → labelStatus ✅
```

**Override Count:** 2
**Convention Compliance:** 85%
**Fix Effort:** 5 minutes (rename 2 properties)

---

### InOnPageMessage (Perfect!)

**Figma Properties:**
```
Type → type ✅
Size → size ✅
Link Button → linkButtonStatus ✅ (AI adds "Status")
Title Status → titleStatus ✅
Title Text → titleText ✅
Description Text → descriptionText ✅
Content Slot Status → contentSlotStatus ✅
```

**Override Count:** 0 🎉
**Convention Compliance:** 100% ✅
**Fix Effort:** 0 minutes

**Key Success Factors:**
- All text properties have " Text" suffix
- All boolean properties have " Status" suffix
- No custom naming (Type, Size)
- Capitalized enum values

---

**Son Güncelleme:** 24 Kasım 2025
**Durum:** Planning & Design Phase
**Sonraki Review:** Aralık 2025
**Owner:** Frontend Team + Design System Team
**Stakeholders:** Designers, Frontend Developers, Product

**New Deliverables:**
- ✅ [FIGMA_DESIGN_GUIDELINES.md](./FIGMA_DESIGN_GUIDELINES.md) - Designer reference
- ✅ [figma-property-mapper.ts](./src/utils/figma-property-mapper.ts) - Generic mapper
- ✅ InButtonV2 enrichment with figmaMapping
- ✅ InOnPageMessage enrichment example (zero overrides)
