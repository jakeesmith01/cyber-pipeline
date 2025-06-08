// Libraries
import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import DistrictView from '../views/DistrictView.vue'
import TeacherView from '../views/TeacherView.vue'
import UserView from '../views/UserView.vue'
import CohortView from '../views/CohortView.vue'
import CourseView from '../views/CourseView.vue'
import MailingView from '../views/MailingView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import CanvasView from '../views/CanvasView.vue'
import MagicLoginView from '@/views/MagicLoginView.vue'

// Stores
import { useTokenStore } from '@/stores/Token'

/**
 * Route guard to confirm the user is an administrator
 *
 * @returns Boolean: true if the user is an admin, otherwise false
 */
const requireAdmin = () => {
  const tokenStore = useTokenStore()
  if (tokenStore.is_admin) {
    return true
  } else {
    return { name: 'home' }
  }
}

const requireUser = () => {
  const tokenStore = useTokenStore()
  if (tokenStore.is_user || tokenStore.is_admin) {
    return true
  } else {
    return { name: 'home' }
  }
}

// List of routes
export const routes = [
  // Homepage
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/magic-login/verify',
    name: 'magic-login',
    component: MagicLoginView, // Create this component
  },

  // Profile page
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  // Teachers page
  {
    path: '/teachers',
    name: 'teachers',
    component: TeacherView,
    beforeEnter: requireUser
  },

  // Districts page
  {
    path: '/districts',
    name: 'districts',
    component: DistrictView,
    beforeEnter: requireUser
  },

  // Cohorts page
  {
    path: '/cohorts',
    name: 'cohorts',
    component: CohortView,
    beforeEnter: requireAdmin
  },

  // Courses page
  {
    path: '/courses',
    name: 'courses',
    component: CourseView,
    beforeEnter: requireAdmin
  },

  // Users page
  {
    path: '/users',
    name: 'users',
    component: UserView,
    beforeEnter: requireAdmin
  },
  // Mailing List page
  {
    path: '/mailing',
    name: 'mailing',
    component: MailingView,
    beforeEnter: requireAdmin
  },
  // Analytics page
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsView,
    beforeEnter: requireAdmin
  },
  // Canvas (test) page
  {
    path: '/canvas',
    name: 'canvas',
    component: CanvasView,
    beforeEnter: requireAdmin
  },
  
]
/**
 * Router factory method
 */
const router = createRouter({
  // Enable virtual history
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * Global route guard - user must be logged in to view any page other than home
 */
router.beforeEach(async function (to) {
  if (to.name !== 'home' && to.name !== 'magic-login') {
    const tokenStore = useTokenStore()
    if (!tokenStore.token) {
      await tokenStore.getToken()
    }
    if (!tokenStore.token) {
      return '/'
    }
  }
})

export default router
