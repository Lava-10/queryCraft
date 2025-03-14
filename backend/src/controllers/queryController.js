import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const executeQuery = async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Start the Rust SQL engine process with debug output
    const rustProcess = spawn(path.join(__dirname, '../../target/debug/sql_engine'), ['--debug', query]);
    
    let result = '';
    let error = '';
    let pipelineData = {
      tokenization: null,
      parsing: null,
      analysis: null,
      optimization: null,
      preparation: null,
      execution: null
    };

    // Collect output from the Rust process
    rustProcess.stdout.on('data', (data) => {
      const output = data.toString();
      result += output;

      // Parse debug output for pipeline information
      try {
        const debugData = JSON.parse(output);
        if (debugData.stage) {
          pipelineData[debugData.stage] = debugData.data;
        }
      } catch (e) {
        // Ignore non-JSON output
      }
    });

    rustProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    rustProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Query execution failed',
          details: error,
          pipeline: pipelineData
        });
      }

      try {
        // Parse the final result from the Rust engine
        const parsedResult = JSON.parse(result);
        
        // Return both the query result and pipeline information
        res.json({
          result: {
            columns: parsedResult.columns || [],
            rows: parsedResult.rows || [],
            executionTime: parsedResult.executionTime || 0
          },
          pipeline: pipelineData
        });
      } catch (parseError) {
        res.status(500).json({
          error: 'Failed to parse query result',
          details: parseError.message,
          pipeline: pipelineData
        });
      }
    });

    // Handle process errors
    rustProcess.on('error', (err) => {
      res.status(500).json({
        error: 'Failed to execute query',
        details: err.message,
        pipeline: pipelineData
      });
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}; 