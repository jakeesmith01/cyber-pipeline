/**
 * @swagger
 * tags:
 *   name: Cohorts
 *   description: Cohorts API
 */

// Load Libraries
//const express = require('express')
//const router = express.Router()
import express from 'express'
const router = express.Router()

// Load Middleware
//const adminOnly = require('../../middlewares/admin-only')
import adminOnly from '../../middlewares/admin-only.js'
// Load Models
//const Cohort = require('../../models/cohort')
import Cohort from '../../models/cohort.js'

/**
 * @swagger
 * /api/v1/cohorts:
 *   get:
 *     summary: Retrieve a list of cohorts
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of cohorts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cohort'
 */
router.get('/', adminOnly, async function (req, res, next) {
  let cohorts = await Cohort.query()
    .select('cohorts.id', 'cohorts.name', 'cohorts.notes')
    .withGraphFetched('teachers')
  res.json(cohorts)
})

/**
 * @swagger
 * /api/v1/cohorts:
 *   put:
 *     summary: <admin> create cohort
 *     tags: [Cohorts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: cohort
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cohort'
 *           example:
 *             name: Spring 2023
 *             notes: PACK grant funded cohort
 *             teachers:
 *               - id: 1
 *                 name: Test Teacher
 *                 notes: Joined on time
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from teachers
    const teachers = req.body.cohort.teachers.map(({ id, notes, ...next }) => {
      return {
        id: id,
        notes: notes,
      }
    })
    await Cohort.query().upsertGraph(
      {
        name: req.body.cohort.name,
        notes: req.body.cohort.notes,
        teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Cohort Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/cohorts:
 *   post:
 *     summary: <admin> update cohort
 *     tags: [Cohorts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: cohort ID
 *     requestBody:
 *       description: cohort
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cohort'
 *           example:
 *             id: 1
 *             name: Spring 2023
 *             notes: PACK grant funded cohort
 *             teachers:
 *               - id: 1
 *                 name: Test Teacher
 *                 notes: Joined on time
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', async (req, res) => {
  try {
    // strip out other data from teachers
    const teachers = req.body.cohort.teachers.map(({ id, notes, ...next }) => {
      return {
        id: id,
        notes: notes,
      }
    })
    await Cohort.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.cohort.name,
        notes: req.body.cohort.notes,
        teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Cohort Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/cohorts/{id}:
 *   delete:
 *     summary: <admin> delete cohort
 *     tags: [Cohorts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: cohort ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await Cohort.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'Cohort Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'Cohort Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

export default router