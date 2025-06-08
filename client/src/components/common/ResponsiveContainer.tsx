import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: boolean;
  className?: string;
  animate?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = true,
  className,
  animate = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const getResponsivePadding = () => {
    if (!padding) return 0;
    
    return {
      px: {
        xs: 2, // 16px on mobile
        sm: 3, // 24px on small tablets
        md: 4, // 32px on desktop
      },
      py: {
        xs: 2, // 16px vertical on mobile
        sm: 3, // 24px on small tablets
        md: 3, // 24px on desktop
      },
    };
  };

  const containerContent = (
    <Container
      maxWidth={maxWidth}
      sx={{
        ...getResponsivePadding(),
        width: '100%',
        // Ensure container doesn't overflow on mobile
        maxWidth: {
          xs: '100%',
          sm: '100%',
          md: `${theme.breakpoints.values[maxWidth]}px`,
        },
      }}
      className={className}
    >
      {children}
    </Container>
  );

  if (animate) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {containerContent}
      </motion.div>
    );
  }

  return containerContent;
};

export default ResponsiveContainer;