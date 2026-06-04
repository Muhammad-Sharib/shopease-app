import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    // DB name is included in the URI (E-commerce)
    await connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit process on connection failure
  }
}

export default dbConnect;
