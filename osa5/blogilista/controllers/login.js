const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

loginRouter.post('/', async (request, response, next) => {
  const user = await User.findOne({username: request.body.username})
  
  const okToLogin = (user === null) ? false
    : await bcrypt.compare(request.body.password, user.passwordHash)
  
  if (!okToLogin) {
    logger.info('Invalid login attempt.')
    return response.status(401).json({ error: 'invalid credentials' })
  }
  
  const userForToken = { username: user.username, id: user._id }
  
  const token = jwt.sign(userForToken, process.env.SECRET)
  
  response.send({ token, username: user.username, name: user.name })

})    

module.exports = loginRouter
