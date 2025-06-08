<script setup>
import { ref } from 'vue'
import { useTokenStore } from '@/stores/Token'
import { useEmailsStore } from '@/stores/Emails'
import { IftaLabel } from 'primevue'


const tokenStore = useTokenStore()
const emailStore = useEmailsStore()
const showDialog = ref(false)  // Show/Hide dialog
const showEmailForm = ref(false) // Toggle between K-State login and email form
const recipient = ref('') // Store email input  
const text = ref('')
const subject = ref('')
const html = ref('')
const message = ref('')

// Function to reset the form
const resetForm = () => {
  showEmailForm.value = false
  email.value = ''
}

// Function to handle the email form submission
// Send email to backend to get magic link
const submitEmail = async () => {
  if(!recipient.value || !recipient.value.includes('@')){
    message.value = 'Please enter a valid email address'
    return
  }

  const result = await tokenStore.requestMagicLink(recipient.value)

  if(!result){
    message.value = 'Failed to request magic link'
    return;
  }

  const {magicLink, emailEnabled} = result;

  if(emailEnabled){
    message.value = 'Email sent successfully'
  } else{
    console.log(`Magic login link: ${magicLink}`)
    message.value = 'Email disabled, link logged to console'
  }
}
</script>

<template>
  <!-- Login Dialog -->
  <Dialog header="Select Login Method" :visible="showDialog" :modal="true" @hide="resetForm" :style="{width: '400px'}">
    
    <div v-if="!showEmailForm">
      <!-- Buttons for login methods -->
      <div class="flex justify-evenly">
        <Button label="Login with K-State" @click="tokenStore.getToken()"></Button>
        <Button label="Login with Email" @click="showEmailForm = true"></Button>
      </div>
    </div>
    
    <!-- Email form if the "Login with Email" button is clicked -->
    <div v-else>
      <form @submit.prevent="submitEmail">
        <IftaLabel class="mb-2">
            <InputText type="email" id="email" v-model="recipient" variant="filled" />
            <label for="email">Email</label>
        </IftaLabel>
        <div class="flex justify-between">
          <Button type="submit" label="Submit"></Button>
          <Button label="Cancel" @click="showEmailForm = false" />
        </div>
      </form>
    </div>
    
  </Dialog>
</template>