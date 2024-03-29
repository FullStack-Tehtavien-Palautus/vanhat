const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req) => req.body?JSON.stringify(req.body):'')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get ('/api/persons', (req, res) => {
  Person.find({}).then(persons => {res.json(persons)})
})

app.post ('/api/persons', (req, res, next) => {
  const body = req.body
  
  const p = new Person({
    name: body.name,
    number: body.number        
  })
  
  p.save()
    .then(savedPerson => res.json(savedPerson) )
    .catch( error => next(error) )
})


app.get ('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then( p => {
    if (p) res.json(p)
    else res.status(404).end()
  })
    .catch( error => next(error) )
})

app.delete ('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then( () => res.status(204).end() )
    .catch( error => next(error))
})

app.put ('/api/persons/:id', (req, res, next) => {
  const body = req.body
  
  const p = {
    name: body.name,
    number: body.number
  }
  
  Person.findByIdAndUpdate(req.params.id, p, {new: true})
    .then( updatedPerson => res.json(updatedPerson) )
    .catch( error => next(error))
})

app.get ('/info', (req, res) => {
  Person.countDocuments({}, (err, count) => {
    const infoSum=`Phonebook has info for ${count} people`
    res.send(`<html><body><p>${infoSum}</p><p>${new Date()}</p></body></html>`)
  })
})



const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name==='CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  }
  if (error.name==='ValidationError') {
    return res.status(400).send({ error: error.message})
  }
  
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
  console.log(`Server running on port ${PORT}`)
})