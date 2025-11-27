# InDatePickerV2

**Version:** v2

## Props

### `id`

**Type:** `String` | **Required**

### `name`

**Type:** `String` | **Required**

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `state`

**Type:** `String` | **Default:** `"default"`

### `stateMessage`

**Type:** `String` | **Default:** `""`

### `disabledApplyButton`

**Type:** `Boolean` | **Default:** `false`

### `applyButtonTooltip`

**Type:** `String` | **Default:** `""`

### `helperMessageStatus`

**Type:** `Boolean` | **Default:** `false`

### `helperMessage`

**Type:** `String` | **Default:** `""`

### `labelStatus`

**Type:** `Boolean` | **Default:** `true`

### `labelText`

**Type:** `String` | **Default:** `"Label"`

### `placeholderText`

**Type:** `String` | **Default:** `""`

### `value`

**Type:** `any` | **Default:** `""`

### `minDate`

**Type:** `any` | **Default:** `""`

### `maxDate`

**Type:** `any` | **Default:** `""`

### `singleDatePickerStatus`

**Type:** `Boolean` | **Default:** `false`

### `comparisonStatus`

**Type:** `Boolean` | **Default:** `false`

### `disabledComparisonStatus`

**Type:** `Boolean` | **Default:** `false`

### `disabledComparisonTooltipText`

**Type:** `String` | **Default:** `""`

### `calendarPopoverAlign`

**Type:** `String` | **Default:** `"left"`

### `disabledRange`

**Type:** `Object` | **Default:** `"[Function]"`

### `calendarPopoverMessage`

**Type:** `Array` | **Default:** `"[Function]"`

### `specificDates`

**Type:** `Array` | **Default:** `"[Function]"`

### `customRanges`

**Type:** `Array` | **Default:** `"[Function]"`

### `comparedCustomRanges`

**Type:** `Array` | **Default:** `"[Function]"`

### `tooltipStatus`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `clearSelectionButton`

**Type:** `Boolean` | **Default:** `false`

### `dayToMonth`

**Type:** `Boolean` | **Default:** `false`

### `timeZone`

**Type:** `Number` | **Default:** `0`

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `weekStartDay`

**Type:** `String` | **Default:** `"Sunday"`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `defaultRanges`

**Type:** `Array` | **Default:** `"[Function]"`

### `invalidDateMessage`

**Type:** `String` | **Default:** `"Invalid Date"`

### `minMaxDateMessageStatus`

**Type:** `Boolean` | **Default:** `true`

### `periodTooltipPosition`

**Type:** `String` | **Default:** `"bottom center"`

### `locale`

**Type:** `String` | **Default:** `"default"`

### `formatMapping`

**Type:** `Object` | **Default:** `"[Function]"`

## Events

### `periodSelected`

### `comparisonPeriodSelected`

### `dateRangeUpdated`

### `dateComparedRangeUpdated`

### `close`

### `apply`

### `rangeSelected`

## Enums

### INPUT_SELECTORS

- `#firstStart`
- `#firstEnd`
- `#secondStart`
- `#secondEnd`

### WEEK_STARTS



## Examples

### Basic Date Range Picker

Simple date range picker without comparison

```vue
<template>
  <InDatePickerV2
    id="date-picker"
    name="date-picker"
    theme="white"
    label-text="Select Period"
    :value="dateValue"
    :min-date="minDate"
    :max-date="maxDate"
    :locale="locale"
    :format-mapping="formatMapping"
    :quick-range-selection-status="true"
    @apply="handleApply" />
</template>

<script>
import { InDatePickerV2 } from '@useinsider/design-system-vue';

export default {
  components: { InDatePickerV2 },
  
  data() {
    return {
      startDate: '01.12.2024',
      endDate: '20.12.2024',
      minDate: '01.01.2023',
      maxDate: new Date(),
      locale: 'tr-TR',
      formatMapping: {
        'tr-TR': 'dd.mm.yyyy',
        'en-US': 'mm/dd/yyyy',
        'default': 'dd.mm.yyyy'
      }
    };
  },
  
  computed: {
    dateValue() {
      return [{
        startDate: this.startDate,
        endDate: this.endDate
      }];
    }
  },
  
  methods: {
    handleApply(payload) {
      // payload is string: "mm/dd/yyyy-mm/dd/yyyy"
      const [start, end] = payload.split('-');
      this.startDate = this.convertToLocalFormat(start);
      this.endDate = this.convertToLocalFormat(end);
    },
    
    convertToLocalFormat(dateStr) {
      // Convert mm/dd/yyyy to dd.mm.yyyy for Turkish locale
      const [month, day, year] = dateStr.split('/');
      return `${day}.${month}.${year}`;
    }
  }
};
</script>
```

### With Comparison & Dynamic Ranges

Full-featured date picker with comparison mode and dynamically calculated comparison ranges

