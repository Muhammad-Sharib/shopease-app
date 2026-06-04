import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

async function dbConnect() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI missing in server/.env');
    return;
  }

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log('✅ Connected to MongoDB successfully');
      return;
    } catch (error) {
      console.error(`❌ MongoDB attempt ${attempt}/${maxAttempts}:`, error.message);
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  console.error('⚠️ MongoDB not connected — server chalega lekin login/API kaam nahi karega jab tak Atlas connect na ho.');
}

export default dbConnect;
