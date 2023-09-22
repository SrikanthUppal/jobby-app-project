import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const onClickJobs = () => {
    const {history} = props
    history.push('/login')
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your ability and potential.
        </p>
        <Link to="/jobs" className="link">
          <button
            type="button"
            className="find-jobs-button"
            onClick={onClickJobs}
          >
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}
export default Home
