import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'

// Set up environment variables
process.env.FORCE_AUTH = 'true'


//Creates a mock user
let adminUser = {
  eid:'test-admin',
  name:'Test Administrator',
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

  //Tests that get requests return a list of all districts
  const getAllDistricts = (adminUser) => {
    it('should list all districts', (done) => {
      request(app)
        .get('/api/v1/districts/')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200)
        .end((err, res) => {
        if (err) {return done(err)}
         expect(res.body).toBeInstanceOf(Array)
         expect(res.body.length).toBe(2)
         done(err)
        })
    })
  }
  

  //Tests that all districts' schema are correct
  const getAllDistrictsSchemaMatch = (adminUser) => {
  it('all districts should match schema', (done) => {
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
          usd: {type: 'integer'},
          url: {type: 'string'},
          locale: {type: 'integer'},
          notes: {type: 'string'},
          teachers: {type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer'},
                name: { type: 'string'},
                notes: { type: 'string'},
                primary: {type: 'boolean'}
              }
            }
          }
        },
      },
      additionalProperties: false,
    }
    request(app)
      .get('/api/v1/districts/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}
//Tests that put requests work
const putDistrict = (adminUser) => {
  it('should create a district', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
    const newdistrict = {
      id: '1',
      name: 'test district',
      notes: 'new district',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/districts/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        district: newdistrict,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.an('array')
        res.body.should.have.lengthOf(4)
        done()
      })
  })
}


//Tests whta put requests ignore any additional properties 
const addDistrictIgnoresAdditionalProperties = (adminUser) => {
  it('should ignore additional properties on new district', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
    const newdistrict = {
      id: '1',
      name: 'test district',
      notes: 'new district',
      extraProperty: 'This should be ignored',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/district/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newdistrict })
      .end((err, res) => {
        if (err) return done(err)
        res.status.should.equal(201)
        request(app)
          .get('/api/v1/district/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.be.an('array')
            res.body.should.have.lengthOf(5)
            const addeduser = res.body.find((u) => u.name === newuser.name)
            addeduser.should.not.have.property('extraProperty')
            addeduser.roles[0].should.not.have.property('extraProperty')
            done()
          })
      })
  })
}

//Tests that put requests don't allow districts of the same name
const addDistrictFailsOnDuplicateName = (adminUser) => {
  it('should fail on duplicate name', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
    const newdistrict = {
      id: '1',
      name: 'test district',
      notes: 'new district',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/district/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newdistrict })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests don't work if the name is missing
const addDistrictFailsOnMissingName = (adminUser) => {
  it('should fail on missing properties', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
    const newdistrict_noname = {
      id: '1',
      notes: 'new district',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/district/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newdistrict_noname })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
        const newdistrict_noid = {
          notes: 'new district',
          teachers: [t]
        }
        request(app)
          .put('/api/v1/district/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .send({ adminUser: newdistrict_noid })
          .expect(422)
          .end((err) => {
            if (err) return done(err)
            done()
        })
      })
    })
  }

  //Tests if post requests work
  const updateDistrict = (adminUser) => {
    it('should update a district', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
    const newdistrict = {
      id: '1',
      notes: 'test',
      teachers: [t]
    }
      request(app)
        .post('/api/v1/district/' + newdistrict.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newdistrict })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(app)
            .get('/api/v1/district/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id === newdistrict.id)
              addeduser.should.shallowDeepEqual(newdistrict)
              done()
            })
        })
    })
  }
  //Tests that post requests ignore any additional properties
  const updateDistrictIgnoresAdditionalProperties = (adminUser) => {
    it('should ignore additional properties on updated user', (done) => {
      const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
      const newdistrict = {
        id: '2',
        name: 'test district',
        notes: 'new district',
        extraProperty: 'This should be ignored',
        teachers: [t]
      }
      request(app)
        .post('/api/v1/district/' + newdistrict.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newdistrict })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(app)
            .get('/api/v1/district/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id == newdistrict.id)
              addeduser.should.not.have.property('extraProperty')
              addeduser.should.have.property('name').eql('test district')
              addeduser.roles[0].should.not.have.property('extraProperty')
              done()
            })
        })
    })
  }

  //Tests that post requests fail if the name is missing
  const updateDistrictFailsOnMissingName = (adminUser) => {
    it('should fail on missing properties', (done) => {
      const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
      const newdistrict_noname = {
        id: '1',
        notes: 'new district',
        teachers: [t]
      }
      request(app)
        .post('/api/v1/district/' + newdistrict_noname.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newdistrict_noname })
        .expect(422)
        .end((err) => {
          if (err) return done(err)
          done()            
        })
    })
}

//Tests that post requests fail if the id is invalid
const updateDistrictFailsOnInvalidName = (adminUser) => {
  it('should fail on invalid name', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', primary: 'true'}
      const newdistrict = {
        id: '',
        name: 'Invalid Name',
        notes: 'new district',
        teachers: [t]
      }
    request(app)
      .post('/api/v1/district/' + newdistrict.id)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newdistrict })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteDistrict = (adminUser) => {
  it('should delete a district', (done) => {
    request(app)
      .delete('/api/v1/district/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(app)
          .get('/api/v1/district/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.be.an('array')
            res.body.should.have.lengthOf(2)
            const deleteddistrict = res.body.find((u) => u.id === 2)
            assert.isUndefined(deleteddistrict)
            done()
          })
      })
  })
}

const deleteDistrictFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid name', (done) => {
    request(app)
      .delete('/api/v1/district/999')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


//Test that get requests only work for users with admin role
const getAllDistrictsRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .get('/api/v1/districts/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests only work for users with admin role
const putDistrictRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .put('/api/v1/districts/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that post requests are only allowed for users with admin role
const postDistrictRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .post('/api/v1/district/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteDistrictRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .delete('/api/v1/district/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

  describe('GET /', () => {
    getAllDistricts(adminUser)
    getAllDistrictsSchemaMatch(adminUser)
    getAllDistrictsRequiresAdminRole(adminUser)
  })

  describe('PUT /', () => {
    putDistrict(adminUser)
    addDistrictIgnoresAdditionalProperties(adminUser)
    putDistrictRequiresAdminRole(adminUser)
    addDistrictFailsOnDuplicateName(adminUser)
    addDistrictFailsOnMissingName(adminUser)
  })


  describe('POST /{id}', () => {
    updateDistrict(adminUser)
    updateDistrictIgnoresAdditionalProperties(adminUser)
    updateDistrictFailsOnMissingName(adminUser)
    updateDistrictFailsOnInvalidName(adminUser)
    postDistrictRequiresAdminRole(adminUser)
  })

  describe('DELETE /{id}', () => {
    deleteDistrict(adminUser)
    deleteDistrictFailsOnInvalidId(adminUser)
    deleteDistrictRequiresAdminRole(adminUser)
  })