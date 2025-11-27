# InCodeSnippet

**Version:** v1

## Props

### `code`

**Type:** `String` | **Required**

### `options`

**Type:** `Object` | **Default:** `"[Function]"`

### `size`

**Type:** `Object` | **Default:** `"[Function]"`

### `syntaxCheck`

**Type:** `Boolean` | **Default:** `true`

### `disable`

**Type:** `Boolean` | **Default:** `false`

### `invalid`

**Type:** `Boolean` | **Default:** `false`

### `invalidMessage`

**Type:** `String` | **Default:** `""`

### `warning`

**Type:** `Boolean` | **Default:** `false`

### `warningMessage`

**Type:** `String` | **Default:** `""`

### `focusEditor`

**Type:** `Boolean` | **Default:** `true`

### `usePercentageSize`

**Type:** `Boolean` | **Default:** `false`

### `replaceDynamicContentMap`

**Type:** `Object` | **Default:** `"[Function]"`

### `fallbackSaveButtonText`

**Type:** `String` | **Default:** `""`

### `fallbackCloseButtonText`

**Type:** `String` | **Default:** `""`

### `fallbackOptions`

**Type:** `Object` | **Default:** `"[Function]"`

### `fallBackDisabledCharacters`

**Type:** `Array` | **Default:** `"[Function]"`

### `fallBackDisabledCharactersMessage`

**Type:** `String` | **Default:** `""`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `canAddDynamicContent`

**Type:** `Boolean` | **Default:** `false`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `canEdit`

**Type:** `Boolean` | **Default:** `true`

### `dynamicContentBoxProps`

**Type:** `Object` | **Default:** `"[Function]"`

### `replaceDynamicContentText`

**Type:** `String` | **Default:** `"Replace Dynamic Content"`

### `dynamicContentButtonText`

**Type:** `String` | **Default:** `""`

### `fallBackStatusMessage`

**Type:** `String` | **Default:** `""`

### `groupingEventInfoText`

**Type:** `String` | **Default:** `""`

### `saveButtonCallback`

**Type:** `Function` | **Default:** `"null"`

### `position`

**Type:** `String` | **Default:** `"bottom"`

### `warningTags`

**Type:** `Array` | **Default:** `"[Function]"`

### `errorTags`

**Type:** `Array` | **Default:** `"[Function]"`

### `validateTagsWithFallback`

**Type:** `Boolean` | **Default:** `true`

### `markNotExistDynamicContent`

**Type:** `Boolean` | **Default:** `false`

### `notExistingAttributeHasErrorState`

**Type:** `Boolean` | **Default:** `false`

### `notExistingAttributeWhiteListRegExp`

**Type:** `RegExp` | **Default:** `"[Function]"`

### `uploadTriggerWords`

**Type:** `Array` | **Default:** `"[Function]"`

## Events

### `markedTags`

### `cursorActivity`

### `input`

### `ready`

### `checkSyntaxError`

### `updateEventPersistent`

### `updateProductAttributePersistent`

### `addDynamicAttribute`

## Examples

### Multi-Language Code Playground

Code editor supporting multiple programming languages with language switcher

