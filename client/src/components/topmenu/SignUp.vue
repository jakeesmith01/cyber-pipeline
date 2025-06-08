<script setup>
// Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// PrimeVue Components
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Menu Items
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-cog',
    command: () => {
      router.push({ name: 'profile' })
    }
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: tokenStore.logout
  }
])

// Menu reference
const menu = ref()

/**
 * Toggle button handler
 *
 * @param {Event} event
 */
const toggle = (event) => {
  menu.value.toggle(event)
}

const visible = ref(false);
</script>

<template>
  <div class="p-menuitem">
    <!-- If no token present, show apply now button -->
    <div
      v-if="tokenStore.token == ''"
      class="p-menuitem-content"
    >
      <Button label="Apply Now" icon="pi pi-check" class="p-button-lg text-lg" />
    </div>
  </div>
</template>
