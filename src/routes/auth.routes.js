import { Router } from 'express';
import { register, login, logout, verifyToken } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verifyToken', verifyToken);

export default router;