```vue
<template>
  <div class="code-playground">
    <div class="toolbar">
      <label>Language:</label>
      <select v-model="selectedLanguage" @change="updateMode">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="css">CSS</option>
        <option value="htmlmixed">HTML</option>
        <option value="sql">SQL</option>
      </select>
      <button @click="runCode" :disabled="!canRun">Run Code</button>
      <button @click="resetCode">Reset</button>
    </div>

    <InCodeSnippet
      v-model:code="code"
      :options="editorOptions"
      :size="editorSize"
      :syntaxCheck="true"
      :focusEditor="true"
      @checkSyntaxError="handleErrors"
      @ready="onEditorReady"
    />

    <div v-if="output" class="output">
      <h4>Output:</h4>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InCodeSnippet } from '@useinsider/design-system-vue';

const selectedLanguage = ref('javascript');
const code = ref(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);

const output = ref('');
const editorInstance = ref(null);

const editorOptions = computed(() => ({
  mode: selectedLanguage.value,
  theme: 'monokai',
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
  indentUnit: 2,
  extraKeys: {
    'Ctrl-Enter': () => runCode(),
    'Cmd-Enter': () => runCode()
  }
}));

const editorSize = {
  width: '100%',
  height: '400px'
};

const canRun = computed(() => selectedLanguage.value === 'javascript');

const languageTemplates: Record<string, string> = {
  javascript: `function example() {\n  console.log('Hello, World!');\n}\n\nexample();`,
  python: `def example():\n    print('Hello, World!')\n\nexample()`,
  css: `.example {\n  color: #333;\n  background: #fff;\n}`,
  htmlmixed: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>`,
  sql: `SELECT * FROM users\nWHERE active = true\nORDER BY created_at DESC;`
};

const updateMode = () => {
  // Optionally update code to language template
  if (confirm('Load example code for this language?')) {
    code.value = languageTemplates[selectedLanguage.value] || '';
  }
};

const runCode = () => {
  if (selectedLanguage.value === 'javascript') {
    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(String).join(' '));
      };

      // Execute code
      eval(code.value);

      // Restore console.log
      console.log = originalLog;

      output.value = logs.join('\n') || 'Code executed successfully (no output)';
    } catch (error: any) {
      output.value = `Error: ${error.message}`;
    }
  }
};

const resetCode = () => {
  code.value = languageTemplates[selectedLanguage.value];
  output.value = '';
};

const handleErrors = (errors: any[]) => {
  if (errors.length > 0) {
    console.warn('Syntax errors:', errors);
  }
};

const onEditorReady = (instance: any) => {
  editorInstance.value = instance;
  console.log('Editor ready');
};
</script>

<style scoped>
.code-playground {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.output {
  padding: 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.output pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
```

### Advanced Email Template Builder

Sophisticated email template editor with dynamic content, validation, preview, and save functionality

```vue
<template>
  <div class="template-builder">
    <div class="header">
      <h2>Email Template Editor</h2>
      <div class="actions">
        <button @click="togglePreview">{{ showPreview ? 'Edit' : 'Preview' }}</button>
        <button @click="validateTemplate" :disabled="validating">Validate</button>
        <button @click="saveTemplate" :disabled="saving || !isValid">Save Template</button>
      </div>
    </div>

    <div class="editor-container">
      <div v-if="!showPreview" class="editor-section">
        <InCodeSnippet
          v-model:code="template"
          :options="editorOptions"
          :size="editorSize"
          :canAddDynamicContent="true"
          :dynamicContentBoxProps="dynamicContentConfig"
          :replaceDynamicContentMap="previewData"
          :markNotExistDynamicContent="true"
          :notExistingAttributeHasErrorState="true"
          :warningTags="warningTags"
          :errorTags="errorTags"
          :validateTagsWithFallback="false"
          :preventXss="true"
          :syntaxCheck="true"
          :saveButtonCallback="saveTemplate"
          position="top"
          dynamicContentButtonText="Insert Merge Tag"
          replaceDynamicContentText="Available Merge Tags"
          @addDynamicAttribute="handleTagAdded"
          @markedTags="handleTagsValidated"
          @checkSyntaxError="handleSyntaxErrors"
          @input="handleCodeChange"
        />
      </div>

      <div v-else class="preview-section">
        <div class="preview-content" v-html="renderedPreview"></div>
      </div>
    </div>

    <div v-if="validationResult" class="validation-result" :class="validationResult.type">
      <h4>{{ validationResult.title }}</h4>
      <ul v-if="validationResult.issues.length > 0">
        <li v-for="(issue, index) in validationResult.issues" :key="index">
          {{ issue }}
        </li>
      </ul>
      <p v-else>{{ validationResult.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InCodeSnippet } from '@useinsider/design-system-vue';

const template = ref(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
    <h1 style="color: #333;">Hello {{user.firstName}}!</h1>
    
    <p>Thank you for your order. Here are the details:</p>
    
    <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p><strong>Order ID:</strong> {{order.id}}</p>
      <p><strong>Total:</strong> {{order.total}}</p>
      <p><strong>Items:</strong> {{order.itemCount}}</p>
    </div>
    
    <p>Shipping to:</p>
    <address style="font-style: normal;">
      {{user.firstName}} {{user.lastName}}<br>
      {{user.address}}<br>
      {{user.city}}, {{user.state}} {{user.zipCode}}
    </address>
    
    <p style="margin-top: 30px;">
      <a href="{{order.trackingUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
    </p>
  </div>
</body>
</html>`);

const showPreview = ref(false);
const validating = ref(false);
const saving = ref(false);
const isValid = ref(true);
const validationResult = ref<any>(null);

const editorOptions = {
  mode: 'htmlmixed',
  theme: 'monokai',
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
  indentUnit: 2
};

const editorSize = {
  width: '100%',
  height: '600px'
};

const dynamicContentConfig = {
  contentObject: [
    // User fields
    { name: 'user.firstName', label: 'First Name', category: 'User' },
    { name: 'user.lastName', label: 'Last Name', category: 'User' },
    { name: 'user.email', label: 'Email', category: 'User' },
    { name: 'user.address', label: 'Street Address', category: 'User' },
    { name: 'user.city', label: 'City', category: 'User' },
    { name: 'user.state', label: 'State', category: 'User' },
    { name: 'user.zipCode', label: 'Zip Code', category: 'User' },
    
    // Order fields
    { name: 'order.id', label: 'Order ID', category: 'Order' },
    { name: 'order.total', label: 'Order Total', category: 'Order' },
    { name: 'order.itemCount', label: 'Item Count', category: 'Order' },
    { name: 'order.trackingUrl', label: 'Tracking URL', category: 'Order' },
    { name: 'order.date', label: 'Order Date', category: 'Order' }
  ],
  groupBy: 'category',
  searchable: true
};

