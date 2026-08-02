import express from 'express';
import { RentPayment } from '../models/RentPayment.js';
import { Tenant } from '../models/Tenant.js';

const router = express.Router();

// GET /api/payments - Fetch all rent payments
router.get('/', async (req, res) => {
  try {
    const payments = await RentPayment.find().populate('tenantId').sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments - Record new rent payment
router.post('/', async (req, res) => {
  try {
    const { tenantId, month, amountPaid, paymentDate, status, paymentMethod, reference } = req.body;
    
    // Find tenant details to populate name & roomNumber
    const tenant = await Tenant.findById(tenantId);
    
    const newPayment = new RentPayment({
      tenantId,
      tenantName: tenant ? tenant.name : req.body.tenantName || 'Resident',
      roomNumber: tenant ? tenant.roomNumber : req.body.roomNumber || 'Room',
      month: month || 'August 2026',
      amountPaid,
      paymentDate: paymentDate || Date.now(),
      status: status || 'paid',
      paymentMethod: paymentMethod || 'UPI',
      reference: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({ success: true, data: savedPayment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/payments/:id - Update payment status
router.put('/:id', async (req, res) => {
  try {
    const updated = await RentPayment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
