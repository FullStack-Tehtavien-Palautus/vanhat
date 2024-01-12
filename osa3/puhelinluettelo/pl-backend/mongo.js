const mongoose = require('mongoose')

if (![3,5].includes(process.argv.length)) {
  console.log('usage:')
  console.log('list contacts: node mongo.js <password>')
  console.log('add a contact: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://pl-kayttaja:${password}@pl.8unzy.mongodb.net/pl?retryWrites=true&w=majority`
mongoose.connect(url)


const personSchema = new mongoose.Schema ({
  name: String,
  number: String,
  id: Number
})
const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then( result => {
    result.forEach( p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const p = new Person({
    id: Math.floor(Math.random()*99999999),
    name: process.argv[3],
    number: process.argv[4]
  })
  p.save().then(() => {
    console.log(`added ${p.name} number ${p.number} to phonebook`)
    mongoose.connection.close()
  })
}






