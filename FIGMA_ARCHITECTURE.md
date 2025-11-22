# Figma Integration Architecture

Bu doküman, Figma-to-Code entegrasyonunun teknik mimarisini ve çalışma mantığını detaylıca açıklar.

## 🏗️ Genel Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                     Figma Design                            │
│  (Components with Properties & Variants)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ Export Frame Data (JSON)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              MCP Server (Claude Code)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MCP Tools (figma-tools.ts)                         │   │
│  │  - convert-figma-to-vue                             │   │
│  │  - validate-figma-component                         │   │
│  │  - list-figma-mappings                              │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   ↓                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Conversion Service (figma-converter.ts)            │   │
│  │  - Parse node tree                                  │   │
│  │  - Find mappings                                    │   │
│  │  - Transform props                                  │   │
│  │  - Generate Vue code                                │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   ↓                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Mapping System (figma-mappings.ts)                 │   │
│  │  - Component patterns                               │   │
│  │  - Prop transformations                             │   │
│  │  - Default values                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Generated Vue Component Code
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   Vue Component                             │
│  <template>...</template>                                   │
│  <script setup>...</script>                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Dosya Yapısı ve Sorumluluklar

### 1. `src/registry/figma-mappings.ts`

**Sorumluluk:** Figma component'lerini Design System component'lerine eşleştiren mapping tanımları.

**Ana Yapılar:**

```typescript
interface FigmaComponentMapping {
  dsComponent: string;              // Hedef DS component (örn: 'InButtonV2')
  figmaPattern: string | RegExp;    // Figma isim pattern'i
  defaultProps?: Record<string, any>; // Varsayılan props
  propMappings?: FigmaPropMapping[]; // Prop dönüşüm kuralları
  examples?: FigmaExample[];        // Örnek kullanımlar
}

interface FigmaPropMapping {
  figmaProperty: string;  // Figma'daki property adı (örn: 'Type')
  dsProp: string;         // DS prop adı (örn: 'type')
  transform?: Record<string, any> | Function; // Değer dönüşümü
  required?: boolean;     // Zorunlu mu?
}
```

**Örnek Mapping:**

```typescript
{
  dsComponent: 'InButtonV2',
  figmaPattern: /^(Button|Btn)\/?/i,
  defaultProps: {
    styling: 'solid',
    type: 'primary',
    size: 'default',
  },
  propMappings: [
    {
      figmaProperty: 'Type',
      dsProp: 'type',
      transform: {
        'Primary': 'primary',
        'Secondary': 'secondary',
        'Danger': 'danger',
      }
    },
    {
      figmaProperty: 'Style',
      dsProp: 'styling',
      transform: {
        'Solid': 'solid',
        'Ghost': 'ghost',
        'Text': 'text',
      }
    }
  ]
}
```

**Key Functions:**

- `findMapping(figmaName)`: Figma component isminden mapping bulur
- `parseFigmaName(name)`: "Button/Primary" → `{ base: "Button", variants: ["Primary"] }`
- `transformProps(mapping, figmaProps)`: Figma props → DS props dönüşümü

---

### 2. `src/services/figma-converter.ts`

**Sorumluluk:** Figma node tree'sini Vue component code'a dönüştürme.

#### 2.1 Ana Fonksiyon: `convertFigmaFrameToVue()`

```typescript
function convertFigmaFrameToVue(
  frame: FigmaFrame,
  options: ConversionOptions
): ConversionResult {
  // 1. Context oluştur
  const context: ConversionContext = {
    imports: new Set(),      // Kullanılan DS component'ler
    warnings: [],            // Uyarılar
    manualProps: [],         // Manuel ayar gereken props
    idCounter: 1,            // ID sayacı
  };

  // 2. Node tree'yi traverse et ve template oluştur
  const templateContent = convertNodeToTemplate(
    frame.node,
    context,
    options.includeComments
  );

  // 3. Script section oluştur
  const script = generateScript(
    Array.from(context.imports),
    options.scriptLang,
    context
  );

  // 4. Birleştir ve döndür
  return {
    code: template + script,
    componentName,
    imports: Array.from(context.imports),
    warnings: context.warnings,
    manualProps: context.manualProps,
  };
}
```

