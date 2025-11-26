# InSelect

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `"qa-select"`

### `options`

**Type:** `Array` | **Default:** `"[Function]"`

### `value`

**Type:** `Array` | **Default:** `"[Function]"`

### `loadingState`

**Type:** `Boolean` | **Default:** `false`

### `labelStatus`

**Type:** `Boolean` | **Default:** `true`

### `labelText`

**Type:** `String` | **Default:** `""`

### `tooltipStatus`

**Type:** `Boolean` | **Default:** `false`

### `tooltipText`

**Type:** `String` | **Default:** `""`

### `disabledStatus`

**Type:** `Boolean` | **Default:** `false`

### `dropdownMenuStatus`

**Type:** `Boolean` | **Default:** `false`

### `searchStatus`

**Type:** `Boolean` | **Default:** `false`

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `buttonType`

**Type:** `String` | **Default:** `"dropdown"`

### `placeholderText`

**Type:** `String` | **Default:** `""`

### `clearSelectionButton`

**Type:** `Boolean` | **Default:** `false`

### `staticPosition`

**Type:** `String` | **Default:** `"BOTTOM_LEFT"`

### `dynamicPosition`

**Type:** `Boolean` | **Default:** `false`

### `dynamicChildPosition`

**Type:** `Boolean` | **Default:** `true`

### `staticChildPosition`

**Type:** `String` | **Default:** `"BOTTOM_RIGHT"`

### `createButtonLabel`

**Type:** `String` | **Default:** `""`

### `createOptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `buttonStatus`

**Type:** `Boolean` | **Default:** `true`

### `buttonIcon`

**Type:** `String` | **Default:** `""`

### `buttonLabel`

**Type:** `String` | **Default:** `""`

### `state`

**Type:** `String` | **Default:** `"default"`

### `stateMessage`

**Type:** `String` | **Default:** `"State Message"`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `optionValidationType`

**Type:** `any` | **Default:** `"VALIDATIONS.All"`

### `minCharacterLimit`

**Type:** `Number | String` | **Default:** `1`

### `maxCharacterLimit`

**Type:** `Number | String` | **Default:** `10`

### `optionValidationText`

**Type:** `String` | **Default:** `"Enter a valid value to continue."`

### `characterLimitValidationText`

**Type:** `String` | **Default:** `"Enter a value between 1 and 10 characters to continue."`

### `bottomOffsetForDynamicPosition`

**Type:** `Number` | **Default:** `0`

### `maxHeight`

**Type:** `Number` | **Default:** `240`

### `maxChildHeight`

**Type:** `Number` | **Default:** `480`

### `fetchPage`

**Type:** `Number` | **Default:** `1`

### `lazyLoad`

**Type:** `Boolean` | **Default:** `false`

### `lazyLoadSearch`

**Type:** `Boolean` | **Default:** `false`

### `isWrappedDescription`

**Type:** `Boolean` | **Default:** `false`

### `helperMessageStatus`

**Type:** `Boolean` | **Default:** `false`

### `helperMessage`

**Type:** `String` | **Default:** `""`

### `customOptionText`

**Type:** `String` | **Default:** `""`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

### `preventFocus`

**Type:** `Boolean` | **Default:** `false`

### `allowAddAllCases`

**Type:** `Boolean` | **Default:** `true`

### `sameValueExistsValidationText`

**Type:** `String` | **Default:** `"This value already exists."`

## Events

### `openList`

### `close`

### `selectedInActiveOption`

### `select`

### `search`

### `unSelect`

### `endScroll`

### `secondaryButtonClick`

## Enums

### KEY_KODE_ENUMS



## Examples

### Basic Single Select

Simple dropdown with static options

