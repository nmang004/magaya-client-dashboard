import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, LinearProgress, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  message?: string;
  variant?: 'page' | 'component' | 'inline';
  showProgress?: boolean;
  tips?: string[];
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading W.M. Stone Command Center...',
  variant = 'page',
  showProgress = false,
  tips = [
    'Optimizing your logistics experience...',
    'Preparing shipment data...',
    'Loading analytics dashboard...',
    'Connecting to maritime networks...',
    'Synchronizing global trade data...'
  ]
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (showProgress) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 95);
        });
      }, 200);

      return () => {
        clearInterval(timer);
      };
    }
  }, [showProgress]);

  useEffect(() => {
    if (tips.length > 1) {
      const timer = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [tips]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'page':
        return {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          zIndex: 9999,
          overflow: 'hidden',
        };
      case 'component':
        return {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          background: alpha(theme.palette.background.paper, 0.8),
          borderRadius: 2,
          position: 'relative',
        };
      case 'inline':
        return {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        };
      default:
        return {};
    }
  };

  if (variant === 'inline') {
    return (
      <Box sx={getContainerStyles()}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={getContainerStyles()}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${alpha('#ffffff', 0.1)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${alpha('#ffffff', 0.08)} 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, ${alpha('#ffffff', 0.05)} 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />

        {/* Logo/Brand */}
        <motion.div variants={itemVariants}>
          <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
            <motion.img
              src="/wm-stone-logo.svg"
              alt="W.M. Stone Logo"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain',
                maxWidth: '200px',
                filter: 'brightness(0) invert(1)', // Make logo white for dark background
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </Box>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div variants={itemVariants}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <CircularProgress
                size={80}
                thickness={3}
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 3,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
            </motion.div>
          </Box>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div variants={itemVariants}>
            <Box sx={{ width: 300, mb: 2, position: 'relative', zIndex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#ffffff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Main Message */}
        <motion.div variants={itemVariants}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {message}
          </Typography>
        </motion.div>

        {/* Tips/Subtitles */}
        {tips.length > 0 && (
          <motion.div variants={itemVariants}>
            <Box sx={{ height: 40, position: 'relative', zIndex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      fontStyle: 'italic',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {tips[currentTip]}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
          </motion.div>
        )}

        {/* Maritime-themed decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 1,
          }}
        >
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PageLoader;