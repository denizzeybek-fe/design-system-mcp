# InTextInput

**Version:** v1

## Props

### `id`

**Type:** `String` | **Required**

### `name`

**Type:** `String` | **Required**

### `value`

**Type:** `String | Number` | **Default:** `""`

### `withLabel`

**Type:** `Boolean` | **Default:** `true`

### `label`

**Type:** `String` | **Default:** `""`

### `labelTooltip`

**Type:** `String` | **Default:** `""`

### `type`

**Type:** `String` | **Default:** `"text"`

### `placeholder`

**Type:** `String` | **Required**

### `disable`

**Type:** `Boolean | Number` | **Default:** `false`

### `invalid`

**Type:** `Boolean` | **Default:** `false`

### `invalidMessage`

**Type:** `String` | **Default:** `""`

### `small`

**Type:** `Boolean` | **Default:** `false`

### `withIcon`

**Type:** `Boolean` | **Default:** `false`

### `iconName`

**Type:** `String` | **Default:** `"search"`

### `iconPosition`

**Type:** `String` | **Default:** `"left"`

### `theme`

**Type:** `String` | **Default:** `"grey"`

### `autoComplete`

**Type:** `String` | **Default:** `"off"`

### `skeletonStatus`

**Type:** `Boolean` | **Default:** `false`

### `skeletonSizing`

**Type:** `Object` | **Default:** `"[Function]"`

### `accept`

**Type:** `String` | **Default:** `""`

### `warning`

**Type:** `Boolean` | **Default:** `false`

### `warningMessage`

**Type:** `String` | **Default:** `""`

### `withSuffix`

**Type:** `Boolean` | **Default:** `false`

### `suffix`

**Type:** `String` | **Default:** `"%"`

### `maxLength`

**Type:** `Number | String` | **Default:** `""`

### `min`

**Type:** `Number | String` | **Default:** `0`

### `autoFocus`

**Type:** `Boolean` | **Default:** `false`

### `allowDecimal`

**Type:** `Boolean` | **Default:** `false`

### `allowComma`

**Type:** `Boolean` | **Default:** `true`

### `prefix`

**Type:** `Boolean | String` | **Default:** `false`

### `preventXss`

**Type:** `Boolean` | **Default:** `true`

## Events

### `keyup`

### `enter`

### `focus`

### `blur`

### `click`

### `input`

### `change`

### `iconClick`

## Examples

### Complete Registration Form

Multi-field registration form with validation, icons, and different input types

