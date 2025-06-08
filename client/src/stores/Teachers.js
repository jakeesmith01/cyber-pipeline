// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useTeachersStore = defineStore('teachers', {
  state: () => {
    return {
      teachers: [] // list of teachers
    }
  },
  getters: {
    /**
     * Getter for an individual item
     *
     * @param {State} state
     * @returns a function to find an item based on a given id
     */
    getTeacher: (state) => {
      return (id) => state.teachers.find((teacher) => teacher.id === id)
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('teachers:hydrate')
      await api.get('/api/v1/teachers').then((response) => {
        this.teachers = response.data
        this.teachers.forEach((teacher) => {
          teacher.districts.map((district) => {
            district.primary = district.primary === 1
          })
          teacher.all_districts = teacher.districts.map((district) => district.usdName).join(', ')
        })
      })
    },

    /**
     * Update an item via the API
     *
     * @param {Teacher} teacher
     */
    async update(teacher) {
      teacher.districts.map((district) => {
        district.primary = district.primary ? 1 : 0
      })
      await api
        .post('/api/v1/teachers/' + teacher.id, {
          teacher: teacher
        })
        .then(async () => {
          await this.hydrate()
        })
    },

    /**
     * Create a new item via the API
     *
     * @param {Teacher} teacher
     */
    async new(teacher) {
      teacher.districts.map((district) => {
        district.primary = district.primary ? 1 : 0
      })
      await api
        .put('/api/v1/teachers', {
          teacher: teacher
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
      await api.delete('/api/v1/teachers/' + id).then(async () => {
        await this.hydrate()
      })
    }
  }
})
