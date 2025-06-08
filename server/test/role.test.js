import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll, expect} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'
import Ajv from 'ajv'

// Set up environment variables
process.env.FORCE_AUTH = 'true'


//Creates a mock user
const adminUser = {
  id: 2,
  eid: "russfeld",
  is_admin: true,
  token: null
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


  //Tests that get requests return a list of all roles
  const getAllRoles = (adminUser) => {
    it('should list all roles', async () => {
      const res = await request(app)
        .get('/api/v1/roles/')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200)
         expect(res.body).toBeInstanceOf(Array)
         expect(res.body.length).toBe(4)
    })
  }
  

  //Tests that all roles' schema are correct
  const getAllRolesSchemaMatch = (adminUser) => {
  it('all roles should match schema', async () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'name'
        ],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', minLength: 1, maxLength: 255 },
        },
      },
      additionalProperties: false,
    }
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const res = await request(app)
      .get('/api/v1/roles/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      const isValid = validate(res.body)
      expect(isValid).toBe(true)
  })
}



  describe('GET /', () => {
    getAllRoles(adminUser)
    getAllRolesSchemaMatch(adminUser)
  })
