import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';
import tenantRoutes from './routes/tenantRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure internal uploads folder exists & serve statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Connect MongoDB Atlas
connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Tenant Management Backend API with Internal Storage & Cloudinary',
    database: 'MongoDB Atlas (Cluster0)',
    dbName: 'tenant_management_db',
    cloudinary: 'dysl5mfsh',
    timestamp: new Date().toISOString()
  });
});

// Seed API Trigger Route
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully with demo tenants and payments!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Direct File Download Route
app.get('/api/download', (req, res) => {
  try {
    const fileRelPath = req.query.file;
    const downloadName = req.query.filename || 'document.pdf';

    if (!fileRelPath) {
      return res.status(400).send('File parameter required');
    }

    const safePath = path.normalize(fileRelPath).replace(/^(\.\.[\/\\])+/, '');
    const absolutePath = path.join(__dirname, safePath.startsWith('/uploads') ? safePath : safePath.startsWith('uploads') ? `/${safePath}` : `/uploads/${safePath}`);

    if (fs.existsSync(absolutePath)) {
      return res.download(absolutePath, downloadName);
    } else {
      return res.status(404).send('File not found on server disk');
    }
  } catch (err) {
    return res.status(500).send('Download error: ' + err.message);
  }
});

// Auth Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email.includes('admin') && password) {
    return res.json({
      success: true,
      user: {
        id: 'admin-01',
        name: 'Yashodhan Gurav (Owner)',
        email,
        role: 'Property Admin'
      },
      token: 'jwt_mock_token_estatepulse_2026'
    });
  }
  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

app.listen(PORT, () => {
  console.log(`🚀 Express REST API server running on http://localhost:${PORT}`);
  console.log(`📊 Connected to MongoDB Atlas Database: tenant_management_db`);
  console.log(`📁 Internal Uploads Directory active at: ${uploadsDir}`);
});

