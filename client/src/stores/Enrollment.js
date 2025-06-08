// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useEnrollmentStore = defineStore('enrollment', {
    state: () => ({
        enrollments: {
            courses: [],     // list of courses
            enrollmentData: []  // students enrolled in each course
        }
    }),
    getters: {
        /**
         * 
         * Given a cohort this returns all the classes
         * attached to that cohort and the number of 
         * students enrolled in each of those courses.
         * 
         * @param {State} state 
         * @returns All courses and the number of students enrolled.
         */
        getAllCourses: (state) => {
            return state.enrollments.courses.map(course => {
                const courseEnrollment = state.enrollments.enrollmentData.find(data => data.id === course.id) || {}
                
                return {
                    ...course,
                    numStudents: courseEnrollment.enrolled,
                    numPassed: courseEnrollment.pass,
                    numNotPassed: courseEnrollment.fail,
                    numWithdrawn: courseEnrollment.withdrawn,
                    numIncompleteOrInProgress: courseEnrollment.incomplete 
                }
            })
        }
    },
    actions: {
        async hydrate() {
            Logger.info('enrollment:hydrate')
            await api.get('api/v1/courses').then((response) => {
                this.enrollments.courses = response.data
            })

            await api.get('api/v1/dashboard/course/grade').then((response) => {
                this.enrollments.enrollmentData = response.data
            })

        }
    }
})
