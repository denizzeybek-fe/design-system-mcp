# InCustomDropDown

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `"qa-custom-dropdown"`

### `text`

**Type:** `String` | **Default:** `""`

### `status`

**Type:** `String` | **Default:** `"default"`

### `type`

**Type:** `String` | **Default:** `"link"`

### `target`

**Type:** `String` | **Default:** `"_self"`

### `options`

**Type:** `Array` | **Required**

### `searchStatus`

**Type:** `Boolean` | **Default:** `false`

### `createNewOptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `createNewOptionText`

**Type:** `String` | **Default:** `"Label"`

### `openPosition`

**Type:** `String` | **Default:** `"left"`

### `buttonType`

**Type:** `String` | **Default:** `"secondary"`

### `icon`

**Type:** `String` | **Default:** `"filled-dropdown-down"`

### `iconPosition`

**Type:** `String` | **Default:** `"right"`

### `iconName`

**Type:** `String` | **Default:** `"line-plus-netural"`

### `disable`

**Type:** `Boolean` | **Default:** `false`

### `title`

**Type:** `String` | **Default:** `"Select Condition"`

### `extraOption`

**Type:** `Object` | **Default:** `"[Function]"`

### `noDataText`

**Type:** `String` | **Default:** `"No Data to Show"`

### `noSearchResultText`

**Type:** `String` | **Default:** `"No Search Result"`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `visibleButton`

**Type:** `Boolean` | **Default:** `true`

### `visibleBorder`

**Type:** `Boolean` | **Default:** `false`

### `avoidClosingSelectors`

**Type:** `any` | **Default:** `false`

### `isFullWidth`

**Type:** `Boolean` | **Default:** `false`

### `isHoverEffectDisabled`

**Type:** `Boolean` | **Default:** `false`

### `dropdownMenuPosition`

**Type:** `String` | **Default:** `"DROPDOWN_MENU_POSITION_AUTO"`

### `withTitle`

**Type:** `Boolean` | **Default:** `true`

### `withTooltip`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

## Events

### `hoverItem`

### `clickExtraOption`

### `openList`

### `click`

### `closeList`

### `selectedInActiveOption`

### `select`

## Enums

### DROPDOWN_MENU_REVERT_POSITION



## Examples

### Advanced Export Options Menu

Feature-rich dropdown with custom templates, search, extra options, and grouped actions

