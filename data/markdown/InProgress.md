# InProgress

**Version:** v1

## Props

### `status`

**Type:** `Boolean` | **Default:** `true`

### `id`

**Type:** `String` | **Required**

### `value`

**Type:** `Number` | **Default:** `0`

### `maxValue`

**Type:** `Number` | **Default:** `100`

### `descriptionStatus`

**Type:** `Boolean` | **Default:** `false`

### `description`

**Type:** `String` | **Default:** `""`

### `descriptionPosition`

**Type:** `String` | **Default:** `"left"`

### `invalid`

**Type:** `Boolean` | **Default:** `false`

### `invalidType`

**Type:** `String` | **Default:** `"button"`

### `invalidMessage`

**Type:** `String` | **Default:** `""`

### `invalidIcon`

**Type:** `String` | **Default:** `"line-redo"`

### `success`

**Type:** `Boolean` | **Default:** `false`

### `successMessage`

**Type:** `String` | **Default:** `""`

### `successIcon`

**Type:** `String` | **Default:** `"line-check-netural"`

### `semiCircle`

**Type:** `Boolean` | **Default:** `false`

### `type`

**Type:** `String` | **Default:** `"default"`

### `semiCircleWidth`

**Type:** `Number` | **Default:** `300`

### `variant`

**Type:** `String` | **Default:** `"default"`

### `completed`

**Type:** `Boolean` | **Default:** `false`

## Events

### `click`

## Enums

### VARIANTS

- `default`
- `indeterminate`

## Examples

### File Upload with Multi-File Progress

Track multiple file uploads with individual progress bars

```vue
<template>
  <div class="upload-manager">
    <h3>Uploading {{ files.length }} files</h3>
    <div v-for="file in files" :key="file.id" class="file-progress">
      <InProgress
        :id="`upload-${file.id}`"
        :value="file.progress"
        :maxValue="100"
        :success="file.status === 'completed'"
        :successMessage="`${file.name} uploaded`"
        :invalid="file.status === 'error'"
        :invalidMessage="file.error"
        :invalidType="'button'"
        :descriptionStatus="true"
        :description="getFileDescription(file)"
        @click="retryUpload(file)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FileUpload {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const files = ref<FileUpload[]>([
  { id: '1', name: 'report.pdf', progress: 45, status: 'uploading' },
  { id: '2', name: 'data.csv', progress: 100, status: 'completed' },
  { id: '3', name: 'image.jpg', progress: 23, status: 'error', error: 'Network timeout' }
]);

const getFileDescription = (file: FileUpload) => {
  if (file.status === 'completed') return file.name;
  if (file.status === 'error') return `Failed: ${file.name}`;
  return `Uploading ${file.name}... ${file.progress}%`;
};

const retryUpload = async (file: FileUpload) => {
  file.progress = 0;
  file.status = 'uploading';
  file.error = undefined;
  
  // Simulate upload
  const interval = setInterval(() => {
    file.progress += 10;
    if (file.progress >= 100) {
      clearInterval(interval);
      file.status = 'completed';
    }
  }, 300);
};
</script>
```

### Dashboard Performance Gauges

Multiple semi-circle gauges showing KPI metrics

```vue
<template>
  <div class="kpi-dashboard">
    <div class="kpi-row">
      <div class="kpi-card">
        <h4>Campaign Completion</h4>
        <InProgress
          id="campaign-progress"
          :value="kpis.campaignCompletion"
          :semiCircle="true"
          :semiCircleWidth="200"
          :descriptionStatus="true"
          :description="`${kpis.campaignCompletion}%`"
          descriptionPosition="bottom"
        />
      </div>
      
      <div class="kpi-card">
        <h4>Goal Achievement</h4>
        <InProgress
          id="goal-progress"
          :value="kpis.goalAchievement"
          :semiCircle="true"
          :semiCircleWidth="200"
          :success="kpis.goalAchievement >= 100"
          :descriptionStatus="true"
          :description="`${kpis.goalAchievement}%`"
          descriptionPosition="bottom"
        />
      </div>
      
      <div class="kpi-card">
        <h4>System Health</h4>
        <InProgress
          id="health-progress"
          :value="kpis.systemHealth"
          :semiCircle="true"
          :semiCircleWidth="200"
          :invalid="kpis.systemHealth < 50"
          :descriptionStatus="true"
          :description="`${kpis.systemHealth}%`"
          descriptionPosition="bottom"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const kpis = ref({
  campaignCompletion: 67,
  goalAchievement: 103,
  systemHealth: 89
});

// Update KPIs from API
onMounted(async () => {
  const data = await fetchKPIs();
  kpis.value = data;
});
</script>

<style scoped>
.kpi-dashboard {
  padding: 20px;
}

.kpi-row {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.kpi-card {
  text-align: center;
}
</style>
```

### Multi-Step Process with Progress

Show progress through a multi-step workflow

```vue
<template>
  <div class="workflow">
    <div class="workflow-header">
      <h3>Data Import Process</h3>
      <p>Step {{ currentStep }} of {{ totalSteps }}</p>
    </div>
    
    <InProgress
      id="workflow-progress"
      :value="currentStep"
      :maxValue="totalSteps"
      :descriptionStatus="true"
      :description="stepDescriptions[currentStep - 1]"
      descriptionPosition="top"
      :variant="isProcessing ? 'indeterminate' : 'default'"
      :success="currentStep === totalSteps && !isProcessing"
      :successMessage="'Import completed successfully!'"
      :invalid="hasError"
      :invalidMessage="errorMessage"
      :invalidType="'button'"
      @click="retryCurrentStep"
    />
    
    <div class="workflow-actions" v-if="!hasError && currentStep < totalSteps">
      <button @click="processNextStep" :disabled="isProcessing">
        {{ isProcessing ? 'Processing...' : 'Next Step' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const totalSteps = 5;
const isProcessing = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

const stepDescriptions = [
  'Validating file format...',
  'Parsing data structure...',
  'Checking data integrity...',
  'Importing records...',
  'Finalizing import...'
];

const processNextStep = async () => {
  isProcessing.value = true;
  hasError.value = false;
  
  try {
    // Simulate step processing
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random error
        if (Math.random() > 0.85) {
          reject(new Error(`Failed at ${stepDescriptions[currentStep.value - 1]}`));
        } else {
          resolve(true);
        }
      }, 2000);
    });
    
    currentStep.value++;
  } catch (error) {
    hasError.value = true;
    errorMessage.value = error.message;
  } finally {
    isProcessing.value = false;
  }
};

const retryCurrentStep = () => {
  hasError.value = false;
  errorMessage.value = '';
  processNextStep();
};
</script>
```

## Common Mistakes

ℹ️ **Not clamping progress value to maxValue**

ℹ️ **Using 'default' variant for unknown-duration tasks**

ℹ️ **Not handling error states**

ℹ️ **Forgetting to show success confirmation**

## Best Practices

- **Always Provide Descriptive Feedback:** Use descriptionStatus with meaningful messages about what's happening
- **Choose Correct Variant Based on Knowledge:** Use 'default' only when you can track actual progress, otherwise use 'indeterminate'
- **Implement Retry for Network Operations:** Always provide retry option for operations that can fail
- **Show Success State Briefly Before Hiding:** Display success state for 1-2 seconds before removing progress indicator

