import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';

interface QueryItem {
  id: string;
  query: string;
  timestamp: string;
  executionTime: number;
  isFavorite: boolean;
}

const QueryHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch query history
  const { data: queries = [] } = useQuery<QueryItem[]>('queryHistory', async () => {
    const response = await fetch('http://localhost:3001/api/history');
    return response.json();
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation(
    async (queryId: string) => {
      await fetch(`http://localhost:3001/api/history/${queryId}/favorite`, {
        method: 'POST',
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('queryHistory');
      },
    }
  );

  // Delete query mutation
  const deleteQueryMutation = useMutation(
    async (queryId: string) => {
      await fetch(`http://localhost:3001/api/history/${queryId}`, {
        method: 'DELETE',
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('queryHistory');
      },
    }
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.query.toLowerCase().includes(searchQuery.toLowerCase());
    return activeTab === 0 ? matchesSearch : (matchesSearch && query.isFavorite);
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Query History
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search queries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="All Queries" />
          <Tab label="Favorites" />
        </Tabs>

        <List>
          {filteredQueries.map((query) => (
            <ListItem
              key={query.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" component="span">
                      {query.query}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${query.executionTime}ms`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={new Date(query.timestamp).toLocaleString()}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => toggleFavoriteMutation.mutate(query.id)}
                  sx={{ mr: 1 }}
                >
                  {query.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => {
                    // TODO: Implement query execution
                    console.log('Execute query:', query.query);
                  }}
                  sx={{ mr: 1 }}
                >
                  <PlayArrowIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => deleteQueryMutation.mutate(query.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default QueryHistory; 