#### 2.2 Node Traversal: `convertNodeToTemplate()`

**Recursive tree traversal ile her node'u işler:**

```typescript
function convertNodeToTemplate(
  node: FigmaNode,
  context: ConversionContext,
  includeComments: boolean,
  indent: number = 0
): string {
  // Node tipine göre farklı işlemler
  switch (node.type) {
    case 'INSTANCE':
      return convertComponentInstance(node, context, includeComments, indent);

    case 'FRAME':
    case 'GROUP':
      return convertFrameToDiv(node, context, includeComments, indent);

    case 'TEXT':
      return convertTextNode(node, indent);

    default:
      return ''; // Skip other types
  }
}
```

#### 2.3 Component Instance Conversion

**En kritik fonksiyon - Figma component'i DS component'e çevirir:**

```typescript
function convertComponentInstance(
  node: FigmaNode,
  context: ConversionContext,
  includeComments: boolean,
  indent: number
): string {
  // 1. Component adını al
  const componentName = node.componentName; // "Button/Primary"
  const instanceName = node.name;           // "Submit Button"

  // 2. Mapping bul
  const mapping = findMapping(componentName);
  if (!mapping) {
    context.warnings.push(`No mapping for "${componentName}"`);
    return convertUnmappedComponent(node, context, indent);
  }

  // 3. DS component bilgisini al
  const dsComponent = getComponentByName(mapping.dsComponent);
  context.imports.add(mapping.dsComponent); // Import ekle

  // 4. Figma properties'i parse et
  const { variants } = parseFigmaName(componentName);
  const figmaProps = { ...node.properties };

  // Variants'ı properties'e ekle
  variants.forEach((variant, i) => {
    figmaProps[`variant${i + 1}`] = variant;
  });

  // 5. Props'ları dönüştür
  const dsProps = transformProps(mapping, figmaProps);

  // 6. Component ID oluştur
  dsProps.id = generateId(instanceName, context);

  // 7. Template code oluştur
  let code = `${' '.repeat(indent)}<${mapping.dsComponent}`;

  // Props'ları ekle
  Object.entries(dsProps).forEach(([key, value]) => {
    code += '\n' + formatProp(key, value, indent + 2);
  });

  // 8. Slot varsa closing tag, yoksa self-closing
  if (dsComponent.slots?.length > 0) {
    code += '>\n';
    // Slot content'i ekle
    code += `${' '.repeat(indent)}</${mapping.dsComponent}>`;
  } else {
    code += ' />';
  }

  return code;
}
```

#### 2.4 Props Transformation Pipeline

```
Figma Properties → Parse → Transform → Format → Template
```

**Örnek Flow:**

```typescript
// INPUT:
node = {
  componentName: "Button/Primary",
  properties: {
    Style: "Solid",
    Size: "Small",
    State: "Disabled"
  }
}

// STEP 1: Parse component name
parseFigmaName("Button/Primary")
→ { base: "Button", variants: ["Primary"] }

// STEP 2: Merge props
figmaProps = {
  variant1: "Primary",    // from variants
  Style: "Solid",         // from properties
  Size: "Small",
  State: "Disabled"
}

// STEP 3: Find mapping
mapping = findMapping("Button/Primary")
→ InButtonV2 mapping found

// STEP 4: Apply default props
dsProps = {
  ...mapping.defaultProps // { styling: 'solid', type: 'primary' }
}

// STEP 5: Transform each property
propMappings.forEach(pm => {
  if (figmaProps[pm.figmaProperty]) {
    dsProps[pm.dsProp] = transform(
      figmaProps[pm.figmaProperty]
    );
  }
});

// Results:
// - variant1: "Primary" → type: "primary"
// - Style: "Solid" → styling: "solid"
// - Size: "Small" → size: "small"
// - State: "Disabled" → disabledStatus: true

// STEP 6: Generate ID
dsProps.id = generateId("Submit Button", context)
→ "submit-button-1"

// FINAL dsProps:
{
  id: "submit-button-1",
  styling: "solid",
  type: "primary",
  size: "small",
  disabledStatus: true
}

// STEP 7: Format to template
formatProp('id', 'submit-button-1') → 'id="submit-button-1"'
formatProp('styling', 'solid') → 'styling="solid"'
formatProp('disabledStatus', true) → ':disabled-status="true"'

// OUTPUT:
<InButtonV2
  id="submit-button-1"
  styling="solid"
  type="primary"
  size="small"
  :disabled-status="true"
/>
```

