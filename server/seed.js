import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Tenant } from './models/Tenant.js';
import { RentPayment } from './models/RentPayment.js';
import { Property } from './models/Property.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://guravyashodhan_db_user:Yashu%40123@cluster0.rpxc1ds.mongodb.net/tenant_management_db?retryWrites=true&w=majority&appName=Cluster0';

const now = new Date();
const addDays = (days) => new Date(now.getTime() + Number(days) * 86400000);
const addMonths = (m) => new Date(new Date(now).setMonth(now.getMonth() + Number(m)));
const currentMonthStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const initialTenants = [
  {
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    roomNumber: "Room 101",
    rentAmount: 12000,
    joiningDate: new Date("2024-03-15"),
    idProof: "Rahul_Sharma_Aadhar_Card.pdf",
    agreementFile: "Agreement_Room101_Rahul.pdf",
    agreementExpiryDate: addDays(4),
    status: "Expiring Soon",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Priya Patel",
    phone: "+91 91234 56789",
    roomNumber: "Room 102",
    rentAmount: 14000,
    joiningDate: new Date("2023-11-01"),
    idProof: "Priya_Patel_Passport_ID.pdf",
    agreementFile: "Agreement_Room102_Priya.pdf",
    agreementExpiryDate: addMonths(4),
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Amit Verma",
    phone: "+91 99887 76655",
    roomNumber: "Room 201",
    rentAmount: 15500,
    joiningDate: new Date("2024-01-10"),
    idProof: "Amit_Verma_Voter_ID.pdf",
    agreementFile: "Agreement_Room201_Amit.pdf",
    agreementExpiryDate: addDays(2),
    status: "Expiring Soon",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Sneha Reddy",
    phone: "+91 97654 32109",
    roomNumber: "Room 202",
    rentAmount: 13500,
    joiningDate: new Date("2024-05-01"),
    idProof: "Sneha_Reddy_Aadhar.pdf",
    agreementFile: "Agreement_Room202_Sneha.pdf",
    agreementExpiryDate: addMonths(10),
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Vikram Malhotra",
    phone: "+91 98111 22334",
    roomNumber: "Room 301",
    rentAmount: 16000,
    joiningDate: new Date("2023-08-15"),
    idProof: "Vikram_Malhotra_DrivingLicense.pdf",
    agreementFile: "Agreement_Room301_Vikram.pdf",
    agreementExpiryDate: addDays(6),
    status: "Expiring Soon",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas to seed data...');
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoURI);
    }
    
    console.log('Clearing existing records and seeding demo data into Atlas database: tenant_management_db...');
    await Tenant.deleteMany({});
    await RentPayment.deleteMany({});
    await Property.deleteMany({});

    const initialProps = [
      {
        customId: "prop-1",
        name: "Sai Kripa Nivas (Home Residency)",
        address: "Plot 42, Viman Nagar, Pune, Maharashtra",
        houseNo: "Plot 42",
        type: "Residential Rental Rooms & Apartments",
        units: 6,
        availableRooms: ["Room 101", "Room 102", "Room 201", "Room 202", "Room 301", "Room 302"],
        occupied: 5,
        monthlyRevenue: 71000,
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
        units: 6,
        availableRooms: ["Flat 101", "Flat 102", "Flat 201", "Flat 202", "Flat 301", "Flat 302"],
        occupied: 0,
        monthlyRevenue: 0,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
        manager: "Yashodhan Gurav (Owner)",
        amenities: ["Solar Water Heater", "Lift Backup", "Security Guard", "Intercom"],
        yearBuilt: 2021
      }
    ];

    const insertedProperties = await Property.insertMany(initialProps);
    console.log(`✅ Seeded ${insertedProperties.length} properties into MongoDB Atlas!`);

    const insertedTenants = await Tenant.insertMany(initialTenants);
    console.log(`✅ Seeded ${insertedTenants.length} tenants into MongoDB Atlas!`);

    // Seed sample rent payments
    const initialPayments = [
      {
        tenantId: insertedTenants[0]._id,
        tenantName: insertedTenants[0].name,
        roomNumber: insertedTenants[0].roomNumber,
        month: currentMonthStr,
        amountPaid: insertedTenants[0].rentAmount,
        paymentDate: now,
        status: "paid",
        paymentMethod: "UPI (Google Pay)",
        reference: "UPI-984210"
      },
      {
        tenantId: insertedTenants[1]._id,
        tenantName: insertedTenants[1].name,
        roomNumber: insertedTenants[1].roomNumber,
        month: currentMonthStr,
        amountPaid: insertedTenants[1].rentAmount,
        paymentDate: null,
        status: "pending",
        paymentMethod: "-",
        reference: "-"
      },
      {
        tenantId: insertedTenants[2]._id,
        tenantName: insertedTenants[2].name,
        roomNumber: insertedTenants[2].roomNumber,
        month: currentMonthStr,
        amountPaid: insertedTenants[2].rentAmount,
        paymentDate: null,
        status: "pending",
        paymentMethod: "-",
        reference: "-"
      },
      {
        tenantId: insertedTenants[3]._id,
        tenantName: insertedTenants[3].name,
        roomNumber: insertedTenants[3].roomNumber,
        month: currentMonthStr,
        amountPaid: insertedTenants[3].rentAmount,
        paymentDate: now,
        status: "paid",
        paymentMethod: "NetBanking",
        reference: "NB-448102"
      },
      {
        tenantId: insertedTenants[4]._id,
        tenantName: insertedTenants[4].name,
        roomNumber: insertedTenants[4].roomNumber,
        month: currentMonthStr,
        amountPaid: insertedTenants[4].rentAmount,
        paymentDate: now,
        status: "paid",
        paymentMethod: "UPI (PhonePe)",
        reference: "UPI-110293"
      }
    ];

    await RentPayment.insertMany(initialPayments);
    console.log(`✅ Seeded sample rent payments into MongoDB Atlas!`);
  } catch (err) {
    console.error('❌ Error seeding MongoDB Atlas:', err);
  }
};

// Execute if called directly from Node
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => mongoose.connection.close());
}
