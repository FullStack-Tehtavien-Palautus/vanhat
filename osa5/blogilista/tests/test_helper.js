const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Weimarin tasavalta',
    author: 'Julius Gustav Sutelainen',
    url: 'https://edsomer.blogs.co-op.fi/',
    likes: 12
  },
  {
    title: 'Väärin kirjoitettu',
    author: 'Tommi Mannermaa',
    url: 'https://blogornot.org/tommi3066',
    likes: 5
  },
  {
    title: 'Ymmärtävämpää suhtautumista',
    author: 'Seppo Mika Yrjö Rautio',
    url: 'https://vihapuhetta.blog-out.com',
    likes: 7
  },
  {
    title: 'Wrongly spelled',
    author: 'Tommi Mannermaa',
    url: 'https://blogornot.org/tommi3067',
    likes: 2
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'to be removed',
    author: 'autohor',
    url: 'https://eowqi.eroer.com/'    
  })
  await blog.save()
  await blog.remove()
  
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map( b => b.toJSON() )
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map( u => u.toJSON() )
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}