```vue
<template>
  <form @submit.prevent="handleSubmit" class="registration-form">
    <h2>Create Account</h2>

    <!-- Username -->
    <InTextInput
      id="username"
      name="username"
      v-model="form.username"
      type="text"
      label="Username"
      placeholder="Choose a username"
      :withIcon="true"
      iconName="user"
      iconPosition="left"
      :maxLength="30"
      :invalid="errors.username !== ''"
      :invalidMessage="errors.username"
      autoComplete="username"
      @blur="validateField('username')"
    />

    <!-- Email -->
    <InTextInput
      id="email"
      name="email"
      v-model="form.email"
      type="email"
      label="Email Address"
      placeholder="your@email.com"
      :withIcon="true"
      iconName="email"
      iconPosition="left"
      :invalid="errors.email !== ''"
      :invalidMessage="errors.email"
      autoComplete="email"
      @blur="validateField('email')"
    />

    <!-- Password -->
    <InTextInput
      id="password"
      name="password"
      v-model="form.password"
      :type="showPassword ? 'text' : 'password'"
      label="Password"
      labelTooltip="At least 8 characters with uppercase, lowercase, and numbers"
      placeholder="Create a strong password"
      :withIcon="true"
      :iconName="showPassword ? 'visibility_off' : 'visibility'"
      iconPosition="right"
      :invalid="errors.password !== ''"
      :invalidMessage="errors.password"
      autoComplete="new-password"
      @iconClick="showPassword = !showPassword"
      @blur="validateField('password')"
    />

    <!-- Confirm Password -->
    <InTextInput
      id="confirm-password"
      name="confirmPassword"
      v-model="form.confirmPassword"
      type="password"
      label="Confirm Password"
      placeholder="Re-enter your password"
      :invalid="errors.confirmPassword !== ''"
      :invalidMessage="errors.confirmPassword"
      autoComplete="new-password"
      @blur="validateField('confirmPassword')"
    />

    <!-- Phone Number -->
    <InTextInput
      id="phone"
      name="phone"
      v-model="form.phone"
      type="tel"
      label="Phone Number (Optional)"
      placeholder="+1 (555) 123-4567"
      :withIcon="true"
      iconName="phone"
      :prefix="'+1'"
      :warning="form.phone && !isValidPhone"
      warningMessage="Phone number format may be invalid"
      autoComplete="tel"
    />

    <!-- Age -->
    <InTextInput
      id="age"
      name="age"
      v-model.number="form.age"
      type="number"
      label="Age"
      placeholder="18"
      :min="18"
      :allowDecimal="false"
      :invalid="errors.age !== ''"
      :invalidMessage="errors.age"
      @blur="validateField('age')"
    />

    <!-- Submit -->
    <button type="submit" :disabled="!isFormValid || submitting">
      {{ submitting ? 'Creating Account...' : 'Create Account' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InTextInput } from '@useinsider/design-system-vue';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  age: number;
}

const form = ref<FormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  age: 0
});

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: ''
});

const showPassword = ref(false);
const submitting = ref(false);

const isValidPhone = computed(() => {
  const phoneRegex = /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(form.value.phone);
});

const validateField = (field: keyof typeof errors.value) => {
  switch (field) {
    case 'username':
      if (!form.value.username) {
        errors.value.username = 'Username is required';
      } else if (form.value.username.length < 3) {
        errors.value.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(form.value.username)) {
        errors.value.username = 'Username can only contain letters, numbers, and underscores';
      } else {
        errors.value.username = '';
      }
      break;

    case 'email':
      if (!form.value.email) {
        errors.value.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Invalid email format';
      } else {
        errors.value.email = '';
      }
      break;

    case 'password':
      if (!form.value.password) {
        errors.value.password = 'Password is required';
      } else if (form.value.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
        errors.value.password = 'Password must contain uppercase, lowercase, and numbers';
      } else {
        errors.value.password = '';
      }
      break;

    case 'confirmPassword':
      if (form.value.confirmPassword !== form.value.password) {
        errors.value.confirmPassword = 'Passwords do not match';
      } else {
        errors.value.confirmPassword = '';
      }
      break;

    case 'age':
      if (form.value.age < 18) {
        errors.value.age = 'You must be at least 18 years old';
      } else if (form.value.age > 120) {
        errors.value.age = 'Please enter a valid age';
      } else {
        errors.value.age = '';
      }
      break;
  }
};

const isFormValid = computed(() => {
  return (
    form.value.username &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    Object.values(errors.value).every(error => error === '')
  );
});

const handleSubmit = async () => {
  // Validate all fields
  Object.keys(errors.value).forEach(field => {
    validateField(field as keyof typeof errors.value);
  });

  if (!isFormValid.value) return;

  submitting.value = true;

  try {
    // API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Registration successful:', form.value);
    // Redirect to success page
  } catch (error) {
    console.error('Registration failed:', error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.registration-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
}

.registration-form > * + * {
  margin-top: 16px;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  margin-top: 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button[type="submit"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### Advanced Search Filter Panel

Search interface with multiple input types, filters, and real-time results

```vue
<template>
  <div class="search-panel">
    <div class="search-header">
      <h3>Product Search</h3>
      <button @click="resetFilters" class="reset-btn">Reset All</button>
    </div>

    <!-- Main Search -->
    <InTextInput
      id="main-search"
      name="query"
      v-model="filters.query"
      type="search"
      placeholder="Search by name, SKU, or description..."
      :withIcon="true"
      iconName="search"
      iconPosition="left"
      :withLabel="false"
      autoComplete="off"
      :autoFocus="true"
      @input="handleSearchDebounced"
      @enter="performSearch"
    />

    <div class="filters-grid">
      <!-- Price Range -->
      <div class="filter-group">
        <h4>Price Range</h4>
        <div class="price-inputs">
          <InTextInput
            id="price-min"
            name="priceMin"
            v-model.number="filters.priceMin"
            type="number"
            placeholder="Min"
            prefix="$"
            :min="0"
            :allowDecimal="true"
            :small="true"
            :withLabel="false"
            @change="performSearch"
          />
          <span class="separator">to</span>
          <InTextInput
            id="price-max"
            name="priceMax"
            v-model.number="filters.priceMax"
            type="number"
            placeholder="Max"
            prefix="$"
            :min="0"
            :allowDecimal="true"
            :small="true"
            :withLabel="false"
            @change="performSearch"
          />
        </div>
      </div>

      <!-- SKU -->
      <InTextInput
        id="sku"
        name="sku"
        v-model="filters.sku"
        type="text"
        label="SKU"
        placeholder="e.g., PROD-12345"
        :maxLength="20"
        @change="performSearch"
      />

      <!-- Stock Quantity -->
      <InTextInput
        id="stock-min"
        name="stockMin"
        v-model.number="filters.stockMin"
        type="number"
        label="Minimum Stock"
        placeholder="0"
        :withSuffix="true"
        suffix="units"
        :min="0"
        :allowDecimal="false"
        @change="performSearch"
      />

      <!-- Discount -->
      <InTextInput
        id="discount"
        name="discount"
        v-model.number="filters.discount"
        type="number"
        label="Min Discount"
        placeholder="0"
        :withSuffix="true"
        suffix="%"
        :min="0"
        :max="100"
        :allowDecimal="false"
        @change="performSearch"
      />

      <!-- Supplier Email -->
      <InTextInput
        id="supplier-email"
        name="supplierEmail"
        v-model="filters.supplierEmail"
        type="email"
        label="Supplier Email"
        placeholder="supplier@example.com"
        :withIcon="true"
        iconName="email"
        @change="performSearch"
      />

      <!-- Product URL -->
      <InTextInput
        id="product-url"
        name="productUrl"
        v-model="filters.productUrl"
        type="url"
        label="Product URL (Optional)"
        placeholder="https://example.com/product"
        prefix="https://"
        @change="performSearch"
      />
    </div>

    <!-- Results Summary -->
    <div class="results-summary">
      <p v-if="loading">Searching...</p>
      <p v-else-if="results.length > 0">
        Found {{ results.length }} product{{ results.length === 1 ? '' : 's' }}
      </p>
      <p v-else-if="hasActiveFilters">No products match your filters</p>
      <p v-else>Enter search criteria to find products</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InTextInput } from '@useinsider/design-system-vue';
