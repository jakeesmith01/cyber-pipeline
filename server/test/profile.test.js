import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach} from 'vitest'
import 'dotenv/config'

const getProfile = (user) => {
  it('should return the current user', (done) => {
    request(app)
      .get('/api/v1/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.have.property('email').eql(user.email)
        done()
      })
  })
}

const getProfileSchemaMatch = (user) => {
  it('should match the expected schema', (done) => {
    const schema = {
      type: 'object',
      required: ['id', 'email', 'name'],
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
      additionalProperties: false,
    }
    request(app)
      .get('/api/v1/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}

const updateProfile = (user) => {
  it('should update the current user', (done) => {
    const name = 'Updated Name'
    request(app)
      .post('/api/v1/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        user: {
          name: name,
        },
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(app)
          .get('/api/v1/profile/')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.have.property('name').eql(name)
            done()
          })
      })
  })
}

const updateProfileShouldIgnoreAdditionalProperties = (user) => {
  it('should ignore additional properties', (done) => {
    const name = 'Updated Name'
    request(app)
      .post('/api/v1/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        user: {
          name: name,
          additionalProperty: 'should not be saved',
        },
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(app)
          .get('/api/v1/profile/')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.have.property('name').eql(name)
            res.body.should.not.have.property('additionalProperty')
            done()
          })
      })
  })
}

const updateProfileCannotChangeEmail = (user) => {
  it('should not allow changing the email', (done) => {
    const name = 'Updated Name'
    const email = 'updated-email@russfeld.me'
    request(app)
      .post('/api/v1/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        user: {
          name: name,
          email: email,
        },
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(app)
          .get('/api/v1/profile/')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.have.property('name').eql(name)
            res.body.should.have.property('email').eql(user.email)
            done()
          })
      })
  })
}

describe('/api/v1/profile', () => {
  describe('user: test-admin', () => {
    let user = {
      email: 'test-admin@russfeld.me',
      token: null,
    }


    describe('GET /', () => {
      getProfile(user)
      getProfileSchemaMatch(user)
    })

    describe('POST /', () => {
      updateProfile(user)
      updateProfileShouldIgnoreAdditionalProperties(user)
      updateProfileCannotChangeEmail(user)
    })
  })

  describe('user: test-api', () => {
    let user = {
      email: 'test-api@russfeld.me',
      token: null,
    }


    describe('GET /', () => {
      getProfile(user)
      getProfileSchemaMatch(user)
    })

    describe('POST /', () => {
      updateProfile(user)
      updateProfileShouldIgnoreAdditionalProperties(user)
      updateProfileCannotChangeEmail(user)
    })
  })
})