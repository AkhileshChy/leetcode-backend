import express from 'express';
import { codeSubmit } from '../controllers/code.controller.js';

const router = express.Router();

router.post('/submit', codeSubmit)

export default router;