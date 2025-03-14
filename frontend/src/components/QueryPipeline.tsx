import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface PipelineStep {
  name: string;
  description: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface QueryPipelineProps {
  steps: PipelineStep[];
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const QueryPipeline: React.FC<QueryPipelineProps> = ({ steps }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Query Execution Pipeline
      </Typography>
      <Stepper orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.name} active={step.status === 'processing'} completed={step.status === 'completed'}>
            <StepLabel>
              <Typography variant="subtitle1">{step.name}</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {step.description}
              </Typography>
              {step.data && (
                <StyledCard>
                  <CardContent>
                    <pre style={{ 
                      margin: 0, 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '1rem',
                      borderRadius: '4px'
                    }}>
                      {JSON.stringify(step.data, null, 2)}
                    </pre>
                  </CardContent>
                </StyledCard>
              )}
              <Divider sx={{ my: 2 }} />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default QueryPipeline; 