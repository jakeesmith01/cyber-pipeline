import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll, expect, vi } from 'vitest' // ES module imports
import 'dotenv/config'
import sendEmail from '../services/emailService'
import db from '../configs/db.js'


let adminUser = {
    id: 1,
    eid: 'test-admin',
    name: 'Test Administrator',
    is_admin: true,
    token: null,
}

const login = async (adminUser) => {
    const agent = request.agent(app)
    return agent
      .get('/auth/login?eid=' + encodeURIComponent(adminUser.eid))
      .then(() => {
        return agent
          .get('/auth/token')
          .expect(200)
          .then((res) => {
            return res.body.token
          })
      })
}

beforeAll(async () => {
    await db.migrate.latest()
   await db.seed.run()
})

beforeEach(async () => {
  adminUser.token = await login(adminUser)
})

vi.mock('../services/emailService', () => ({
  default: vi.fn().mockResolvedValue({ success: true, message: 'Email sent successfully' })
}))



const shouldSendEmailWithValidEmailFormat = (adminUser) => {
    it('should successfully send an email', async () => {
        const res = await request(app)
          .post('/api/v1/emails')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .send({
                to: "test@gmail.com",
                subject: "test subject",
                text: "test email",
                html: "html"
            })
          .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Email sent successfully')

        expect(sendEmail).toHaveBeenCalledTimes(1)
        expect(sendEmail).toHaveBeenCalledWith("test@gmail.com", "test subject", "test email","html")
    })
}



describe('POST /emails', () => {
    shouldSendEmailWithValidEmailFormat(adminUser)
})
