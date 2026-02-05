import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MultiStepSignup.module.css';
import Alert from '../../components/Alert/Alert'; // ✅ Import Alert component

const MultiStepSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountType, setAccountType] = useState(location.state?.accountType || 'user');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', message: '' });

  // User Data - Pre-filled from LoginSignup
  const [userData, setUserData] = useState({
    FirstName: location.state?.userData?.FirstName || '',
    LastName: location.state?.userData?.LastName || '',
    Email: location.state?.userData?.Email || '',
    Password: location.state?.userData?.Password || '',
    confirmPassword: location.state?.userData?.confirmPassword || '',
    Number: location.state?.userData?.Number || '',
    Location: '',
    Photo: null,
    PhotoPreview: null,
    Description: '',
    skills: [],
    experiences: []
  });

  // Company Data - Pre-filled from LoginSignup
  const [companyData, setCompanyData] = useState({
    Name: location.state?.companyData?.Name || '',
    Email: location.state?.companyData?.Email || '',
    Password: location.state?.companyData?.Password || '',
    confirmPassword: location.state?.companyData?.confirmPassword || '',
    Website: location.state?.companyData?.Website || '',
    Industry: location.state?.companyData?.Industry || '',
    Employees_Number: location.state?.companyData?.Employees_Number || '',
    MainLocation: '',
    Foundation_Date: '',
    Logo: null,
    LogoPreview: null,
    Description: '',
    managers: []
  });

  const totalSteps = accountType === 'user' ? 2 : 4;

  // ✅ Helper function to show alerts
  const showNotification = (message, type = 'success') => {
    setAlertConfig({ type, message });
    setShowAlert(true);
  };

  const handleInputChange = (field, value) => {
    if (accountType === 'user') {
      setUserData({ ...userData, [field]: value });
    } else {
      setCompanyData({ ...companyData, [field]: value });
    }
    setErrors({ ...errors, [field]: '' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors({ image: 'Image size must be less than 5MB' });
        showNotification('Image size must be less than 5MB', 'error'); // ✅ Alert
        return;
      }
      
      const preview = URL.createObjectURL(file);
      if (accountType === 'user') {
        setUserData({ ...userData, Photo: file, PhotoPreview: preview });
        showNotification('Profile photo uploaded successfully!', 'success'); // ✅ Alert
      } else {
        setCompanyData({ ...companyData, Logo: file, LogoPreview: preview });
        showNotification('Company logo uploaded successfully!', 'success'); // ✅ Alert
      }
      setErrors({});
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const data = accountType === 'user' ? userData : companyData;

    if (currentStep === 1) {
      // Location and Description validation for users
      if (accountType === 'user') {
        if (!data.Location) {
          newErrors.Location = 'Location is required';
        }
        if (!data.Description || data.Description.trim().length < 20) {
          newErrors.Description = 'Description must be at least 20 characters';
        }
      }
      // Location and Language validation for companies
      if (accountType === 'company') {
        if (!data.MainLocation) {
          newErrors.MainLocation = 'Main location is required';
        }
        if (!data.Foundation_Date) {
          newErrors.Foundation_Date = 'Foundation date is required';
        } else {
          // ✅ Validate that Foundation_Date is not in the future
          const selectedDate = new Date(data.Foundation_Date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate > today) {
            newErrors.Foundation_Date = 'Foundation date cannot be in the future';
          }
        }
      }
    }

    if (currentStep === 2) {
      // Photo/Logo Validation for both users and companies
      if (accountType === 'user' && !data.Photo) {
        newErrors.image = 'Profile photo is required';
      }
      if (accountType === 'company' && !data.Logo) {
        newErrors.image = 'Company logo is required';
      }
    }

    if (currentStep === 3) {
      // Team Members Validation for Company only
      if (accountType === 'company' && data.managers.length < 2) {
        newErrors.managers = 'At least 2 team members are required';
      }
    }

    if (currentStep === 4) {
      // Description Validation for Company only
      if (accountType === 'company' && (!data.Description || data.Description.trim().length < 20)) {
        newErrors.Description = 'Description must be at least 20 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      showNotification('Please fix all validation errors before proceeding.', 'warning'); // ✅ Alert
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/SignIn');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(currentStep + 1);
    showNotification('Step skipped successfully.', 'info'); // ✅ Alert
  };

  const handleSubmit = async () => {
    // Skip validation for optional step
    if (currentStep !== 4 && !validateStep()) {
      showNotification('Please fix all validation errors before submitting.', 'warning'); // ✅ Alert
      return;
    }

    setLoading(true);

    try {
      // ✅ Upload manager photos to Cloudinary first (for company signup)
      let managersWithPhotos = [];
      if (accountType === 'company' && companyData.managers.length > 0) {
        showNotification('Uploading manager photos...', 'info');
        
        for (const manager of companyData.managers) {
          if (manager.Photo) {
            // Upload each manager photo
            const managerFormData = new FormData();
            managerFormData.append('Manager_Photo', manager.Photo);
            
            const uploadResponse = await fetch('http://localhost:3000/api/upload', {
              method: 'POST',
              body: managerFormData
            });
            
            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json();
              managersWithPhotos.push({
                FirstName: manager.FirstName,
                LastName: manager.LastName,
                Role: manager.Role,
                Email: manager.Email,
                LinkedInLink: manager.LinkedInLink,
                Manager_Photo: uploadResult.data?.url || uploadResult.secure_url || ''
              });
            } else {
              // If upload fails, still add manager but without photo
              managersWithPhotos.push({
                FirstName: manager.FirstName,
                LastName: manager.LastName,
                Role: manager.Role,
                Email: manager.Email,
                LinkedInLink: manager.LinkedInLink,
                Manager_Photo: null
              });
            }
          } else {
            managersWithPhotos.push({
              FirstName: manager.FirstName,
              LastName: manager.LastName,
              Role: manager.Role,
              Email: manager.Email,
              LinkedInLink: manager.LinkedInLink,
              Manager_Photo: null
            });
          }
        }
      }

      const formData = new FormData();
      
      if (accountType === 'user') {
        formData.append('accountType', 'user');
        formData.append('FirstName', userData.FirstName);
        formData.append('LastName', userData.LastName);
        formData.append('Email', userData.Email);
        formData.append('Password', userData.Password);
        formData.append('Number', userData.Number);
        formData.append('Location', userData.Location);
        formData.append('Description', userData.Description);
        formData.append('Status', 'JobSeeker');
        
        if (userData.Photo) {
          formData.append('image', userData.Photo);
        }
      } else {
        formData.append('accountType', 'company');
        formData.append('Name', companyData.Name);
        formData.append('Email', companyData.Email);
        formData.append('Password', companyData.Password);
        formData.append('Website', companyData.Website);
        formData.append('Industry', companyData.Industry);
        formData.append('Employees_Number', companyData.Employees_Number);
        formData.append('MainLocation', companyData.MainLocation);
        formData.append('Foundation_Date', companyData.Foundation_Date);
        formData.append('Description', companyData.Description);
        
        if (companyData.Logo) {
          formData.append('image', companyData.Logo);
        }
        
        // ✅ Send managers with photo URLs instead of File objects
        if (managersWithPhotos.length > 0) {
          formData.append('managers', JSON.stringify(managersWithPhotos));
        }
      }

      // Updated endpoint to match your backend
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log('Signup successful! Storing data...');
        
        // Store authentication data
        const token = result.data.token;
        const resultAccountType = result.accountType || accountType;
        
        localStorage.setItem('token', token);
        localStorage.setItem('accountType', resultAccountType);
        
        if (resultAccountType === 'user') {
          const user = result.data.user;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('Image', user.Photo || '');
          
          showNotification('Account created successfully! Welcome!', 'success'); // ✅ Alert
          
          // Use setTimeout to ensure localStorage is written
          setTimeout(() => {
            window.location.href = '/User/Home';
          }, 100);
          
        } else {
          const company = result.data.company;
          localStorage.setItem('user', JSON.stringify(company));
          localStorage.setItem('Image', company.Logo || '');
          
          showNotification('Company account created successfully! Welcome!', 'success'); // ✅ Alert
          
          // Use setTimeout to ensure localStorage is written
          setTimeout(() => {
            window.location.href = '/Company/Home';
          }, 100);
        }
      } else {
        console.error('Signup failed:', result.error);
        setErrors({ general: result.error || 'Registration failed' });
        showNotification(`Registration failed: ${result.error || 'Unknown error'}`, 'error'); // ✅ Alert
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An error occurred. Please try again. Error: ' + error.message });
      showNotification('An error occurred during registration. Please try again.', 'error'); // ✅ Alert
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return <Step1Location
        accountType={accountType}
        data={accountType === 'user' ? userData : companyData}
        onChange={handleInputChange}
        errors={errors}
      />;
    }
    if (currentStep === 2) {
      // Photo/Logo upload for both users and companies
      return <Step2ImageUpload
        accountType={accountType}
        data={accountType === 'user' ? userData : companyData}
        onFileUpload={handleFileUpload}
        errors={errors}
        showNotification={showNotification} // ✅ Pass alert function
      />;
    }
    if (currentStep === 3) {
      // Team Members for companies only
      if (accountType === 'company') {
        return <Step3TeamMembers
          managers={companyData.managers}
          setManagers={(managers) => setCompanyData({ ...companyData, managers })}
          errors={errors}
          showNotification={showNotification} // ✅ Pass alert function
        />;
      }
    }
    if (currentStep === 4) {
      // Description for Company only
      if (accountType === 'company') {
        return <Step4Description
          data={companyData}
          onChange={handleInputChange}
          errors={errors}
        />;
      }
    }
  };

  const isOptionalStep = () => {
    return false; // No optional steps
  };

  return (
    <>
      {/* ✅ Alert Component */}
      {showAlert && (
        <Alert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
          duration={3000}
          autoClose={true}
        />
      )}

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className={styles.stepIndicator}>
            Step {currentStep} of {totalSteps}
          </p>

          {errors.general && (
            <div className={styles.errorAlert}>{errors.general}</div>
          )}

          <div className={styles.stepContent}>
            {renderStepContent()}
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.backBtn}
              onClick={handleBack}
              disabled={loading}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>

            <div className={styles.rightActions}>
              {isOptionalStep() && (
                <button 
                  className={styles.skipBtn}
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Skip
                </button>
              )}

              {currentStep < totalSteps ? (
                <button 
                  className={styles.nextBtn}
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button 
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Registration <i className="fas fa-check"></i>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Step Components
const Step1Location = ({ accountType, data, onChange, errors }) => {
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Dutch',
    'Russian',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Turkish',
    'Polish',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Greek',
    'Hebrew',
    'Czech',
    'Romanian',
    'Hungarian',
    'Thai',
    'Vietnamese',
    'Indonesian',
    'Malay',
    'Filipino',
    'Swahili'
  ];

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>
        {accountType === 'user' ? 'Tell Us About Yourself' : 'Where Is Your Company Located?'}
      </h2>

      <div className={styles.formGroup}>
        <label>{accountType === 'user' ? 'Your Location' : 'Main Office Location'} *</label>
        <input
          type="text"
          value={accountType === 'user' ? data.Location : data.MainLocation}
          onChange={(e) => onChange(accountType === 'user' ? 'Location' : 'MainLocation', e.target.value)}
          className={errors.Location || errors.MainLocation ? styles.hasError : ''}
          placeholder="e.g., San Francisco, CA"
        />
        {(errors.Location || errors.MainLocation) && (
          <span className={styles.errorText}>{errors.Location || errors.MainLocation}</span>
        )}
      </div>

      {accountType === 'user' ? (
        // Description for users
        <div className={styles.formGroup}>
          <label>Description *</label>
          <textarea
            value={data.Description}
            onChange={(e) => onChange('Description', e.target.value)}
            className={errors.Description ? styles.hasError : ''}
            rows={8}
            placeholder="Write a brief description about yourself... (minimum 20 characters)"
          />
          {errors.Description && <span className={styles.errorText}>{errors.Description}</span>}
          <span className={styles.charCount}>{data.Description.length} / 500 characters</span>
        </div>
        ) : (
          // Foundation Date for companies
          <div className={styles.formGroup}>
            <label>Foundation Date *</label>
            <input
              type="date"
              value={data.Foundation_Date}
              onChange={(e) => onChange('Foundation_Date', e.target.value)}
              className={errors.Foundation_Date ? styles.hasError : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.Foundation_Date && (
              <span className={styles.errorText}>{errors.Foundation_Date}</span>
            )}
          </div>
        )}
    </div>
  );
};

const Step2ImageUpload = ({ accountType, data, onFileUpload, errors, showNotification }) => (
  <div className={styles.step}>
    <h2 className={styles.stepTitle}>
      {accountType === 'user' ? 'Upload Your Photo' : 'Upload Company Logo'}
    </h2>

    <div className={styles.uploadSection}>
      <div className={styles.uploadBox}>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={onFileUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="imageUpload" className={styles.uploadLabel}>
          {(data.PhotoPreview || data.LogoPreview) ? (
            <img 
              src={data.PhotoPreview || data.LogoPreview} 
              alt="Preview" 
              className={accountType === 'user' ? styles.previewImageCircular : styles.previewImageSquare}
            />
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}></i>
              <p>Click to upload or drag and drop</p>
              <p className={styles.uploadHint}>PNG, JPG up to 5MB</p>
            </>
          )}
        </label>
      </div>
      {errors.image && <span className={styles.errorText}>{errors.image}</span>}
    </div>
  </div>
);

const Step3Description = ({ data, onChange, errors }) => (
  <div className={styles.step}>
    <h2 className={styles.stepTitle}>Tell Us About Yourself</h2>

    <div className={styles.formGroup}>
      <label>Description *</label>
      <textarea
        value={data.Description}
        onChange={(e) => onChange('Description', e.target.value)}
        className={errors.Description ? styles.hasError : ''}
        rows={8}
        placeholder="Write a brief description about yourself or your company... (minimum 20 characters)"
      />
      {errors.Description && <span className={styles.errorText}>{errors.Description}</span>}
      <span className={styles.charCount}>{data.Description.length} / 500 characters</span>
    </div>
  </div>
);

const Step4Description = ({ data, onChange, errors }) => (
  <div className={styles.step}>
    <h2 className={styles.stepTitle}>Tell Us About Your Company</h2>

    <div className={styles.formGroup}>
      <label>Company Description *</label>
      <textarea
        value={data.Description}
        onChange={(e) => onChange('Description', e.target.value)}
        className={errors.Description ? styles.hasError : ''}
        rows={8}
        placeholder="Write a brief description about your company, its mission, and what makes it unique... (minimum 20 characters)"
      />
      {errors.Description && <span className={styles.errorText}>{errors.Description}</span>}
      <span className={styles.charCount}>{data.Description.length} / 500 characters</span>
    </div>
  </div>
);

const Step4SkillsAndExperience = ({ skills, setSkills, experiences, setExperiences, showNotification }) => {
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [skillFormData, setSkillFormData] = useState({ title: '', confidence: 3 });
  const [expFormData, setExpFormData] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    certificate: null,
    certificateName: '',
    certificatePreview: null
  });

  const addSkill = () => {
    if (skillFormData.title) {
      setSkills([...skills, { ...skillFormData, id: Date.now() }]);
      setSkillFormData({ title: '', confidence: 3 });
      setShowSkillForm(false);
      if (showNotification) showNotification('Skill added successfully!', 'success'); // ✅ Alert
    } else {
      if (showNotification) showNotification('Please enter a skill name.', 'warning'); // ✅ Alert
    }
  };

  const removeSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
    if (showNotification) showNotification('Skill removed.', 'info'); // ✅ Alert
  };

  const addExperience = () => {
    if (expFormData.title && expFormData.company && expFormData.startDate) {
      setExperiences([...experiences, { ...expFormData, id: Date.now() }]);
      setExpFormData({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        certificate: null,
        certificateName: '',
        certificatePreview: null
      });
      setShowExpForm(false);
      if (showNotification) showNotification('Experience added successfully!', 'success'); // ✅ Alert
    } else {
      if (showNotification) showNotification('Please fill all required fields for experience.', 'warning'); // ✅ Alert
    }
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter(e => e.id !== id));
    if (showNotification) showNotification('Experience removed.', 'info'); // ✅ Alert
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) { // 10MB
        if (showNotification) showNotification('File size must be less than 10MB', 'error'); // ✅ Alert
        return;
      }
      setExpFormData({ 
        ...expFormData, 
        certificate: file,
        certificateName: file.name,
        certificatePreview: URL.createObjectURL(file)
      });
      if (showNotification) showNotification('Certificate uploaded successfully!', 'success'); // ✅ Alert
    }
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Skills & Experience (Optional)</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Add your skills and work experience to make your profile stand out
      </p>

      {/* Skills Section */}
      <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>Skills</h3>
      {skills.length === 0 ? (
        <p className={styles.emptyMessage}>No skills added yet</p>
      ) : (
        <div className={styles.skillsList}>
          {skills.map((skill) => (
            <div key={skill.id} className={styles.skillCard}>
              <div>
                <h4>{skill.title}</h4>
                <div className={styles.confidence}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < skill.confidence ? styles.starFilled : styles.starEmpty}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => removeSkill(skill.id)} className={styles.removeBtn}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {!showSkillForm ? (
        <button className={styles.addBtn} onClick={() => setShowSkillForm(true)}>
          <i className="fas fa-plus"></i> Add Skill
        </button>
      ) : (
        <div className={styles.inlineForm}>
          <input
            type="text"
            placeholder="Skill name (e.g., JavaScript)"
            value={skillFormData.title}
            onChange={(e) => setSkillFormData({ ...skillFormData, title: e.target.value })}
          />
          <div className={styles.sliderGroup}>
            <label>Confidence: {skillFormData.confidence}/5</label>
            <input
              type="range"
              min="1"
              max="5"
              value={skillFormData.confidence}
              onChange={(e) => setSkillFormData({ ...skillFormData, confidence: parseInt(e.target.value) })}
            />
          </div>
          <div className={styles.formActions}>
            <button onClick={() => setShowSkillForm(false)} className={styles.cancelBtn}>Cancel</button>
            <button onClick={addSkill} className={styles.saveBtn}>Add</button>
          </div>
        </div>
      )}

      {/* Experiences Section */}
      <h3 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>Experience</h3>
      {experiences.length === 0 ? (
        <p className={styles.emptyMessage}>No experiences added yet</p>
      ) : (
        <div className={styles.experiencesList}>
          {experiences.map((exp) => (
            <div key={exp.id} className={styles.experienceCard}>
              <div>
                <h4>{exp.title}</h4>
                <p className={styles.company}>{exp.company}</p>
                <p className={styles.date}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                {exp.certificateName && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    <i className="fas fa-certificate"></i> Certificate attached: {exp.certificateName}
                  </p>
                )}
              </div>
              <button onClick={() => removeExperience(exp.id)} className={styles.removeBtn}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {!showExpForm ? (
        <button className={styles.addBtn} onClick={() => setShowExpForm(true)}>
          <i className="fas fa-plus"></i> Add Experience
        </button>
      ) : (
        <div className={styles.inlineForm}>
          <input
            type="text"
            placeholder="Job Title"
            value={expFormData.title}
            onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Company"
            value={expFormData.company}
            onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
          />
          <div className={styles.formRow}>
            <input
              type="month"
              placeholder="Start Date"
              value={expFormData.startDate}
              onChange={(e) => setExpFormData({ ...expFormData, startDate: e.target.value })}
            />
            <input
              type="month"
              placeholder="End Date"
              value={expFormData.endDate}
              onChange={(e) => setExpFormData({ ...expFormData, endDate: e.target.value })}
              disabled={expFormData.current}
            />
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={expFormData.current}
              onChange={(e) => setExpFormData({ ...expFormData, current: e.target.checked, endDate: '' })}
            />
            I currently work here
          </label>
          
          {/* Certificate Upload */}
          <div style={{ marginTop: '15px', marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Certificate (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCertificateUpload}
              style={{ width: '100%', padding: '8px' }}
            />
            {expFormData.certificateName && (
              <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                <i className="fas fa-file"></i> {expFormData.certificateName}
              </p>
            )}
            <p style={{ marginTop: '5px', fontSize: '12px', color: '#999' }}>
              Max file size: 10MB. Formats: PDF, JPG, PNG
            </p>
          </div>

          <div className={styles.formActions}>
            <button onClick={() => setShowExpForm(false)} className={styles.cancelBtn}>Cancel</button>
            <button onClick={addExperience} className={styles.saveBtn}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Step3TeamMembers = ({ managers, setManagers, errors, showNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Role: '',
    Email: '',
    Photo: null,
    PhotoPreview: null
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        if (showNotification) showNotification('Image size must be less than 5MB', 'error');
        return;
      }
      
      const preview = URL.createObjectURL(file);
      setFormData({ ...formData, Photo: file, PhotoPreview: preview });
    }
  };

  const addManager = () => {
    if (formData.FirstName && formData.LastName && formData.Role && formData.Photo) {
      setManagers([...managers, { ...formData, id: Date.now() }]);
      setFormData({ FirstName: '', LastName: '', Role: '', Email: '', Photo: null, PhotoPreview: null });
      setShowForm(false);
      if (showNotification) showNotification('Team member added successfully!', 'success'); // ✅ Alert
    } else {
      if (showNotification) showNotification('Please fill all required fields including manager photo.', 'warning'); // ✅ Alert
    }
  };

  const removeManager = (id) => {
    setManagers(managers.filter(m => m.id !== id));
    if (showNotification) showNotification('Team member removed.', 'info'); // ✅ Alert
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Add Your Team *</h2>
      <p className={styles.subtitle}>Please add at least 2 team members to continue</p>

      {errors.managers && <span className={styles.errorText}>{errors.managers}</span>}

      {managers.length === 0 ? (
        <p className={styles.emptyMessage}>No team members added yet. Please add at least 2 members.</p>
      ) : (
        <div className={styles.managersList}>
          {managers.map((manager) => (
            <div key={manager.id} className={styles.managerCard}>
              {manager.PhotoPreview && (
                <img src={manager.PhotoPreview} alt={`${manager.FirstName} ${manager.LastName}`} className={styles.managerPhoto} />
              )}
              <div>
                <h4>{manager.FirstName} {manager.LastName}</h4>
                <p className={styles.role}>{manager.Role}</p>
                {manager.Email && <p className={styles.email}>{manager.Email}</p>}
              </div>
              <button onClick={() => removeManager(manager.id)} className={styles.removeBtn}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
      <p className={styles.countInfo}>Team members added: {managers.length} / 2 minimum</p>

      {!showForm ? (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Add Team Member
        </button>
      ) : (
        <div className={styles.inlineForm}>
          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="First Name"
              value={formData.FirstName}
              onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.LastName}
              onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Role (e.g., CEO, CTO)"
            value={formData.Role}
            onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
          />
          <div className={styles.photoUploadSection}>
            <label className={styles.photoLabel}>Manager Photo * (Required)</label>
            {formData.PhotoPreview && (
              <div className={styles.photoPreviewContainer}>
                <img src={formData.PhotoPreview} alt="Preview" className={styles.photoPreview} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className={styles.fileInput}
              id="managerPhoto"
            />
            <label htmlFor="managerPhoto" className={styles.uploadButton}>
              {formData.Photo ? '✓ Photo Selected' : 'Choose Photo'}
            </label>
          </div>
          <div className={styles.formActions}>
            <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
            <button onClick={addManager} className={styles.saveBtn}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepSignup;