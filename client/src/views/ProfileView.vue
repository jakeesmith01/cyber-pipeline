<script setup>
import ProfileEdit from '@/components/profile/ProfileEdit.vue'
// Stores
import { useProfileStore } from '@/stores/Profile'

// Token Store
const profileStore = useProfileStore()
profileStore.hydrate()
</script>

<template>
  <main>
    <ProfileEdit />
  </main>
</template>