#### 2.5 Prop Formatting Rules

```typescript
function formatProp(key: string, value: any): string {
  const kebabKey = kebabCase(key); // camelCase → kebab-case

  // String: attribute binding
  if (typeof value === 'string') {
    return `${kebabKey}="${value}"`;
  }

  // Boolean: expression binding
  if (typeof value === 'boolean') {
    return `:${kebabKey}="${value}"`;
  }

  // Number: expression binding
  if (typeof value === 'number') {
    return `:${kebabKey}="${value}"`;
  }

  // Object/Array: JSON expression binding
  if (Array.isArray(value) || typeof value === 'object') {
    return `:${kebabKey}='${JSON.stringify(value)}'`;
  }

  return `${kebabKey}="${String(value)}"`;
}
```

#### 2.6 ID Generation

```typescript
function generateId(instanceName: string, context: ConversionContext): string {
  // "Submit Button" → "submit-button"
  const base = kebabCase(instanceName);

  // Add counter for uniqueness
  const id = `${base}-${context.idCounter}`;
  context.idCounter++;

  return id;
}

// Examples:
// "Submit Button" → "submit-button-1"
// "Submit Button" → "submit-button-2" (if called again)
// "Email Input Field" → "email-input-field-1"
```

---

### 3. `src/tools/figma-tools.ts`

**Sorumluluk:** Figma işlevlerini MCP tool'ları olarak expose etme.

#### 3.1 Tool: `convert-figma-to-vue`

```typescript
server.tool(
  'convert-figma-to-vue',
  'Convert a Figma frame to Vue component code',
  {
    frame: z.object({...}),
    options: z.object({...}).optional()
  },
  async ({ frame, options }) => {
    try {
      // Converter service'i çağır
      const result = convertFigmaFrameToVue(
        frame as FigmaFrame,
        options
      );

      // MCP response formatında döndür
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            componentName: result.componentName,
            code: result.code,
            imports: result.imports,
            warnings: result.warnings,
            manualProps: result.manualProps,
            stats: {
              componentsUsed: result.imports.length,
              warningsCount: result.warnings.length,
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: error.message }],
        isError: true
      };
    }
  }
);
```

#### 3.2 Tool: `validate-figma-component`

```typescript
server.tool(
  'validate-figma-component',
  'Validate if Figma component can be mapped',
  { figmaComponentName: z.string() },
  async ({ figmaComponentName }) => {
    const validation = validateFigmaComponentName(figmaComponentName);

    if (validation.valid && validation.mapping) {
      // Mapping bulundu - DS component bilgisini de ekle
      const dsComponent = getComponentByName(
        validation.mapping.dsComponent
      );

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            valid: true,
            figmaName: figmaComponentName,
            dsComponent: validation.mapping.dsComponent,
            mapping: validation.mapping,
            componentInfo: dsComponent ? {
              propsCount: Object.keys(dsComponent.props).length,
              enriched: dsComponent.enriched
            } : null
          }, null, 2)
        }]
      };
    }

    // Mapping bulunamadı - suggestions ver
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          valid: false,
          figmaName: figmaComponentName,
          suggestions: validation.suggestions
        }, null, 2)
      }]
    };
  }
);
```

#### 3.3 Tool: `list-figma-mappings`

```typescript
server.tool(
  'list-figma-mappings',
  'List all Figma to DS component mappings',
  {},
  async () => {
    const mappings = getAllMappings();

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          total: mappings.length,
          mappings: mappings.map(m => ({
            figmaPattern: typeof m.figmaPattern === 'string'
              ? m.figmaPattern
              : m.figmaPattern.source,
            dsComponent: m.dsComponent,
            defaultProps: m.defaultProps,
            propMappings: m.propMappings?.map(pm => ({
              figmaProperty: pm.figmaProperty,
              dsProp: pm.dsProp
            }))
          }))
        }, null, 2)
      }]
    };
  }
);
```

