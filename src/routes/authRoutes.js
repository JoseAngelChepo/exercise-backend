import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser, oauthToken } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login',    loginUser);
router.post('/refresh',  refreshToken);
router.post('/logout',   logoutUser);

router.post("/oauth/token", oauthToken);

export default router;
