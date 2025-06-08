/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: JWT is missing or invalid
 */

// Load Libraries
//const express = require('express')
//const router = express.Router()
//const jwt = require('jsonwebtoken')
import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'

// Load Configurations
//var cas = require('../configs/cas')
//const requestLogger = require('../middlewares/request-logger')
import cas from '../configs/cas.js'
import requestLogger from '../middlewares/request-logger.js'

// Load Models
//const User = require('../models/user')
import User from '../models/user.js'

import sendMagicLink from '../services/emailService.js'

// Configure Logging
router.use(requestLogger)

import crypto from 'crypto'
import logger from '../configs/logger.js'

const tokenStore = new Map()
setInterval(() => {
  const now = Date.now();

  tokenStore.forEach((value, token) => {
    if (value.expiresAt < now) {
      console.log(`Token expired and removed: ${token}`);
      tokenStore.delete(token);  // Remove expired token
    }
  });
}, 24 * 60 * 60 * 1000); // Run once a day

// 1. Send Magic Login Link
// router.post('/magic-link', async (req, res) => {
//   const { email } = req.body
//   if (!email) return res.status(400).json({ error: 'Missing email' })

//   // Generate a secure, time-limited token
//   const token = crypto.randomBytes(32).toString('hex')
//   const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

//   tokenStore.set(token, { email, expiresAt })

//   const magicLink = `${process.env.APP_HOSTNAME}/auth/magic-login/verify?token=${token}`

//   if (process.env.EMAIL_ENABLED === 'true') {
//     res.status(200).json({ magicLink, emailEnabled: true })
//   } else {
//     console.log(`🔗 Magic login link for ${email}: ${magicLink}`);
//     res.status(200).json({ magicLink, emailEnabled: false })
//   }
// })

/**
 * @swagger
 * /post:
 *    post:
 *      summary: Send a magic link to the user
 *      description: Sends a magic link to the user for login
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  description: The email address of the user
 *      responses:
 *        200:
 *          description: Magic link sent successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  magicLink:
 *                    type: string
 *                  emailEnabled:
 *                    type: boolean
 *        400:
 *          description: Invalid email address
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Error message
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Error message
 *  
 * 
 */
router.post('/magic-link', async (req, res) => {
  const { email } = req.body

  if(!email || !email.includes('@')){
    return res.status(400).json({ message: 'Invalid email address'})
  }

  try{
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 15 * 60 * 1000

    tokenStore.set(token, {email, expiresAt})

    const magicLink = `${process.env.APP_HOSTNAME}/auth/magic-login/verify?token=${token}`

    const emailData = {
      to: email,
      subject: 'Login link for CyberPipeline',
      text: `Here is your link to login to CyberPipeline: ${magicLink}`,
      html: `<p>Here is your <strong>link</strong> to login to <em>CyberPipeline</em>: <a href="${magicLink}">${magicLink}</a></p>`
    }

    await sendMagicLink(emailData.to, emailData.subject, emailData.text, emailData.html);

    res.status(200).json({magicLink, emailEnabled: true})
  }catch(error){
      console.log("Error sending magic link")
  }
})

router.get('/magic-login/verify', async (req, res) => {
  const { token } = req.query
  const data = tokenStore.get(token)

  if (!data || Date.now() > data.expiresAt) {
    return res.status(401).send('Invalid or expired magic link')
  }

  const eid = data.email

  tokenStore.delete(token)

  const user = await User.findOrCreate(eid)

  req.session.user_id = user.id
  req.session.user_eid = eid
  console.log("Session after login:", req.session);

  res.redirect('/')
})


/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: login
 *     description: log in the current user by redirecting to CAS or using force authentication if enabled
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       301:
 *         description: user is logged in, redirect to homepage
 */
router.get('/login', async function (req, res, next) {
  if (!req.session.user_id) {
    let eid = ''
    if (req.query.eid && process.env.FORCE_AUTH === 'true') {
      // force authentication enabled, use eID from query
      eid = req.query.eid
    } else {
      // use CAS authentication
      if (req.session[cas.session_name] === undefined) {
        // CAS is not authenticated, so redirect
        // Hack to fix redirects
        console.log("req session: ", req.session)
        req.url = req.originalUrl
        cas.bounce_redirect(req, res, next)
        return
      } else {
        // CAS is authenticated, get eID from session
        eid = req.session[cas.session_name]
      }
    }
    if (eid && eid.length != 0) {
      // Find or Create User for eID
      console.log("eid2: ", eid)
      console.log("req session: ", req.session)
      let user = await User.findOrCreate(eid)
      // Store User ID in session
      req.session.user_id = user.id
      req.session.user_eid = eid
    }
  }
  // Redirect to Homepage
  res.redirect('/')
})

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: get JWT
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JWT for user
 *         content:
 *           application/json:
 *             schema:
 *               token:
 *                 type: string
 *                 format: JWT
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/token', async function (req, res, next) {
  if (req.session.user_id) {
    const token = await User.getToken(req.session.user_id)
    res.json({
      token: token,
    })
  } else {
    res.status(401)
    res.json({ error: 'No Session Established, Please Login' })
  }
})

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: use refresh token to get new JWT
 *     tags: [Auth]
 *     requestBody:
 *       description: refresh token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 format: JWT
 *     responses:
 *       200:
 *         description: JWT for user
 *         content:
 *           application/json:
 *             schema:
 *               token:
 *                 type: string
 *                 format: JWT
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/token', async function (req, res, next) {
  if (req.body.refresh_token) {
    jwt.verify(
      req.body.refresh_token,
      process.env.TOKEN_SECRET,
      async (err, data) => {
        // console.log('Debugging old refresh tokens')
        // console.log(err)
        // console.log(data)
        if (err) {
          res.status(401)
          res.json({ error: 'Error Parsing Token' })
          return
        }
        if (data && data.refresh_token) {
          // If we receive a verified token, see if it is valid in the database
          const user = await User.findByRefreshToken(data.refresh_token)
          if (user != null) {
            // If it is valid, generate a new token and send
            const token = await User.getToken(user.id)
            res.json({
              token: token,
            })
          } else {
            res.status(401)
            res.json({
              error:
                'Refresh Token Not Found in Database, Session Expired, Please Login',
            })
          }
        } else {
          res.status(401)
          res.json({ error: 'Token Data Invalid, Please Login' })
        }
      }
    )
  } else {
    res.status(401)
    res.json({ error: 'Refresh Token Not Found in Request Body' })
  }
})

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout
 *     description: log out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       301:
 *         description: user is logged out, redirect to home page
 */
router.get('/logout', async function (req, res, next) {
  if (req.session.user_id) {
    await User.clearRefreshToken(req.session.user_id)
  }
  if (req.session[cas.session_name]) {
    cas.logout(req, res, next)
  } else {
    req.session.destroy()
    res.redirect('/')
  }
})

export default router
//module.exports = router
