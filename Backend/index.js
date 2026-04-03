import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import approvalFlowRoutes from './routes/approvalFlowRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: function(origin, callback) {
    callback(null, true); // allow all origins dynamically
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.options('*', cors());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approval-flows', approvalFlowRoutes);

app.get('/', (req, res) => {
  res.send('RMS API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});