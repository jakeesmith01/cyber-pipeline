import { defineStore } from 'pinia'
import Logger from 'js-logger'

import api from '@/services/api'

// TODO: Finish setting this store up for database logging of the emails

export const useEmailsStore = defineStore('emails', {
    state: () => {
        return {
            emails: [] // list of emails
        }
    },
    actions: {
        /**
         * Sends an email using the SMTP transporter on the backend.
         * @param {object} emailData
         * @param {string} emailData.to - The recipient(s) email address(es) NOTE: When sending a magic link, this should be a single email address
         * @param {string} emailData.subject - The subject of the email
         * @param {string} emailData.text - The plain text version of the email
         * @param {string} emailData.html - The HTML version of the email 
         */
        async sendEmail(emailData){
            try {
                await api.post('/api/v1/emails', emailData)
            } catch (error) {
                Logger.error('Failed to send email: ', error);
            }
        },
        //async hydrate() {
        //    Logger.info('emails:hydrate')
        //    await api.get('/api/v1/emails').then((response) => {
        //        this.emails = response.data
        //    })
        //}
    }

})

export default useEmailsStore