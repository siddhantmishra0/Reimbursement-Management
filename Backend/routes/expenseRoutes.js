import express from 'express';
import { approveExpense, rejectExpense } from '../controllers/approvalController.js';
import { createExpense, getMyExpenses, getTeamExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

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