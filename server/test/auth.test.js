import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeAll, beforeEach, expect } from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'
import jwt from 'jsonwebtoken'
import Ajv from 'ajv'

let agent

const login = async (user) => {
  agent = request.agent(app)
  return agent
    .get('/auth/login?eid=' + encodeURIComponent(user.eid))
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

const adminUser = {
  id: 2,
  eid: "russfeld",
  is_admin: true,
  token: null
}
const shouldAllowLogin = (user) => {
  it('should allow ' + user.eid + ' to log in and get token', async () => {
    if (!user.token) {
      console.log("No token available.")
      return
    }

    await agent
      .get('/api/v1')
      .auth(user.token, { type: 'bearer' })
      .expect(200)
  })
}



const tokenShouldIncludeUserData = (user) => {
  it('should include user info in token', async () => {
    const token_user = jwt.decode(user.token)
    expect(token_user).property('user_id').eql(user.id)
    expect(token_user).property('eid').eql(user.eid)
  })
}

const tokenShouldBeValid = (user) => {
  it('should have a valid token signature', async () => {
    try{
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(user.token, process.env.TOKEN_SECRET, (err, decoded) => {
          if (err) return reject(err)
          resolve(decoded)
        })
      })

      
      expect(decoded).property('user_id').eql(user.id)
      expect(decoded).property('eid').eql(user.eid)
    } catch (err) {
      throw err
    }
  })
}

const tokenSchemaShouldBeValid = (user) => {
  it('should have a valid token schema', async () => {
    const schema = {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        eid: { type: 'string' },
        roles: {
          type: 'array',
          items: { type: 'string' } 
        },
        refresh_token: { type: 'string' },
        iat: { type: 'number' },
        exp: { type: 'number' },
      },
      required: ['user_id', 'eid', 'roles', 'refresh_token', 'iat', 'exp'],  
      additionalProperties: false,  
    }
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
        const decoded = jwt.decode(user.token)
        const isValid = validate(decoded)
      expect(isValid).toBe(true)
  })
}

const tokenShouldFailOnNoSession = () => {
  it('should not issue token without session', async () => {
    const agent = request.agent(app)
    agent
      .get('/auth/token')
      .expect(401)
  })
}




describe('/auth', () => {
  describe('user: russfeld', () => {
    beforeAll(async () => {
      adminUser.token = await login(adminUser)
    })
    shouldAllowLogin(adminUser)
    tokenShouldIncludeUserData(adminUser)
    tokenShouldBeValid(adminUser)
    tokenSchemaShouldBeValid(adminUser)
    
  })

  describe('user: test-fail', () => {
    tokenShouldFailOnNoSession()
  })


})
