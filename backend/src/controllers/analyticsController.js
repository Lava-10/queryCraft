import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    // Get total queries
    const [totalQueries] = await pool.query(
      'SELECT COUNT(*) as count FROM query_history'
    );

    // Get average execution time
    const [avgExecutionTime] = await pool.query(
      'SELECT AVG(execution_time) as avg_time FROM query_history'
    );

    // Get slowest queries
    const [slowestQueries] = await pool.query(
      'SELECT query, execution_time, timestamp FROM query_history ORDER BY execution_time DESC LIMIT 5'
    );

    // Get query type distribution
    const [queryTypes] = await pool.query(`
      SELECT 
        CASE 
          WHEN LOWER(query) LIKE 'select%' THEN 'SELECT'
          WHEN LOWER(query) LIKE 'insert%' THEN 'INSERT'
          WHEN LOWER(query) LIKE 'update%' THEN 'UPDATE'
          WHEN LOWER(query) LIKE 'delete%' THEN 'DELETE'
          ELSE 'OTHER'
        END as type,
        COUNT(*) as count
      FROM query_history
      GROUP BY type
    `);

    // Get performance trends (last 7 days)
    const [performanceTrends] = await pool.query(`
      SELECT 
        DATE(timestamp) as date,
        AVG(execution_time) as avg_time,
        COUNT(*) as query_count
      FROM query_history
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date
    `);

    res.json({
      totalQueries: totalQueries[0].count,
      averageExecutionTime: avgExecutionTime[0].avg_time || 0,
      slowestQueries,
      queryTypes,
      performanceTrends
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}; 