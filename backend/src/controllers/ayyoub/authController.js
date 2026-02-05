require('dotenv').config()
const prisma = require("../../config/prisma.js") 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Sign In (Register) - Creates new user or company
// ✅ UPDATED VERSION - Creates managers during company signup
exports.signIn = async (req, res) => {
  try {
    console.log('=== SIGNUP REQUEST RECEIVED ===');
    console.log('Account Type:', req.body.accountType);
    console.log('Email:', req.body.Email);
    console.log('Has Image:', !!req.file);
    
    const { accountType, Email, Password, ...otherData } = req.body;

    // Validate required fields
    if (!accountType || !Email || !Password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Account type, email, and password are required'
      });
    }

    console.log('✓ Required fields present');

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log('✓ Password hashed');
    
    // Get image URL from cloudinary
    const imageUrl = req.file ? req.file.path : null;
    console.log('✓ Image URL:', imageUrl || 'No image');

    let account;
    let token;

    if (accountType === 'user') {
      console.log('📝 Creating user account...');
      
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: { Email }
      });

      if (existingUser) {
        console.log('❌ User already exists with email:', Email);
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      console.log('✓ Email is unique');

      // Create user with basic data only
      const userData = {
        Email,
        Password: hashedPassword,
        FirstName: otherData.FirstName,
        LastName: otherData.LastName,
        Number: otherData.Number,
        Location: otherData.Location,
        Description: otherData.Description || null,
        Status: otherData.Status || 'JobSeeker',
        Photo: imageUrl
      };

      console.log('Creating user with data:', {
        ...userData,
        Password: '[HIDDEN]'
      });

      account = await prisma.user.create({
        data: userData
      });

      console.log('✓ User created with ID:', account.User_id);

      // Generate JWT token
      token = jwt.sign(
        { 
          userId: account.User_id, 
          accountType: 'user', 
          email: account.Email,
          image: account.Photo 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      console.log('✅ User signup successful!');
      console.log('================================');

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            User_id: account.User_id,
            Email: account.Email,
            FirstName: account.FirstName,
            LastName: account.LastName,
            Photo: account.Photo,
            Status: account.Status,
            Location: account.Location
          },
          token,
          accountType: 'user',
          image: account.Photo
        },
        accountType: 'user'
      });

    } else if (accountType === 'company') {
      console.log('📝 Creating company account...');
      
      // Check if company already exists
      const existingCompany = await prisma.company.findFirst({
        where: { Email }
      });

      if (existingCompany) {
        console.log('❌ Company already exists with email:', Email);
        return res.status(400).json({
          success: false,
          error: 'Company with this email already exists'
        });
      }

      console.log('✓ Email is unique');

      // ✅ Validate Foundation_Date (cannot be in the future)
      // Support both camelCase and snake_case from frontend
      const foundationDateValue = otherData.FoundationDate || otherData.Foundation_Date;
      
      if (foundationDateValue) {
        const foundationDate = new Date(foundationDateValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (foundationDate > today) {
          console.log('❌ Foundation date cannot be in the future:', foundationDateValue);
          return res.status(400).json({
            success: false,
            error: 'Foundation date cannot be in the future'
          });
        }
      }

      // Create company with basic data only
      const companyData = {
        Email,
        Password: hashedPassword,
        Name: otherData.Name,
        Industry: otherData.Industry,
        Description: otherData.Description || null,
        MainLocation: otherData.MainLocation,
        Website: otherData.Website,
        Employees_Number: otherData.Employees_Number ? parseInt(otherData.Employees_Number) : null,
        FoundationDate: foundationDateValue ? new Date(foundationDateValue) : null, // ✅ Support both naming conventions
        Logo: imageUrl
      };

      console.log('Creating company with data:', {
        ...companyData,
        Password: '[HIDDEN]'
      });

      account = await prisma.company.create({
        data: companyData
      });

      console.log('✓ Company created with ID:', account.Company_id);

      // ✅ CREATE MANAGERS if provided
      if (otherData.managers) {
        try {
          const managersData = JSON.parse(otherData.managers);
          console.log('📋 Creating managers:', managersData.length);
          
          for (const manager of managersData) {
            await prisma.manager.create({
              data: {
                Company_id: account.Company_id,
                FirstName: manager.FirstName,
                LastName: manager.LastName,
                Role: manager.Role,
                Email: manager.Email || null,
                LinkedInLink: manager.LinkedInLink || null,
                Manager_Photo: manager.Manager_Photo || null // ✅ Use the uploaded photo URL
              }
            });
          }
          console.log('✓ All managers created successfully');
        } catch (managerError) {
          console.error('⚠️ Error creating managers:', managerError);
          // Don't fail signup if managers fail, just log it
        }
      }

      // Generate JWT token
      token = jwt.sign(
        { 
          companyId: account.Company_id, 
          accountType: 'company', 
          email: account.Email,
          image: account.Logo 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      console.log('✅ Company signup successful!');
      console.log('================================');

      return res.status(201).json({
        success: true,
        message: 'Company registered successfully',
        data: {
          company: {
            Company_id: account.Company_id,
            Email: account.Email,
            Name: account.Name,
            Logo: account.Logo,
            Website: account.Website,
            Industry: account.Industry,
            MainLocation: account.MainLocation
          },
          token,
          accountType: 'company',
          image: account.Logo
        },
        accountType: 'company'
      });

    } else {
      console.log('❌ Invalid account type:', accountType);
      return res.status(400).json({
        success: false,
        error: 'Invalid account type. Must be "user" or "company"'
      });
    }

  } catch (error) {
    console.error('========================================');
    console.error('❌ SIGNUP ERROR - DETAILED INFORMATION');
    console.error('========================================');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Stack Trace:', error.stack);
    console.error('----------------------------------------');
    console.error('Request Details:');
    console.error('- Account Type:', req.body.accountType);
    console.error('- Email:', req.body.Email);
    console.error('- Has File:', !!req.file);
    console.error('========================================');
    
    // Provide more helpful error messages
    let userMessage = 'Failed to register account';
    
    if (error.code === 'P2002') {
      userMessage = 'This email is already registered';
    } else if (error.code === 'P2003') {
      userMessage = 'Invalid data provided';
    } else if (error.message.includes('Cloudinary')) {
      userMessage = 'Image upload failed. Please check your image and try again.';
    }
    
    res.status(500).json({
      success: false,
      error: userMessage,
      details: error.message,
      errorCode: error.code,
      errorType: error.constructor.name
    });
  }
};

// signUp is same as signIn
exports.signUp = exports.signIn;

// Log In - Authenticates existing user or company
exports.logIn = async (req, res) => {
  try {
    const { accountType, Email, Password } = req.body;

    // Validate required fields
    if (!accountType || !Email || !Password) {
      return res.status(400).json({
        success: false,
        error: 'Account type, email, and password are required'
      });
    }

    let account;
    let token;

    if (accountType === 'user') {
      // Find user by email
      account = await prisma.user.findFirst({
        where: { Email }
      });

      if (!account) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(Password, account.Password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token
      token = jwt.sign(
        { 
          userId: account.User_id, 
          accountType: 'user', 
          email: account.Email,
          image: account.Photo 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            User_id: account.User_id,
            Email: account.Email,
            FirstName: account.FirstName,
            LastName: account.LastName,
            Photo: account.Photo,
            Status: account.Status
          },
          token,
          accountType: 'user',
          image: account.Photo
        },
        accountType: 'user'
      });

    } else if (accountType === 'company') {
      // Find company by email
      account = await prisma.company.findFirst({
        where: { Email }
      });

      if (!account) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check if password exists in database
      if (!account.Password) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(Password, account.Password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token
      token = jwt.sign(
        { 
          companyId: account.Company_id, 
          accountType: 'company', 
          email: account.Email,
          image: account.Logo 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          company: {
            Company_id: account.Company_id,
            Email: account.Email,
            Name: account.Name,    
            Logo: account.Logo
          },
          token,
          accountType: 'company',
          image: account.Logo
        },
        accountType: 'company'
      });

    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid account type. Must be "user" or "company"'
      });
    }

  } catch (error) {
    console.error('Log In Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Log Out - Invalidates token (client-side token removal primarily)
exports.logOut = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Log Out Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};