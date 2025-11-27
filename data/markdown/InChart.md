# InChart

**Version:** v1

## Props

### `type`

**Type:** `String` | **Required**

### `labels`

**Type:** `Array` | **Required**

### `data`

**Type:** `Array` | **Required**

### `dataText`

**Type:** `Array` | **Default:** `"[Function]"`

### `dataTooltips`

**Type:** `Array` | **Default:** `"[Function]"`

### `backgroundColor`

**Type:** `Array` | **Default:** `"[Function]"`

### `width`

**Type:** `Number` | **Default:** `0`

### `height`

**Type:** `Number` | **Default:** `0`

### `theme`

**Type:** `String` | **Default:** `"blue"`

### `labelLimit`

**Type:** `Number` | **Default:** `12`

### `labelLimitYAxes`

**Type:** `Number` | **Default:** `5`

### `labelOffsetX`

**Type:** `Number` | **Default:** `0`

### `drawYLine`

**Type:** `Boolean` | **Default:** `false`

### `drawXLine`

**Type:** `Boolean` | **Default:** `true`

### `step`

**Type:** `Object` | **Default:** `"[Function]"`

### `tooltipsExtraSettings`

**Type:** `Object` | **Default:** `"[Function]"`

### `labelXAxesTicksExtraSettings`

**Type:** `Object` | **Default:** `"[Function]"`

### `labelYAxesTicksExtraSettings`

**Type:** `Object` | **Default:** `"[Function]"`

### `labelYAxeScaleType`

**Type:** `String` | **Default:** `"linear"`

### `labelRotationXAxes`

**Type:** `Number` | **Default:** `0`

### `noDataIconStatus`

**Type:** `Boolean` | **Default:** `true`

### `noDataTitle`

**Type:** `String` | **Default:** `""`

### `noDataDescription`

**Type:** `String` | **Default:** `""`

### `legendSettings`

**Type:** `Object` | **Default:** `"[Function]"`

### `legendNames`

**Type:** `Array` | **Default:** `"[Function]"`

### `colorPalette`

**Type:** `Array` | **Default:** `"[Function]"`

### `chartAnnotations`

**Type:** `Array` | **Default:** `"[Function]"`

### `annotationsExtraSettings`

**Type:** `Object` | **Default:** `"[Function]"`

### `datasetSettings`

**Type:** `Array` | **Default:** `"[Function]"`

### `iconLocations`

**Type:** `Array` | **Default:** `"[Function]"`

### `enableUsDateFormat`

**Type:** `Boolean` | **Default:** `false`

### `showDescription`

**Type:** `Boolean` | **Default:** `true`

### `hintIcon`

**Type:** `String` | **Default:** `"line-tooltip"`

### `singleInfoIcons`

**Type:** `Array` | **Default:** `"[Function]"`

## Examples

### Sales Trend Analysis

Line chart showing monthly sales with target annotation

```vue
<script setup>
import { ref } from 'vue';
import { InChart } from '@useinsider/design-system-vue';

const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
const salesData = ref([[120, 150, 140, 180, 200, 190]]);

const targetLine = ref([{
  type: 'line',
  value: 150,
  borderColor: 'red',
  label: { content: 'Target', enabled: true }
}]);
</script>

<template>
  <InChart
    type="line"
    :labels="labels"
    :data="salesData"
    :chart-annotations="targetLine"
    :width="800"
    :height="400"
    theme="blue"
  />
</template>
```

### Traffic Source Distribution

Pie chart showing website traffic sources

```vue
<script setup>
import { ref } from 'vue';
import { InChart } from '@useinsider/design-system-vue';

const sources = ref(['Direct', 'Organic', 'Paid', 'Social']);
const traffic = ref([[45, 30, 15, 10]]);
const colors = ref(['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']);
</script>

<template>
  <InChart
    type="pie"
    :labels="sources"
    :data="traffic"
    :color-palette="colors"
    :legend-settings="{ position: 'bottom' }"
  />
</template>
```

### Multi-Year Comparison

Bar chart comparing quarterly revenue across years

```vue
<script setup>
import { ref } from 'vue';
import { InChart } from '@useinsider/design-system-vue';

const quarters = ref(['Q1', 'Q2', 'Q3', 'Q4']);
const revenue = ref([
  [100, 120, 140, 160], // 2023
  [110, 130, 150, 170]  // 2024
]);

const datasets = ref([
  { label: '2023', backgroundColor: '#36A2EB' },
  { label: '2024', backgroundColor: '#FF6384' }
]);
</script>

<template>
  <InChart
    type="bar"
    :labels="quarters"
    :data="revenue"
    :dataset-settings="datasets"
  />
</template>
```

## Common Mistakes

ℹ️ **Not matching data and labels array lengths**

ℹ️ **Using single array instead of nested array for data**

ℹ️ **Forgetting to set width/height for responsive charts**

ℹ️ **Not providing color palette for multi-dataset charts**

## Best Practices

- **Always Provide Accessible Labels:** Add aria-label to chart container for screen reader users
- **Use Annotations for Important Thresholds:** Highlight targets, limits, or significant values with annotation lines
- **Aggregate Large Datasets:** Group data into larger time periods for better performance and readability
- **Customize Tooltips for Better Context:** Add custom formatting to tooltip values for clarity

