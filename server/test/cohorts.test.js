import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll, expect} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'
import Ajv from 'ajv'

const numCohorts = 5
// Set up environment variables
process.env.FORCE_AUTH = 'true'
let NotAdmin = {
  id: 3,
  eid: 'test-student',
  name: 'Test Student',
  created_by: 'test-admin',
  updated_by: 'test-admin',
  is_admin: false,
  token: null
}

//Creates a mock user
let adminUser = {
  id: 2,
  eid:'russfeld',
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
    adminUser.token = await login(adminUser)
  })
  


  //Tests that get requests return a list of all cohorts
  const getAllCohorts = (adminUser) => {
    it('should list all cohorts', async ()=> {
      const res = await request(app)
        .get('/api/v1/cohorts')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200)
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body.length).toBe(numCohorts)

    })
  }
  

  //Tests that all cohorts' schema are correct
  const getAllCohortsSchemaMatch = (adminUser) => {
  it('all cohorts should match schema', async ()=> {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'name'
        ],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', minLength: 1, maxLength: 255 },
          teachers: {type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer'},
                name: { type: 'string'},
                notes: { type: 'string'}
              }
            }
          }
        },
      },
      additionalProperties: false,
    }
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const res = await request(app)
      .get('/api/v1/cohorts')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      const isValid = validate(res.body)
      expect(isValid).toBe(true)
        
  })
}
//Tests that put requests work
const putCohort = (adminUser) => {
  it('should create a cohort', async () => {
    await request(app)
      .put('/api/v1/cohorts')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        cohort: {
          name: "put cohort",
          notes: "notes",
          teachers: [
            {
              id: 1,
              notes: "teacher notes"
            }
          ]
        }
      })
      .expect(200)
      const res = await request(app)
      .get('/api/v1/cohorts')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toBe(numCohorts + 1)
  })
}


//Tests whta put requests ignore any additional properties 
const addCohortIgnoresAdditionalProperties = (adminUser) => {
  it('should ignore additional properties on new cohort', async () => {
  
    await request(app)
      .put('/api/v1/cohorts')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        cohort: {
          name: "ignores additional properties",
          extraProperty: "should be ignored",
          notes: "notes",
          teachers: [
            {
              id: 1,
              notes: "teacher notes"
            }
          ]
        }
      })
      .expect(200)
       const res = await request(app)
          .get('/api/v1/cohorts')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body.length).toBe(numCohorts + 2)
            const addeduser = res.body.find((u) => u.name === "ignores additional properties" )
            expect(addeduser).not.toHaveProperty('extraProperty')
            expect(addeduser).not.toHaveProperty('extraProperty')
  })
}

//Tests that put requests don't allow cohorts of the same name
const addCohortFailsOnDuplicateName = (adminUser) => {
  it('should fail on duplicate name', async () => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time'}
    const newcohort = {
      name: 'Spring 2023',
      notes: 'PACK granted funded cohort',
      teachers: [t]
    }
    await request(app)
      .put('/api/v1/cohorts')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newcohort })
      .expect(422)
  })
}

