import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const executeQuery = async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Start the Rust SQL engine process
    const rustProcess = spawn(path.join(__dirname, '../../target/debug/sql_engine'), [query]);
    
    let result = '';
    let error = '';

    // Collect output from the Rust process
    rustProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    rustProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    rustProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Query execution failed',
          details: error
        });
      }

      try {
        // Parse the result from the Rust engine
        const parsedResult = JSON.parse(result);
        
        // Return the formatted result
        res.json({
          columns: parsedResult.columns || [],
          rows: parsedResult.rows || [],
          executionTime: parsedResult.executionTime || 0
        });
      } catch (parseError) {
        res.status(500).json({
          error: 'Failed to parse query result',
          details: parseError.message
        });
      }
    });

    // Handle process errors
    rustProcess.on('error', (err) => {
      res.status(500).json({
        error: 'Failed to execute query',
        details: err.message
      });
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}; 