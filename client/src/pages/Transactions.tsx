import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const Transactions: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your financial transactions. This page will be implemented in the next phase.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Transactions;