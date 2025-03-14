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
  Tabs,
  Tab,
} from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import QueryPipeline from './QueryPipeline';

interface QueryResult {
  result: {
    columns: string[];
    rows: any[];
    executionTime: number;
  };
  pipeline: {
    tokenization: any;
    parsing: any;
    analysis: any;
    optimization: any;
    preparation: any;
    execution: any;
  };
  error?: string;
}

const SQLEditor: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const pipelineSteps = result?.pipeline ? [
    {
      name: 'Tokenization',
      description: 'Breaking down the SQL query into tokens',
      data: result.pipeline.tokenization,
      status: result.pipeline.tokenization ? 'completed' : 'pending'
    },
    {
      name: 'Parsing',
      description: 'Converting tokens into an Abstract Syntax Tree (AST)',
      data: result.pipeline.parsing,
      status: result.pipeline.parsing ? 'completed' : 'pending'
    },
    {
      name: 'Analysis',
      description: 'Semantic analysis and validation',
      data: result.pipeline.analysis,
      status: result.pipeline.analysis ? 'completed' : 'pending'
    },
    {
      name: 'Optimization',
      description: 'Query optimization and transformation',
      data: result.pipeline.optimization,
      status: result.pipeline.optimization ? 'completed' : 'pending'
    },
    {
      name: 'Preparation',
      description: 'Final query preparation and validation',
      data: result.pipeline.preparation,
      status: result.pipeline.preparation ? 'completed' : 'pending'
    },
    {
      name: 'Execution',
      description: 'Query execution and result generation',
      data: result.pipeline.execution,
      status: result.pipeline.execution ? 'completed' : 'pending'
    }
  ] : [];

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
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Results" />
            <Tab label="Execution Pipeline" />
          </Tabs>

          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Execution time: {result.result.executionTime}ms
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {result.result.columns.map((column) => (
                        <th key={column} style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.result.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {result.result.columns.map((column) => (
                          <td key={column} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </>
          )}

          {activeTab === 1 && (
            <QueryPipeline steps={pipelineSteps} />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SQLEditor; 