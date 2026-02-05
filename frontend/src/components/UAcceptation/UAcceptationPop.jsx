import React, { useEffect } from 'react';
import styles from './UAcceptationPop.module.css';

const SuccessPopup = ({ isOpen, onClose, companyName, jobRole }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }

    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <div className={styles.successIcon}>
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
          
          <h2 className={styles.popupTitle}>OFFER ACCEPTED</h2>
          
          <div className={styles.highlightBox}>
            <p className={styles.highlightText}>
              You have successfully accepted the employment offer from
            </p>
            <p className={styles.companyName}>
              {companyName || 'the company'}
            </p>
            <p className={styles.highlightText}>for the role of</p>
            <p className={styles.jobRole}>
              {jobRole || 'the position'}
            </p>
          </div>
          
          <p className={styles.popupMessage}>
            Your acceptance has been confirmed with {companyName || 'the company'}.
          </p>
          
          <p className={styles.popupMessage}>
            You will receive further instructions regarding onboarding documentation and your start date via email.
          </p>
                    
          <button 
            className={styles.continueButton}
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;