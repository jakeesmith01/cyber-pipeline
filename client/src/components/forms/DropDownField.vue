<script setup>
// PrimeVue Components
import IftaLabel from 'primevue/iftalabel'
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'

// Props
const props = defineProps({
  // Field name inside of model object and errors
  field: {
    type: String,
    required: true
  },
  // Label text
  label: {
    type: String,
    required: true
  },
  // Icon CSS classes
  icon: {
    type: String,
    required: true
  },
  // Values to use for options
  values: {
    type: Array,
    required: true
  },
  // Label within values to display
  valueLabel: {
    type: String,
    default: 'name'
  },
  // Boolean to disable editing
  disabled: {
    type: Boolean,
    default: false
  },
  // Validation errors from server
  errors: {
    type: Object,
    default() {
      return {}
    }
  }
})

// V-model of field to be edited
const model = defineModel()
</script>

<template>
  <div class="w-full">
    <!-- Floating Label-->
    <IftaLabel>
      <!-- Icon -->
      <IconField
        iconPosition="left"
        class="w-full"
      >
        <InputIcon>
          <i :class="props.icon" />
        </InputIcon>

        <!-- Dropdown Component -->
        <Select
          :id="field"
          :disabled="disabled"
          :invalid="errors[field] ? true : false"
          v-model="model"
          class="w-full"
          :options="values"
          :optionLabel="valueLabel"
          optionValue="id"
        />
      </IconField>

      <!-- Label -->
      <label
        :for="field"
        class="ml-20"
        >{{ props.label }}</label
      >
    </IftaLabel>

    <!-- Error Text -->
    <small
      :id="field + '-help'"
      class="w-full text-red-600"
      >{{ errors[field] ? errors[field][0].message : '' }}</small
    >
  </div>
</template>

<style scoped>
/* HACK: Make icon field visible */
:deep(.p-dropdown-label) {
  padding-left: 2.5rem;
}

:deep(.pi) {
  z-index: 1;
}
</style>
