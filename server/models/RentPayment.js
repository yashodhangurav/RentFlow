import mongoose from 'mongoose';

const rentPaymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required']
  },
  tenantName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: [true, 'Payment month is required'] // e.g. "August 2026"
  },
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
    min: [0, 'Amount paid must be positive']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'verification_pending', 'rejected', 'Paid', 'Pending', 'Verification Pending', 'Rejected'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'UPI (GPay / PhonePe)'
  },
  reference: {
    type: String,
    default: () => `REF-${Math.floor(100000 + Math.random() * 900000)}`
  },
  proofFile: {
    type: String,
    default: ''
  },
  electricityAmount: {
    type: Number,
    default: 0,
    min: [0, 'Electricity amount must be non-negative']
  },
  electricityRef: {
    type: String,
    default: ''
  },
  electricityProofFile: {
    type: String,
    default: ''
  },
  propertyName: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const RentPayment = mongoose.models.RentPayment || mongoose.model('RentPayment', rentPaymentSchema);
