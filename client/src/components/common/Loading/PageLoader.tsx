import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
// You'll need to add a shipping/logistics Lottie animation JSON file
// Download from https://lottiefiles.com/search?q=shipping&category=animations

const PageLoader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.6, -0.05, 0.01, 0.99],
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 300,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated CircularProgress as fallback for Lottie */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <CircularProgress
              size={120}
              thickness={2}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
          </motion.div>
          
          {/* Add your Lottie animation here */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Loading your dashboard...
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default PageLoader;