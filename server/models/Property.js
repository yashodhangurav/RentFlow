import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  customId: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true
  },
  houseNo: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    required: [true, 'Property address is required'],
    trim: true
  },
  type: {
    type: String,
    default: 'Residential Apartments'
  },
  units: {
    type: Number,
    default: 10
  },
  availableRooms: {
    type: [String],
    default: ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301']
  },
  occupied: {
    type: Number,
    default: 0
  },
  monthlyRevenue: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80'
  },
  manager: {
    type: String,
    default: 'Yashodhan Gurav (Owner)'
  },
  amenities: {
    type: [String],
    default: ['High-speed Wi-Fi', '24/7 CCTV Security', 'Power Backup', '2-Wheeler / Car Parking']
  },
  yearBuilt: {
    type: Number,
    default: 2024
  }
}, {
  timestamps: true
});

export const Property = mongoose.model('Property', propertySchema);
