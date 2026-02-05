// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Configure Cloudinary with your keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage (Where files go)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'quickhire-uploads', // The folder name in your Cloudinary Dashboard
    allowed_formats: ['jpg', 'png', 'jpeg','pdf'], // Limit file types
  },
});

// 3. Create the Multer instance
const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };