# 🎨 Figma Design Guidelines for MCP Integration

**Design System Team için Figma Component Naming & Property Conventions**

---

## 🎯 Amaç

Figma component'lerini Design System MCP ile %100 uyumlu hale getirmek için **convention-based naming** kullanıyoruz. Bu sayede:
- ✅ AI otomatik olarak Figma → Code mapping yapabilir
- ✅ Manuel override ihtiyacı minimize olur
- ✅ Yeni component'ler eklendiğinde otomatik çalışır
- ✅ Designer-Developer workflow hızlanır

---

## 📋 Property Naming Conventions

### ✅ **Convention 1: Common Props (Exact Match)**

Bazı prop isimleri standart - aynen kullanın:

| Figma Property | DS Prop | Example Value |
|----------------|---------|---------------|
| `Type` | `type` | "Primary", "Secondary" |
| `Size` | `size` | "Small", "Medium", "Large" |
| `ID` | `id` | "button-1" |
| `Name` | `name` | "submitButton" |
| `Value` | `value` | "Submit" |

**Rule:** Lowercase yapılır, aynen kullanılır.

---

### ✅ **Convention 2: Text Properties**

Text içeren property'ler `xxx Text` formatında olmalı:

| Figma Property | DS Prop | Example |
|----------------|---------|---------|
| `Label Text` | `labelText` | "Export" |
| `Title Text` | `titleText` | "Your title goes here" |
| `Description Text` | `descriptionText` | "Your message" |
| `Placeholder Text` | `placeholderText` | "Enter text..." |
| `Helper Text` | `helperText` | "Min 8 characters" |
| `Button Text` | `buttonText` | "Click me" |

**Rule:** Boşluk bırakın, "Text" suffix ekleyin. → `camelCase + Text`

**✅ Good:**
```
Title Text → titleText ✓
Description Text → descriptionText ✓
Button Text → buttonText ✓
```

**❌ Bad:**
```
title → title (Text eksik!)
TitleText → titleText (Boşluk yok!)
Title_Text → titleText (Underscore kullanma!)
```

---

### ✅ **Convention 3: Status/Boolean Properties**

Boolean property'ler `xxx Status` formatında olmalı:

| Figma Property | DS Prop | Type |
|----------------|---------|------|
| `Loading Status` | `loadingStatus` | Boolean |
| `Disabled Status` | `disabledStatus` | Boolean |
| `Success Status` | `successStatus` | Boolean |
| `Label Status` | `labelStatus` | Boolean |
| `Icon Status` | `iconStatus` | Boolean |
| `Right Icon Status` | `rightIconStatus` | Boolean |

**Rule:** Boolean prop'lar `xxx Status` olmalı. → `camelCase + Status`

**✅ Good:**
```
Loading Status → loadingStatus ✓
Disabled Status → disabledStatus ✓
Icon Status → iconStatus ✓
```

**❌ Bad:**
```
Loading → loadingStatus (AI otomatik "Status" ekler ama convention bozar)
isLoading → loadingStatus (Figma'da "is" prefix kullanma!)
loading_status → loadingStatus (Underscore kullanma!)
```

**Special Case:** Boolean prop ama "Status" suffix olmadan:
```
Disabled → disableStatus (AI otomatik ekler)
```
Ama convention için `Disabled Status` kullanın.

---

### ✅ **Convention 4: Enum Properties (Capitalized Values)**

Enum değerleri Figma'da **Capitalized**, code'da **lowercase**:

| Figma Value | DS Value |
|-------------|----------|
| `Solid` | `"solid"` |
| `Ghost` | `"ghost"` |
| `Primary` | `"primary"` |
| `Secondary` | `"secondary"` |
| `Small` | `"small"` |
| `Medium` | `"medium"` |
| `Large` | `"large"` |

**Rule:** Figma'da first letter uppercase, code'da lowercase.

**Multi-word Enums:**
```
Figma: "Subtle Primary"
DS: "subtle-primary"

Figma: "Right Icon"
DS: "right-icon"
```

**✅ Good:**
```
Type: Primary → type="primary" ✓
Style: Solid → styling="solid" ✓
Size: Medium → size="medium" ✓
```

**❌ Bad:**
```
Type: primary → (Figma'da lowercase kullanma!)
Type: PRIMARY → (All caps kullanma!)
Type: Primary_Button → (Underscore kullanma!)
```

---

## 🚨 State Props (Preview Only)

Bazı boolean prop'lar sadece Figma **preview** için kullanılır, code'a dahil edilmez:

