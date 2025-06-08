// Imports
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { useStorage } from '@vueuse/core'
import Logger from 'js-logger'

// Services
import api from '@/services/api'


export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      // HACK this may be unsafe - consider refactor?
      // This allows the user to refresh the page and hold on to an existing token
      token: useStorage('token', '') // store current user token in browser storage
    }
  },
  getters: {
    /**
     * Gets the user's refresh token
     *
     * @returns String: the user's refresh token
     */
    refresh_token() {
      if (this.token) {
        return jwtDecode(this.token)['refresh_token']
      } else {
        return ''
      }
    },
    /**
     * Gets the user's eID
     *
     * @returns String: the user's eID
     */
    eid() {
      if (this.token) {
        return jwtDecode(this.token)['eid']
      } else {
        return ''
      }
    },
    /**
     * Gets the user's internal ID
     *
     * @returns String: the user's internal ID
     */
    id() {
      if (this.token) {
        return jwtDecode(this.token)['user_id']
      } else {
        return ''
      }
    },
    /**
     * Gets the user's admin status
     *
     * @returns Boolean: true if the user is an admin, otherwise false
     */
    is_admin() {
      if (this.token) {
        return jwtDecode(this.token)['roles'].includes('admin')
      } else {
        return false
      }
    },
    /**
     * Gets the user's user status
     *
     * @returns Boolean: true if the user is a user, otherwise false
     */
    is_user() {
      if (this.token) {
        return jwtDecode(this.token)['roles'].includes('user')
      } else {
        return false
      }
    },
    /**
     * Gets the user's guest status
     * 
     * @returns Boolean: true if the user is a guest, otherwise false
     */
    is_guest() {
      if(this.token){
        return jwtDecode(this.token)['roles'].includes('guest')
      } else {
        return false
      }
    },
    /**
     * Gets the user's student admin status
     * 
     * @returns Boolean: true if the user is a student admin, otherwise false 
     */
    is_student_admin() {
      if(this.token){
        return jwtDecode(this.token)['roles'].includes('student_admin')
      } else {
        return false
      }
    }
  },
  actions: {
    /**
     * Gets a token from the API using an existing cookie session
     */
    async getToken() {
      Logger.info('token:get')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          // If the response is a 401 error, the user is not logged in
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:get login failed - redirecting to CAS')
            window.location.href = '/auth/login'
          } else {
            Logger.error('token:get error' + err)
            this.token = ''
          }
        })
    },

    /**
     * Tries the existing token or refresh token to establish a session
     */
    async tryToken() {
      Logger.info('token:try')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch(async (err) => {
          // If the current token fails, try the refresh token
          if (err.response && err.response.status === 401) {
            Logger.info('token:try login failed - trying refresh token')
            await this.tryRefreshToken()
          } else {
            this.token = ''
            Logger.error('token:try error' + err)
          }
        })
    },

    /**
     * Use the refresh token to get a new API token
     */
    async refreshToken() {
      Logger.info('token:refresh')
      await api
        .post('/auth/token', {
          refresh_token: this.refresh_token
        })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          // If the refresh token fails, the user must log in again
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:refresh login failed - redirecting to CAS')
            window.location.href = '/auth/login'
          } else {
            Logger.error('token:refresh error' + err)
            this.token = ''
          }
        })
    },

    /**
     * Try to establish a session with a refresh token.
     */
    async tryRefreshToken() {
      Logger.info('token:tryrefresh')
      await api
        .post('/auth/token', {
          refresh_token: this.refresh_token
        })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          // if it fails, log out the user but do not force a login
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:tryrefresh login failed')
          } else {
            this.token = ''
            Logger.error('token:tryrefresh error' + err)
          }
        })
    },

    /**
     * Log the user out and clear the token
     */
    async logout() {
      this.token = ''
      window.location.href = '/auth/logout'
    },

    /**
     * Sends a magic link to the user via email 
     * @param {string} email - The user's email address, note: this should be a single email address unlike the sendEmail function 
     * @returns 
     */
    async requestMagicLink(email) {
      Logger.info(`token:requestMagicLink for ${email}`)
      const response = await api.post('/auth/magic-link', { email })
      return{
        magicLink: response.data.magicLink,
        emailEnabled: response.data.emailEnabled,
      }
    },
    /**
     * Verifies the magic link to establish a session 
     * @param {string} link 
     */
    async verifyMagicLink(link){
      Logger.info(`token:verifyMagicLink for ${link}`)
      await api.post('/auth/magic-link/verify', { link })
    }
  }
})
