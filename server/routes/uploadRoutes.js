import express from 'express';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Helper upload handler
const handleCloudinaryUpload = async (req, res) => {
  try {
    const { file, folder, resourceType } = req.body;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadOptions = {
      folder: folder || 'tenant_management_system',
      resource_type: resourceType || 'auto',
      overwrite: true,
      invalidate: true
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    console.log(`✅ Uploaded to Cloudinary (${folder}): ${result.secure_url}`);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

// Route Handlers
router.post('/', handleCloudinaryUpload);
router.post('/upload', handleCloudinaryUpload);

export default router;
