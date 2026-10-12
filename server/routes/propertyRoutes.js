import express from 'express';
import mongoose from 'mongoose';
import { Property } from '../models/Property.js';

const router = express.Router();

const defaultProperties = [
  {
    customId: "prop-1",
    name: "Sai Kripa Nivas (Home Residency)",
    address: "Plot 42, Viman Nagar, Pune, Maharashtra",
    houseNo: "Plot 42",
    type: "Residential Rental Rooms & Apartments",
    units: 12,
    availableRooms: ["Room 101", "Room 102", "Room 201", "Room 202", "Room 301", "Room 302"],
    occupied: 10,
    monthlyRevenue: 145000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    manager: "Yashodhan Gurav (Owner)",
    amenities: ["High-speed Wi-Fi", "24/7 CCTV Security", "Power Backup", "2-Wheeler / Car Parking", "Water Purifier"],
    yearBuilt: 2022
  },
  {
    customId: "prop-2",
    name: "Shree Ganesh Heights",
    address: "Sector 17, Vashi, Navi Mumbai, Maharashtra",
    houseNo: "Building B",
    type: "Residential Flats",
    units: 8,
    availableRooms: ["Flat 101", "Flat 102", "Flat 201", "Flat 202", "Flat 301", "Flat 302"],
    occupied: 7,
    monthlyRevenue: 125000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    manager: "Yashodhan Gurav (Owner)",
    amenities: ["Solar Water Heater", "Lift Backup", "Security Guard", "Intercom"],
    yearBuilt: 2021
  }
];

// GET /api/properties - Fetch all properties
router.get('/', async (req, res) => {
  try {
    let properties = await Property.find().sort({ createdAt: -1 });
    if (properties.length === 0) {
      // Auto seed default properties
      properties = await Property.insertMany(defaultProperties);
    }
    res.json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/properties - Add new property (Owner only)
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.customId && data.id) {
      data.customId = data.id;
    }
    const newProperty = new Property(data);
    const savedProperty = await newProperty.save();
    res.status(201).json({ success: true, data: savedProperty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/properties/:id - Update existing property & room numbers (Owner only)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let query = mongoose.isValidObjectId(id) ? { _id: id } : { customId: id };
    
    let updatedProperty = await Property.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    
    // Fallback if not found by customId, check _id
    if (!updatedProperty && !mongoose.isValidObjectId(id)) {
      updatedProperty = await Property.findOne({ $or: [{ customId: id }, { name: req.body.name }] });
      if (updatedProperty) {
        Object.assign(updatedProperty, req.body);
        await updatedProperty.save();
      }
    }

    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: updatedProperty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/properties/:id - Delete property (Owner only)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let query = mongoose.isValidObjectId(id) ? { _id: id } : { customId: id };
    const deleted = await Property.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
