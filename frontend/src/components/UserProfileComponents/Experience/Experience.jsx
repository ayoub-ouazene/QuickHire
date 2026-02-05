
import styles from "./Experience.module.css"
import { useEffect, useState } from "react"

function useIsMobile(maxWidth = 600) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth)
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= maxWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [maxWidth])
  return isMobile
}

const Experience = ({Experience}) => {
  const isMobile = useIsMobile(600)
  if (isMobile) {
    // Mobile: image and details in row, then description below
    return (
      <div className={styles.ExperienceContainer}>
        <div className={styles.ExperienceTopRow}>
          <img src={Experience.CompanyImg} />
          <div className={styles.ExperienceDetails}>
            <h6>{Experience.JobTitle}</h6>
            <div className={styles.MoreJobDetails}>
              <p className={styles.Company}> {Experience.Company}</p> <span>• </span>
              <p>{Experience.JobType}</p><span>• </span>
              <p>{Experience.date}<p> (1 year)</p></p>
            </div>
            <p className={styles.LocationP}>{Experience.Location}</p>
          </div>
        </div>
        <p className={styles.DescriptionP}>{Experience.JobDescription}</p>
      </div>
    )
  } else {
    // Desktop: image, details, description stacked
    return (
      <div className={styles.ExperienceContainer}>
        <img src={Experience.CompanyImg} />
        <div className={styles.ExperienceDetails}>
          <h6>{Experience.JobTitle}</h6>
          <div className={styles.MoreJobDetails}>
            <p className={styles.Company}> {Experience.Company}</p> <span>• </span>
            <p>{Experience.JobType}</p><span>• </span>
            <p>{Experience.date}<p> (1 year)</p></p>
          </div>
          <p className={styles.LocationP}>{Experience.Location}</p>
          <p className={styles.DescriptionP}>{Experience.JobDescription}</p>
        </div>
      </div>
    )
  }
}

export default Experience