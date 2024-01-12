import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then( resp => resp.data )
}

const create = newContact => {
  const req = axios.post(baseUrl, newContact)
  return req.then( resp => resp.data )
}

const delEntry = id => {
  const req = axios.delete(`${baseUrl}/${id}`)
  return req.then( resp => resp.data )
}

const replace = (id, newContact ) => {
  const req = axios.put(`${baseUrl}/${id}`, newContact)
  return req.then( resp => resp.data )
}

const services = { getAll, create, delEntry, replace }
export default services
