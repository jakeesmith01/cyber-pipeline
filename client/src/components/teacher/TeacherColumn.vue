<template>
    <Column
      :header="header"
      :field="field"
      sortable
      :show-filter-menu="false"
    >
      <template #filter="{ filterModel, filterCallback }">
        <MultiSelect
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="statuses"
          optionLabel="label"
          optionValue="id"
          placeholder="Any"
          class="p-column-filter"
          :maxSelectedLabels="2"
          :show-toggle-all="false"
        >
        </MultiSelect>
      </template>
      <template #body="slotProps">
        <Tag
          :value="statuses[slotProps.data[field]].label"
          :severity="statuses[slotProps.data[field]].severity"
          :icon="statuses[slotProps.data[field]].icon"
          v-if="statuses[slotProps.data[field]].hidden != 'true'"
          class="m-1"
        />
      </template>
    </Column>
  </template>
  
  <script>
  export default {
    props: {
      header: {
        type: String,
        required: true
      },
      field: {
        type: String,
        required: true
      },
      statuses: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  