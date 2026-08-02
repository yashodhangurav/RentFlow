import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    default: 'Tenant123'
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  rentAmount: {
    type: Number,
    required: [true, 'Monthly rent amount is required'],
    min: [0, 'Rent amount must be positive']
  },
  deposit: {
    type: Number,
    default: 24000,
    min: [0, 'Advance deposit must be positive']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    default: Date.now
  },
  idProof: {
    type: String,
    default: 'Aadhar_Card_Proof.pdf'
  },
  agreementFile: {
    type: String,
    default: 'Rental_Agreement.pdf'
  },
  agreementExpiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },
  status: {
    type: String,
    enum: ['Active', 'Expiring Soon', 'Notice', 'Archived'],
    default: 'Active'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
}, {
  timestamps: true
});

export const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);
