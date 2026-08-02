import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Tenant } from './models/Tenant.js';
import { RentPayment } from './models/RentPayment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://guravyashodhan_db_user:Yashu%40123@cluster0.rpxc1ds.mongodb.net/tenant_management_db?retryWrites=true&w=majority&appName=Cluster0';

const initialTenants = [
  {
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    roomNumber: "Room 101",
    rentAmount: 12000,
    joiningDate: new Date("2024-03-15"),
    idProof: "Rahul_Sharma_Aadhar_Card.pdf",
    agreementFile: "Agreement_Room101_Rahul.pdf",
    agreementExpiryDate: new Date("2026-08-10"),
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
    agreementExpiryDate: new Date("2026-11-30"),
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
    agreementExpiryDate: new Date("2026-08-06"),
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
    agreementExpiryDate: new Date("2027-04-30"),
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
    agreementExpiryDate: new Date("2026-08-14"),
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

    const insertedTenants = await Tenant.insertMany(initialTenants);
    console.log(`✅ Seeded ${insertedTenants.length} tenants into MongoDB Atlas!`);

    // Seed sample rent payments
    const initialPayments = [
      {
        tenantId: insertedTenants[0]._id,
        tenantName: insertedTenants[0].name,
        roomNumber: insertedTenants[0].roomNumber,
        month: "August 2026",
        amountPaid: insertedTenants[0].rentAmount,
        paymentDate: new Date("2026-08-01"),
        status: "paid",
        paymentMethod: "UPI (Google Pay)",
        reference: "UPI-984210"
      },
      {
        tenantId: insertedTenants[1]._id,
        tenantName: insertedTenants[1].name,
        roomNumber: insertedTenants[1].roomNumber,
        month: "August 2026",
        amountPaid: insertedTenants[1].rentAmount,
        paymentDate: new Date("2026-08-01"),
        status: "pending",
        paymentMethod: "-",
        reference: "-"
      },
      {
        tenantId: insertedTenants[2]._id,
        tenantName: insertedTenants[2].name,
        roomNumber: insertedTenants[2].roomNumber,
        month: "August 2026",
        amountPaid: insertedTenants[2].rentAmount,
        paymentDate: new Date("2026-08-01"),
        status: "pending",
        paymentMethod: "-",
        reference: "-"
      },
      {
        tenantId: insertedTenants[3]._id,
        tenantName: insertedTenants[3].name,
        roomNumber: insertedTenants[3].roomNumber,
        month: "August 2026",
        amountPaid: insertedTenants[3].rentAmount,
        paymentDate: new Date("2026-08-01"),
        status: "paid",
        paymentMethod: "NetBanking",
        reference: "NB-448102"
      },
      {
        tenantId: insertedTenants[4]._id,
        tenantName: insertedTenants[4].name,
        roomNumber: insertedTenants[4].roomNumber,
        month: "August 2026",
        amountPaid: insertedTenants[4].rentAmount,
        paymentDate: new Date("2026-07-30"),
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
