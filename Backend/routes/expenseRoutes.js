import express from 'express';
import { createExpense, getMyExpenses, getTeamExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createExpense);

router.route('/my')
  .get(protect, getMyExpenses);

router.route('/team')
  .get(protect, getTeamExpenses);

export default router;