//Tests that put requests don't work if the name is missing
const addCohortFailsOnMissingName = (adminUser) => {
  it('should fail on missing properties', async () => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time'}
    const newcohort_noname = {
      notes: 'PACK granted funded cohort',
      teachers: [t]
    }
    await request(app)
      .put('/api/v1/cohorts')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newcohort_noname })
      .expect(422)
    })
  }

  //Tests if post requests work
  const updateCohort = (adminUser) => {
    it('should update a cohort', async () => {
     await request(app)
        .post('/api/v1/cohorts/1')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          cohort: {
            name: "update cohort 1",
            notes: "notes",
            teachers: [
              {
                id: 1,
                notes: "teacher notes"
              }
            ]
          }
        })
        .expect(200)
         const res = await request(app)
            .get('/api/v1/cohorts')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body.length).toBe(numCohorts + 2)
              const addedCohort = res.body.find((u) => u.id === 1)
              expect(addedCohort.name).toBe("update cohort 1")
    })
  }
  //Tests that post requests ignore any additional properties
  const updateCohortIgnoresAdditionalProperties = (adminUser) => {
    it('should ignore additional properties on updated user', async () => {
      await request(app)
        .post('/api/v1/cohorts/1')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          cohort: {
            name: "post ignores properties",
            extraProperty: "should be ignored",
            notes: "notes",
            teachers: [
              {
                id: 1,
                notes: "teacher notes"
              }
            ]
          }
        })
          .expect(200)
          const res = await request(app)
            .get('/api/v1/cohorts')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body.length).toBe(numCohorts + 2)
              const addedCohort = res.body.find((u) => u.id == 1)
              expect(addedCohort).not.toHaveProperty('extraProperty')
              expect(addedCohort).toHaveProperty('name')
              expect(addedCohort.name).toBe("post ignores properties")
              expect(addedCohort).not.toHaveProperty('extraProperty')
    })
  }


//Tests that post requests fail if the id is invalid
const updateCohortFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid name', async () => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time'}
      const newcohort = {
        id: '',
        name: 'Invalid Name',
        notes: 'PACK granted funded cohort',
        teachers: [t]
      }
    await request(app)
      .post('/api/v1/cohorts/999')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        cohort: {
          name: "post fails on invalid id",
          extraProperty: "should be ignored",
          notes: "notes",
          teachers: [
            {
              id: 1,
              notes: "teacher notes"
            }
          ]
        }
      })
      .expect(422)
  })
}


const deleteCohort = (adminUser) => {
  it('should delete a cohort', async () => {
    await request(app)
      .delete('/api/v1/cohorts/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
        const res = await request(app)
          .get('/api/v1/cohorts')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body.length).toBe(numCohorts + 1)
            const deletedcohort = res.body.find((u) => u.id === 1)
            expect(deletedcohort).toBeUndefined
  })
}

const deleteCohortFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid name', async ()=> {
    await request(app)
      .delete('/api/v1/cohorts/999')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(422)
  })
}



//Test that get requests only work for users with admin role
const getAllCohortsRequiresAdminRole = (NotAdmin) => {
  it('should require the admin role', async () => {
    await request(app)
      .get('/api/v1/cohorts')
      .set('Authorization', `Bearer ${NotAdmin.token}`)
      .expect(403)
  })
}

//Tests that put requests only work for users with admin role
const putCohortRequiresAdminRole = (NotAdmin) => {
  it('should require the admin role', async () => {
    await request(app)
      .put('/api/v1/cohorts')
      .set('Authorization', `Bearer ${NotAdmin.token}`)
      .send({
        cohort: {
          name: "ignores additional properties",
          extraProperty: "should be ignored",
          notes: "notes",
          teachers: [
            {
              id: 1,
              notes: "teacher notes"
            }
          ]
        }
      })
      .expect(403)
  })
}



const deleteCohortRequiresAdminRole = (adminUser) => {
  it('should require the admin role', async () => {
    await request(app)
      .delete('/api/v1/cohorts/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
  })
}

  describe('GET /', () => {
    getAllCohorts(adminUser)
    getAllCohortsSchemaMatch(adminUser)
    getAllCohortsRequiresAdminRole(NotAdmin)
  })

  describe('PUT /', () => {
    putCohort(adminUser)
    addCohortIgnoresAdditionalProperties(adminUser)
    putCohortRequiresAdminRole(NotAdmin)
    addCohortFailsOnDuplicateName(adminUser)
    addCohortFailsOnMissingName(adminUser)
  })


  describe('POST /{id}', () => {
    updateCohort(adminUser)
    updateCohortIgnoresAdditionalProperties(adminUser)
    updateCohortFailsOnInvalidId(adminUser)
  })

  describe('DELETE /{id}', () => {
    deleteCohort(adminUser)
    deleteCohortFailsOnInvalidId(adminUser)
    deleteCohortRequiresAdminRole(NotAdmin)
  })
