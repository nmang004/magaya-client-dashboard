import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            403
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You don't have permission to access this resource.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Go to Dashboard
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Unauthorized;