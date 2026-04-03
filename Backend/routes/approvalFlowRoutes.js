import express from 'express';
import {
  getApprovalFlows,
  createApprovalFlow,
  updateApprovalFlow,
  deleteApprovalFlow
} from '../controllers/approvalFlowController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getApprovalFlows)
  .post(protect, admin, createApprovalFlow);

router.route('/:id')
  .put(protect, admin, updateApprovalFlow)
  .delete(protect, admin, deleteApprovalFlow);

export default router;
