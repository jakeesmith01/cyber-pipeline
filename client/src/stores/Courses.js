// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useCoursesStore = defineStore('courses', {
  state: () => {
    return {
      courses: [], // list of courses
      dashGrades: [] // grades dashboard
    }
  },
  getters: {
    /**
     * Getter for an individual item
     *
     * @param {State} state
     * @returns a function to find an item based on a given id
     */
    getCourse: (state) => {
      return (id) => state.courses.find((course) => course.id === id)
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('courses:hydrate')
      await api.get('/api/v1/courses').then((response) => {
        this.courses = response.data
        this.courses.forEach((course) => {
          course.teachers.map((teacher) => {
            teacher.incomplete = teacher.incomplete === 1
          })
        })
      })
      await api.get('/api/v1/dashboard/course/grade').then((response) => {
        this.dashGrades = response.data
      })
    },

    /**
     * Update an item via the API
     *
     * @param {Course} course
     */
    async update(course) {
      course.teachers.map((teacher) => {
        teacher.incomplete = teacher.incomplete ? 1 : 0
      })
      await api
        .post('/api/v1/courses/' + course.id, {
          course: course
        })
        .then(async () => {
          await this.hydrate()
        })
    },

    /**
     * Create a new item via the API
     *
     * @param {Course} course
     */
    async new(course) {
      course.teachers.map((teacher) => {
        teacher.incomplete = teacher.incomplete ? 1 : 0
      })
      await api
        .put('/api/v1/courses', {
          course: course
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
      await api.delete('/api/v1/courses/' + id).then(async () => {
        await this.hydrate()
      })
    }
  }
})
