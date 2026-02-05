require('dotenv').config();

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'quickhire/images'; // Default folder

    // Determine folder based on field name
    if (file.fieldname === 'Photo') {
      folder = 'quickhire/profiles';
    } else if (file.fieldname === 'Logo') {
      folder = 'quickhire/company-logos';
    } else if (file.fieldname === 'Company_logo') {
      folder = 'quickhire/experience-logos';
    } else if (file.fieldname === 'Manager_Photo') {
      folder = 'quickhire/managers';
    } else if (file.fieldname === 'certificate') {
      folder = 'quickhire/certificates';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
      public_id: `${file.fieldname}-${Date.now()}`,
      transformation: file.mimetype !== 'application/pdf' ? [
        { width: 1000, height: 1000, crop: 'limit' }
      ] : undefined
    };
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const mimetype = file.mimetype;
  const extname = file.originalname.split('.').pop().toLowerCase();

  const isImage = mimetype.startsWith('image/') && allowedTypes.test(extname);
  const isPDF = mimetype === 'application/pdf' && extname === 'pdf';

  if (isImage || isPDF) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDF files are allowed'), false);
  }
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;