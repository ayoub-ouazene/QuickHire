import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import styles from "./filtring.module.css";

function FilterObject({ jobs = [], onFilterChange }) {
  const [selectedEmployment, setSelectedEmployment] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const counts = useMemo(() => {
    const c = {
      employment: {
        "Full-time": 0,
        "Part-time": 0,
        Remote: 0,
        Internship: 0,
        Contract: 0,
      },
      categories: {},
    };
    jobs.forEach((job) => {
      const et = job?.stats?.jobtype;
      const cat = job?.stats?.jobcategory;
      if (et && c.employment.hasOwnProperty(et)) c.employment[et]++;
      if (cat) c.categories[cat] = (c.categories[cat] || 0) + 1;
    });
    return c;
  }, [jobs]);

  useEffect(() => {
    onFilterChange &&
      onFilterChange({
        EmploymentType: selectedEmployment,
        Categories: selectedCategories,
      });
  }, [selectedEmployment, selectedCategories, onFilterChange]);

  const toggleEmployment = (value) => {
    setSelectedEmployment((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* ===== MOBILE FILTER ICON ===== */}
      <div className={styles.mobileFilterIcon} onClick={toggleMobileMenu}>
        <Filter size={20} />
        <span className={styles.filterText}>Filters</span>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu}>
          <div
            className={styles.mobileFilterContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={toggleMobileMenu}>
              ×
            </button>

            <div className={styles.FilterBar}>
              <form className={styles.JobType} onSubmit={(e) => e.preventDefault()}>
                <legend>Type Of Employment</legend>
                {Object.keys(counts.employment).map((key) => (
                  <div className={styles.singleButton} key={key}>
                    <input
                      className={styles.buttons}
                      type="checkbox"
                      name="JobType"
                      id={`emp-${key}-mobile`}
                      value={key}
                      checked={selectedEmployment.includes(key)}
                      onChange={() => toggleEmployment(key)}
                    />
                    <label htmlFor={`emp-${key}-mobile`}>
                      {key} ({counts.employment[key] || 0})
                    </label>
                  </div>
                ))}
              </form>

              <form className={styles.JobField} onSubmit={(e) => e.preventDefault()}>
                <legend>Categories</legend>
                {Object.keys(counts.categories)
                  .sort()
                  .map((cat) => (
                    <div className={styles.singleButton} key={cat}>
                      <input
                        className={styles.buttons}
                        type="checkbox"
                        name="JobField"
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
            <legend>Type Of Employment</legend>
            {Object.keys(counts.employment).map((key) => (
              <div className={styles.singleButton} key={key}>
                <input
                  className={styles.buttons}
                  type="checkbox"
                  name="JobType"
                  id={`emp-${key}-desktop`}
                  value={key}
                  checked={selectedEmployment.includes(key)}
                  onChange={() => toggleEmployment(key)}
                />
                <label htmlFor={`emp-${key}-desktop`}>
                  {key} ({counts.employment[key] || 0})
                </label>
              </div>
            ))}
          </form>

          <form className={styles.JobField} onSubmit={(e) => e.preventDefault()}>
            <legend>Categories</legend>
            {Object.keys(counts.categories)
              .sort()
              .map((cat) => (
                <div className={styles.singleButton} key={cat}>
                  <input
                    className={styles.buttons}
                    type="checkbox"
                    name="JobField"
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

export default FilterObject;
