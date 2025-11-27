# InModals

**Version:** v1

## Props

### `id`

**Type:** `String` | **Default:** `""`

### `status`

**Type:** `Boolean` | **Default:** `false`

### `type`

**Type:** `String` | **Default:** `"information"`

### `title`

**Type:** `String` | **Default:** `""`

### `size`

**Type:** `String` | **Default:** `"small"`

### `informationModalDescription`

**Type:** `String` | **Default:** `""`

### `modalStatus`

**Type:** `String` | **Default:** `"default"`

### `acceptButtonType`

**Type:** `String` | **Default:** `"BUTTON_TYPE_PRIMARY"`

### `acceptButtonText`

**Type:** `String` | **Default:** `""`

### `acceptButtonDisable`

**Type:** `Boolean` | **Default:** `false`

### `cancelButtonText`

**Type:** `String` | **Default:** `""`

### `visibleButtons`

**Type:** `Boolean` | **Default:** `true`

### `withSpacing`

**Type:** `String` | **Default:** `"px-5"`

### `closeButtons`

**Type:** `Boolean` | **Default:** `true`

### `modalDescription`

**Type:** `String` | **Default:** `""`

### `withPage`

**Type:** `Boolean` | **Default:** `false`

### `backButtonText`

**Type:** `String` | **Default:** `""`

### `closeOnOverlayClick`

**Type:** `Boolean` | **Default:** `true`

### `hasOverlay`

**Type:** `Boolean` | **Default:** `true`

### `isModalAcceptButtonLoading`

**Type:** `Boolean` | **Default:** `false`

### `withBackOption`

**Type:** `Boolean` | **Default:** `false`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

## Events

### `closeModal`

### `acceptButton`

### `back`

## Examples

### Multi-Step Wizard Modal

Modal with multiple steps/pages for complex workflows

```vue
<template>
  <InModals
    v-model:status="showWizard"
    type="form"
    size="large"
    :title="currentStepTitle"
    :acceptButtonText="isLastStep ? 'Finish' : 'Next'"
    cancelButtonText="Cancel"
    :withPage="true"
    :withBackOption="currentStep > 0"
    backButtonText="Previous"
    :acceptButtonDisable="!isCurrentStepValid"
    :isModalAcceptButtonLoading="isProcessing"
    :closeOnOverlayClick="false"
    @acceptButton="handleNext"
    @back="handleBack"
    @closeModal="handleClose"
  >
    <!-- Step Indicator -->
    <div class="step-indicator">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{
          active: index === currentStep,
          completed: index < currentStep
        }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Step 1: Account Info -->
      <div v-if="currentStep === 0" class="space-y-4">
        <h3>Account Information</h3>
        <div>
          <label>Username</label>
          <input v-model="wizardData.username" type="text" required />
        </div>
        <div>
          <label>Email</label>
          <input v-model="wizardData.email" type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input v-model="wizardData.password" type="password" required />
        </div>
      </div>

      <!-- Step 2: Personal Details -->
      <div v-if="currentStep === 1" class="space-y-4">
        <h3>Personal Details</h3>
        <div>
          <label>First Name</label>
          <input v-model="wizardData.firstName" type="text" required />
        </div>
        <div>
          <label>Last Name</label>
          <input v-model="wizardData.lastName" type="text" required />
        </div>
        <div>
          <label>Phone</label>
          <input v-model="wizardData.phone" type="tel" />
        </div>
      </div>

      <!-- Step 3: Preferences -->
      <div v-if="currentStep === 2" class="space-y-4">
        <h3>Preferences</h3>
        <div>
          <label>
            <input v-model="wizardData.newsletter" type="checkbox" />
            Subscribe to newsletter
          </label>
        </div>
        <div>
          <label>
            <input v-model="wizardData.notifications" type="checkbox" />
            Enable notifications
          </label>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div v-if="currentStep === 3" class="space-y-4">
        <h3>Review Your Information</h3>
        <div class="review-section">
          <h4>Account</h4>
          <p>Username: {{ wizardData.username }}</p>
          <p>Email: {{ wizardData.email }}</p>
        </div>
        <div class="review-section">
          <h4>Personal</h4>
          <p>Name: {{ wizardData.firstName }} {{ wizardData.lastName }}</p>
          <p>Phone: {{ wizardData.phone || 'Not provided' }}</p>
        </div>
        <div class="review-section">
          <h4>Preferences</h4>
          <p>Newsletter: {{ wizardData.newsletter ? 'Yes' : 'No' }}</p>
          <p>Notifications: {{ wizardData.notifications ? 'Yes' : 'No' }}</p>
        </div>
      </div>
    </div>
  </InModals>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InModals } from '@useinsider/design-system-vue';

const showWizard = ref(true);
const currentStep = ref(0);
const isProcessing = ref(false);

const steps = [
  { label: 'Account', validate: () => validateStep1() },
  { label: 'Personal', validate: () => validateStep2() },
  { label: 'Preferences', validate: () => true },
  { label: 'Review', validate: () => true }
];

const wizardData = ref({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  newsletter: false,
  notifications: true
});

const currentStepTitle = computed(() => {
  const titles = [
    'Step 1: Account Information',
    'Step 2: Personal Details',
    'Step 3: Preferences',
    'Step 4: Review'
  ];
  return titles[currentStep.value];
});

const isLastStep = computed(() => currentStep.value === steps.length - 1);

const isCurrentStepValid = computed(() => {
  return steps[currentStep.value].validate();
});

const validateStep1 = () => {
  return (
    wizardData.value.username.length >= 3 &&
    wizardData.value.email.includes('@') &&
    wizardData.value.password.length >= 8
  );
};

const validateStep2 = () => {
  return (
    wizardData.value.firstName.length > 0 &&
    wizardData.value.lastName.length > 0
  );
};

const handleNext = async () => {
  if (isLastStep.value) {
    // Submit wizard
    isProcessing.value = true;
    try {
      await submitWizard();
      showWizard.value = false;
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      isProcessing.value = false;
    }
  } else {
    // Go to next step
    currentStep.value++;
  }
};

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleClose = () => {
  if (confirm('Exit wizard? Your progress will be lost.')) {
    showWizard.value = false;
  }
};

const submitWizard = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Wizard submitted:', wizardData.value);
};
</script>

<style scoped>
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
}

.step.active,
.step.completed {
  opacity: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  font-weight: 600;
}

.step.active .step-number {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #6b7280;
}

.step.active .step-label {
  color: #1f2937;
  font-weight: 500;
}

.step-content {
  min-height: 300px;
}

.review-section {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.review-section h4 {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #1f2937;
}

.review-section p {
  margin: 4px 0;
  color: #4b5563;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
}
</style>
```

## Common Mistakes

ℹ️ **Not handling XSS in user-generated content**

ℹ️ **Missing error handling in accept button handler**

ℹ️ **Using closeOnOverlayClick for forms**

ℹ️ **Not disabling accept button during loading**

## Best Practices

- **Use Appropriate Modal Type:** Choose the correct type based on the modal's purpose for clear user communication
- **Disable Overlay Click for Forms:** Prevent accidental data loss by disabling overlay click on forms with user input
- **Show Loading State on Async Actions:** Use isModalAcceptButtonLoading during async operations to provide feedback
- **Use v-model for Status:** Use v-model:status for cleaner two-way binding of modal visibility

