import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'
import { expect } from 'chai'

process.env.FORCE_AUTH = 'true'

//Creates a mock user
const adminUser = {
    eid: 'test-admin',
    name: 'Test Administrator',
    created_by: 'test-admin',
    updated_by: 'test-admin',
    id: 1, 
    is_admin: true,
    token: 'test-token',
    }
  
    beforeAll(async () => {
      db.migrate.latest()
    })
    
    beforeEach(async () => {
      db.seed.run()
    })


    const ShouldGetAllCohortStatus = (adminUser) => {
        it('should get cohort status', (done) => {
            request(app)
                .get('/cohort/status')
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {return done(err)}
                     expect(res.body).toBeInstanceOf(Array)
                     expect(res.body.length).toBe(6)
                     done(err)
                })

        })
    }

    const PDStatusShouldBeReturned = (adminUser) => {
        it('should return PD status for the cohort', (done) => {
            request(app)
                .get('/cohort/pdstatus')
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {return done(err)}
                     expect(res.body).toBeInstanceOf(Array)
                     expect(res.body.length).toBe(6)
                     done(err)
                })
        })
    }

    const CertStatusShouldBeReturned = (adminUser) => {
        it('should return cert status for the cohort', (done) => {
            request(app)
                .get('/cohort/certstatus')
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {return done(err)}
                     expect(res.body).toBeInstanceOf(Array)
                     expect(res.body.length).toBe(6)
                     done(err)
                })
        })
    }

    const MSStatusShouldBeReturned = (adminUser) => {
        it('should return ms status for the cohort', (done) => {
            request(app)
                .get('/cohort/msstatus')
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {return done(err)}
                     expect(res.body).toBeInstanceOf(Array)
                     expect(res.body.length).toBe(6)
                     done(err)
                })
        })
    }

    const GradeShouldBeReturned = (adminUser) => {
        it('should return the grades for the course', (done) => {
            request(app)
                .get('/course/grade')
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {return done(err)}
                     expect(res.body).toBeInstanceOf(Array)
                     expect(res.body.length).toBe(7)
                     done(err)
                })
        })
    }

    const TeachersForTheDistrictShouldBeReturned = (adminUser) => {
        it('should return the teachers for the districts', (done) => {
            request(app)
                .get('/district/teacher')
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {return done(err)}
                     expect(res.body).toBeInstanceOf(Array)
                     expect(res.body.length).toBe(4)
                     done(err)
                })
        })
    }



describe('GET /', () => {
    ShouldGetAllCohortStatus(adminUser)
    PDStatusShouldBeReturned(adminUser)
    CertStatusShouldBeReturned(adminUser)
    MSStatusShouldBeReturned(adminUser)
    GradeShouldBeReturned(adminUser)
    TeachersForTheDistrictShouldBeReturned(adminUser)
})