const previewData = {
  'user.firstName': 'Sarah',
  'user.lastName': 'Johnson',
  'user.email': 'sarah.j@example.com',
  'user.address': '456 Oak Avenue',
  'user.city': 'San Francisco',
  'user.state': 'CA',
  'user.zipCode': '94102',
  'order.id': 'ORD-789012',
  'order.total': '$387.50',
  'order.itemCount': '5',
  'order.trackingUrl': 'https://tracking.example.com/ORD-789012',
  'order.date': 'November 28, 2025'
};

const warningTags = ref<string[]>([]);
const errorTags = ref<string[]>([]);

const renderedPreview = computed(() => {
  let preview = template.value;
  // Replace all dynamic content tags with preview data
  Object.entries(previewData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    preview = preview.replace(regex, String(value));
  });
  return preview;
});

const togglePreview = () => {
  showPreview.value = !showPreview.value;
};

const validateTemplate = async () => {
  validating.value = true;
  validationResult.value = null;

  // Simulate validation
  await new Promise(resolve => setTimeout(resolve, 1000));

  const issues: string[] = [];

  // Check for missing tags
  const tagPattern = /{{([^}]+)}}/g;
  const usedTags = new Set<string>();
  let match;
  while ((match = tagPattern.exec(template.value)) !== null) {
    usedTags.add(match[1]);
  }

  const availableTags = new Set(
    dynamicContentConfig.contentObject.map(item => item.name)
  );

  usedTags.forEach(tag => {
    if (!availableTags.has(tag)) {
      issues.push(`Unknown merge tag: {{${tag}}}`);
      if (!errorTags.value.includes(tag)) {
        errorTags.value.push(tag);
      }
    }
  });

  // Check for basic HTML structure
  if (!template.value.includes('<!DOCTYPE html>')) {
    issues.push('Missing DOCTYPE declaration');
  }

  if (!template.value.includes('<html>')) {
    issues.push('Missing HTML tag');
  }

  isValid.value = issues.length === 0;
  validationResult.value = {
    type: isValid.value ? 'success' : 'error',
    title: isValid.value ? 'Validation Passed' : 'Validation Failed',
    message: isValid.value ? 'Template is valid and ready to use.' : '',
    issues
  };

  validating.value = false;
};

const saveTemplate = async () => {
  saving.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Template saved:', template.value);
    
    validationResult.value = {
      type: 'success',
      title: 'Template Saved',
      message: 'Your email template has been saved successfully.',
      issues: []
    };
  } catch (error: any) {
    validationResult.value = {
      type: 'error',
      title: 'Save Failed',
      message: error.message,
      issues: []
    };
  } finally {
    saving.value = false;
  }
};

const handleTagAdded = (tag: any) => {
  console.log('Merge tag inserted:', tag);
};

const handleTagsValidated = (tags: any) => {
  console.log('Tags validated:', tags);
  if (tags.invalid && tags.invalid.length > 0) {
    errorTags.value = tags.invalid;
  }
};

const handleSyntaxErrors = (errors: any[]) => {
  if (errors.length > 0) {
    isValid.value = false;
  }
};

const handleCodeChange = (newCode: string) => {
  // Reset validation when code changes
  validationResult.value = null;
};
</script>

<style scoped>
.template-builder {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.actions {
  display: flex;
  gap: 12px;
}

.editor-container {
  min-height: 600px;
}

.preview-section {
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.preview-content {
  max-width: 600px;
  margin: 0 auto;
}

.validation-result {
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.validation-result.success {
  background: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.validation-result.error {
  background: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.validation-result ul {
  margin: 8px 0 0 20px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## Common Mistakes

ℹ️ **Displaying user-generated code without XSS protection**

ℹ️ **Conflicting canEdit and readOnly settings**

ℹ️ **Not validating dynamic content tags before sending**

ℹ️ **Using fixed pixel sizes for responsive layouts**

ℹ️ **Not handling saveButtonCallback errors**

## Best Practices

- **Always Enable XSS Protection for User Content:** Set preventXss: true when displaying any user-generated or untrusted code content
- **Use Appropriate Editor Size:** Set editor dimensions based on expected content length and available screen space
- **Validate Dynamic Content Tags:** Enable tag validation to catch typos and removed attributes before content is sent
- **Configure Syntax Checking for Critical Code:** Enable syntax validation for configuration files, SQL queries, and production code

