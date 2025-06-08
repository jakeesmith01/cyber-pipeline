/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teachers API
 */

// Load Libraries
import express from 'express'
const router = express.Router()

// Load Middleware
import adminOnly from '../../middlewares/admin-only.js'
import userOrAdminOnly from '../../middlewares/user-or-admin-only.js'

// Load Models
import Teacher from '../../models/teacher.js'

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     summary: <admin> list all the teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', userOrAdminOnly, async function (req, res, next) {
  if (req.roles.includes('admin')) {
    let teachers = await Teacher.query()
      .select(
        'teachers.id',
        'teachers.name',
        'teachers.email',
        'teachers.eid',
        'teachers.wid',
        'teachers.status',
        'teachers.pd_status',
        'teachers.cert_status',
        'teachers.ms_status',
        'teachers.grade_level',
        'teachers.notes',
        'teachers.email_opt_out'
      )
      .withGraphFetched('districts')
      .withGraphFetched('courses')
      .withGraphFetched('cohorts')
    res.json(teachers)
  } else {
    let teachers = await Teacher.query()
      .select(
        'teachers.id',
        'teachers.name',
        'teachers.email',
        'teachers.eid',
        'teachers.wid',
        'teachers.grade_level',
        'teachers.notes'
      )
      .withGraphFetched('districts')
      .withGraphFetched('cohorts')
    res.json(teachers)
  }
})

/**
 * @swagger
 * /api/v1/teachers:
 *   put:
 *     summary: <admin> create teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: teacher
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *           example:
 *             name: Test Teacher
 *             email: test@distrct.com
 *             eid: test-teacher
 *             wid: "000000000"
 *             status: 0
 *             pd_status: 0
 *             cert_status: 0
 *             ms_status: 0
 *             grade_level: high school 9-12
 *             notes: This is a test teacher
 *             districts:
 *               - id: 2
 *                 notes: Current District
 *                 primary: true
 *               - id: 1
 *                 notes: Previous District
 *                 primary: false
 *             cohorts:
 *               - id: 1
 *                 notes: Started cohort on time
 *             courses:
 *               - id: 1
 *                 notes: Teacher is doing well
 *                 status: 0
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from districts
    const districts = req.body.teacher.districts.map(
      ({ id, notes, primary, ...next }) => {
        return {
          id: id,
          notes: notes,
          primary: primary,
        }
      }
    )
    const cohorts = req.body.teacher.cohorts.map(({ id, notes, ...next }) => {
      return {
        id: id,
        notes: notes,
      }
    })
    const courses = req.body.teacher.courses.map(
      ({ id, notes, status, ...next }) => {
        return {
          id: id,
          notes: notes,
          status: status,
        }
      }
    )
    await Teacher.query().upsertGraph(
      {
        name: req.body.teacher.name,
        email: req.body.teacher.email,
        eid: req.body.teacher.eid,
        wid: req.body.teacher.wid,
        status: req.body.teacher.status,
        pd_status: req.body.teacher.pd_status,
        cert_status: req.body.teacher.cert_status,
        ms_status: req.body.teacher.ms_status,
        grade_level: req.body.teacher.grade_level,
        notes: req.body.teacher.notes,
        districts: districts,
        cohorts: cohorts,
        courses: courses,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Teacher Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   post:
 *     summary: <admin> update teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: teacher ID
 *     requestBody:
 *       description: teacher
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *           example:
 *             id: 1
 *             name: Test Teacher
 *             email: test@distrct.com
 *             eid: test-teacher
 *             wid: "000000000"
 *             status: 0
 *             pd_status: 0
 *             cert_status: 0
 *             ms_status: 0
 *             district_id: 1
 *             grade_level: high school 9-12
 *             notes: This is a test teacher
 *             districts:
 *               - id: 2
 *                 notes: Current District
 *                 primary: true
 *               - id: 1
 *                 notes: Previous District
 *                 primary: false
 *             cohorts:
 *               - id: 1
 *                 notes: Started cohort on time
 *             courses:
 *               - id: 1
 *                 notes: Teacher is doing well
 *                 status: 0
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async function (req, res, next) {
  try {

    console.log(req.body.teacher)
    // strip out other data from districts
    const districts = req.body.teacher.districts.map(
      ({ id, notes, primary, ...next }) => {
        return {
          id: id,
          notes: notes,
          primary: primary,
        }
      }
    )
    const cohorts = req.body.teacher.cohorts.map(({ id, notes, ...next }) => {
      return {
        id: id,
        notes: notes,
      }
    })
    const courses = req.body.teacher.courses.map(
      ({ id, notes, status, ...next }) => {
        return {
          id: id,
          notes: notes,
          status: status,
        }
      }
    )
    await Teacher.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.teacher.name,
        email: req.body.teacher.email,
        eid: req.body.teacher.eid,
        wid: req.body.teacher.wid,
        status: req.body.teacher.status,
        pd_status: req.body.teacher.pd_status,
        cert_status: req.body.teacher.cert_status,
        ms_status: req.body.teacher.ms_status,
        grade_level: req.body.teacher.grade_level,
        email_opt_out: req.body.teacher.email_opt_out,
        notes: req.body.teacher.notes,
        districts: districts,
        cohorts: cohorts,
        courses: courses,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Teacher Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   delete:
 *     summary: <admin> delete teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: teacher ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await Teacher.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'Teacher Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'Teacher Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

export default router