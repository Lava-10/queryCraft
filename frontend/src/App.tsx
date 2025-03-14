import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import Layout from './components/Layout';
import SQLEditor from './components/SQLEditor';
import Dashboard from './components/Dashboard';
import QueryHistory from './components/QueryHistory';
import Settings from './components/Settings';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

// Create query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', height: '100vh' }}>
            <Layout>
              <Routes>
                <Route path="/" element={<SQLEditor />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<QueryHistory />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 