---

## 🔄 Complete End-to-End Flow

### Senaryo: Login Form Conversion

#### 1. Figma'da Tasarım

```
Frame: "Login Form" (id: frame-123)
├── Text: "Welcome Back"
├── Instance: "Email Input"
│   └── Component: "Input/Email"
│   └── Properties: { State: "Default" }
├── Instance: "Password Input"
│   └── Component: "Input/Password"
│   └── Properties: { State: "Default" }
└── Instance: "Login Button"
    └── Component: "Button/Primary"
    └── Properties: { Style: "Solid", Size: "Default" }
```

#### 2. Export Data Structure

```typescript
const figmaFrame = {
  name: "Login Form",
  id: "frame-123",
  node: {
    id: "root",
    name: "Login Form",
    type: "FRAME",
    children: [
      {
        id: "text-1",
        name: "Title",
        type: "TEXT",
        characters: "Welcome Back"
      },
      {
        id: "input-1",
        name: "Email Input",
        type: "INSTANCE",
        componentName: "Input/Email",
        properties: {
          State: "Default"
        }
      },
      {
        id: "input-2",
        name: "Password Input",
        type: "INSTANCE",
        componentName: "Input/Password",
        properties: {
          State: "Default"
        }
      },
      {
        id: "button-1",
        name: "Login Button",
        type: "INSTANCE",
        componentName: "Button/Primary",
        properties: {
          Style: "Solid",
          Size: "Default"
        }
      }
    ]
  }
};
```

#### 3. MCP Tool Call

```typescript
// Claude Code'dan çağrı:
await mcp.callTool('convert-figma-to-vue', {
  frame: figmaFrame,
  options: {
    componentName: "LoginForm",
    includeScript: true,
    scriptLang: "ts"
  }
});
```

#### 4. Processing Steps (Detaylı)

```
┌─────────────────────────────────────────────────────────────┐
│ convertFigmaFrameToVue()                                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Create ConversionContext                                    │
│ {                                                           │
│   imports: Set([]),                                         │
│   warnings: [],                                             │
│   manualProps: [],                                          │
│   idCounter: 1                                              │
│ }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ convertNodeToTemplate(rootNode)                             │
│   ↓                                                         │
│   Convert FRAME → <div class="login-form">                 │
│   ↓                                                         │
│   Process children recursively:                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Child 1: TEXT node                                          │
│   ↓                                                         │
│   convertTextNode("Welcome Back")                           │
│   → <span>Welcome Back</span>                               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Child 2: INSTANCE "Email Input"                             │
│   ↓                                                         │
│   convertComponentInstance()                                │
│   ├─ findMapping("Input/Email")                             │
│   │  → Found: InTextInput                                   │
│   ├─ parseFigmaName("Input/Email")                          │
│   │  → { base: "Input", variants: ["Email"] }              │
│   ├─ Build figmaProps                                       │
│   │  → { variant1: "Email", State: "Default" }             │
│   ├─ transformProps(mapping, figmaProps)                    │
│   │  ├─ Apply defaultProps: { theme: "grey" }              │
│   │  ├─ Transform: variant1 → type: "email"                │
│   │  ├─ Transform: State → state: "default"                │
│   │  → { theme: "grey", type: "email", state: "default" }  │
│   ├─ generateId("Email Input")                              │
│   │  → "email-input-1" (idCounter: 1→2)                    │
│   ├─ context.imports.add("InTextInput")                     │
│   └─ Generate template:                                     │
│      <InTextInput                                           │
│        id="email-input-1"                                   │
│        type="email"                                         │
│        theme="grey"                                         │
│        state="default"                                      │
│      />                                                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Child 3: INSTANCE "Password Input"                          │
│   (Similar process as Email Input)                          │
│   → <InTextInput                                            │
│       id="password-input-2"                                 │
│       type="password"                                       │
│       ...                                                   │
│     />                                                      │
│   idCounter: 2→3                                            │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Child 4: INSTANCE "Login Button"                            │
│   ↓                                                         │
│   convertComponentInstance()                                │
│   ├─ findMapping("Button/Primary")                          │
│   │  → Found: InButtonV2                                    │
│   ├─ parseFigmaName("Button/Primary")                       │
│   │  → { base: "Button", variants: ["Primary"] }           │
│   ├─ Build figmaProps                                       │
│   │  → { variant1: "Primary", Style: "Solid", Size: "Default" } │
│   ├─ transformProps()                                       │
│   │  ├─ defaultProps: { styling: "solid", type: "primary" }│
│   │  ├─ Transform: variant1 → type: "primary"              │
│   │  ├─ Transform: Style → styling: "solid"                │
│   │  ├─ Transform: Size → size: "default"                  │
│   │  → { styling: "solid", type: "primary", size: "default" } │
│   ├─ generateId("Login Button") → "login-button-3"         │
│   ├─ context.imports.add("InButtonV2")                      │
│   └─ Generate template                                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Final Context State:                                        │
│ {                                                           │
│   imports: Set(["InTextInput", "InButtonV2"]),             │
│   warnings: [],                                             │
│   manualProps: [],                                          │
│   idCounter: 4                                              │
│ }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ generateScript()                                            │
│   ├─ Create import statement from context.imports          │
│   └─ Add CSS import                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Return ConversionResult                                     │
└─────────────────────────────────────────────────────────────┘
```

