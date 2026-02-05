import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './CAcceptationPop.module.css';

const SuccessPopup = ({ isOpen, onClose, applicantName, jobRole }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle overlay click (close popup when clicking outside)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <div className={styles.successIcon} aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="var(--Main-blue-color)"/>
              <path 
                d="M44 22L28 38L20 30" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <h2 id="popup-title" className={styles.popupTitle}>
            OFFER EXTENDED
          </h2>
          
          <div className={styles.highlightBox}>
            <p className={styles.highlightText}>
              <span className={styles.applicantName}>
                {applicantName || 'The candidate'}
              </span> has been selected for
            </p>
            <p className={styles.jobRole}>
              {jobRole || 'the position'}
            </p>
          </div>
          
          <p className={styles.popupMessage}>
            The official offer letter has been sent to the candidate.
          </p>
          
          <p className={styles.popupMessage}>
            HR will coordinate the onboarding process and start date.
          </p>
          
          <div className={styles.buttonContainer}>
            <button 
              className={styles.continueButton}
              onClick={onClose}
              autoFocus
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SuccessPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  applicantName: PropTypes.string,
  jobRole: PropTypes.string
};

SuccessPopup.defaultProps = {
  applicantName: 'The candidate',
  jobRole: 'the position'
};


export default SuccessPopup;
