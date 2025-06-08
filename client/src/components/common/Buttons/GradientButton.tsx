import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledGradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 600,
  padding: '12px 32px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
    
    '&::before': {
      opacity: 1,
    },
  },
  
  '& .MuiButton-label': {
    position: 'relative',
    zIndex: 1,
  },
  
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <StyledGradientButton {...props}>
        {children}
      </StyledGradientButton>
    </motion.div>
  );
};