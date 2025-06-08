<script setup>
// Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// PrimeVue Components
import { useToast } from 'primevue/usetoast'
const toast = useToast()

// Custom Components
import TextField from '@/components/forms/TextField.vue'

// Stores
import { useProfileStore } from '@/stores/Profile'
const profileStore = useProfileStore()

// Setup Stores
const { user } = storeToRefs(profileStore)

// Variables
const loading = ref(false) // controls loading message
const errors = ref({}) // form errors
const message = ref('') // error message on dialog form

/**
 * Click handler for save button
 */
const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ''
  try {
    await profileStore.update()
    toast.add({ severity: 'success', summary: 'Success', detail: 'Profile Updated!', life: 3000 })
  } catch (error) {
    if (error.response.data.data) {
      errors.value = error.response.data.data
      message.value = 'The server rejected this submission. Please correct errors listed below'
    } else {
      message.value =
        'The server rejected this submission due to an SQL Error. Refresh and try again'
    }
  }
  loading.value = false
}
</script>

<template>
  <Panel header="Profile Settings">
    <Message
      v-if="message"
      severity="error"
      >{{ message }}</Message
    >
    <div
      class="flex flex-col items-center gap-y-8 w-full pt-6"
      v-focustrap
      v-on:keyup.enter="save"
    >
      <TextField
        v-model="user.eid"
        field="eid"
        label="eID"
        icon="pi pi-at"
        :errors="errors"
        :disabled="true"
      />
      <TextField
        v-model="user.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        @click="save"
        :loading="loading"
      />
    </div>
  </Panel>
</template>
