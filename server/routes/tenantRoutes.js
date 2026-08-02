import express from 'express';
import { Tenant } from '../models/Tenant.js';

const router = express.Router();

// GET /api/tenants - Fetch all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tenants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tenants - Add new tenant
router.post('/', async (req, res) => {
  try {
    const newTenant = new Tenant(req.body);
    const savedTenant = await newTenant.save();
    res.status(201).json({ success: true, data: savedTenant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/tenants/:id - Update tenant
router.put('/:id', async (req, res) => {
  try {
    const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    res.json({ success: true, data: updatedTenant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/tenants/:id - Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tenant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
