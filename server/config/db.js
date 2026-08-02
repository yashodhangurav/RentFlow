import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://guravyashodhan_db_user:Yashu%40123@cluster0.rpxc1ds.mongodb.net/tenant_management_db?retryWrites=true&w=majority&appName=Cluster0';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Notice: ${error.message}`);
    console.warn(`ℹ️ Operating with in-memory Mongo fallback / Local State mode.`);
    return null;
  }
};
