import { useState, useEffect, useMemo } from "react";
import styles from "./CompanyFilter.module.css";

function CompanyFilterObject({ jobs = [], onFilterChange }) {
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const counts = useMemo(() => {
    const c = {
      experience: {
        "0-4 Years": 0,
        "4-6 Years": 0,
        "6-8 Years": 0,
        "8-10 Years": 0,
        "10+ Years": 0,
      },
      categories: {}
    };
    jobs.forEach(job => {
      const exp = job?.stats?.experience || 0;
      let range = "";
      if (exp < 4) range = "0-4 Years";
      else if (exp < 6) range = "4-6 Years";
      else if (exp < 8) range = "6-8 Years";
      else if (exp < 10) range = "8-10 Years";
      else range = "10+ Years";
      c.experience[range]++;
      const cat = job?.stats?.jobcategory;
      if (cat) c.categories[cat] = (c.categories[cat] || 0) + 1;
    });
    return c;
  }, [jobs]);

  useEffect(() => {
    onFilterChange && onFilterChange({
      ExperienceRange: selectedExperience,
      Categories: selectedCategories
    });
  }, [selectedExperience, selectedCategories, onFilterChange]);

  const toggleExperience = (value) => {
    setSelectedExperience(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleCategory = (value) => {
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <div className={styles.FilterBar}>
      <form className={styles.JobType} onSubmit={(e) => e.preventDefault()}>
        <legend>Job Experience</legend>
        {Object.keys(counts.experience).map((key) => (
          <div className={styles.singleButton} key={key}>
            <input
              className={styles.buttons}
              type="checkbox"
              id={`exp-${key}`}
              value={key}
              checked={selectedExperience.includes(key)}
              onChange={() => toggleExperience(key)}
            />
            <label htmlFor={`exp-${key}`}>
              {key} ({counts.experience[key] || 0})
            </label>
          </div>
        ))}
      </form>

      <form className={styles.JobField} onSubmit={(e) => e.preventDefault()}>
        <legend>Categories</legend>
        {Object.keys(counts.categories).sort().map((cat) => (
          <div className={styles.singleButton} key={cat}>
            <input
              className={styles.buttons}
              type="checkbox"
              id={`cat-${cat}`}
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            <label htmlFor={`cat-${cat}`}>
              {cat} ({counts.categories[cat]})
            </label>
          </div>
        ))}
      </form>
    </div>
  );
}

export default CompanyFilterObject;
