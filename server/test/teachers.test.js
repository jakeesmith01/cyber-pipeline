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

  //Tests that get requests return a list of all teachers
  const getAllTeachers = (adminUser) => {
    it('should list all teachers', (done) => {
      request(app)
        .get('/api/v1/teachers/')
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
  

  //Tests that all teachers' schema are correct
  const getAllTeachersSchemaMatch = (adminUser) => {
  it('all teachers should match schema', (done) => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'name',
          'email'
        ],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', minLength: 1, maxLength: 255 },
          email: {type: 'string', minLength: 1, maxLength: 255, format: 'email'},
          eid: {type: 'string', minLength: 3, maxLength: 20},
          wid: {type: 'string', minLength: 9, maxLength: 9},
          status: {type: 'integer'},
          pd_status: {type: 'integer'},
          cert_status: {type: 'integer'},
          ms_status: {type: 'interger'},
          grade_level: {type: 'string'},
          notes: {type: 'string'},
          districts: {type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer'},
                name: { type: 'string'},
                usd: { type: 'integer'},
                notes: {type: 'string'},
                primary: {type: 'boolean'}
              }
            }
          },
          cohorts: {type: 'array', 
            items: {
              type: 'object',
              properties: {
                id: {type: 'integer'},
                name: {type: 'string'},
                notes: {type: 'string'}
              }
            }
          },
          courses: {type: 'array', 
            items: {
              type: 'object',
              properties: {
                id: {type: 'integer'},
                name: {type: 'string'},
                notes: {type: 'string'},
                status: {type: 'integer'}
              }
            }
          }
        },
      },
      additionalProperties: false,
    }
    request(app)
      .get('/api/v1/teachers/')
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
const putTeacher = (adminUser) => {
  it('should create a teacher', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher = {
      id: '4',
      name: 'test teacher',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
    request(app)
      .put('/api/v1/teachers/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        teacher: newteacher,
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


//Tests what put requests ignore any additional properties 
const addTeacherIgnoresAdditionalProperties = (adminUser) => {
  it('should ignore additional properties on new teacher', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher = {
      id: '4',
      name: 'test teacher',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
    request(app)
      .put('/api/v1/teacher/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newteacher })
      .end((err, res) => {
        if (err) return done(err)
        res.status.should.equal(201)
        request(app)
          .get('/api/v1/teacher/')
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

//Tests that put requests don't allow teachers of the same name
const addTeacherFailsOnDuplicateName = (adminUser) => {
  it('should fail on duplicate name', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher = {
      id: '4',
      name: 'test teacher',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
    request(app)
      .put('/api/v1/teacher/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newteacher })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests don't work if the name or the email is missing
const addTeacherFailsOnMissingProperties = (adminUser) => {
  it('should fail on missing properties', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher_noname = {
      id: '4',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
    request(app)
      .put('/api/v1/teacher/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newteacher_noname })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
        const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
        const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
        const newteacher_noemail = {
          id: '4',
          name: 'test teacher',
          eid: 'testeid',
          wid: '123456789',
          status: '1',
          pd_status: '1',
          cert_status: '0',
          ms_status: '0',
          grade_level: 'high school 9-12',
          notes: 'new teacher',
          districts: [d],
          cohorts: [ch],
          courses: [c]
        }
        request(app)
          .put('/api/v1/teacher/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .send({ adminUser: newteacher_noemail })
          .expect(422)
          .end((err) => {
            if (err) return done(err)
            done()
        })
      })
    })
  }

  //Tests if post requests work
  const updateTeacher = (adminUser) => {
    it('should update a teacher', (done) => {
      const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
      const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
      const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
      const newteacher = {
        id: '4',
        name: 'test teacher',
        email: 'test@gmail.com',
        eid: 'testeid',
        wid: '123456789',
        status: '1',
        pd_status: '1',
        cert_status: '0',
        ms_status: '0',
        grade_level: 'high school 9-12',
        notes: 'new teacher',
        districts: [d],
        cohorts: [ch],
        courses: [c]
      }
      request(app)
        .post('/api/v1/teacher/' + newteacher.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newteacher })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(app)
            .get('/api/v1/teacher/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id === newteacher.id)
              addeduser.should.shallowDeepEqual(newteacher)
              done()
            })
        })
    })
  }
  //Tests that post requests ignore any additional properties
  const updateTeacherIgnoresAdditionalProperties = (adminUser) => {
    it('should ignore additional properties on updated teacher', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher = {
      id: '4',
      name: 'test teacher',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
      request(app)
        .post('/api/v1/teacher/' + newteacher.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newteacher })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(app)
            .get('/api/v1/teacher/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id == newteacher.id)
              addeduser.should.not.have.property('extraProperty')
              addeduser.should.have.property('name').eql('test teacher')
              addeduser.roles[0].should.not.have.property('extraProperty')
              done()
            })
        })
    })
  }

  //Tests that post requests fail if the name is missing
  const updateTeacherFailsOnMissingName = (adminUser) => {
    it('should fail on missing name', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher_noname = {
      id: '4',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
      request(app)
        .post('/api/v1/teacher/' + newteacher_noname.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newteacher_noname })
        .expect(422)
        .end((err) => {
          if (err) return done(err)
            const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
          const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
          const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
          const newteacher_email = {
            id: '4',
            eid: 'testeid',
            wid: '123456789',
            status: '1',
            pd_status: '1',
            cert_status: '0',
            ms_status: '0',
            grade_level: 'high school 9-12',
            notes: 'new teacher',
            districts: [d],
            cohorts: [ch],
            courses: [c]
          }
            request(app)
              .post('/api/v1/teacher/' + newteacher_noemail.id)
              .set('Authorization', `Bearer ${adminUser.token}`)
              .send({ adminUser: newteacher_noname })
              .expect(422)
              .end((err) => {
                if (err) return done(err)
                done()            
              })        
        })
    })
}

//Tests that post requests fail if the id is invalid
const updateTeacherFailsOnInvalidName = (adminUser) => {
  it('should fail on invalid name', (done) => {
    const d = { id: '4', name: 'Test District', notes: 'This is a test', primary: 'true'}
    const ch = {id: '4', name: 'Test Cohort', notes: 'This is a test'}
    const c = {id: '4', name: 'Test Course', notes: 'This is a test', status: '0'}
    const newteacher = {
      id: '4',
      name: 'test teacher',
      email: 'test@gmail.com',
      eid: 'testeid',
      wid: '123456789',
      status: '1',
      pd_status: '1',
      cert_status: '0',
      ms_status: '0',
      grade_level: 'high school 9-12',
      notes: 'new teacher',
      districts: [d],
      cohorts: [ch],
      courses: [c]
    }
    request(app)
      .post('/api/v1/teacher/' + newteacher.id)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newteacher })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteTeacher = (adminUser) => {
  it('should delete a teacher', (done) => {
    request(app)
      .delete('/api/v1/teacher/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(app)
          .get('/api/v1/teacher/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.be.an('array')
            res.body.should.have.lengthOf(2)
            const deletedteacher = res.body.find((u) => u.id === 2)
            assert.isUndefined(deletedteacher)
            done()
          })
      })
  })
}

const deleteTeacherFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid name', (done) => {
    request(app)
      .delete('/api/v1/teacher/999')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


//Test that get requests only work for users with admin role
const getAllTeachersRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .get('/api/v1/teachers/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests only work for users with admin role
const putTeacherRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .put('/api/v1/teachers/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that post requests are only allowed for users with admin role
const postTeacherRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .post('/api/v1/teacher/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteTeacherRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .delete('/api/v1/teacher/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

  describe('GET /', () => {
    getAllTeachers(adminUser)
    getAllTeachersSchemaMatch(adminUser)
    getAllTeachersRequiresAdminRole(adminUser)
  })

  describe('PUT /', () => {
    putTeacher(adminUser)
    addTeacherIgnoresAdditionalProperties(adminUser)
    putTeacherRequiresAdminRole(adminUser)
    addTeacherFailsOnDuplicateName(adminUser)
    addTeacherFailsOnMissingProperties(adminUser)
  })


  describe('POST /{id}', () => {
    updateTeacher(adminUser)
    updateTeacherIgnoresAdditionalProperties(adminUser)
    updateTeacherFailsOnMissingName(adminUser)
    updateTeacherFailsOnInvalidName(adminUser)
    postTeacherRequiresAdminRole(adminUser)
  })

  describe('DELETE /{id}', () => {
    deleteTeacher(adminUser)
    deleteTeacherFailsOnInvalidId(adminUser)
    deleteTeacherRequiresAdminRole(adminUser)
  })