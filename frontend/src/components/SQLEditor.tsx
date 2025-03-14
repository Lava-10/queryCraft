import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
  error?: string;
}

const SQLEditor: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [isExecuting, setIsExecuting] = useState(false);

  const { data: result, error, refetch } = useQuery<QueryResult>(
    ['executeQuery', query],
    async () => {
      setIsExecuting(true);
      try {
        const response = await fetch('http://localhost:3001/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        
        if (!response.ok) {
          throw new Error('Query execution failed');
        }
        
        return response.json();
      } finally {
        setIsExecuting(false);
      }
    },
    {
      enabled: false,
      retry: false,
    }
  );

  const handleExecuteQuery = () => {
    refetch();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ flex: 1, p: 2 }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={isExecuting ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          onClick={handleExecuteQuery}
          disabled={isExecuting}
        >
          Execute Query
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          Error executing query: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Execution time: {result.executionTime}ms
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {result.columns.map((column) => (
                    <th key={column} style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {result.columns.map((column) => (
                      <td key={column} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SQLEditor; 