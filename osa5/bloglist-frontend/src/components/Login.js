import PropTypes from 'prop-types'
import React from 'react'

const Form = ({ handleLogin,
  username, handleUsername,
  password, handlePassword }) => (
  <div>
    <h3>Please, log in:</h3>
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input type="text" name="Username"
          value={username} onChange={handleUsername} />
      </div>
      <div>
        password:
        <input type="text" name="Password"
          value={password} onChange={handlePassword} />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)
Form.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}


const Info = ({ user, handleLogout }) => (
  <div>
    <h3>Logged in as:</h3>
    <div>{user.name} ({user.username})</div>
    <button onClick={handleLogout}>logout</button>
  </div>
)
Info.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}



export default { Form, Info }
