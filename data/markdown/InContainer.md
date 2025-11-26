# InContainer

**Version:** v1

## Props

### `border`

**Type:** `String` | **Default:** `"bor-w-1 bor-s-s bor-c-6"`

### `borderRadius`

**Type:** `String` | **Default:** `"bor-r-1"`

### `borderTriangle`

**Type:** `Boolean` | **Default:** `false`

### `borderTrianglePosition`

**Type:** `String` | **Default:** `""`

### `borderTriangleAlign`

**Type:** `String` | **Default:** `""`

### `headerStatus`

**Type:** `Boolean` | **Default:** `false`

### `footerStatus`

**Type:** `Boolean` | **Default:** `false`

### `fullWidthContentStatus`

**Type:** `Boolean` | **Default:** `true`

### `containerType`

**Type:** `String` | **Default:** `"default"`

### `colorIndicatorStatus`

**Type:** `Boolean` | **Default:** `false`

### `colorIndicatorColor`

**Type:** `String` | **Default:** `""`

## Examples

### Basic Container

Simple container with default border and content

```vue
<InContainer>
  <template #contentArea>
    <p>Container content goes here</p>
  </template>
</InContainer>
```

### Container with Header

Container with header title and description

```vue
<InContainer :header-status="true">
  <template #headerTitle>
    <h3>Section Title</h3>
  </template>
  <template #headerDescription>
    <p>Section description text</p>
  </template>
  <template #contentArea>
    <p>Main content</p>
  </template>
</InContainer>
```

### Dashboard Card

Complete card with header actions and footer

```vue
<template>
  <InContainer
    :header-status="true"
    :footer-status="true"
    border="bor-w-1 bor-s-s bor-c-6"
    border-radius="bor-r-1">
    <template #headerTitle>
      <h3>Dashboard Overview</h3>
    </template>
    <template #headerDescription>
      <p>View your key metrics</p>
    </template>
    <template #headerRightSlot>
      <InButtonV2 type="primary" label-text="Export" @click="handleExport" />
    </template>

    <template #contentArea>
      <div class="dashboard-content">
        <!-- Dashboard widgets -->
      </div>
    </template>

    <template #footerTitle>
      <span>Last updated: 2 mins ago</span>
    </template>
    <template #footerRightSlot>
      <InButtonV2 type="secondary" label-text="Refresh" @click="handleRefresh" />
    </template>
  </InContainer>
</template>

<script setup>
const handleExport = () => {
  console.log('Exporting data...');
};

const handleRefresh = () => {
  console.log('Refreshing data...');
};
</script>
```

### Status Card with Color Indicator

Container with colored left border indicator

```vue
<InContainer
  :color-indicator-status="true"
  color-indicator-color="#4CAF50"
  :header-status="true"
  border="bor-w-1 bor-s-s bor-c-6"
  border-radius="bor-r-1">
  <template #headerTitle>
    <h3>Success Status</h3>
  </template>
  <template #contentArea>
    <p>Operation completed successfully</p>
  </template>
</InContainer>
```

### Form Container with Actions

Container for forms with cancel and save buttons

```vue
<template>
  <InContainer
    :header-status="true"
    :full-width-content-status="false">
    <template #headerTitle>
      <h3>Edit Profile</h3>
    </template>
    <template #headerLeftSlot>
      <InButtonV2
        type="secondary"
        label-text="Cancel"
        @click="handleCancel"
      />
    </template>
    <template #headerRightSlot>
      <InButtonV2
        type="primary"
        label-text="Save Changes"
        :loading="isSaving"
        @click="handleSave"
      />
    </template>

    <template #contentArea>
      <form @submit.prevent="handleSave">
        <!-- Form fields -->
      </form>
    </template>
  </InContainer>
</template>

<script setup>
import { ref } from 'vue';

const isSaving = ref(false);

const handleCancel = () => {
  console.log('Form cancelled');
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    // Save logic
  } finally {
    isSaving.value = false;
  }
};
</script>
```

### Borderless Content Section

Container without border for seamless layouts

```vue
<InContainer border="">
  <template #contentArea>
    <div class="seamless-content">
      <p>Content without visible borders</p>
    </div>
  </template>
</InContainer>
```

