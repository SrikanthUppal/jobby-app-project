import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCardItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <>
      <Link to={`/jobs/${id}`} className="link">
        <li className="job-list-item">
          <div className="company-job-role-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
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
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="description-container">
            <h1 className="description-text">Description</h1>
            <p className="job-description">{jobDescription}</p>
          </div>
        </li>
      </Link>
    </>
  )
}
export default JobCardItem
