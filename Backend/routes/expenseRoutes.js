import express from 'express';
import multer from 'multer';
import path from 'path';
import { approveExpense, rejectExpense } from '../controllers/approvalController.js';
import { createExpense, getMyExpenses, getTeamExpenses } from '../controllers/expenseController.js';
import { extractReceipt } from '../controllers/ocrController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage configuration for saving receipts to disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    // Unique filename using timestamp + exact original extension
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// OCR route
router.post('/extract-receipt', protect, upload.single('receipt'), extractReceipt);

// Expense Routes
router.route('/')
  .post(protect, createExpense);


router.route('/my')
  .get(protect, getMyExpenses);

router.route('/team')
  .get(protect, getTeamExpenses);

// Approval Engine Routes
router.post('/:id/approve', protect, approveExpense);
router.post('/:id/reject', protect, rejectExpense);

export default router;