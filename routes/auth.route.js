import express from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', protectRoute, logout);

router.get("/me", protectRoute, getCurrentUser);

export default router;