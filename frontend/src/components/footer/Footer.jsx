import React, { useState } from 'react';
import styles from './Footer.module.css';
import { useNavigate } from "react-router-dom";


const Footer = () => {


  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError && validateEmail(value)) {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // If validation passes
    setEmailError('');
    setIsSubmitted(true);
    
    // Here you would typically send the email to your backend
    console.log('Subscribed email:', email);
    
    // Reset form after successful submission
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footercontent}>
        
        <div className={styles.logosection}>
          <div className={styles.logo}>
            <img src="src\assets\LOGO.svg" alt="QuickHire" />
          </div>

          <p className={styles.tagline}>
            Find your next career opportunity and connect with like-minded individuals.
          </p>
          
          <div className={styles.platformindicators}>
            <div className={styles.socialcontainer}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.sociallink}>
                <img src="src\assets\Facebook.svg" alt="Facebook" className={styles.socialicon} />
              </a>

              <div className={styles.divider}></div>

              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.sociallink}>
                <img src="src\assets\linkedin-svgrepo-com.svg" alt="LinkedIn" className={styles.socialicon} />
              </a>

              <div className={styles.divider}></div>

              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.sociallink}>
                <img src="src\assets\twitter-svgrepo-com.svg" alt="Twitter" className={styles.socialicon} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.helplinks}>
          <h4>Help Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/Terms&Conditions">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className={styles.QuickHiresection}>
          <h4>Subscribe In QuickHire</h4>
          <p className={styles.QuickHiredesc}>
            Get the freshest job news and articles delivered to your inbox every week.
          </p>
          
          <form className={styles.QuickHireform} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputgroup}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className={`${styles.emailinput} ${emailError ? styles.error : ''} ${isSubmitted ? styles.success : ''}`}
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button 
                type="submit" 
               
                className={styles.submitbtn}
                disabled={isSubmitted}
              >
                {isSubmitted ? 'Subscribed!' : 'Submit'}
              </button>
            </div>
            {emailError && <div className={styles.errorMessage}>{emailError}</div>}
            {isSubmitted && <div className={styles.successMessage}>Thank you for subscribing!</div>}
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;