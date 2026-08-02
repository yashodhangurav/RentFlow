import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect MongoDB Atlas
connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Tenant Management Backend API with Cloudinary',
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
  console.log(`☁️ Cloudinary Storage Connected: dysl5mfsh (API Key: 799942128833791)`);
});
