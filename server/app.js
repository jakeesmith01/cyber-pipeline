import 'dotenv/config'

//Require Libraries
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import debugModule from 'debug'
const debug = debugModule('app')
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import history from 'connect-history-api-fallback'  
import util from 'node:util'
import dotenv from 'dotenv'
import swaggerUI from 'swagger-ui-express'
import openapi from './configs/openapi.js'

// View engine setup
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Logger
import logger from './configs/logger.js'

// Default Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Load Environment Variable
dotenv.config()
debug('Environment:\n' + process.env)

// Configure Timezone
process.env.TZ = 'UTC'

// Load Configs
import session from './configs/session.js'

// Load Routers
import indexRouter from './routes/index.js'
import authRouter from './routes/auth.js'
import apiRouter from './routes/api.js'

// Create Express Application
const app = express()

// Set up Sessions
app.use(session)

// Enable CORS in development
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:3001',
      credentials: true,
    })
  )
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Logging middleware is added in routers
// to capture user ID information from token

// JSON Middleware
app.use(express.json())

// Handle URLEncoded Bodies
app.use(express.urlencoded({ extended: false }))

// Parse Cookies
app.use(cookieParser())

// Enable Compression
app.use(compression())

// Add Helmet Protection
app.use(helmet())

// Add Index router and OpenAPI spec in development
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  app.use('/', indexRouter)

  // Use dynamic import for ES6 modules
  app.use(
    '/docs',
    swaggerUI.serve,
    swaggerUI.setup(openapi, {explorer: true})
  )
}

// Routers
// Auth routes must come first
app.use('/auth', authRouter)

// Redirect other requests to Vue app
app.use(history())

// Serve Static Resources
app.use(express.static(path.join(__dirname, 'public')))

// Handle any API routes last
app.use('/api/v1', apiRouter)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  logger.error(util.inspect(err))
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app