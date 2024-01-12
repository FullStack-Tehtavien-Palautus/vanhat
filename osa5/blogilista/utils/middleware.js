const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('>>> * * * *', new Date() )
  logger.info('>>> * Method:', request.method )
  logger.info('>>> * Path:', request.path )
  logger.info('>>> * Body:', request.body )
  next()
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  request.token = (auth && auth.toLowerCase().startsWith('bearer '))
    ? request.token = auth.substring(7)
    : null
  next()
}

const userExtractor = async (request, response, next) => { 
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
    if( !(request.token && decodedToken.id) ) {
      logger.info('invalid/missing token.')
      return response.status(401).json({error: 'invalid/missing token'})
    }
    request.user = await User.findById(decodedToken.id)
  } else {
    request.user = null;
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
   
  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return response.status(400).send({ error: error.message })
    case 'JsonWebTokenError':
      return response.status(401).send({ error: 'invalid token' })
  }
  next()
}

module.exports = {
  errorHandler,
  requestLogger,
  tokenExtractor,
  userExtractor
}