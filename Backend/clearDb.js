import connectDB from './config/db.js';
import User from './models/User.js';
import Company from './models/Company.js';
import dotenv from 'dotenv';
dotenv.config();

const clear = async () => {
    await connectDB();
    await User.deleteMany({});
    await Company.deleteMany({});
    console.log("Database cleared.");
    process.exit(0);
}
clear();
