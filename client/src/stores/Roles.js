// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useRolesStore = defineStore('roles', {
  state: () => {
    return {
      roles: [] // list of roles
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('roles:hydrate')
      await api.get('/api/v1/roles').then((response) => {
        this.roles = response.data
      })
    }
  }
})
