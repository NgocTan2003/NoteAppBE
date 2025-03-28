import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const connectStringDB = process.env.CONNECTION_STRING;

export async function connectDB() {
    console.log(connectStringDB);

    try {
        await mongoose.connect(String(connectStringDB));
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
