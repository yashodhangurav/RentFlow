import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper upload handler: Stores file internally in server/uploads/ and optionally syncs to Cloudinary
const handleUpload = async (req, res) => {
  try {
    const { file, folder, filename, resourceType } = req.body;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadSubDir = folder || 'tenant_documents';
    const targetDir = path.join(__dirname, '..', 'uploads', uploadSubDir);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let ext = '.pdf';
    let base64Data = file;
    
    if (typeof file === 'string' && file.startsWith('data:')) {
      const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        base64Data = matches[2];
        if (mimeType.includes('png')) ext = '.png';
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
        else if (mimeType.includes('pdf')) ext = '.pdf';
      }
    }

    const rawName = (filename || 'document').replace(/[^a-zA-Z0-9_-]/g, '_');
    const timeStamp = Date.now();
    const finalFileName = `${timeStamp}_${rawName}${rawName.endsWith(ext) ? '' : ext}`;
    const filePath = path.join(targetDir, finalFileName);

    // Save binary buffer directly to server disk
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uploadSubDir}/${finalFileName}`;
    const fullUrl = `http://localhost:5001${relativeUrl}`;

    console.log(`✅ File saved internally to server disk: ${filePath}`);

    // Asynchronous Cloudinary sync in background (non-blocking)
    if (typeof file === 'string' && file.length < 10000000) {
      cloudinary.uploader.upload(file, {
        folder: uploadSubDir,
        resource_type: resourceType || 'auto',
        overwrite: true
      }).then(res => {
        console.log(`☁️ Cloudinary background sync finished: ${res.secure_url}`);
      }).catch(err => {
        console.log('ℹ️ Cloudinary sync skipped/offline; internal disk copy active.');
      });
    }

    return res.status(200).json({
      success: true,
      url: fullUrl,
      localUrl: fullUrl,
      relativeUrl: relativeUrl,
      secure_url: fullUrl,
      filename: finalFileName
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

// Route Handlers
router.post('/', handleUpload);
router.post('/upload', handleUpload);
router.post('/local', handleUpload);

export default router;

