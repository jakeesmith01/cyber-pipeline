<script setup>
// Libraries
import { ref } from 'vue'

// PrimeVue Components
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import AutoComplete from 'primevue/autocomplete'

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
  // Values to use for autocomplete
  values: {
    type: Array,
    required: true
  },
  // Label within values to display and search for
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
const model = defineModel({ required: true })

// Items list for search results
const items = ref([])

/**
 * Search method for autocomplete
 *
 * @param {AutoCompleteCompleteEvent} event
 */
const search = (event) => { //right now this is case sensitive
  items.value = props.values
    .filter((value) => value[props.valueLabel].includes(event.query))
    .sort((a, b) => a[props.valueLabel].localeCompare(b[props.valueLabel]))
}
</script>

<template>
  <div class="w-full">
    <!-- Floating Label-->
    <FloatLabel class="w-full">
      <!-- Icon -->
      <IconField
        iconPosition="left"
        class="w-full"
      >
        <InputIcon>
          <i :class="props.icon" />
        </InputIcon>

        <!-- Autocomplete Component-->
        <AutoComplete
          :optionLabel="valueLabel"
          :id="field"
          :disabled="disabled"
          multiple
          :suggestions="items"
          @complete="search"
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
    </FloatLabel>

    <!-- Error Text-->
    <small
      :id="field + '-help'"
      class="w-full text-red-600"
      >{{ errors[field] ? errors[field][0].message : '' }}</small
    >
  </div>
</template>

<style scoped>
/* HACK: Make icon field visible */
:deep(.p-autocomplete-multiple-container) {
  padding-left: 2.5rem;
}

:deep(.pi) {
  z-index: 1;
}
</style>
