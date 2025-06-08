// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useCohortsStore = defineStore('cohorts', {
  state: () => {
    return {
      cohorts: [], // list of cohorts
      dashStatus: [], // status dashboard
      pdStatus: [], // pd status dashboard
      certStatus: [], // cert status dashboard
      msStatus: [] // ms status dashboard
    }
  },
  getters: {
    /**
     * Getter for an individual item
     *
     * @param {State} state
     * @returns a function to find an item based on a given id
     */
    getCohort: (state) => {
      return (id) => state.cohorts.find((cohort) => cohort.id === id)
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('cohorts:hydrate')
      await api.get('/api/v1/cohorts').then((response) => {
        this.cohorts = response.data
      })
      await api.get('/api/v1/dashboard/cohort/status').then((response) => {
        this.dashStatus = response.data
      })
      await api.get('/api/v1/dashboard/cohort/pdstatus').then((response) => {
        this.pdStatus = response.data
      })
      await api.get('/api/v1/dashboard/cohort/certstatus').then((response) => {
        this.certStatus = response.data
      })
      await api.get('/api/v1/dashboard/cohort/msstatus').then((response) => {
        this.msStatus = response.data
      })
    },

    /**
     * Update an item via the API
     *
     * @param {Cohort} cohort
     */
    async update(cohort) {
      await api
        .post('/api/v1/cohorts/' + cohort.id, {
          cohort: cohort
        })
        .then(async () => {
          await this.hydrate()
        })
    },

    /**
     * Create a new item via the API
     *
     * @param {Cohort} cohort
     */
    async new(cohort) {
      await api
        .put('/api/v1/cohorts', {
          cohort: cohort
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    /**
     * Delete an item with the given ID via the API
     *
     * @param {Integer} id
     */
    async delete(id) {
      await api.delete('/api/v1/cohorts/' + id).then(async () => {
        await this.hydrate()
      })
    }
  }
})
