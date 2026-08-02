import cloudinary from './config/cloudinary.js';

async function testUpload() {
  try {
    console.log('Testing Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing'
    });

    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const result = await cloudinary.uploader.upload(sampleBase64, {
      folder: 'test_folder'
    });

    console.log('✅ Cloudinary Upload Success:', result.secure_url);
  } catch (error) {
    console.error('❌ Cloudinary Upload Failed:', error);
  }
}

testUpload();
