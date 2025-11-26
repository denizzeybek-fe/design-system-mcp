# InChips

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `""`

### `type`

**Type:** `any` | **Default:** `"default"`

### `styles`

**Type:** `any` | **Default:** `"stroke"`

### `text`

**Type:** `String` | **Required**

### `value`

**Type:** `String|Number` | **Required**

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `interactive`

**Type:** `Boolean` | **Default:** `true`

### `closeButton`

**Type:** `Boolean` | **Default:** `true`

### `selectedStatus`

**Type:** `Boolean` | **Default:** `false`

### `actionableLabel`

**Type:** `Boolean` | **Default:** `false`

### `maxWidth`

**Type:** `Number` | **Default:** `"null"`

## Events

### `tagClick`

### `click`

## Examples

### Basic Removable Chip

Simple chip with close button for tag removal

```vue
<template>
  <div class="chip-list">
    <InChips
      v-for="tag in tags"
      :key="tag.value"
      :text="tag.text"
      :value="tag.value"
      @click="removeTag"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tags = ref([
  { text: 'JavaScript', value: 'js' },
  { text: 'Vue.js', value: 'vue' },
  { text: 'TypeScript', value: 'ts' }
]);

const removeTag = (value) => {
  tags.value = tags.value.filter(tag => tag.value !== value);
};
</script>

<style scoped>
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
```

### Chip Color Types

Different semantic color types for chips

```vue
<template>
  <div class="chip-list">
    <InChips text="Default" value="1" type="default" />
    <InChips text="Danger" value="2" type="danger" />
    <InChips text="Warning" value="3" type="warning" />
    <InChips text="Smart" value="4" type="smart" />
    <InChips text="Info" value="5" type="information" />
  </div>
</template>
```

### Solid vs Stroke Styles

Compare stroke (outlined) and solid (filled) chip styles

```vue
<template>
  <div>
    <div class="chip-list">
      <h4>Stroke Style (default)</h4>
      <InChips text="Stroke" value="1" type="smart" styles="stroke" />
      <InChips text="Danger" value="2" type="danger" styles="stroke" />
    </div>
    
    <div class="chip-list">
      <h4>Solid Style</h4>
      <InChips text="Solid" value="3" type="smart" styles="solid" />
      <InChips text="Danger" value="4" type="danger" styles="solid" />
    </div>
  </div>
</template>
```

### Clickable Chip Label

Chip with clickable label for navigation, separate from removal

```vue
<template>
  <div class="chip-list">
    <InChips
      v-for="category in categories"
      :key="category.id"
      :text="category.name"
      :value="category.id"
      :actionable-label="true"
      @tagClick="viewCategory"
      @click="removeCategory"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const categories = ref([
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Books' }
]);

const viewCategory = (id) => {
  router.push(`/category/${id}`);
};

const removeCategory = (id) => {
  categories.value = categories.value.filter(cat => cat.id !== id);
};
</script>
```

### Selectable Filter Chips

Toggle selection state for filter chips

```vue
<template>
  <div class="filter-chips">
    <InChips
      v-for="filter in filters"
      :key="filter.value"
      :text="filter.label"
      :value="filter.value"
      :selected-status="isFilterActive(filter.value)"
      :actionable-label="true"
      :close-button="false"
      @tagClick="toggleFilter"
    />
  </div>
  
  <p>Active filters: {{ activeFilters }}</p>
</template>

<script setup>
import { ref } from 'vue';

const filters = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Books', value: 'books' },
  { label: 'Clothing', value: 'clothing' }
];

const activeFilters = ref(['electronics']);

const isFilterActive = (value) => {
  return activeFilters.value.includes(value);
};

const toggleFilter = (value) => {
  const index = activeFilters.value.indexOf(value);
  if (index > -1) {
    activeFilters.value.splice(index, 1);
  } else {
    activeFilters.value.push(value);
  }
};
</script>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
```

### Truncated Long Text

Handle long chip text with truncation

```vue
<template>
  <div class="chip-list">
    <InChips
      text="This is a very long chip label that will be truncated"
      value="long-1"
      :max-width="150"
      type="default"
      @click="removeChip"
    />
  </div>
</template>

<script setup>
const removeChip = (value) => {
  console.log('Remove:', value);
};
</script>
```

### Read-Only Chips (No Close Button)

Display-only chips without removal functionality

```vue
<template>
  <div class="chip-list">
    <InChips
      v-for="skill in skills"
      :key="skill"
      :text="skill"
      :value="skill"
      :close-button="false"
      type="smart"
    />
  </div>
</template>

<script setup>
const skills = ['JavaScript', 'Vue.js', 'TypeScript', 'Node.js'];
</script>
```

### Disabled Chip

Non-interactive disabled chip state

```vue
<template>
  <InChips
    text="Disabled Tag"
    value="disabled-1"
    :disabled-status="true"
    type="neutral"
  />
</template>
```

### Status Tags with Color Coding

Use semantic colors for status indication

```vue
<template>
  <div class="status-tags">
    <div class="status-item">
      <span>Order Status:</span>
      <InChips
        :text="orderStatus.label"
        :value="orderStatus.value"
        :type="orderStatus.type"
        styles="solid"
        :close-button="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const status = ref('delivered');

const orderStatus = computed(() => {
  const statusMap = {
    pending: { label: 'Pending', type: 'warning', value: 'pending' },
    processing: { label: 'Processing', type: 'information', value: 'processing' },
    delivered: { label: 'Delivered', type: 'smart', value: 'delivered' },
    cancelled: { label: 'Cancelled', type: 'danger', value: 'cancelled' }
  };
  return statusMap[status.value];
});
</script>

<style scoped>
.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
```

## Common Mistakes

ℹ️ **Missing required value prop**

value prop is required for tracking chip interactions

**Wrong:**
```vue
<InChips text="Tag" @click="remove" />
```

**Correct:**
```vue
<InChips text="Tag" value="tag-1" @click="remove" />
```

ℹ️ **Missing required text prop**

text prop is required for display

**Wrong:**
```vue
<InChips value="1" @click="remove" />
```

**Correct:**
```vue
<InChips text="Label" value="1" @click="remove" />
```

ℹ️ **Confusing @click and @tagClick events**

@click is for close button, @tagClick is for label

**Wrong:**
```vue
<InChips text="Tag" value="1" @click="navigate" />
```

**Correct:**
```vue
<InChips text="Tag" value="1" :actionable-label="true" @tagClick="navigate" @click="remove" />
```

ℹ️ **Not removing chip from list on @click**

Chip should be removed from data array

**Wrong:**
```vue
@click="() => {}"
```

**Correct:**
```vue
@click="(value) => chips = chips.filter(c => c.value !== value)"
```

ℹ️ **Using duplicate values in chip list**

Each chip must have unique value

**Wrong:**
```vue
chips.map((c, i) => ({ text: c, value: 'chip' }))
```

**Correct:**
```vue
chips.map((c, i) => ({ text: c, value: i }))
```

ℹ️ **Setting actionableLabel without @tagClick**

actionableLabel requires event handler

**Wrong:**
```vue
<InChips :actionable-label="true" />
```

**Correct:**
```vue
<InChips :actionable-label="true" @tagClick="handleClick" />
```

ℹ️ **Not using maxWidth for long text**

Long text breaks layout without truncation

**Wrong:**
```vue
<InChips text="Very long chip text here" value="1" />
```

**Correct:**
```vue
<InChips text="Very long chip text" value="1" :max-width="150" />
```

## Best Practices

- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined
- **undefined:** undefined

