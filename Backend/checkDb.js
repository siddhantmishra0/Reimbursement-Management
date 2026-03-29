import connectDB from './config/db.js';
import User from './models/User.js';
import Company from './models/Company.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    await connectDB();
    const users = await User.find({});
    const companies = await Company.find({});
    console.log("Users:", users.map(u => ({ email: u.email, name: u.name })));
    console.log("Companies:", companies.map(c => ({ name: c.name })));
    process.exit(0);
}
run();