| State Prop | Purpose | Include in Code? |
|------------|---------|------------------|
| `Hover` | Hover state preview | ❌ No |
| `Pressed` | Pressed state preview | ❌ No |
| `Selected` | Selected state preview | ❌ No |
| `Focus` | Focus state preview | ❌ No |

**Note:** AI bu prop'ları otomatik skip eder (code generation'da kullanılmaz).

**Real Implementation Props:**
```
✅ Disabled Status → User interaction control
✅ Loading Status → Dynamic state
✅ Success Status → Feedback state
```

---

## 📊 Real Examples

### Example 1: InButtonV2 (✅ Good)

```
Figma Component: InButtonV2

Properties:
  Label Text: "Export"           → labelText="Export"
  Style: Solid                   → styling="solid"
  Type: Secondary                → type="secondary"
  Size: Default                  → size="default"
  Disabled Status: False         → :disabledStatus="false"
  Loading Status: False          → :loadingStatus="false"
  Success Status: False          → :successStatus="false"
  Label Status: True             → :labelStatus="true"
  Right Icon Status: False       → :rightIconStatus="false"
  Left Icon Status: False        → :leftIconStatus="false"

  // State props (Figma preview only):
  Hover: False                   → (skipped in code)
  Pressed: False                 → (skipped in code)
  Selected: False                → (skipped in code)
```

**Generated Code:**
```vue
<InButtonV2
  label-text="Export"
  styling="solid"
  type="secondary"
  size="default"
  label-status
/>
```

**Override Needed:** 2 props (`Label` → `labelText`, `Style` → `styling`)

---

### Example 2: InOnPageMessage (✅ Perfect - No Overrides!)

```
Figma Component: InOnPageMessage

Properties:
  Type: Error                    → type="error"
  Size: Medium                   → size="medium"
  Link Button: False             → :linkButtonStatus="false"
  Title Status: True             → :titleStatus="true"
  Title Text: "Your title..."    → titleText="Your title..."
  Description Text: "Your msg"   → descriptionText="Your msg"
  Content Slot Status: False     → :contentSlotStatus="false"
```

**Generated Code:**
```vue
<InOnPageMessage
  type="error"
  size="medium"
  title-status
  title-text="Your title goes here"
  description-text="Your message goes here"
/>
```

**Override Needed:** 0 props! ✅ Perfect convention match!

---

## 🎯 Naming Convention Checklist

Yeni Figma component oluştururken:

- [ ] **Common props** (Type, Size, ID) → Exact match kullan
- [ ] **Text properties** → `xxx Text` format (boşluk bırak)
- [ ] **Boolean props** → `xxx Status` format (boşluk bırak)
- [ ] **Enum values** → Capitalized (Solid, Primary, Medium)
- [ ] **Multi-word enums** → "Subtle Primary" (boşluklu)
- [ ] **State props** → Ayrı grupla (Hover, Pressed, Selected)
- [ ] **Avoid:** Underscore, camelCase in Figma, all caps

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: camelCase in Figma
```
❌ labelText (Figma'da camelCase kullanma!)
✅ Label Text (Boşluklu yaz)
```

### ❌ Mistake 2: Underscore
```
❌ title_text (Underscore kullanma!)
✅ Title Text (Boşluklu yaz)
```

### ❌ Mistake 3: Missing "Text" or "Status"
```
❌ Label (Text eksik!)
✅ Label Text

❌ Loading (Status eksik!)
✅ Loading Status
```

### ❌ Mistake 4: Lowercase Enum Values
```
❌ Type: primary (Figma'da lowercase!)
✅ Type: Primary
```

### ❌ Mistake 5: All Caps
```
❌ Type: PRIMARY (All caps kullanma!)
✅ Type: Primary
```

---

## 🔧 Override Gerektiğinde

Bazı durumlarda convention'dan sapmanız gerekebilir (eski component'ler, özel durumlar). Bu durumda override kullanıyoruz:

**InButtonV2 Example:**
```json
{
  "figmaMapping": {
    "propertyOverrides": {
      "Label": "labelText",    // Convention: "label" → Override: "labelText"
      "Style": "styling"       // Convention: "style" → Override: "styling"
    }
  }
}
```

**Note:** Override minimize etmeye çalışın. Convention'a uymak daha iyi.

---

## 📚 Property Type Patterns

### String Properties
```
Label Text → string
Title Text → string
Description Text → string
Placeholder Text → string
```

### Enum Properties
```
Type → enum (Primary, Secondary, Danger)
Size → enum (Small, Medium, Large)
Style → enum (Solid, Ghost, Text)
```

### Boolean Properties
```
Disabled Status → boolean
Loading Status → boolean
Icon Status → boolean
Label Status → boolean
```

