const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersInDb = require('./test_helper').usersInDb

const api = supertest(app)

describe('tests for readily populated db', () => {
  beforeAll( async () => {
    await User.deleteMany({})

    const username = 'root'
    const name = 'Vastaamo Security Team'
    const passwordHash = await bcrypt.hash(username, 10)
  
    const user = new User({ username, name, passwordHash })
  
    await user.save()
  })
  
  test('create user, valid data, 200 created', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
      username: 'bvaatain',
      name: 'Benjamin Timo Väätäinen',
      password: 'Lieksa040578!'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
    const usernames = usersAtEnd.map( u => u.username )
    expect(usernames).toContain(newUser.username)
  })

  test('create user, duplicate username, 400 bad request', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
      username: 'root',
      name: 'Satu Vanessa Nathalia Ojaniemi',
      password: 'A1kaHyväVa1M1tä?'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('`username` is not unique')
      
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('create user, short password, 400 bad request', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
      username: 'irantan3',
      name: 'Irma Rantanen',
      password: 'ok'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('`password` is invalid')
      
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('create user, no password, 400 bad request', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
      username: 'jraisane',
      name: 'Joona Mikko Räisänen',
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('`password` is missing')
      
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('create user, short username, 400 bad request', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
      username: 'sf',
      name: 'Satu J Flyktman',
      password: 'Qwerty1!'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('`username` is invalid')
      
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('create user, no username, 400 bad request', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
      name: 'Risto Aaro Kai Brunström',
      password: 'S4l4S4n4¤'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('`username` is missing')
      
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

afterAll( () => {
  mongoose.connection.close()
})
