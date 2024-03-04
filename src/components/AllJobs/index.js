import {Component} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import JobCardItem from '../JobCardItem'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const employmentLocationsList = [
  {
    label: 'Hyderabad',
    employmentTypeId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    employmentTypeId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    employmentTypeId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    employmentTypeId: 'DELHI',
  },
  {
    label: 'Mumbai',
    employmentTypeId: 'MUMBAI',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    searchInput: '',
    profileApiStatus: apiStatusConstants.initial,
    profileData: [],
    jobsApiStatus: apiStatusConstants.initial,
    jobsData: [],
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    activeLocationList: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {
      activeCheckBoxList,
      activeLocationList,
      activeSalaryRangeId,
      searchInput,
    } = this.state
    const location = activeLocationList.join(',')
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&location=${location}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsData: updatedJobsData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const profile = data.profile_details
      const updatedProfileData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  renderSuccessProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-icon" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  renderJobsSuccessView = () => {
    const {jobsData} = this.state
    const jobsLength = jobsData.length > 0
    return jobsLength ? (
      <>
        <ul className="jobs-list-container">
          {jobsData.map(eachOne => (
            <JobCardItem key={eachOne.id} jobDetails={eachOne} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  onClickRetryProfile = () => this.getProfileData()

  onClickRetryJobs = () => this.getJobsData()

  renderFailureProfileView = () => (
    <div className="retry-btn-container">
      <button
        type="button"
        onClick={this.onClickRetryProfile}
        className="retry-profile-button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-container">
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
        onClick={this.onClickRetryJobs}
        className="retry-profile-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#f1f5f9" height="30" width="30" />
    </div>
  )

  onRenderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureProfileView()
      case apiStatusConstants.success:
        return this.renderSuccessProfileView()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      default:
        return null
    }
  }

  onRenderSearchBar = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          onClick={this.onSubmitSearchInput}
          className="search-button"
          data-testid="searchButton"
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  onChangeCheckBox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onChangeCheckBoxLocation = event => {
    const {activeLocationList} = this.state
    if (activeLocationList.includes(event.target.id)) {
      const updatedList = activeLocationList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeLocationList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeLocationList: [
            ...prevState.activeLocationList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onGetCheckBoxFilter = () => (
    <ul className="filters-list">
      {employmentTypesList.map(eachType => (
        <li className="list-item" key={eachType.employmentTypeId}>
          <input
            className="checkbox"
            type="checkbox"
            id={eachType.employmentTypeId}
            onChange={this.onChangeCheckBox}
          />
          <label htmlFor={eachType.employmentTypeId} className="label">
            {eachType.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetCheckBoxLocation = () => (
    <ul className="filters-list">
      {employmentLocationsList.map(eachLocation => (
        <li className="list-item" key={eachLocation.employmentTypeId}>
          <input
            className="checkbox"
            type="checkbox"
            id={eachLocation.employmentTypeId}
            onChange={this.onChangeCheckBoxLocation}
          />
          <label htmlFor={eachLocation.employmentTypeId} className="label">
            {eachLocation.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeRadio = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onGetRadioFilter = () => (
    <ul className="filters-list">
      {salaryRangesList.map(eachRadio => (
        <li className="list-item" key={eachRadio.salaryRangeId}>
          <input
            className="radio"
            type="radio"
            name="option"
            id={eachRadio.salaryRangeId}
            onChange={this.onChangeRadio}
          />
          <label className="label" htmlFor={eachRadio.salaryRangeId}>
            {eachRadio.label}
          </label>
        </li>
      ))}
    </ul>
  )

  render() {
    return (
      <>
        <Header />
        <div className="all-jobs-body-container">
          <div className="search-bar-container-sm">
            {this.onRenderSearchBar()}
          </div>
          <div className="profile-filters-container">
            {this.onRenderProfile()}
            <hr className="hr-line" />
            <h1 className="filter-headings">Type of Employment</h1>
            {this.onGetCheckBoxFilter()}
            <hr className="hr-line" />
            <h1 className="filter-headings">Salary Range</h1>
            {this.onGetRadioFilter()}
            <hr className="hr-line" />
            <h1 className="filter-headings">Locations</h1>
            {this.onGetCheckBoxLocation()}
            <hr className="hr-line" />
          </div>
          <div className="jobs-container">
            <div className="search-bar-container-lg">
              {this.onRenderSearchBar()}
            </div>
            {this.onRenderJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
