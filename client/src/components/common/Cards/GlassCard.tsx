import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledGlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
  },
}));

interface GlassCardProps extends CardProps {
  children: React.ReactNode;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <StyledGlassCard {...props}>
        {children}
      </StyledGlassCard>
    </motion.div>
  );
};