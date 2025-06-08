<script setup>
// Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// PrimeVue Components
import Menubar from 'primevue/menubar'


// Custom Components
import ThemeToggle from '@/components/topmenu/ThemeToggle.vue'
import LoginProfile from '@/components/topmenu/LoginProfile.vue'
import SignUp from '@/components/topmenu/SignUp.vue'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

import { useCohortsStore } from '@/stores/Cohorts.js'
import { useCoursesStore } from '@/stores/Courses.js'
import { useUsersStore } from '@/stores/Users.js'
import { useDistrictsStore } from '@/stores/Districts.js'
import { useTeachersStore } from '@/stores/Teachers.js'
import { useEnrollmentStore } from '@/stores/Enrollment.js'
import { useRolesStore } from '@/stores/Roles.js'
import { useCanvasStore } from '@/stores/Canvas.js'

const cohortsStore = useCohortsStore()
const coursesStore = useCoursesStore()
const usersStore = useUsersStore()
const districtsStore = useDistrictsStore()
const teacherStore = useTeachersStore()
const enrollmentStore = useEnrollmentStore()
const rolesStore = useRolesStore()
const canvasStore = useCanvasStore()

const testCanvasAPI = async () => {
  toast.add({
    severity: 'info',
    summary: 'Testing API Connection',
    detail: 'Testing connection to Canvas API...',
    life: 3000
  })

  const response = await canvasStore.getCourseProgress(175999, 159643);

  if(response.status == 200){
    toast.add({
      severity: 'success',
      summary: 'API Connection Successful',
      detail: 'Successfully obtained response from the Canvas API',
      life: 3000
    })
  } else if(response.status == 401) {
    toast.add({
      severity: 'error',
      summary: 'Canvas Token not defined.',
      detail: 'See README for instructions on configuring server/.env',
      life: 3000
    })
  } else if(response.status == 500){
    toast.add({
      severity: 'error',
      summary: 'Canvas is NOT enabled!', 
      detail: 'Canvas API must be defined and enabled in the environment variables.',
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'API Connection Failed',
      detail: 'Unable to communicate with Canvas.'
    })
  }

}

/**
 * Rehydrates all the stores, slightly faster than fully refreshing the page
 */
const syncWithDatabase = async () => {
  try{
    toast.add({
      severity: 'info',
      summary: 'Syncing with Database',
      detail: 'Please wait...',
      life: 3000
    })

    await cohortsStore.hydrate()
    await coursesStore.hydrate()
    await usersStore.hydrate()
    await districtsStore.hydrate()
    await teacherStore.hydrate()
    await enrollmentStore.hydrate()
    await rolesStore.hydrate()

    toast.add({
      severity: 'success',
      summary: 'Synced with Database',
      detail: 'All stores have been hydrated',
      life: 3000
    })
  } catch(error){
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to sync with database',
      life: 3000
    })
  }  
}

// Menu items
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push({ name: 'home' })
    }
  }
])

/**
 * Watch for changes in token and update menu
 */
tokenStore.$subscribe(() => {
  // All users render these fields
  if(tokenStore.is_guest){
    items.value = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          router.push({ name: 'home' })
        }
      }
    ]
  }

  if (tokenStore.is_user || tokenStore.is_admin || tokenStore.is_student_admin) {
    items.value = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          router.push({ name: 'home' })
        }
      },
      {
        label: 'Teachers',
        icon: 'pi pi-users',
        command: () => {
          router.push({ name: 'teachers' })
        }
      },
      {
        label: 'Districts',
        icon: 'pi pi-building',
        command: () => {
          router.push({ name: 'districts' })
        }
      }
    ]
  }
  if (tokenStore.is_admin || tokenStore.is_student_admin) {
    items.value.push(
      {
        label: 'Cohorts',
        icon: 'pi pi-users',
        command: () => {
          router.push({ name: 'cohorts' })
        }
      },
      {
        label: 'Courses',
        icon: 'pi pi-book',
        command: () => {
          router.push({ name: 'courses' })
        }
      },
      {
        label: 'Users',
        icon: 'pi pi-user-edit',
        command: () => {
          router.push({ name: 'users' })
        }
      },
      {
        label: 'Analytics',
        icon: 'pi pi-sliders-h',
        command: () => {
          router.push({ name: 'analytics' })  
        }
      },
      {
        label: 'Canvas',
        icon: 'pi pi-book',
        command: () => {
          router.push({ name: 'canvas' })
        }
      },
      {
        label: 'Sync',
        icon: 'pi pi-refresh',
        command: () => {
          syncWithDatabase()
        }
      },
      {
        label: 'Test API Connection',
        icon: 'pi pi-cloud',
        command: () => {
          testCanvasAPI()
        }
      },
    )
  }

  if(tokenStore.is_admin){
    items.value.push(
      {
        label: 'Mailing',
        icon: 'pi pi-envelope',
        command: () => {
          router.push({ name: 'mailing'})
        }
      },
    )
    
  }
})
</script>

<template>
  <Menubar :model="items">
    <template #start>
      <RouterLink :to="{ name: 'home' }">
        <img
          src="../../assets/logo.png"
          height="45px"
          width="55px"
          alt="CyberPipeline Logo"
        />
      </RouterLink>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <ThemeToggle /> 
        <LoginProfile />
        <SignUp />
      </div>
    </template>
  </Menubar>
</template>

<style scoped></style>