### Container with Triangle Pointer

Decorative triangle pointer (useful for tooltips or popovers)

```vue
<InContainer
  :border-triangle="true"
  border-triangle-position="top"
  border-triangle-align="center"
  border="bor-w-1 bor-s-s bor-c-6"
  border-radius="bor-r-1">
  <template #contentArea>
    <p>This container has a triangle pointer at the top</p>
  </template>
</InContainer>
```

### Data Table Container with Filters

Container with header bottom slot for filters

```vue
<template>
  <InContainer :header-status="true">
    <template #headerTitle>
      <h3>Data Table</h3>
    </template>
    <template #headerRightSlot>
      <InButtonV2 type="primary" label-text="Add New" @click="handleAdd" />
    </template>
    <template #headerBottomSlot>
      <div class="filters" style="padding: 12px 24px; border-top: 1px solid #e0e0e0;">
        <InSelect placeholder="Filter by status" :options="statusOptions" />
      </div>
    </template>

    <template #contentArea>
      <!-- Data table -->
    </template>
  </InContainer>
</template>

<script setup>
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

const handleAdd = () => {
  console.log('Add new item');
};
</script>
```

### Nested Containers Layout

Multiple containers for complex layouts

```vue
<InContainer
  :header-status="true"
  border="bor-w-1 bor-s-s bor-c-6">
  <template #headerTitle>
    <h2>Main Container</h2>
  </template>

  <template #contentArea>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px;">
      <InContainer border="bor-w-1 bor-s-s bor-c-8" border-radius="bor-r-1">
        <template #contentArea>
          <p>Nested container 1</p>
        </template>
      </InContainer>

      <InContainer border="bor-w-1 bor-s-s bor-c-8" border-radius="bor-r-1">
        <template #contentArea>
          <p>Nested container 2</p>
        </template>
      </InContainer>
    </div>
  </template>
</InContainer>
```

## Common Mistakes

ℹ️ **Using V1 'type' prop instead of 'containerType'**

InBox V1 used 'type' prop, InContainer V2 uses 'containerType'

**Wrong:**
```vue
<InContainer type="default" />
```

**Correct:**
```vue
<InContainer container-type="default" />
```

ℹ️ **Using CSS values instead of utility classes for border**

border prop expects design system utility classes, not CSS values

**Wrong:**
```vue
<InContainer border="1px solid #ccc" />
```

**Correct:**
```vue
<InContainer border="bor-w-1 bor-s-s bor-c-6" />
```

ℹ️ **Setting borderTriangle without borderTrianglePosition**

Triangle decoration requires position to be specified

**Wrong:**
```vue
<InContainer :border-triangle="true" />
```

**Correct:**
```vue
<InContainer :border-triangle="true" border-triangle-position="top" />
```

ℹ️ **Setting colorIndicatorStatus without colorIndicatorColor**

Color indicator needs explicit color value to be visible

**Wrong:**
```vue
<InContainer :color-indicator-status="true" />
```

**Correct:**
```vue
<InContainer :color-indicator-status="true" color-indicator-color="#4CAF50" />
```

ℹ️ **Not using contentArea slot**

Content should be placed in #contentArea slot for proper structure

**Wrong:**
```vue
<InContainer><p>Content</p></InContainer>
```

**Correct:**
```vue
<InContainer><template #contentArea><p>Content</p></template></InContainer>
```

ℹ️ **Setting headerStatus=true but not using header slots**

Enabling header without content creates empty space

**Wrong:**
```vue
<InContainer :header-status="true"><template #contentArea>Content</template></InContainer>
```

**Correct:**
```vue
<InContainer :header-status="true"><template #headerTitle>Title</template><template #contentArea>Content</template></InContainer>
```

ℹ️ **Expecting padding when fullWidthContentStatus=true**

fullWidthContentStatus=true removes all content padding

**Wrong:**
```vue
<InContainer :full-width-content-status="true"><!-- Expecting padding --></InContainer>
```

**Correct:**
```vue
<InContainer :full-width-content-status="false"><!-- Has padding --></InContainer>
```

## Best Practices

- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined

