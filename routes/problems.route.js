import express from 'express';
import { protectRoute } from '../middleware/middleware.js';
import { isAdmin } from '../middleware/rbac.js';
import { createProblem, deleteProblem, getProblem, listProblems, updateProblem } from '../controllers/problems.controller.js';

const router = express.Router();

router.get('/list', protectRoute, listProblems);
router.get('/get/:problemId', protectRoute, getProblem);
router.post('/create', protectRoute, isAdmin, createProblem);
router.delete('/delete/:problemId', protectRoute, isAdmin, deleteProblem);
router.put('/update/:problemId', protectRoute, isAdmin, updateProblem);

export default router;