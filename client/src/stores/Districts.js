// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useDistrictsStore = defineStore('districts', {
  state: () => {
    return {
      districts: [] // list of districts
    }
  },
  getters: {
    /**
     * Getter for an individual item
     *
     * @param {State} state
     * @returns a function to find an item based on a given id
     */
    getDistrict: (state) => {
      return (id) => state.districts.find((district) => district.id === id)
    },
    getAllDistrictsUsd: (state) => {
      return state.districts.map((district) => district.usd).join(',')
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('districts:hydrate')
      await api.get('/api/v1/districts').then((response) => {
        this.districts = response.data
      })
    },

    /**
     * Update an item via the API
     *
     * @param {District} district
     */
    async update(district) {
      await api
        .post('/api/v1/districts/' + district.id, {
          district: district
        })
        .then(async () => {
          await this.hydrate()
        })
    },

    /**
     * Create a new item via the API
     *
     * @param {District} district
     */
    async new(district) {
      await api
        .put('/api/v1/districts', {
          district: district
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
      await api.delete('/api/v1/districts/' + id).then(async () => {
        await this.hydrate()
      })
    }
  }
})