import { useDebounceFn } from '@vueuse/core';

interface Filters {
  query: string;
  priceMin: number;
  priceMax: number;
  sku: string;
  stockMin: number;
  discount: number;
  supplierEmail: string;
  productUrl: string;
}

const filters = ref<Filters>({
  query: '',
  priceMin: 0,
  priceMax: 0,
  sku: '',
  stockMin: 0,
  discount: 0,
  supplierEmail: '',
  productUrl: ''
});

const results = ref<any[]>([]);
const loading = ref(false);

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => 
    value !== '' && value !== 0
  );
});

const performSearch = async () => {
  if (!hasActiveFilters.value) {
    results.value = [];
    return;
  }

  loading.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Searching with filters:', filters.value);
    
    // Mock results
    results.value = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' }
    ];
  } catch (error) {
    console.error('Search failed:', error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSearchDebounced = useDebounceFn(() => {
  performSearch();
}, 500);

const resetFilters = () => {
  filters.value = {
    query: '',
    priceMin: 0,
    priceMax: 0,
    sku: '',
    stockMin: 0,
    discount: 0,
    supplierEmail: '',
    productUrl: ''
  };
  results.value = [];
};
</script>

<style scoped>
.search-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reset-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.filter-group h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  color: #666;
  font-size: 14px;
}

.results-summary {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}
</style>
```

## Common Mistakes

ℹ️ **Using same ID for multiple inputs**

ℹ️ **Disabling XSS protection for user inputs**

ℹ️ **Not validating on blur, validating on every keystroke instead**

ℹ️ **Not debouncing search inputs**

ℹ️ **Using type='number' without min/max or allowDecimal settings**

ℹ️ **Forgetting autoComplete attributes**

## Best Practices

- **Always Provide Unique IDs:** Generate unique id for each input to ensure proper label association and accessibility
- **Use Appropriate Input Types:** Choose the correct type prop for better validation and mobile keyboard optimization
- **Implement Proper Validation:** Validate on blur for better UX, show clear error messages, and prevent invalid form submission
- **Debounce Search and Real-time Inputs:** Add debouncing to search inputs and live-update fields to reduce API calls and improve performance

