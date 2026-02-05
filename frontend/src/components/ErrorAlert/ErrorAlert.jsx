import { useEffect } from 'react';
import { XCircle, X } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './ErrorAlert.module.css';

/**
 * ErrorAlert Component
 * 
 * Usage:
 * <ErrorAlert 
 *   message="Failed to update profile. Please try again." 
 *   onClose={() => setShowAlert(false)}
 *   duration={4000}
 * />
 */
const ErrorAlert = ({ message, onClose, duration = 4000, autoClose = true }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={styles.alertOverlay}>
      <div className={styles.alertContainer}>
        <div className={styles.iconWrapper}>
          <XCircle className={styles.icon} size={28} />
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>Error</h3>
          <p className={styles.message}>{message}</p>
        </div>

        {onClose && (
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close alert"
          >
            <X size={20} />
          </button>
        )}

        {autoClose && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  duration: PropTypes.number,
  autoClose: PropTypes.bool,
};

export default ErrorAlert;