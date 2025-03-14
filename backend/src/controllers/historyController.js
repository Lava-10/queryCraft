import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Get query history
export const getHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM query_history ORDER BY timestamp DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch query history' });
  }
};

// Add query to history
export const addToHistory = async (req, res) => {
  const { query, executionTime } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO query_history (id, query, execution_time, timestamp, is_favorite) VALUES (?, ?, ?, NOW(), ?)',
      [uuidv4(), query, executionTime, false]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add query to history' });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query(
      'UPDATE query_history SET is_favorite = NOT is_favorite WHERE id = ?',
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite status' });
  }
};

// Delete query from history
export const deleteQuery = async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM query_history WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete query' });
  }
}; 