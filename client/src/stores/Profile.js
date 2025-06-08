// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      user: {} // user object
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('profile:hydrate')
      await api.get('/api/v1/profile').then((response) => {
        this.user = response.data
      })
    },
    /**
     * Update the current user's profile
     */
    async update() {
      await api
        .post('/api/v1/profile/', {
          user: this.user
        })
        .then(async () => {
          await this.hydrate()
        })
    }
  }
})
