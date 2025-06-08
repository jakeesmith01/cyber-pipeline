<script setup>
// Libraries
import { RouterView } from 'vue-router'

// PrimeVue Components
import Toast from 'primevue/toast'

// Custom Components
import TopMenu from '@/components/topmenu/TopMenu.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
import { useCohortsStore } from '@/stores/Cohorts.js'
import { useCoursesStore } from '@/stores/Courses.js'
import { useUsersStore } from '@/stores/Users.js'
import { useDistrictsStore } from '@/stores/Districts.js'
import { useTeachersStore } from '@/stores/Teachers.js'
import { useEnrollmentStore } from '@/stores/Enrollment.js'
import { useRolesStore } from '@/stores/Roles.js'
import { onMounted } from 'vue'
const tokenStore = useTokenStore()

// Setup Stores
onMounted(async () => {
  await tokenStore.tryToken()

  const cohortsStore = useCohortsStore()
  const coursesStore = useCoursesStore()
  const usersStore = useUsersStore()
  const districtsStore = useDistrictsStore()
  const teacherStore = useTeachersStore()
  const enrollmentStore = useEnrollmentStore()
  const rolesStore = useRolesStore()

  if(tokenStore.is_admin){
    cohortsStore.hydrate()
    coursesStore.hydrate()
    usersStore.hydrate()
    districtsStore.hydrate()
    teacherStore.hydrate()
    enrollmentStore.hydrate()
    rolesStore.hydrate()
  } else if(tokenStore.is_user){
    teacherStore.hydrate()
    districtsStore.hydrate()
  }  
})


</script>

<template>
  <header></header>

  <nav>
    <!-- Navigation Menu-->
    <TopMenu />
  </nav>

  <aside></aside>

  <main>
    <div class="my-2">
      <!-- Main Application View-->
      <RouterView />
    </div>
  </main>

  <footer></footer>

  <!-- Toast Library -->
  <Toast position="bottom-right" />
</template>
