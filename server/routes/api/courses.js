/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Courses API
 */

// Load Libraries
import express from 'express'
const router = express.Router()

// Load Middleware
import adminOnly from '../../middlewares/admin-only.js'

// Load Models
import Course from '../../models/course.js'

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', async function (req, res, next) {
  let courses = await Course.query()
    .select('courses.id', 'courses.name', 'courses.notes', 'courses.academic_year', 'courses.course_id')
    .withGraphFetched('teachers')
  res.json(courses)
})

/**
 * @swagger
 * /api/v1/courses:
 *   put:
 *     summary: <admin> create course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *           example:
 *             name: CC 710 S23
 *             notes: First offering under new CC 710 heading
 *             teachers:
 *             - id: 1
 *               name: Test Teacher
 *               notes: Teacher is doing well
 *               status: 0
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from teachers
    const teachers = req.body.course.teachers.map(
      ({ id, notes, status, ...next }) => {
        return {
          id: id,
          notes: notes,
          status: status,
        }
      }
    )
    await Course.query().upsertGraph(
      {
        name: req.body.course.name,
        notes: req.body.course.notes,
        teachers: teachers,
        academic_year: req.body.course.academic_year,
        course_id: req.body.course.course_id
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Course Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: <admin> update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: course ID
 *     requestBody:
 *       description: course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *           example:
 *             id: 1
 *             name: CC 710 S23
 *             notes: First offering under new CC 710 heading
 *             teachers:
 *             - id: 1
 *               name: Test Teacher
 *               notes: Teacher is doing well
 *               status: 0
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async (req, res) => {
  try {
    // strip out other data from teachers
    const teachers = req.body.course.teachers.map(
      ({ id, notes, status, ...next }) => {
        return {
          id: id,
          notes: notes,
          status: status,
        }
      }
    )
    await Course.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.course.name,
        notes: req.body.course.notes,
        teachers: teachers,
        academic_year: req.body.course.academic_year,
        course_id: req.body.course.course_id
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Course Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: <admin> delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: course ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await Course.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'Course Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'Course Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

export default router