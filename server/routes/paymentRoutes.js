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

// GET /api/payments/analytics/revenue-trends - Aggregated historical collection vs expected gross target
router.get('/analytics/revenue-trends', async (req, res) => {
  try {
    const tenants = await Tenant.find({ status: { $ne: 'Archived' } });
    const targetGrossRevenue = tenants.reduce((acc, t) => acc + (Number(t.rentAmount) || 0), 0) || 71000;
    const totalTenantsCount = tenants.length || 5;

    // Get all payments from MongoDB Atlas
    const payments = await RentPayment.find();

    // Generate last 6 calendar months
    const baseDate = new Date();
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const fullMonth = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const shortMonth = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();

      // Find matching payments
      const monthPayments = payments.filter(p => {
        const pMonth = (p.month || '').trim().toLowerCase();
        const matchesMonthStr = pMonth === fullMonth.toLowerCase() || pMonth.startsWith(shortMonth.toLowerCase());
        const matchesDate = p.paymentDate && 
          new Date(p.paymentDate).getMonth() === d.getMonth() && 
          new Date(p.paymentDate).getFullYear() === year;
        return matchesMonthStr || matchesDate;
      });

      const collected = monthPayments
        .filter(p => p.status === 'paid' || p.status === 'Paid')
        .reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);

      const pending = monthPayments
        .filter(p => p.status === 'pending' || p.status === 'Pending')
        .reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);

      const isCurrentMonth = i === 0;
      const collectionRate = targetGrossRevenue > 0 ? Math.round((collected / targetGrossRevenue) * 100) : 0;

      monthlyTrends.push({
        month: shortMonth,
        fullMonth,
        year,
        collected,
        pending,
        target: targetGrossRevenue,
        collectionRate,
        isCurrentMonth,
        paidCount: monthPayments.filter(p => p.status === 'paid' || p.status === 'Paid').length,
        occupancy: 95
      });
    }

    res.json({
      success: true,
      data: {
        monthlyTrends,
        targetGrossRevenue,
        totalTenantsCount
      }
    });
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
      month: month || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
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
