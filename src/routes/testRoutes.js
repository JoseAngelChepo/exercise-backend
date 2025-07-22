import express from 'express';
import { delay } from '../controllers/testController.js';

const router = express.Router();
router.get('/delay', delay);

export default router;
