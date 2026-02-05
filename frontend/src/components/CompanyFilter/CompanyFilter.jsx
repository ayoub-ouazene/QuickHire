import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import styles from "./CompanyFilter.module.css";

function CompanyFilterObject({ jobs = [], onFilterChange }) {
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* ===== MOBILE FILTER ICON (only for mobile) ===== */}
      <div className={styles.mobileFilterIcon} onClick={toggleMobileMenu}>
        <Filter size={20} />
        <span className={styles.filterText}>Filters</span>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu}>
          <div className={styles.mobileFilterContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={toggleMobileMenu}>
              ×
            </button>

            <div className={styles.FilterBar}>
              <form className={styles.JobType} onSubmit={(e) => e.preventDefault()}>
                <legend>Job Experience</legend>
                {Object.keys(counts.experience).map((key) => (
                  <div className={styles.singleButton} key={key}>
                    <input
                      className={styles.buttons}
                      type="checkbox"
                      id={`exp-${key}-mobile`}
                      value={key}
                      checked={selectedExperience.includes(key)}
                      onChange={() => toggleExperience(key)}
                    />
                    <label htmlFor={`exp-${key}-mobile`}>
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
                      id={`cat-${cat}-mobile`}
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <label htmlFor={`cat-${cat}-mobile`}>
                      {cat} ({counts.categories[cat]})
                    </label>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== DESKTOP FILTER ===== */}
      <div className={styles.desktopFilter}>
        <div className={styles.FilterBar}>
          <form className={styles.JobType} onSubmit={(e) => e.preventDefault()}>
            <legend>Job Experience</legend>
            {Object.keys(counts.experience).map((key) => (
              <div className={styles.singleButton} key={key}>
                <input
                  className={styles.buttons}
                  type="checkbox"
                  id={`exp-${key}-desktop`}
                  value={key}
                  checked={selectedExperience.includes(key)}
                  onChange={() => toggleExperience(key)}
                />
                <label htmlFor={`exp-${key}-desktop`}>
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
                  id={`cat-${cat}-desktop`}
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <label htmlFor={`cat-${cat}-desktop`}>
                  {cat} ({counts.categories[cat]})
                </label>
              </div>
            ))}
          </form>
        </div>
      </div>
    </>
  );
}

export default CompanyFilterObject;