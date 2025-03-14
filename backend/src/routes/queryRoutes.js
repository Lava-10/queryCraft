import express from 'express';
import { executeQuery } from '../controllers/queryController.js';

const router = express.Router();

// Route for executing SQL queries
router.post('/query', executeQuery);

export default router; 