#### 5. Generated Output

```vue
<template>
  <div class="login-form">
    <span>Welcome Back</span>
    <InTextInput
      id="email-input-1"
      type="email"
      theme="grey"
      state="default"
    />
    <InTextInput
      id="password-input-2"
      type="password"
      theme="grey"
      state="default"
    />
    <InButtonV2
      id="login-button-3"
      styling="solid"
      type="primary"
      size="default"
    />
  </div>
</template>

<script setup lang="ts">
import { InTextInput, InButtonV2 } from '@useinsider/design-system-vue';
import '@useinsider/design-system-vue/dist/design-system-vue.css';
</script>
```

---

## 🛡️ Error Handling & Edge Cases

### 1. Missing Mapping

```typescript
// Figma: "CustomWidget/Advanced"
// No mapping found

// Result:
context.warnings.push("No mapping found for CustomWidget/Advanced");

// Generated:
<div class="custom-widget-advanced">
  <!-- Unmapped: CustomWidget/Advanced -->
</div>
```

### 2. Required Props Missing

```typescript
// InTextInput requires 'name' prop
// Figma'da sağlanmamış

// Detection:
checkRequiredProps(component, dsProps, componentId, instanceName, context);

// Result:
context.manualProps.push({
  componentId: "email-input-1",
  componentName: "Email Input",
  propName: "name",
  reason: "Required prop missing"
});

// User görür:
{
  "manualProps": [
    {
      "componentId": "email-input-1",
      "propName": "name",
      "reason": "Required prop missing"
    }
  ]
}
```

### 3. Invalid Property Values

```typescript
// Figma: { State: "InvalidState" }
// Mapping: { 'Default': 'default', 'Error': 'error' }

// Transform result: value passed as-is
dsProps.state = "InvalidState"; // ❌ Wrong but non-blocking

// Better: Add warning
if (!validValues.includes(transformedValue)) {
  context.warnings.push(
    `Invalid value "${value}" for ${propName}`
  );
}
```

---

## 🔧 Extensibility

### Yeni Component Eklemek

**1. Mapping Tanımla (`figma-mappings.ts`):**

```typescript
export const FIGMA_COMPONENT_MAPPINGS = [
  // ... existing mappings
  {
    dsComponent: 'InTooltipV2',
    figmaPattern: /^Tooltip\/?/i,
    defaultProps: {
      theme: 'dark',
    },
    propMappings: [
      {
        figmaProperty: 'Position',
        dsProp: 'staticPosition',
        transform: {
          'Top': 'top center',
          'Bottom': 'bottom center',
          'Left': 'left center',
          'Right': 'right center',
        }
      }
    ],
    examples: [
      {
        figmaName: 'Tooltip/Top',
        expectedOutput: '<InTooltipV2 static-position="top center" />',
        description: 'Top positioned tooltip'
      }
    ]
  }
];
```

**2. Test Et:**

