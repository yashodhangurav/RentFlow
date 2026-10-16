import express from 'express';
import mongoose from 'mongoose';
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
        .filter(p => p.status === 'pending' || p.status === 'Pending' || p.status === 'verification_pending')
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

// POST /api/payments - Record new rent payment or submit payment proof
router.post('/', async (req, res) => {
  try {
    const { 
      tenantId, 
      month, 
      amountPaid, 
      paymentDate, 
      status, 
      paymentMethod, 
      reference,
      proofFile,
      electricityAmount,
      electricityRef,
      electricityProofFile,
      propertyName,
      roomNumber,
      tenantName
    } = req.body;
    
    // Find tenant details to populate name & roomNumber if not provided
    let tenant = null;
    if (tenantId && mongoose.Types.ObjectId.isValid(tenantId)) {
      tenant = await Tenant.findById(tenantId);
    }
    
    const validTenantId = tenant ? tenant._id : (mongoose.Types.ObjectId.isValid(tenantId) ? tenantId : new mongoose.Types.ObjectId());
    const finalMonth = month || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const finalStatus = status || 'pending';

    // Check if an existing payment record exists for this tenant & month
    let existingPayment = null;
    if (tenantId) {
      existingPayment = await RentPayment.findOne({
        $or: [
          { tenantId: validTenantId, month: finalMonth },
          ...(tenant ? [{ tenantName: tenant.name, month: finalMonth }] : [])
        ]
      });
    }

    if (existingPayment) {
      if (amountPaid !== undefined) existingPayment.amountPaid = Number(amountPaid) || existingPayment.amountPaid;
      if (paymentDate) existingPayment.paymentDate = paymentDate;
      existingPayment.status = finalStatus;
      if (paymentMethod) existingPayment.paymentMethod = paymentMethod;
      if (reference) existingPayment.reference = reference;
      if (proofFile) existingPayment.proofFile = proofFile;
      if (electricityAmount !== undefined) existingPayment.electricityAmount = Number(electricityAmount) || 0;
      if (electricityRef) existingPayment.electricityRef = electricityRef;
      if (electricityProofFile) existingPayment.electricityProofFile = electricityProofFile;
      if (propertyName || (tenant && tenant.propertyName)) {
        existingPayment.propertyName = propertyName || tenant?.propertyName || existingPayment.propertyName;
      }

      const updatedPayment = await existingPayment.save();
      return res.status(200).json({ success: true, data: updatedPayment });
    }

    const newPayment = new RentPayment({
      tenantId: validTenantId,
      tenantName: tenantName || (tenant ? tenant.name : 'Resident'),
      roomNumber: roomNumber || (tenant ? tenant.roomNumber : 'Room'),
      propertyName: propertyName || (tenant ? tenant.propertyName : ''),
      month: finalMonth,
      amountPaid: Number(amountPaid) || (tenant ? tenant.rentAmount : 0),
      paymentDate: paymentDate || Date.now(),
      status: finalStatus,
      paymentMethod: paymentMethod || 'UPI (GPay / PhonePe)',
      reference: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      proofFile: proofFile || '',
      electricityAmount: Number(electricityAmount) || 0,
      electricityRef: electricityRef || '',
      electricityProofFile: electricityProofFile || ''
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({ success: true, data: savedPayment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/payments/:id - Update payment record / approve verification
router.put('/:id', async (req, res) => {
  try {
    const updated = await RentPayment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // If payment was verified/paid, update tenant paymentStatus if tenantId exists
    if ((req.body.status === 'paid' || req.body.status === 'Paid') && updated.tenantId) {
      await Tenant.findByIdAndUpdate(updated.tenantId, { paymentStatus: 'Paid' }).catch(() => {});
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
