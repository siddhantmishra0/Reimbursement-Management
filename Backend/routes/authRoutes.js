import express from 'express';
import { registerCompanyAndAdmin, authUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerCompanyAndAdmin);
router.post('/login', authUser);

export default router;
