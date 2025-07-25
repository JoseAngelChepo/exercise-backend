import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect }         from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/me', protect, getUserProfile);

export default router;
