const config = require ('./utils/config')
const logger = require ('./utils/logger')
const http = require('http')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const middleware = require ('./utils/middleware')
const mongoose = require('mongoose')


logger.info('connecting to MONGODB_URI')
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('MongoDB connect failed:', error.message))
  

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (config.TESTING) app.use('/api/testing', testingRouter)

app.use(middleware.errorHandler)


module.exports = app
