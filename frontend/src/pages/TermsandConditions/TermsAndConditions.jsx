import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TermsAndConditions.module.css';


const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const navigate = useNavigate();


  const sections = {
    acceptance: '1. Acceptance of Terms',
    definitions: '2. Definitions',
    services: '3. Services Description',
    accounts: '4. User Accounts',
    responsibilities: '5. User Responsibilities',
    content: '6. Content Guidelines',
    intellectual: '7. Intellectual Property',
    privacy: '8. Privacy and Data Protection',
    hiring: '9. Job Applications and Hiring Process',
    prohibited: '10. Prohibited Activities',
    termination: '11. Termination',
    liability: '12. Disclaimers and Limitations of Liability',
    indemnification: '13. Indemnification',
    changes: '14. Changes to Terms',
    law: '15. Governing Law and Dispute Resolution',
    international: '16. International Use',
    severability: '17. Severability',
    agreement: '18. Entire Agreement',
    contact: '19. Contact Information',
    additional: '20. Additional Provisions for Specific Services'
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Adjust this value based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      <div className={styles.header}>
        <h1>Terms and Conditions</h1>
        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Sidebar Navigation */}
        <nav className={styles.sidebar}>
          <h3>Quick Navigation</h3>
          <ul className={styles.navList}>
            {Object.entries(sections).map(([key, title]) => (
              <li key={key}>
                <button
                  className={`${styles.navLink} ${activeSection === key ? styles.active : ''}`}
                  onClick={() => scrollToSection(key)}
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.termsContent}>
            {/* Section 1 */}
            <section id="acceptance" className={styles.section}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to QuickHire ("Platform," "Website," "Service," "we," "us," or "our"). 
                By accessing or using QuickHire, you agree to be bound by these Terms and Conditions ("Terms"). 
                If you do not agree to these Terms, you may not access or use the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section id="definitions" className={styles.section}>
              <h2>2. Definitions</h2>
              <ul className={styles.definitionList}>
                <li>
                  <strong>"Company"</strong> refers to employers, recruiters, or organizations posting job listings on QuickHire.
                </li>
                <li>
                  <strong>"User"</strong> refers to job seekers creating profiles and applying for positions.
                </li>
                <li>
                  <strong>"Content"</strong> includes job postings, profiles, CVs, messages, and any other information uploaded to the Platform.
                </li>
                <li>
                  <strong>"Services"</strong> refers to all features, functions, and services provided by QuickHire.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="services" className={styles.section}>
              <h2>3. Services Description</h2>
              <p>QuickHire provides an online platform that enables:</p>
              <ul className={styles.bulletList}>
                <li>Companies to post job opportunities including full-time, part-time, contract, and internship positions</li>
                <li>Users to create professional profiles, upload CVs, and showcase experience and qualifications</li>
                <li>Connection between employers and job seekers</li>
                <li>Job search and application capabilities</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="accounts" className={styles.section}>
              <h2>4. User Accounts</h2>
              
              <h3>4.1 Registration</h3>
              <ul className={styles.bulletList}>
                <li>You must be at least 18 years old to create an account</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials</li>
              </ul>

              <h3>4.2 Account Types</h3>
              <ul className={styles.bulletList}>
                <li><strong>Job Seeker Accounts:</strong> For individuals seeking employment opportunities</li>
                <li><strong>Employer Accounts:</strong> For companies and recruiters posting job opportunities</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="responsibilities" className={styles.section}>
              <h2>5. User Responsibilities</h2>
              
              <h3>5.1 Job Seekers</h3>
              <ul className={styles.bulletList}>
                <li>Ensure your profile information is accurate and truthful</li>
                <li>Do not misrepresent your qualifications, experience, or identity</li>
                <li>Maintain the security and confidentiality of your account</li>
                <li>You are responsible for all activities under your account</li>
              </ul>

              <h3>5.2 Employers</h3>
              <ul className={styles.bulletList}>
                <li>Provide accurate company information and job descriptions</li>
                <li>Ensure job postings comply with all applicable employment laws</li>
                <li>Do not post discriminatory, fraudulent, or misleading job opportunities</li>
                <li>Process applications and communicate with candidates in a professional manner</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="content" className={styles.section}>
              <h2>6. Content Guidelines</h2>
              
              <h3>6.1 Prohibited Content</h3>
              <p>You agree not to post content that:</p>
              <ul className={styles.bulletList}>
                <li>Is illegal, fraudulent, or promotes illegal activities</li>
                <li>Is discriminatory based on protected characteristics</li>
                <li>Contains false, misleading, or deceptive information</li>
                <li>Infringes on intellectual property rights of others</li>
                <li>Contains viruses, malware, or other harmful code</li>
                <li>Is sexually explicit, obscene, or pornographic</li>
                <li>Harasses, bullies, or threatens others</li>
              </ul>

              <h3>6.2 Job Postings</h3>
              <p>Employers must ensure job postings:</p>
              <ul className={styles.bulletList}>
                <li>Accurately describe the position and requirements</li>
                <li>Include legitimate employment opportunities</li>
                <li>Comply with all applicable labor and employment laws</li>
                <li>Clearly state employment type (contract, internship, full-time, etc.)</li>
              </ul>

              <h3>6.3 Profile Information</h3>
              <p>Users must ensure profiles:</p>
              <ul className={styles.bulletList}>
                <li>Contain truthful and accurate information</li>
                <li>Do not misrepresent qualifications or experience</li>
                <li>Respect privacy and confidentiality of previous employers</li>
                <li>Do not include confidential or proprietary information from previous employment</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="intellectual" className={styles.section}>
              <h2>7. Intellectual Property</h2>
              
              <h3>7.1 Platform Content</h3>
              <ul className={styles.bulletList}>
                <li>QuickHire owns all intellectual property rights in the Platform and its content</li>
                <li>You may not copy, modify, distribute, or create derivative works without our permission</li>
              </ul>

              <h3>7.2 User Content</h3>
              <ul className={styles.bulletList}>
                <li>You retain ownership of content you upload to the Platform</li>
                <li>By posting content, you grant QuickHire a worldwide, non-exclusive, royalty-free license to use your content</li>
                <li>You represent that you have the right to grant this license for all content you post</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="privacy" className={styles.section}>
              <h2>8. Privacy and Data Protection</h2>
              
              <h3>8.1 Data Collection</h3>
              <p>We collect and process personal data in accordance with our Privacy Policy, including:</p>
              <ul className={styles.bulletList}>
                <li>Contact information</li>
                <li>Professional experience and qualifications</li>
                <li>Job preferences and search history</li>
                <li>Application history and interactions</li>
              </ul>

              <h3>8.2 Data Usage</h3>
              <p>We use your data to:</p>
              <ul className={styles.bulletList}>
                <li>Provide and improve our Services</li>
                <li>Match candidates with job opportunities</li>
                <li>Communicate important service updates</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h3>8.3 Data Sharing</h3>
              <ul className={styles.bulletList}>
                <li>Your profile information may be shared with employers when you apply for positions</li>
                <li>We do not sell your personal data to third parties</li>
                <li>We may share aggregated, anonymized data for analytical purposes</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="hiring" className={styles.section}>
              <h2>9. Job Applications and Hiring Process</h2>
              
              <h3>9.1 Application Process</h3>
              <ul className={styles.bulletList}>
                <li>QuickHire facilitates connections but is not a party to employment agreements</li>
                <li>Employers are solely responsible for their hiring decisions and processes</li>
                <li>We do not guarantee job placement or interview opportunities</li>
              </ul>

              <h3>9.2 Background Checks</h3>
              <ul className={styles.bulletList}>
                <li>Employers may conduct background checks in accordance with applicable laws</li>
                <li>QuickHire is not responsible for background checks conducted by employers</li>
              </ul>

              <h3>9.3 Employment Terms</h3>
              <ul className={styles.bulletList}>
                <li>Employment terms, conditions, and compensation are negotiated directly between employers and candidates</li>
                <li>QuickHire is not involved in employment contract negotiations</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="prohibited" className={styles.section}>
              <h2>10. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul className={styles.bulletList}>
                <li>Use the Platform for any illegal purpose</li>
                <li>Create multiple accounts for deceptive purposes</li>
                <li>Scrape, crawl, or use automated means to access the Platform</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>Attempt to gain unauthorized access to other users' accounts</li>
                <li>Use the Platform to transmit spam or unsolicited communications</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="termination" className={styles.section}>
              <h2>11. Termination</h2>
              
              <h3>11.1 By User</h3>
              <p>You may deactivate your account at any time through your account settings.</p>

              <h3>11.2 By QuickHire</h3>
              <p>We may suspend or terminate your account if:</p>
              <ul className={styles.bulletList}>
                <li>You violate these Terms</li>
                <li>We suspect fraudulent or illegal activity</li>
                <li>Required by law or legal process</li>
                <li>We discontinue the Service</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="liability" className={styles.section}>
              <h2>12. Disclaimers and Limitations of Liability</h2>
              
              <h3>12.1 Service "As Is"</h3>
              <p>The Platform is provided "as is" without warranties of any kind. We do not guarantee:</p>
              <ul className={styles.bulletList}>
                <li>Continuous, uninterrupted, or secure access to the Platform</li>
                <li>Accuracy or reliability of any content</li>
                <li>That employers will respond to applications</li>
                <li>That job seekers will be qualified for positions</li>
              </ul>

              <h3>12.2 Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, QuickHire shall not be liable for:</p>
              <ul className={styles.bulletList}>
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Employment decisions made by employers or candidates</li>
                <li>Actions or omissions of users on the Platform</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section id="indemnification" className={styles.section}>
              <h2>13. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless QuickHire, its affiliates, and their respective officers, 
                directors, employees, and agents from any claims, damages, losses, or expenses arising from:
              </p>
              <ul className={styles.bulletList}>
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your interactions with other users</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section id="changes" className={styles.section}>
              <h2>14. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. We will notify you of material changes through 
                the Platform or via email. Continued use of the Platform after changes constitutes 
                acceptance of the modified Terms.
              </p>
            </section>

            {/* Section 15 */}
            <section id="law" className={styles.section}>
              <h2>15. Governing Law and Dispute Resolution</h2>
              
              <h3>15.1 Governing Law</h3>
              <p>
                These Terms shall be governed by the laws of [Jurisdiction], without regard to its 
                conflict of law principles.
              </p>

              <h3>15.2 Dispute Resolution</h3>
              <p>
                Any disputes shall be resolved through binding arbitration in accordance with the 
                rules of [Arbitration Association]. The arbitration shall take place in [City, State].
              </p>
            </section>

            {/* Section 16 */}
            <section id="international" className={styles.section}>
              <h2>16. International Use</h2>
              <p>
                The Platform may be accessed from countries around the world. You are responsible for 
                compliance with local laws regarding online conduct and acceptable content.
              </p>
            </section>

            {/* Section 17 */}
            <section id="severability" className={styles.section}>
              <h2>17. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining 
                provisions shall remain in full force and effect.
              </p>
            </section>

            {/* Section 18 */}
            <section id="agreement" className={styles.section}>
              <h2>18. Entire Agreement</h2>
              <p>
                These Terms constitute the entire agreement between you and QuickHire regarding the 
                use of the Platform and supersede any prior agreements.
              </p>
            </section>

            {/* Section 19 */}
            <section id="contact" className={styles.section}>
              <h2>19. Contact Information</h2>
              <p>For questions about these Terms, please contact us at:</p>
              <div className={styles.contactInfo}>
                <p><strong>QuickHire Support</strong></p>
                <p>Email: legal@quickhire.com</p>
                <p>Address: [Company Address]</p>
                <p>Phone: [Company Phone Number]</p>
              </div>
            </section>

            {/* Section 20 */}
            <section id="additional" className={styles.section}>
              <h2>20. Additional Provisions for Specific Services</h2>
              
              <h3>20.1 CV and Profile Services</h3>
              <ul className={styles.bulletList}>
                <li>You retain ownership of your CV and profile content</li>
                <li>You grant QuickHire license to display your profile to employers</li>
                <li>You may control visibility settings for your profile</li>
                <li>We are not responsible for how employers use your profile information</li>
              </ul>

              <h3>20.2 Job Posting Services</h3>
              <ul className={styles.bulletList}>
                <li>Employers are responsible for the accuracy of job postings</li>
                <li>Job postings must comply with equal opportunity employment laws</li>
                <li>We reserve the right to remove job postings that violate our policies</li>
                <li>Employers must process applications in a timely manner</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;