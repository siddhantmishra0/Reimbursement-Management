import express from 'express';
import { approveExpense, rejectExpense } from '../controllers/approvalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Approval Engine Endpoints
router.post('/:id/approve', protect, approveExpense);
router.post('/:id/reject', protect, rejectExpense);

export default router;
