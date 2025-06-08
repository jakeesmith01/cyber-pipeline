<script setup>
import ToggleSwitch from 'primevue/toggleswitch';

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
  <div class="flex w-full items-center">
    <!-- InputText Component -->
    <ToggleSwitch
      :id="field"
      :disabled="disabled"
      :invalid="errors[field] ? true : false"
      v-model="model"
      class=""
      style="min-width: 2.5rem"
    />

    <!-- Label -->
    <label
      :for="field"
      class="ml-2"
      >{{ props.label }}</label
    >

    <!-- Error Text -->
    <small
      :id="field + '-help'"
      class="w-6/12 text-red-600"
      >{{ errors[field] ? errors[field][0].message : '' }}</small
    >
  </div>
</template>
