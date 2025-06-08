/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile API
 */

// Load Libraries
import express from 'express'
const router = express.Router()

// Load Models
import User from '../../models/user.js'

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: get the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/', async function (req, res, next) {
  let user = await User.query().findById(req.user_id)
  res.json(user)
})

/**
 * @swagger
 * /api/v1/profile:
 *   post:
 *     summary: update current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: Test Administrator
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/', async function (req, res, next) {
  try {
    await User.query().findById(req.user_id).patch({
      name: req.body.user.name,
    })
    res.status(200)
    res.json({ message: 'Profile Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

export default router