### Number Properties
```
Width → number
Height → number
Max Length → number
```

---

## 🎨 Component Property Organization

Figma'da property'leri bu sırayla organize edin:

```
1. Text Properties
   - Label Text
   - Title Text
   - Description Text

2. Enum Properties
   - Type
   - Style
   - Size

3. Boolean Features
   - Icon Status
   - Label Status
   - Link Button Status

4. Boolean States
   - Disabled Status
   - Loading Status
   - Success Status

5. State Props (Preview Only)
   - Hover
   - Pressed
   - Selected
```

**Benefit:** Developers Figma panel'de kolayca bulur.

---

## 🚀 Before/After Example

### ❌ Before (Convention'suz)

```
Figma Component: Button

Properties:
  label: "Click me"              → ??? (label? labelText?)
  buttonType: "primary"          → ??? (buttonType? type?)
  isDisabled: false              → ??? (isDisabled? disabled? disabledStatus?)
  size: "md"                     → ??? (md? medium?)
  ShowIcon: true                 → ??? (ShowIcon? iconStatus? showIcon?)
```

**Problems:**
- Property names don't match DS
- Enum values inconsistent (md vs medium)
- Boolean naming unclear (isDisabled vs disabled)
- Requires 5+ overrides

---

### ✅ After (Convention-based)

```
Figma Component: InButton

Properties:
  Label Text: "Click me"         → labelText="Click me"
  Type: Primary                  → type="primary"
  Size: Medium                   → size="medium"
  Disabled Status: False         → :disabledStatus="false"
  Icon Status: True              → :iconStatus="true"
```

**Benefits:**
- Clear, consistent naming
- AI auto-maps %95 properties
- Only 1-2 overrides needed (Label Text, if any)
- New components work immediately

---

## 📋 Migration Guide (Eski Component'ler)

Mevcut Figma component'lerinizi güncellemek için:

1. **Property ismini kontrol et**
   - camelCase → Space-separated
   - Underscore → Space-separated
   - Eksik suffix → Ekle (Text, Status)

2. **Enum değerlerini düzelt**
   - lowercase → Capitalized
   - ALL CAPS → Capitalized
   - Abbreviations → Full words (md → Medium)

3. **Boolean prop'ları grupla**
   - Feature toggles (Icon Status, Label Status)
   - State props (Disabled Status, Loading Status)
   - Preview props (Hover, Pressed, Selected)

4. **Test et**
   - MCP tools ile mapping test et
   - Generated code kontrol et
   - Override gerekiyorsa ekle

---

## 🤝 Designer-Developer Collaboration

### Designer Sorumlulukları:
- ✅ Convention'a uygun property isimleri
- ✅ Consistent enum values (Capitalized)
- ✅ Boolean props "xxx Status" formatında
- ✅ Component description'ında DS component name
- ✅ Storybook link ekle

### Developer Sorumlulukları:
- ✅ Enrichment dosyalarında Figma mapping tanımla
- ✅ Override'ları minimize et
- ✅ Convention'a uymayan durumlarda designer'a feedback ver
- ✅ Yeni pattern görünce convention'ı güncelle

---

## 📝 Component Description Template

Her Figma component'inde şu description'ı kullanın:

```
🎨 Design System Component: InButtonV2
📚 Documentation: https://design.useinsider.com/InButtonV2
📖 Storybook: InButtonV2
🤖 MCP Mapping: Supported
⚠️ DO NOT DETACH!

Usage Notes:
- Use for primary, secondary, and tertiary actions
- Supports icons, loading states, and success feedback
- See documentation for full prop list
```

**Benefits:**
- Developer'lar hemen DS component'ini bulur
- Documentation link tek tıkla erişilebilir
- MCP support durumu açık

---

## 🎯 Success Metrics

Convention adoption için hedefler:

- [ ] **%90+ properties** follow convention (no override needed)
- [ ] **%95+ components** have description with DS name
- [ ] **Zero** camelCase property names in Figma
- [ ] **Zero** underscore property names in Figma
- [ ] **All** enum values capitalized
- [ ] **All** boolean props have "Status" suffix

---

## 📞 Support

Convention konusunda sorularınız varsa:

- **Design System Team:** #design-system-team
- **MCP Documentation:** /PRESENTATION_FIGMA_MCP.md
- **Generic Mapper:** /src/utils/figma-property-mapper.ts
- **Enrichment Examples:** /src/registry/enrichments/

---

**Son Güncelleme:** 24 Kasım 2025
**Owners:** Design System Team + Frontend Team
**Status:** Active - Tüm yeni component'lerde kullanılmalı
