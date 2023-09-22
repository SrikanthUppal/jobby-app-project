import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobs = props => {
  const {similarJobsDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsDetails
  return (
    <>
      <li className="similar-job-list-item">
        <div className="company-job-role-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
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
        <div className="description-container">
          <h1 className="description-text">Description</h1>
          <p className="job-description">{jobDescription}</p>
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
        </div>
      </li>
    </>
  )
}
export default SimilarJobs
