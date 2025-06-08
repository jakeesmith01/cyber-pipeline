/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles API
 */

// Load Libraries
import express from 'express'
const router = express.Router()

// Load Middleware
import adminOnly from '../../middlewares/admin-only.js'

// Load Models
import Role from '../../models/role.js'

// Require Admin Role on All Routes
router.use(adminOnly)

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: <admin> list all the roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get('/', async function (req, res, next) {
  let roles = await Role.query().select('id', 'name')
  console.log("roles: " + roles)
  res.json(roles)
})

export default router