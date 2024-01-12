const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

var testAuth = null
var wrongAuth = null

beforeAll( async() => {
  await User.deleteMany({})
  const savedUser = await new User({
    name: 'Matti A Wächter',
    username: 'mwachter',
    password: 'J39fdM;¤¤%jw'
  }).save()
  const userForToken = { username: savedUser.username, id: savedUser._id }
  testAuth = `bearer ${jwt.sign(userForToken, process.env.SECRET)}`

  const wrongUser = await new User({
    name: 'Sanna Pirkko Paula Nygård',
    username: 'snygard',
    password: '!#¤H#¤TI"(snne'
  }).save()
  const userForToken2 = { username: wrongUser.username, id: wrongUser._id }
  wrongAuth = `bearer ${jwt.sign(userForToken2, process.env.SECRET)}`
})

describe('tests for adding blogs', () => {
  beforeAll( async () => {
    await Blog.deleteMany({})
  })

  test('adding blog, valid entry, 201 created', async () => {
    const newBlogEntry = {
      title: 'just testing',
      author: 'adding a new and valid',
      url: 'https://blog.entry.info/',
      likes: 300
    }

    const entriesAtBegin = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .set('Authorization', testAuth)
      .send(newBlogEntry)
      .expect(201)
      .expect('Content-Type', /application\/json/ )
      
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength( entriesAtBegin.length + 1 )
    
    const titles = entriesAtEnd.map(r => r.title)
    expect(titles).toContain('just testing')
  })

  test('addind blog, valid entry, defaults 0 likes', async () => {
    const newBlogEntry = {
      title: 'just testing without likes',
      author: 'add no likes',
      url: 'https://likes.entry.info/'
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', testAuth)
      .send(newBlogEntry)
      .expect(201)
      .expect('Content-Type', /application\/json/ )
      
    addedEntry = await Blog.findById(response.body.id)
    expect(addedEntry.likes).toBe(0)
  })

  test('adding blog, no url, 400 bad request', async () => {
    const newBlogEntry = {
      title: 'just testing without url'
    }

    const entriesAtBegin = await helper.blogsInDb()
    
    await api
      .post('/api/blogs')
      .set('Authorization', testAuth)
      .send(newBlogEntry)
      .expect(400)
      .expect('Content-Type', /application\/json/ )
      
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength(entriesAtBegin.length)
  })
  
  test('adding blog, no title, 400 bad request', async () => {
    const newBlogEntry = {
      url: 'https://notitle.entry.info/'
    }

    const entriesAtBegin = await helper.blogsInDb()
    
    await api
      .post('/api/blogs')
      .set('Authorization', testAuth)
      .send(newBlogEntry)
      .expect(400)
      .expect('Content-Type', /application\/json/ )
      
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength(entriesAtBegin.length)
  })
  
  test('adding blog, no auth, 401 unauthorized', async () => {
    const newBlogEntry = {
      url: 'https://notitle2.entry.info/'
    }

    const entriesAtBegin = await helper.blogsInDb()
    
    const result = await api
      .post('/api/blogs')
      .send(newBlogEntry)
      .expect(401)
      .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('not logged in')
      
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength(entriesAtBegin.length)
  })
  
})


describe('tests for existing database', () => {
  beforeAll( async () => {
    await Blog.deleteMany({})
    for (newBlogEntry of helper.initialBlogs ) {
      await api
        .post('/api/blogs')
        .set('Authorization', testAuth)
        .send(newBlogEntry)
        .expect(201)
        .expect('Content-Type', /application\/json/ )
    }
  })

  test('get blogs, returned as json, 200 ok', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/ )
    })

  test('get blogs, all returned', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(entriesInBegin.length)
  })

  test('get blogs, id is defined', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body[0].id).toBeDefined()
  })
  
  test('get blogs, includes a specific entry', async () => {
    const response = await api.get('/api/blogs')
    
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Väärin kirjoitettu')
  })

  test('modify blog, update likes, 201 created', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const entryToModify = entriesInBegin[1]
    const newData = { likes: 1000000 }

    await api
      .put(`/api/blogs/${entryToModify.id}`)
      .set('Authorization', testAuth)
      .send(newData)
      .expect(201)
      .expect('Content-Type', /application\/json/ )
      
    const entryAfterEdit = await Blog.findById(entryToModify.id)
    
    expect(entryAfterEdit.likes).toBe(newData.likes)
   
  })

  test('modify blog, no login, 401 unauthorized', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const entryToModify = entriesInBegin[1]
    const newData = { likes: 1000000 }

    await api
      .put(`/api/blogs/${entryToModify.id}`)
      .send(newData)
      .expect(401)
      .expect('Content-Type', /application\/json/ )
      
    const entryAfterEdit = await Blog.findById(entryToModify.id)
    
    expect(entryAfterEdit.likes).toBe(entryToModify.likes)
  })

  test('modify blog, wrong user login, 401 unauthorized', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const entryToModify = entriesInBegin[1]
    const newData = { likes: 1000000 }

    await api
      .put(`/api/blogs/${entryToModify.id}`)
      .set('Authorization', wrongAuth)
      .send(newData)
      .expect(401)
      .expect('Content-Type', /application\/json/ )
      
    const entryAfterEdit = await Blog.findById(entryToModify.id)
    
    expect(entryAfterEdit.likes).toBe(entryToModify.likes)
  })



  test('delete blog, valid entry, 204 no content', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const entryToDelete = entriesInBegin[1]
    
    await api
      .delete(`/api/blogs/${entryToDelete.id}`)
      .set('Authorization', testAuth)
      .expect(204)
    
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    
    const titles = entriesAtEnd.map(r => r.title)
    expect(titles).not.toContain(entryToDelete.title)
  })
  
  test('delete blog, no authentication, 401 unauthorized', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const entryToDelete = entriesInBegin[1]
    
    const result = await api
      .delete(`/api/blogs/${entryToDelete.id}`)
      .expect(401)
      
    expect(result.body.error).toContain('not logged in')
    
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength(entriesInBegin.length)
  })
  
  test('delete blog, wrong user, 401 unauthorized', async () => {
    const entriesInBegin = await helper.blogsInDb()
    const entryToDelete = entriesInBegin[1]
    
    const result = await api
      .delete(`/api/blogs/${entryToDelete.id}`)
      .set('Authorization', wrongAuth)
      .expect(401)
      
    expect(result.body.error).toContain('user mismatch')
    
    const entriesAtEnd = await helper.blogsInDb()
    expect (entriesAtEnd).toHaveLength(entriesInBegin.length)
  })
  
})

afterAll( () => {
  mongoose.connection.close()
})
