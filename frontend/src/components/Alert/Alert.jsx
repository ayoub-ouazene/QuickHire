import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './Alert.module.css';

/**
 * Universal Alert Component
 * 
 * Usage:
 * <Alert 
 *   type="success" // 'success' | 'error' | 'info' | 'warning'
 *   message="Operation completed successfully!" 
 *   onClose={() => setShowAlert(false)}
 *   duration={3000}
 *   autoClose={true}
 * />
 */
const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  duration = 2000, 
  autoClose = true 
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  // Configuration for each alert type
  const alertConfig = {
    success: {
      icon: CheckCircle,
      title: 'Success!',
      className: 'success'
    },
    error: {
      icon: XCircle,
      title: 'Error',
      className: 'error'
    },
    warning: {
      icon: AlertTriangle,
      title: 'Warning',
      className: 'warning'
    },
    info: {
      icon: Info,
      title: 'Info',
      className: 'info'
    }
  };

  const config = alertConfig[type] || alertConfig.info;
  const IconComponent = config.icon;

  return (
    <div className={styles.alertOverlay}>
      <div className={`${styles.alertContainer} ${styles[config.className]}`}>
        <div className={styles.iconWrapper}>
          <IconComponent className={styles.icon} size={28} />
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{config.title}</h3>
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

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  duration: PropTypes.number,
  autoClose: PropTypes.bool,
};

export default Alert;