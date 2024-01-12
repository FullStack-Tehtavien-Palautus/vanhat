import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Create from './components/Create'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './notice.css'

const Header = () => (
  <h2>blogs</h2>
)

const Notify = ({ notice, handleNotice }) => {
  if (notice === null) return (<div className="noticeBox"></div>)
  return (
    <div className="noticeBox">
      <div className={(notice.toLowerCase()).startsWith('error') ?
        'errorNotice' : 'infoNotice'} onClick={handleNotice}>
        {notice}
      </div>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState( null )
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const setTimedNotice = (notice) => {
    setNotice(notice)
    setTimeout( () => {setNotice(null)}, 5000 )
  }

  const sortLikes = (a,b) => b.likes-a.likes

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs( blogs.sort(sortLikes) ) )
  }, [])

  useEffect(() => {
    const credentialsJSON = window.localStorage.getItem('credentials')
    if (credentialsJSON) {
      const credentials = JSON.parse(credentialsJSON)
      setUser(credentials)
    }
  }, [])

  const handleNotice = () => setNotice(null)

  const handleUsername = (event) => setUsername(event.target.value)
  const handlePassword = (event) => setPassword(event.target.value)
  const handleLogout = async () => {
    window.localStorage.removeItem('credentials')
    setTimedNotice('Lugged out successfully')
    setUser(null)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loginUser = await loginService.login({ username, password })
      blogService.setToken(loginUser.token)
      window.localStorage.setItem('credentials', JSON.stringify(loginUser))
      setTimedNotice(`Successfully logged in as ${loginUser.username}`)
      setUser(loginUser)
      setUsername('')
      setPassword('')
    } catch (exception) { setTimedNotice('ERROR: wrogn credentials!') }
  }

  const handleTitle = (event) => setTitle(event.target.value)
  const handleAuthor = (event) => setAuthor(event.target.value)
  const handleUrl = (event) => setUrl(event.target.value)
  const handleCreate = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    blogService.setToken(user.token)
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setTimedNotice(`Successfully added blog ${returnedBlog.title}`)
      setTitle('')
      setAuthor('')
      setUrl('')
    }).catch( (error) => setTimedNotice(error.toString()) )
  }

  const handleLike = async (event) => {
    event.preventDefault()
    const id=event.target.attributes.blogid.value
    const blog=blogs.find( b => b.id === id )
    const updatedBlog = {
      ...blog,
      likes: blog.likes+1
    }
    blogService.setToken(user.token)
    blogService.update(updatedBlog).then(returnedBlog => {
      setBlogs(
        blogs.filter(b => b.id !== id).concat(returnedBlog).sort(sortLikes)
      )
      setTimedNotice(`Successfully liked blog ${returnedBlog.title}`)
    }).catch( (error) => setTimedNotice(error.toString()) )

  }

  const handleDelete = async (event) => {
    event.preventDefault()
    const id=event.target.attributes.blogid.value
    const blog=blogs.find( b => b.id === id )
    if (!window.confirm( `Remove blog ${blog.title}`) ) return
    blogService.setToken(user.token)
    blogService.del(id).then(() => {
      setBlogs( blogs.filter(b => b.id !== id).sort(sortLikes) )
      setTimedNotice(`Successfully deleted blog ${blog.title}`)
    }).catch( (error) => setTimedNotice(error.toString()) )
  }

  const loggedIn = !(user === null)

  console.log(blogs)
  console.log(blogs.sort(sortLikes))

  if (!loggedIn) return <div>
    <Header />
    <Notify notice={notice} handleNotice={handleNotice} />
    <Togglable buttonLabel='login'>
      <Login.Form handleLogin={handleLogin}
        username={username} handleUsername={handleUsername}
        password={password} handlePassword={handlePassword} />
    </Togglable>
  </div>
  else return <div>
    <Header />
    <Notify notice={notice} handleNotice={handleNotice} />
    <Login.Info user={user} handleLogout={handleLogout} />
    <Togglable buttonLabel='add blog'>
      <Create handleCreate={handleCreate}
        title={title}  handleTitle={handleTitle}
        author={author} handleAuthor={handleAuthor}
        url={url} handleUrl={handleUrl} />
    </Togglable>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} username={user.username}
        handleLike={handleLike} handleDelete={handleDelete}/>
    )}
  </div>

}

export default App