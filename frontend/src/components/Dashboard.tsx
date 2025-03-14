import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { useQuery } from 'react-query';

interface AnalyticsData {
  totalQueries: number;
  averageExecutionTime: number;
  slowestQueries: Array<{
    query: string;
    executionTime: number;
    timestamp: string;
  }>;
  queryTypes: {
    select: number;
    insert: number;
    update: number;
    delete: number;
  };
  performanceTrend: Array<{
    date: string;
    averageTime: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { data: analytics } = useQuery<AnalyticsData>('analytics', async () => {
    const response = await fetch('http://localhost:3001/api/analytics');
    return response.json();
  });

  if (!analytics) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Queries
              </Typography>
              <Typography variant="h4">
                {analytics.totalQueries}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Execution Time
              </Typography>
              <Typography variant="h4">
                {analytics.averageExecutionTime.toFixed(2)}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                SELECT Queries
              </Typography>
              <Typography variant="h4">
                {analytics.queryTypes.select}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Other Queries
              </Typography>
              <Typography variant="h4">
                {analytics.queryTypes.insert + analytics.queryTypes.update + analytics.queryTypes.delete}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              {analytics.performanceTrend.map((point, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${(point.averageTime / Math.max(...analytics.performanceTrend.map(p => p.averageTime))) * 100}%`,
                    backgroundColor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Slowest Queries */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Slowest Queries
            </Typography>
            <List>
              {analytics.slowestQueries.map((query, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={query.query}
                      secondary={`${query.executionTime}ms - ${new Date(query.timestamp).toLocaleString()}`}
                    />
                  </ListItem>
                  {index < analytics.slowestQueries.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Query Type Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Query Type Distribution
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(analytics.queryTypes).map(([type, count]) => (
                <Grid item xs={12} sm={6} md={3} key={type}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {type.toUpperCase()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(count / analytics.totalQueries) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {count} queries
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 