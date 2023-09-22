import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobItem extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    jobData: [],
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  // eslint-disable-next-line no-unused-vars
  getJobData = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobDetailsData = [data.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachItem.title,
      }))
      const updatedSimilarJobsData = data.similar_jobs.map(eachSimilar => ({
        companyLogoUrl: eachSimilar.company_logo_url,
        employmentType: eachSimilar.employment_type,
        id: eachSimilar.id,
        jobDescription: eachSimilar.job_description,
        location: eachSimilar.location,
        rating: eachSimilar.rating,
        title: eachSimilar.title,
      }))
      this.setState({
        jobData: updatedJobDetailsData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderJobSuccessView = () => {
    const {jobData, similarJobsData} = this.state
    if (jobData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobData[0]
      return (
        <>
          <div className="job-card">
            <div className="company-job-role-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="job-role-rating-container">
                <h1 className="job-role">{title}</h1>
                <div className="rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-job-type-package-container">
              <div className="location-job-type-container">
                <div className="location-container">
                  <MdLocationOn className="gps-icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="job-type-container">
                  <BsFillBriefcaseFill className="brief-case-icon" />
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
              <div>
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="hr-line" />
            <div className="description-container">
              <div className="description-web-link-container">
                <h1 className="description-text">Description</h1>
                <a className="visit-link" href={companyWebsiteUrl}>
                  Visit
                  <BiLinkExternal className="visit-link-icon" />
                </a>
              </div>
              <p className="job-description">{jobDescription}</p>
            </div>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list">
              {skills.map(each => (
                <li className="skills-list-item" key={each.name}>
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-icon"
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-at-company-container">
              <p className="life-at-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobsData.map(eachOne => (
              <SimilarJobs
                key={eachOne.id}
                similarJobsDetails={eachOne}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  onClickRetryJobList = () => this.getJobData()

  renderJobFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.onClickRetryJobList}
        className="retry-job-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-job-container">
      <Loader type="ThreeDots" color="#f1f5f9" height="40" width="40" />
    </div>
  )

  renderJobData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.failure:
        return this.renderJobFailureView()
      case apiStatusConstant.success:
        return this.renderJobSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="about-job-item-container">{this.renderJobData()}</div>
      </>
    )
  }
}
export default AboutJobItem
