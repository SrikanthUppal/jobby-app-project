import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  console.log(props)

  const onClockLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <ul className="nav-items-list">
        <li className="nav-item-logo">
          <Link to="/" className="link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo"
            />
          </Link>
        </li>
        <li className="nav-items-container">
          <Link to="/" className="link">
            <h1 className="nav-text">Home</h1>
            <AiFillHome className="nav-icon" />
          </Link>
          <Link to="/jobs" className="link">
            <h1 className="nav-text">Jobs</h1>
            <BsBriefcaseFill className="nav-icon" />
          </Link>
        </li>
        <li className="nav-item-button">
          <button
            type="button"
            className="nav-text logout-button"
            onClick={onClockLogout}
          >
            Logout
          </button>
          <FiLogOut className="nav-icon" onClick={onClockLogout} />
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
