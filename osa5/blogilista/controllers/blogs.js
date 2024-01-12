const logger = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  blogs = await Blog.find({})
    .populate('user', {username: 1, name: 1})
  response.json( blogs )
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json( blog )
  response.status(404).json()
})

blogsRouter.post('/', async (request, response, next) => {
  if (!request.user) return response.status(401).json({error: 'not logged in'})

  const blog = new Blog ({
    ...request.body,
    user: request.user._id
  })
  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save();

  response.status(201).json( savedBlog.toJSON() )
})

blogsRouter.put('/:id', async (request, response, next) => {
  if (!request.user) return response.status(401).json({error: 'not logged in'})

  oldEntry = await Blog.findById(request.params.id)

  if (request.user._id.toString() !== oldEntry.user.toString() ) {
    return response.status(401).json({error: 'user mismatch'})
  }

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
  const blogToDelete = await Blog.findById(request.params.id)
  
  if (!request.user) {
    logger.info('No deletion without login')
    return response.status(401).json({error: 'not logged in'})
  }
  
  if ( request.user._id.toString() === blogToDelete.user.toString() ) {
    return response
      .status(204)
      .json( await Blog.findByIdAndRemove(request.params.id) )
  }
    
  logger.info('Not allowed to delete other user data')
  response.status(401).json({error: 'user mismatch'})
})

module.exports = blogsRouter
