import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only routes for user management
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

export default router;
