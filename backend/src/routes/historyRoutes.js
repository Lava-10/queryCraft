import express from 'express';
import {
  getHistory,
  addToHistory,
  toggleFavorite,
  deleteQuery
} from '../controllers/historyController.js';

const router = express.Router();

// Get all query history
router.get('/', getHistory);

// Add query to history
router.post('/', addToHistory);

// Toggle favorite status
router.patch('/:id/favorite', toggleFavorite);

// Delete query from history
router.delete('/:id', deleteQuery);

export default router; 