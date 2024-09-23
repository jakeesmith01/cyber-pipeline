<script setup>
// Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// PrimeVue Components
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

// Custom Components
import AutocompleteMultiple from '../forms/AutocompleteMultiple.vue'

// Stores
import { useUsersStore } from '@/stores/Users'
const usersStore = useUsersStore()
import { useRolesStore } from '@/stores/Roles'
const rolesStore = useRolesStore()

// Setup Stores
usersStore.hydrate()
const { users } = storeToRefs(usersStore)
rolesStore.hydrate()
const { roles } = storeToRefs(rolesStore)

// Variables
const userDialog = ref(false) // controls opening the dialog
const userDialogHeader = ref('') // controls header for dialog
const editEid = ref(false) // controls whether eID is editable
const loading = ref(false) // controls loading message
const message = ref('') // controls loading message
const user = ref({}) // item to be edited
const errors = ref({}) // form errors
const dt = ref() // datatable reference

// Filters
const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS
  }
})

/**
 * Click handler to edit an item in the datatable
 *
 * @param {User} aUser
 */
const editUser = (aUser) => {
  user.value = { ...aUser }
  userDialogHeader.value = 'Edit User'
  editEid.value = false
  userDialog.value = true
}

/**
 * Click handler for new button
 */
const newUser = () => {
  user.value = {
    eid: '',
    name: '',
    roles: []
  }
  editEid.value = true
  userDialogHeader.value = 'New User'
  userDialog.value = true
}

/**
 * Click handler to delete an item in the datatable
 *
 * @param {User} aUser
 */
const deleteUser = (aUser) => {
  confirm.require({
    message: 'Are you sure you want to delete ' + aUser.name + '?',
    header: 'Danger Zone',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await usersStore.delete(aUser.id)
        toast.add({ severity: 'success', summary: 'Success', detail: 'User Deleted!', life: 3000 })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.error,
          life: 3000
        })
      }
    },
    reject: () => {
      // do nothing
    }
  })
}

/**
 * Save button handler in edit form dialog
 */
const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ''
  try {
    if (user.value.id) {
      await usersStore.update(user.value)
    } else {
      await usersStore.new(user.value)
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'User Updated!', life: 3000 })
    userDialog.value = false
  } catch (error) {
    console.log(error)
    if (error.response.data.data) {
      errors.value = error.response.data.data
      message.value = 'The server rejected this submission. Please correct errors listed below'
    } else if (error.response.data.message) {
      message.value = error.response.data.message
    } else {
      message.value =
        'The server rejected this submission due to an SQL Error. Refresh and try again'
    }
  }
  loading.value = false
}

/**
 * Export datatable to CSV
 */
const exportCSV = () => {
  dt.value.exportCSV()
}

/**
 * Custom export function to handle exporting datatable data
 *
 * @param {District} row
 */
const exportFunction = (row) => {
  if (Array.isArray(row.data)) {
    var output = '"'
    for (const item of row.data) {
      output += item.name + ','
    }
    output += '"'
    console.log(output)
    return output
  } else {
    return row.data
  }
}
</script>

<template>
  <!-- Location for confirmation dialog to be inserted -->
  <ConfirmDialog></ConfirmDialog>

  <!-- Main datatable for items -->
  <Panel header="Manage Users">
    <DataTable
      ref="dt"
      :value="users"
      stripedRows
      sortField="eid"
      :sortOrder="1"
      tableStyle="min-width: 50rem"
      v-model:filters="filters"
      :globalFilterFields="['name', 'eid']"
      :exportFunction="exportFunction"
    >
      <template #header>
        <Toolbar
          class="mb-2"
          style="border: none"
        >
          <template #start>
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="newUser"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="help"
              @click="exportCSV($event)"
            />
          </template>
          <template #end>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </IconField>
          </template>
        </Toolbar>
      </template>
      <template #empty>
        <div class="p-text-center">
          <p>No Users Found</p>
        </div>
      </template>
      <Column
        field="eid"
        sortable
        header="eID"
      ></Column>
      <Column
        field="name"
        sortable
        header="Name"
      ></Column>
      <Column
        field="roles"
        header="Roles"
      >
        <template #body="slotProps">
          <Tag
            v-for="role in slotProps.data.roles"
            :key="role.id"
            :value="role.name"
            :icon="role.name == 'admin' ? 'pi pi-key' : ''"
            :severity="role.name == 'admin' ? 'danger' : 'secondary'"
          />
        </template>
      </Column>
      <Column
        header="Actions"
        :exportable="false"
        style="min-width: 8rem"
      >
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editUser(slotProps.data)"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="deleteUser(slotProps.data)"
            v-tooltip.bottom="'Delete'"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>

  <!-- Edit item dialog -->
  <Dialog
    v-model:visible="userDialog"
    :style="{ width: '450px' }"
    :header="userDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
  >
    <Message
      v-if="message"
      severity="error"
      >{{ message }}</Message
    >
    <div
      class="flex flex-column align-items-center row-gap-5 w-full pt-3 mt-1"
      v-focustrap
      v-on:keyup.enter="save"
    >
      <TextField
        v-model="user.eid"
        field="eid"
        label="eID"
        icon="pi pi-at"
        :errors="errors"
        :disabled="!editEid"
      />
      <TextField
        v-model="user.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <AutocompleteMultiple
        v-model="user.roles"
        field="roles"
        label="Roles"
        icon="pi pi-check-square"
        :errors="errors"
        :values="roles"
        valueLabel="name"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        @click="save"
        :loading="loading"
      />
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-datatable-header) {
  padding: 0px !important;
}
</style>
