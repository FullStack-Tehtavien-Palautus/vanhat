const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.post('/', async (request, response, next) => {
  if (!request.body.password ) {
    logger.error('Not adding user: `password` is missing')
    return response.status(400).json({error: '`password` is missing'})
  }
  if ( request.body.password.length <3 ) {
    logger.error('Not adding user: `password` is invalid')
    return response.status(400).json({error: '`password` is invalid'})
  }
  if (!request.body.username ) {
    logger.error('Not adding user: `username` is missing')
    return response.status(400).json({error: '`username` is missing'})
  }
  if ( request.body.username.length <3 ) {
    logger.error('Not adding user: `username` is invalid')
    return response.status(400).json({error: '`username` is invalid'})
  }
  if ( await User.exists({username: request.body.username}) ) {
    logger.error('Not adding user: `username` is not unique')
    return response.status(400).json({error: '`username` is not unique'})
  }

  const username = request.body.username
  const name = request.body.name || request.body.username
  const passwordHash = await bcrypt.hash(request.body.password, 10)
  
  const user = new User({ username, name, passwordHash })
  
  const savedUser = await user.save()
    
  response.json( savedUser )
})

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })

  response.json( users.map(u => u.toJSON() ) )
})

module.exports = usersRouter


/*
blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json( blog )
  response.status(404).json()
})


blogsRouter.put('/:id', async (request, response, next) => {
  oldEntry = await Blog.findById(request.params.id)
  const blogEdit = {
    title: request.body.title || oldEntry.title,
    url: request.body.url || oldEntry.url,
    author: request.body.author || oldEntry.author,
    likes: request.body.likes || oldEntry.likes
  }
  response.status(201).json(
    await Blog.findByIdAndUpdate(request.params.id, blogEdit, { new: true })
  )
})

blogsRouter.delete('/:id', async (request, response, next) => {
  response.status(204).json( await Blog.findByIdAndRemove(request.params.id) )
})

*/