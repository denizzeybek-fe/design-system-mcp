# InDatePicker

**Version:** v1

## Props

### `id`

**Type:** `String` | **Required**

### `label`

**Type:** `String` | **Default:** `""`

### `visibleLabel`

**Type:** `Boolean` | **Default:** `true`

### `value`

**Type:** `Object` | **Default:** `"[Function]"`

### `openPosition`

**Type:** `String` | **Default:** `"right"`

### `minDate`

**Type:** `String` | **Default:** `"null"`

### `maxDate`

**Type:** `String` | **Default:** `"null"`

### `singleDatePicker`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `timeZone`

**Type:** `Number` | **Default:** `0`

### `customDateRange`

**Type:** `Boolean` | **Default:** `false`

### `additionalRanges`

**Type:** `Boolean` | **Default:** `false`

### `customRanges`

**Type:** `Object` | **Default:** `"[Function]"`

### `disabledRange`

**Type:** `Array` | **Default:** `"[Function]"`

### `locale`

**Type:** `String` | **Default:** `"default"`

### `separator`

**Type:** `String` | **Default:** `" - "`

### `weekLabel`

**Type:** `String` | **Default:** `"W"`

### `customRangeLabel`

**Type:** `String` | **Default:** `"Custom Range"`

### `daysOfWeek`

**Type:** `Array` | **Default:** `"[Function]"`

### `monthNames`

**Type:** `Array` | **Default:** `"[Function]"`

### `formatMapping`

**Type:** `Object` | **Default:** `"[Function]"`

### `firstDay`

**Type:** `Number` | **Default:** `0`

## Events

### `update`

## Examples

### Basic V1 Date Range Picker

Simple date range picker without custom ranges

```vue
<template>
  <InDatePicker
    id="date-picker"
    label="Select Period"
    :value="dateValue"
    :min-date="minDate"
    :max-date="maxDate"
    :locale="locale"
    :format-mapping="formatMapping"
    :additional-ranges="true"
    open-position="right"
    @update="handleUpdate" />
</template>

<script>
import { InDatePicker } from '@useinsider/design-system-vue';

export default {
  components: { InDatePicker },
  
  data() {
    return {
      startDate: '01/12/2024',
      endDate: '20/12/2024',
      minDate: '01/01/2023',
      maxDate: new Date().toLocaleDateString('en-US'),
      locale: 'en-US',
      formatMapping: {
        'en-US': 'mm/dd/yyyy',
        'tr-TR': 'dd.mm.yyyy',
        'default': 'mm/dd/yyyy'
      }
    };
  },
  
  computed: {
    dateValue() {
      // V1: Plain object (NOT array)
      return {
        startDate: this.startDate,
        endDate: this.endDate
      };
    }
  },
  
  methods: {
    handleUpdate(rangeStr) {
      // V1 always returns string: "mm/dd/yyyy-mm/dd/yyyy"
      const [start, end] = rangeStr.split('-');
      this.startDate = start;
      this.endDate = end;
      
      console.log('Date range selected:', { start, end });
    }
  }
};
</script>
```

### With Custom Ranges & Disabled Dates

V1 date picker with custom quick ranges and disabled date range

```vue
<template>
  <InDatePicker
    id="date-picker-custom"
    label="Reporting Period"
    :value="dateValue"
    :custom-date-range="true"
    :custom-ranges="customRanges"
    :disabled-range="disabledRange"
    :additional-ranges="true"
    :locale="locale"
    :format-mapping="formatMapping"
    open-position="center"
    @update="handleUpdate" />
</template>

<script>
import { InDatePicker } from '@useinsider/design-system-vue';

export default {
  components: { InDatePicker },
  
  data() {
    return {
      startDate: '10/01/2024',
      endDate: '12/31/2024',
      locale: 'en-US',
      formatMapping: {
        'en-US': 'mm/dd/yyyy',
        'default': 'mm/dd/yyyy'
      },
      // V1 custom ranges: Object with Date arrays
      customRanges: {
        'Q4 2024': [new Date('2024-10-01'), new Date('2024-12-31')],
        'Q3 2024': [new Date('2024-07-01'), new Date('2024-09-30')],
        'H2 2024': [new Date('2024-07-01'), new Date('2024-12-31')],
        'Full Year': [new Date('2024-01-01'), new Date('2024-12-31')]
      },
      // V1 disabled range: Unix timestamps in SECONDS
      disabledRange: [
        Math.floor(new Date('2024-12-25').getTime() / 1000), // Christmas
        Math.floor(new Date('2024-12-26').getTime() / 1000)
      ]
    };
  },
  
  computed: {
    dateValue() {
      return {
        startDate: this.startDate,
        endDate: this.endDate
      };
    }
  },
  
  methods: {
    handleUpdate(rangeStr) {
      const [start, end] = rangeStr.split('-');
      this.startDate = start;
      this.endDate = end;
      
      // Update analytics or fetch data
      this.fetchReportData(start, end);
    },
    
    fetchReportData(startDate, endDate) {
      console.log('Fetching data for:', startDate, 'to', endDate);
      // API call here
    }
  }
};
</script>
```

### Turkish Locale with Dot Format

V1 date picker configured for Turkish locale with dd.mm.yyyy format

```vue
<template>
  <InDatePicker
    id="date-picker-tr"
    label="Tarih Aralığı Seçin"
    :value="dateValue"
    :locale="'tr-TR'"
    :format-mapping="formatMapping"
    :additional-ranges="true"
    :custom-date-range="true"
    :custom-ranges="customRanges"
    separator=" - "
    @update="handleUpdate" />
</template>

<script>
import { InDatePicker } from '@useinsider/design-system-vue';

export default {
  components: { InDatePicker },
  
  data() {
    return {
      startDate: '01.12.2024',
      endDate: '31.12.2024',
      formatMapping: {
        'tr-TR': 'dd.mm.yyyy',
        'default': 'dd.mm.yyyy'
      },
      customRanges: {
        'Son Çeyrek': [new Date('2024-10-01'), new Date('2024-12-31')],
        'Bu Yıl': [new Date('2024-01-01'), new Date('2024-12-31')]
      }
    };
  },
  
  computed: {
    dateValue() {
      return {
        startDate: this.startDate,
        endDate: this.endDate
      };
    }
  },
  
  methods: {
    handleUpdate(rangeStr) {
      // Note: rangeStr is still in mm/dd/yyyy format from component
      // Need to convert to dd.mm.yyyy for Turkish display
      const [start, end] = rangeStr.split('-');
      this.startDate = this.convertToTurkishFormat(start);
      this.endDate = this.convertToTurkishFormat(end);
    },
    
    convertToTurkishFormat(usDateStr) {
      // Convert mm/dd/yyyy to dd.mm.yyyy
      const [month, day, year] = usDateStr.split('/');
      return `${day}.${month}.${year}`;
    }
  }
};
</script>
```