```vue
<template>
  <InDatePickerV2
    :key="`${datePickerKey}-${startDate}-${endDate}`"
    id="date-picker-compare"
    name="date-picker-compare"
    theme="white"
    label-text="Select Period"
    :value="datePickerValue"
    :min-date="minDate"
    :max-date="maxDate"
    :locale="locale"
    :format-mapping="formatMapping"
    :comparison-status="true"
    :disabled-comparison-status="compareDisabled"
    :quick-range-selection-status="true"
    :custom-ranges="customRangesForV2"
    :compared-custom-ranges="comparedCustomRangesForV2"
    @apply="handleApply"
    @periodSelected="handlePeriodSelected"
    @openComparison="handleOpenComparison"
    @closeComparison="handleCloseComparison" />
</template>

<script>
import { InDatePickerV2 } from '@useinsider/design-system-vue';

export default {
  components: { InDatePickerV2 },
  
  data() {
    return {
      datePickerKey: 0,
      startDate: '01.12.2024',
      endDate: '20.12.2024',
      comparisonStartDate: '',
      comparisonEndDate: '',
      isComparisonActive: false,
      compareDisabled: false,
      comparedCustomRangesForV2: [],
      minDate: '01.01.2023',
      maxDate: new Date(),
      locale: 'tr-TR',
      formatMapping: {
        'tr-TR': 'dd.mm.yyyy',
        'en-US': 'mm/dd/yyyy',
        'default': 'dd.mm.yyyy'
      },
      customDateRanges: {
        'Q4 2024': [new Date('2024-10-01'), new Date('2024-12-31')],
        'Last Quarter': [new Date('2024-07-01'), new Date('2024-09-30')]
      }
    };
  },
  
  computed: {
    datePickerValue() {
      const main = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      
      if (this.isComparisonActive && this.comparisonStartDate && this.comparisonEndDate) {
        return [
          main,
          {
            startDate: this.comparisonStartDate,
            endDate: this.comparisonEndDate
          }
        ];
      }
      
      return [main];
    },
    
    customRangesForV2() {
      return Object.entries(this.customDateRanges).map(([title, dates], index) => ({
        name: `custom${index + 1}`,
        title,
        startDate: this.formatDateToSlash(dates[0]),
        endDate: this.formatDateToSlash(dates[1])
      }));
    }
  },
  
  methods: {
    handlePeriodSelected(range) {
      // Recalculate dynamic comparison ranges
      const start = this.parseDate(range.start);
      const end = this.parseDate(range.end);
      const periodLength = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      // Previous Period
      const prevEnd = new Date(start);
      prevEnd.setDate(start.getDate() - 1);
      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevEnd.getDate() - periodLength + 1);
      
      // Previous Period Last Year
      const lastYearStart = new Date(prevStart);
      lastYearStart.setFullYear(prevStart.getFullYear() - 1);
      const lastYearEnd = new Date(prevEnd);
      lastYearEnd.setFullYear(prevEnd.getFullYear() - 1);
      
      this.comparedCustomRangesForV2 = [{
        name: 'lastYear',
        title: 'Previous Period Last Year',
        startDate: this.formatDateToSlash(lastYearStart),
        endDate: this.formatDateToSlash(lastYearEnd)
      }];
    },
    
    handleApply(payload) {
      if (Array.isArray(payload)) {
        // With comparison
        const [mainRange, comparisonRange] = payload;
        this.applyDateRange(mainRange);
        this.applyComparisonRange(comparisonRange);
      } else {
        // Single range
        this.applyDateRange(payload);
      }
    },
    
    applyDateRange(rangeStr) {
      const [start, end] = rangeStr.split('-');
      this.startDate = this.convertToLocalFormat(start);
      this.endDate = this.convertToLocalFormat(end);
    },
    
    applyComparisonRange(rangeStr) {
      const [start, end] = rangeStr.split('-');
      this.comparisonStartDate = this.convertToLocalFormat(start);
      this.comparisonEndDate = this.convertToLocalFormat(end);
    },
    
    handleOpenComparison() {
      this.isComparisonActive = true;
    },
    
    handleCloseComparison() {
      this.isComparisonActive = false;
      this.comparisonStartDate = '';
      this.comparisonEndDate = '';
    },
    
    formatDateToSlash(date) {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    },
    
    parseDate(dateStr) {
      const parts = dateStr.split(/[/.]/); 
      const isSlash = dateStr.includes('/');
      
      if (isSlash) {
        // mm/dd/yyyy
        const [month, day, year] = parts;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // dd.mm.yyyy
        const [day, month, year] = parts;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    },
    
    convertToLocalFormat(dateStr) {
      const [month, day, year] = dateStr.split('/');
      return `${day}.${month}.${year}`;
    }
  }
};
</script>
```

## Common Mistakes

ℹ️ **Using single v-model instead of dual v-model**

ℹ️ **Not clearing compare dates when toggling off**

ℹ️ **Creating custom ranges in template**

## Best Practices

- **Always Use Dual v-model:** V2 requires separate v-model for start and end dates
- **Provide Custom Ranges for Analytics:** Include common analytics periods as shortcuts
- **Handle Compare Mode Properly:** Clear compare dates when compare is disabled
- **Set Unique ID and Name:** Required for accessibility and form submissions

