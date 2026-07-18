const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for product images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'loomistry-studio/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
  },
});

// Multer storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'loomistry-studio/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'webm'],
  },
});

const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

/**
 * Delete an asset from Cloudinary by public_id
 */
const deleteAsset = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Extract public_id from a Cloudinary URL
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  // Skip version (v1234...) and get the rest without extension
  const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');
  return pathAfterUpload.replace(/\.[^/.]+$/, '');
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
  deleteAsset,
  getPublicIdFromUrl,
};
