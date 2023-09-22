import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorStatus: false,
    errorMsg: '',
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFail = err => {
    this.setState({errorMsg: err, errorStatus: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFail(data.error_msg)
    }
  }

  render() {
    const {username, password, errorStatus, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <div className="form-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="form-logo-image"
            />
          </div>
          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <input
            placeholder="Username"
            id="username"
            type="text"
            className="inputs-bar"
            value={username}
            onChange={this.onChangeUserName}
          />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            placeholder="Password"
            id="password"
            type="password"
            className="inputs-bar"
            value={password}
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {errorStatus && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default LoginForm
