<script setup>
// PrimeVue Components
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import IftaLabel  from 'primevue/iftalabel'

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

console.log(model.value)
</script>

<template>
  <div class="w-full">
    <!-- Floating Label-->
    <IftaLabel class="w-full">
      <!-- Icon -->
      <IconField
        iconPosition="left"
        class="w-full"
      >
        <InputIcon>
          <i :class="props.icon" />
        </InputIcon>

        <!-- InputText Component -->
        <InputText
          :id="field"
          :disabled="disabled"
          :invalid="errors[field] ? true : false"
          v-model="model"
          class="w-full"
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