```vue
<template>
  <div class="export-menu">
    <InCustomDropDown
      id="export-dropdown"
      text="Export Data"
      buttonType="primary"
      icon="download"
      iconPosition="left"
      :options="exportOptions"
      :searchStatus="true"
      :extraOption="selectAllOption"
      :avoidClosingSelectors="['.format-preview', '.option-checkbox']"
      openPosition="right"
      dropdownMenuPosition="DROPDOWN_MENU_POSITION_AUTO"
      :isFullWidth="false"
      :withTooltip="true"
      tooltipText="Export your data in various formats"
      @select="handleExport"
      @clickExtraOption="handleSelectAll"
      @openList="onDropdownOpen"
      @closeList="onDropdownClose"
    />

    <!-- Export Progress -->
    <div v-if="isExporting" class="export-progress">
      <p>Exporting {{ exportFormat }}...</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InCustomDropDown } from '@useinsider/design-system-vue';

const selectedFormats = ref<string[]>([]);
const isExporting = ref(false);
const exportProgress = ref(0);
const exportFormat = ref('');

const exportOptions = [
  {
    label: 'PDF Document',
    value: 'pdf',
    icon: 'file-pdf',
    metadata: { extension: 'pdf', mimeType: 'application/pdf' },
    template: `
      <div class="export-option">
        <div class="option-header">
          <input type="checkbox" class="option-checkbox" />
          <span class="icon">📄</span>
          <span class="label">PDF Document</span>
        </div>
        <div class="format-preview">Portable Document Format - Best for printing</div>
      </div>
    `
  },
  {
    label: 'Excel Spreadsheet',
    value: 'xlsx',
    icon: 'file-excel',
    metadata: { extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    template: `
      <div class="export-option">
        <div class="option-header">
          <input type="checkbox" class="option-checkbox" />
          <span class="icon">📊</span>
          <span class="label">Excel Spreadsheet</span>
        </div>
        <div class="format-preview">XLSX format - Includes formulas and formatting</div>
      </div>
    `
  },
  {
    label: 'CSV File',
    value: 'csv',
    icon: 'file-csv',
    metadata: { extension: 'csv', mimeType: 'text/csv' },
    template: `
      <div class="export-option">
        <div class="option-header">
          <input type="checkbox" class="option-checkbox" />
          <span class="icon">📋</span>
          <span class="label">CSV File</span>
        </div>
        <div class="format-preview">Comma-separated values - Universal format</div>
      </div>
    `
  },
  {
    label: 'JSON Data',
    value: 'json',
    icon: 'code',
    metadata: { extension: 'json', mimeType: 'application/json' },
    template: `
      <div class="export-option">
        <div class="option-header">
          <input type="checkbox" class="option-checkbox" />
          <span class="icon">{ }</span>
          <span class="label">JSON Data</span>
        </div>
        <div class="format-preview">Structured data format - For developers</div>
      </div>
    `
  },
  {
    label: 'XML File',
    value: 'xml',
    icon: 'file-code',
    metadata: { extension: 'xml', mimeType: 'application/xml' },
    template: `
      <div class="export-option">
        <div class="option-header">
          <input type="checkbox" class="option-checkbox" />
          <span class="icon">< ></span>
          <span class="label">XML File</span>
        </div>
        <div class="format-preview">Extensible Markup Language - Legacy systems</div>
      </div>
    `
  },
  {
    label: 'HTML Report',
    value: 'html',
    icon: 'file-html',
    metadata: { extension: 'html', mimeType: 'text/html' },
    template: `
      <div class="export-option">
        <div class="option-header">
          <input type="checkbox" class="option-checkbox" />
          <span class="icon">🌐</span>
          <span class="label">HTML Report</span>
        </div>
        <div class="format-preview">Web page format - Interactive reports</div>
      </div>
    `
  }
];

const selectAllOption = {
  label: 'Select All Formats',
  value: 'select_all',
  icon: 'check-all',
  position: 'top',
  onClick: () => {
    selectedFormats.value = exportOptions.map(opt => opt.value);
  }
};

const handleExport = async (option: any) => {
  exportFormat.value = option.label;
  isExporting.value = true;
  exportProgress.value = 0;

  try {
    // Simulate export progress
    const interval = setInterval(() => {
      exportProgress.value += 10;
      if (exportProgress.value >= 100) {
        clearInterval(interval);
        
        // Trigger download
        downloadFile(option);
        
        // Reset after 1 second
        setTimeout(() => {
          isExporting.value = false;
          exportProgress.value = 0;
        }, 1000);
      }
    }, 200);
  } catch (error) {
    console.error('Export failed:', error);
    isExporting.value = false;
  }
};

const downloadFile = (option: any) => {
  const { extension, mimeType } = option.metadata;
  const filename = `export_${Date.now()}.${extension}`;
  
  // Create blob and download
  const blob = new Blob(['Export data here'], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log(`Downloaded: ${filename}`);
};

const handleSelectAll = () => {
  console.log('Select all clicked');
};

const onDropdownOpen = () => {
  console.log('Export dropdown opened');
};

const onDropdownClose = () => {
  console.log('Export dropdown closed');
};
</script>

<style scoped>
.export-menu {
  position: relative;
}

.export-progress {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

/* Custom option styles (injected via template) */
:deep(.export-option) {
  padding: 8px;
}

:deep(.option-header) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

:deep(.format-preview) {
  font-size: 12px;
  color: #666;
  margin-left: 28px;
}

:deep(.option-checkbox) {
  margin: 0;
}
</style>
```

## Common Mistakes

ℹ️ **Not providing unique values for options**

ℹ️ **Forgetting to handle @select event**

ℹ️ **Using searchStatus for short lists**

ℹ️ **Not setting avoidClosingSelectors for interactive options**

ℹ️ **Missing error handling in onClick callbacks**

## Best Practices

- **Use Search for Long Option Lists:** Enable searchStatus when dropdown has more than 10-15 options
- **Provide Clear Action Labels:** Use descriptive, action-oriented labels for dropdown options
- **Handle Errors in Action Callbacks:** Implement proper error handling for dropdown option click handlers
- **Use avoidClosingSelectors for Interactive Content:** Prevent dropdown from closing when clicking on checkboxes, buttons, or other interactive elements within options