```vue
<template>
  <InSelect
    id="status-select"
    label-text="Status"
    placeholder-text="Select status"
    :options="statusOptions"
    :value="selectedStatus"
    @optionClick="handleSelect" />
</template>

<script>
import { InSelect } from '@useinsider/design-system-vue';

export default {
  components: { InSelect },
  data() {
    return {
      statusOptions: [
        { text: 'Active', value: 'active' },
        { text: 'Pending', value: 'pending' },
        { text: 'Inactive', value: 'inactive' }
      ],
      selectedStatus: [] // Empty = no selection
    };
  },
  methods: {
    handleSelect(option) {
      this.selectedStatus = [option]; // CRITICAL: Always array!
      console.log('Selected:', option.value);
    }
  }
};
</script>
```

### With Search and Icons

Searchable dropdown with icons

```vue
<template>
  <InSelect
    id="country-select"
    label-text="Country"
    placeholder-text="Search countries..."
    :search-status="true"
    :options="countryOptions"
    :value="selectedCountry"
    @optionClick="handleSelect"
    @search="handleSearch" />
</template>

<script>
import { InSelect } from '@useinsider/design-system-vue';

export default {
  components: { InSelect },
  data() {
    return {
      allCountries: [
        { text: 'United States', value: 'US', icon: 'flag-us' },
        { text: 'United Kingdom', value: 'UK', icon: 'flag-uk' },
        { text: 'Turkey', value: 'TR', icon: 'flag-tr' },
        // ... more countries
      ],
      countryOptions: [],
      selectedCountry: []
    };
  },
  created() {
    this.countryOptions = this.allCountries;
  },
  methods: {
    handleSelect(option) {
      this.selectedCountry = [option];
    },
    handleSearch(query) {
      if (!query) {
        this.countryOptions = this.allCountries;
        return;
      }
      this.countryOptions = this.allCountries.filter(country =>
        country.text.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};
</script>
```

### Lazy Loading with Infinite Scroll

Load options on scroll for large datasets

```vue
<template>
  <InSelect
    id="user-select"
    label-text="Select User"
    :search-status="true"
    :lazy-load="true"
    :lazy-load-search="true"
    :fetch-page="currentPage"
    :options="users"
    :value="selectedUser"
    :loading-state="isLoading"
    @optionClick="handleSelect"
    @search="handleSearch"
    @endScroll="loadMore" />
</template>

<script>
import { InSelect } from '@useinsider/design-system-vue';

export default {
  components: { InSelect },
  data() {
    return {
      users: [],
      selectedUser: [],
      currentPage: 1,
      isLoading: false,
      searchQuery: ''
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.isLoading = true;
      try {
        const response = await fetch(
          `/api/users?page=${this.currentPage}&search=${this.searchQuery}`
        );
        const data = await response.json();
        
        // Transform API response to select format
        const newUsers = data.users.map(u => ({
          text: u.name,
          value: u.id,
          description: u.email
        }));
        
        this.users = [...this.users, ...newUsers];
      } finally {
        this.isLoading = false;
      }
    },
    
    loadMore() {
      this.currentPage++;
      this.loadUsers();
    },
    
    handleSearch(query) {
      this.searchQuery = query;
      this.currentPage = 1;
      this.users = []; // Clear existing
      this.loadUsers();
    },
    
    handleSelect(option) {
      this.selectedUser = [option];
    }
  }
};
</script>
```

### Grouped Options

Options organized in groups

```vue
<template>
  <InSelect
    id="product-select"
    label-text="Select Product"
    :options="productOptions"
    :value="selectedProduct"
    @optionClick="handleSelect" />
</template>

<script>
import { InSelect } from '@useinsider/design-system-vue';

export default {
  components: { InSelect },
  data() {
    return {
      productOptions: [
        {
          groupLabel: 'Marketing',
          options: [
            { text: 'Email Marketing', value: 'email' },
            { text: 'SMS Marketing', value: 'sms' }
          ]
        },
        {
          groupLabel: 'Analytics',
          options: [
            { text: 'Web Analytics', value: 'web' },
            { text: 'Mobile Analytics', value: 'mobile' }
          ]
        }
      ],
      selectedProduct: []
    };
  },
  methods: {
    handleSelect(option) {
      this.selectedProduct = [option];
    }
  }
};
</script>
```

