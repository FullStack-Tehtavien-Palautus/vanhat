const testingRouter = require('express').Router()
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response, next) => {
  await User.deleteMany({})

  const username = 'ereponen'
  const name = 'Esko Rauno Reponen'
  const passwordHash = await bcrypt.hash('salakka', 10)
  const user = new User({ username, name, passwordHash })
  await user.save()

  await Blog.deleteMany({})
  return response.status(201).json({ info: 'backend reset' })
})    

module.exports = testingRouter