```typescript
// Validate
validateFigmaComponentName("Tooltip/Top")
// → { valid: true, mapping: {...} }

// Convert
convertFigmaFrameToVue({
  node: {
    type: 'INSTANCE',
    componentName: 'Tooltip/Top',
    properties: { Position: 'Top' }
  }
})
// → <InTooltipV2 static-position="top center" />
```

**3. Hepsi Bu!** Kod değişikliği yok, sadece mapping eklendi.

---

## 📊 Performance Considerations

### 1. Mapping Lookup

```typescript
// O(n) linear search
function findMapping(figmaName: string) {
  for (const mapping of FIGMA_COMPONENT_MAPPINGS) {
    if (mapping.figmaPattern.test(figmaName)) {
      return mapping;
    }
  }
  return null;
}

// Optimization için cache eklenebilir:
const mappingCache = new Map<string, FigmaComponentMapping>();
```

### 2. Node Traversal

```typescript
// Recursive traversal - Stack depth ~= tree depth
// Max depth tipik olarak 10-20
// Performance impact: Minimal
```

### 3. Import Deduplication

```typescript
// Set kullanımı ile otomatik deduplicate
context.imports = new Set(); // O(1) add, O(1) lookup
context.imports.add("InButtonV2");
context.imports.add("InButtonV2"); // Duplicate ignored
```

---

## 🎯 Design Decisions

### 1. Neden Regex Pattern?

```typescript
// ✅ Flexible
figmaPattern: /^(Button|Btn)\/?/i

// Matches: "Button", "Button/Primary", "Btn/Secondary"
// Case insensitive

// ❌ Alternative: Exact string
// figmaPattern: "Button"
// Only matches: "Button"
```

### 2. Neden Transform Functions?

```typescript
// ✅ Dynamic transformation
{
  figmaProperty: 'State',
  dsProp: 'disabledStatus',
  transform: (value) => value === 'Disabled' // Boolean conversion
}

// vs

// ❌ Static mapping
{
  transform: {
    'Disabled': true,
    'Enabled': false
  }
}
// Doesn't handle edge cases
```

### 3. Neden Context Object?

```typescript
// ✅ Shared state across recursion
const context = {
  imports: Set(),
  warnings: [],
  manualProps: [],
  idCounter: 1
};

// vs

// ❌ Global variables
let globalImports = new Set();
let globalWarnings = [];
// Not thread-safe, hard to test
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('figma-mappings', () => {
  test('findMapping - Button', () => {
    const result = findMapping('Button/Primary');
    expect(result.dsComponent).toBe('InButtonV2');
  });

  test('transformProps - Type mapping', () => {
    const mapping = {...};
    const result = transformProps(mapping, {
      Type: 'Primary',
      Style: 'Solid'
    });
    expect(result.type).toBe('primary');
    expect(result.styling).toBe('solid');
  });
});

describe('figma-converter', () => {
  test('convertNodeToTemplate - INSTANCE', () => {
    const node = {
      type: 'INSTANCE',
      componentName: 'Button/Primary',
      name: 'Submit'
    };
    const context = createContext();
    const result = convertNodeToTemplate(node, context);

    expect(result).toContain('<InButtonV2');
    expect(result).toContain('id="submit-1"');
    expect(context.imports.has('InButtonV2')).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('End-to-end conversion', () => {
  test('Login form conversion', () => {
    const frame = createLoginFormFrame();
    const result = convertFigmaFrameToVue(frame);

    expect(result.imports).toContain('InTextInput');
    expect(result.imports).toContain('InButtonV2');
    expect(result.code).toContain('<template>');
    expect(result.code).toContain('<script setup');
  });
});
```

---

## 📝 Summary

**Katmanlar:**
1. **Mapping System** - Declarative component & prop mappings
2. **Conversion Service** - Tree traversal & code generation
3. **MCP Tools** - External interface

**Veri Akışı:**
```
Figma Data → findMapping() → transformProps() → generateTemplate() → Vue Code
```

**Key Benefits:**
- ✅ Declarative mappings (no code changes needed)
- ✅ Type-safe transformations
- ✅ Extensible architecture
- ✅ Comprehensive error handling
- ✅ MCP integration ready

**Next Steps:**
- Add more component mappings
- Implement layout/spacing conversion
- Create Figma plugin for seamless export
- Add visual testing

