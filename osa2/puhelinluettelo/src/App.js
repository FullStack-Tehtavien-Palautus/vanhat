import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'


const Contacts = ({persons, deleter}) => {
  return ( persons.map( p => 
    <Contact person={p} key={p.name} deleter={deleter}/>
  ))
}

const Contact = ({person, deleter}) => (
  <div>
    <p>
      {person.name} {person.number}
      <button id={person.id} onClick={deleter}>delete</button>
    </p>
  </div>
)

const Filter = ({ value, handle }) => (
  <form>
    <div>
      filter shown with:
      <input value={value} onChange={handle} />
    </div>
  </form>     
)

const PersonForm = ({name, nameHandle, number, numberHandle, submit}) => (
  <form onSubmit={submit}>
    <NameInput value={name} handle={nameHandle} />
    <NumberInput value={number} handle={numberHandle} />
    <div> <button type="submit">add</button> </div>
  </form>
)
const NameInput = ({ value, handle }) => 
    <div> name: <input value={value} onChange={handle} /></div>
const NumberInput = ({ value, handle }) => 
    <div> number: <input value={value} onChange={handle} /></div>

const Notification = ({msg}) => {
  if (msg===null) return null;
  return (
    <div className="infoCont">
      <div className={msg.startsWith('ERROR')?"error":"info"}>{msg}</div>
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ newNotify, setNewNotify ] = useState( null )
  
  useEffect( () => personsService.getAll().then( data => {
    setPersons(data)
    operationOK("Phonebook loaded from server succesfully")
  }).catch( error => {
    operationOK(`ERROR: Cannot load phonebook from server`)
  }), [])
      
  const operationOK = (msg) => {
    setNewNotify( msg )
    setTimeout( () => setNewNotify(null), 3000 )
    setNewName( '' )
    setNewNumber( '' )
    setNewFilter( '' )
  }

  const addEntry = (event) => {
    event.preventDefault()

    const oldPerson = persons.find( p => p.name === newName )
    if (oldPerson) {

      if (!window.confirm(
          `${newName} is already added to phonebook. `+
          `Do you want to replace old number (${oldPerson.number}) with`+
          `a new one (${newNumber})?`
      )) return;

      const newPersons=persons.filter( p => p.id !== oldPerson.id )
      const contactObject = {
        name: newName,
        number: newNumber,
        id: oldPerson.id
      }
      newPersons.push(contactObject)

      personsService.replace(oldPerson.id, contactObject).then( () => {
        setPersons(newPersons)
        operationOK(`Contact "${newName}" replaced succesfully`) 
      }).catch( error => {
        operationOK(`ERROR: Cannot replace contact "${newName}" on server`+
            `Is it still there? Try refreshing page.`)
      })
      
      return
    }

    const contactObject = {
      name: newName,
      number: newNumber,
    }
    personsService.create(contactObject).then( respData => {
      setPersons( persons.concat(respData) )
      operationOK(`Contact "${newName}" added succesfully`) 
    }).catch( error => {
      operationOK(`ERROR: Cannot add contact "${newName}" to server`)
    })
  }
  
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewFilter(event.target.value)
  
  const handleDelete = (event) => {
    const person = persons.find( p => p.id === parseInt(event.target.id) )
    if (!window.confirm(`Delete "${person.name}" ?`)) return;
    const remainingPersons=persons.filter( p => p.id !== person.id )
    personsService.delEntry(person.id).then( () => { 
      setPersons(remainingPersons)
      operationOK(`Contact "${person.name}" deleted succesfully.`) 
    }).catch( error => {
      operationOK(`ERROR: Cannot delete contact "${person.name}" from server`)
    }) 
  }
  
  const filteredPersons = newFilter === '' 
    ? persons
    : persons.filter(p=>p.name.toLowerCase().includes(newFilter.toLowerCase()))
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg={newNotify} />
      <Filter value={newFilter} handle={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
          name={newName} nameHandle={handleNameChange}
          number={newNumber} numberHandle={handleNumberChange}
          submit={addEntry}
      />
      <h2>Numbers</h2>
      <Contacts persons={filteredPersons} deleter={handleDelete} />
    </div>
  )

}

export default App