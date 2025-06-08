import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'

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

  //Tests that get requests return a list of all courses
  const getAllCourses = (adminUser) => {
    it('should list all courses', (done) => {
      request(app)
        .get('/api/v1/courses/')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200)
        .end((err, res) => {
        if (err) {return done(err)}
         expect(res.body).toBeInstanceOf(Array)
         expect(res.body.length).toBe(3)
         done(err)
        })
    })
  }
  

  //Tests that all courses' schema are correct
  const getAllCoursesSchemaMatch = (adminUser) => {
  it('all courses should match schema', (done) => {
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
                notes: { type: 'string'},
                status: {type: 'integer'}
              }
            }
          }
        },
      },
      additionalProperties: false,
    }
    request(app)
      .get('/api/v1/courses/')
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
const putCourse = (adminUser) => {
  it('should create a course', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0' }
    const newcourse = {
      id: '1',
      name: 'test course',
      notes: 'new course',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/courses/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        course: newcourse,
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
const addCourseIgnoresAdditionalProperties = (adminUser) => {
  it('should ignore additional properties on new course', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
    const newcourse = {
      id: '1',
      name: 'test course',
      notes: 'new course',
      extraProperty: 'This should be ignored',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/course/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newcourse })
      .end((err, res) => {
        if (err) return done(err)
        res.status.should.equal(201)
        request(app)
          .get('/api/v1/course/')
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

//Tests that put requests don't allow courses of the same name
const addCourseFailsOnDuplicateName = (adminUser) => {
  it('should fail on duplicate name', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
    const newcourse = {
      id: '1',
      name: 'test course',
      notes: 'new course',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/course/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newcourse })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests don't work if the name is missing
const addCourseFailsOnMissingName = (adminUser) => {
  it('should fail on missing name', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
    const newcourse_noname = {
      id: '1',
      notes: 'new course',
      teachers: [t]
    }
    request(app)
      .put('/api/v1/course/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newcourse_noname })
      .expect(422)
      .end((err) => {
        done()
      })
  })
}

  //Tests if post requests work
  const updateCourse = (adminUser) => {
    it('should update a course', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
    const newcourse = {
      id: '1',
      notes: 'test',
      teachers: [t]
    }
      request(app)
        .post('/api/v1/course/' + newcourse.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newcourse })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(app)
            .get('/api/v1/course/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id === newcourse.id)
              addeduser.should.shallowDeepEqual(newcourse)
              done()
            })
        })
    })
  }
  //Tests that post requests ignore any additional properties
  const updateCourseIgnoresAdditionalProperties = (adminUser) => {
    it('should ignore additional properties on updated user', (done) => {
      const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
      const newcourse = {
        id: '2',
        name: 'test course',
        notes: 'new course',
        extraProperty: 'This should be ignored',
        teachers: [t]
      }
      request(app)
        .post('/api/v1/course/' + newcourse.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newcourse })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(app)
            .get('/api/v1/course/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id == newcourse.id)
              addeduser.should.not.have.property('extraProperty')
              addeduser.should.have.property('name').eql('test course')
              addeduser.roles[0].should.not.have.property('extraProperty')
              done()
            })
        })
    })
  }

  //Tests that post requests fail if the name is missing
  const updateCourseFailsOnMissingName = (adminUser) => {
    it('should fail on missing name', (done) => {
      const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
      const newcourse_noname = {
        id: '1',
        notes: 'new course',
        teachers: [t]
      }
      request(app)
        .post('/api/v1/course/' + newcourse_noname.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newcourse_noname })
        .expect(422)
        .end((err) => {
          if (err) return done(err)
           done()
        })
    })
}

//Tests that post requests fail if the id is invalid
const updateCourseFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid id', (done) => {
    const t = {id:'1', name:'Teacher', notes:'Joined on time', status: '0'}
      const newcourse = {
        id: '999',
        name: 'test course',
        notes: 'new course',
        teachers: [t]
      }
    request(app)
      .post('/api/v1/course/' + newcourse.id)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newcourse })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteCourse = (adminUser) => {
  it('should delete a course', (done) => {
    request(app)
      .delete('/api/v1/course/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(app)
          .get('/api/v1/course/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.be.an('array')
            res.body.should.have.lengthOf(2)
            const deletedcourse = res.body.find((u) => u.id === 2)
            assert.isUndefined(deletedcourse)
            done()
          })
      })
  })
}

const deleteCourseFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid id', (done) => {
    request(app)
      .delete('/api/v1/course/999')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


//Test that get requests only work for users with admin role
const getAllCoursesRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .get('/api/v1/courses/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests only work for users with admin role
const putCourseRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .put('/api/v1/courses/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that post requests are only allowed for users with admin role
const postCourseRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .post('/api/v1/course/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteCourseRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .delete('/api/v1/course/2')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

  describe('GET /', () => {
    getAllCourses(adminUser)
    getAllCoursesSchemaMatch(adminUser)
    getAllCoursesRequiresAdminRole(adminUser)
  })

  describe('PUT /', () => {
    putCourse(adminUser)
    addCourseIgnoresAdditionalProperties(adminUser)
    putCourseRequiresAdminRole(adminUser)
    addCourseFailsOnDuplicateName(adminUser)
    addCourseFailsOnMissingName(adminUser)
  })


  describe('POST /{id}', () => {
    updateCourse(adminUser)
    updateCourseIgnoresAdditionalProperties(adminUser)
    updateCourseFailsOnMissingName(adminUser)
    updateCourseFailsOnInvalidId(adminUser)
    postCourseRequiresAdminRole(adminUser)
  })

  describe('DELETE /{id}', () => {
    deleteCourse(adminUser)
    deleteCourseFailsOnInvalidId(adminUser)
    deleteCourseRequiresAdminRole(adminUser)
  })

