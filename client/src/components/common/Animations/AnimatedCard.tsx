import React from 'react';
import { Card, CardProps, useTheme, alpha } from '@mui/material';
import { motion, MotionProps, Variants } from 'framer-motion';

interface AnimatedCardProps extends Omit<CardProps, 'sx'> {
  children: React.ReactNode;
  variant?: 'elevation' | 'glassmorphism' | 'gradient' | 'outlined';
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt' | 'none';
  clickEffect?: 'scale' | 'ripple' | 'none';
  animation?: 'fadeIn' | 'slideUp' | 'slideIn' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  onClick?: () => void;
  sx?: any;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'elevation',
  hoverEffect = 'lift',
  clickEffect = 'scale',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.3,
  onClick,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  const getCardVariant = () => {
    switch (variant) {
      case 'glassmorphism':
        return {
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
          boxShadow: theme.customShadows?.glass || theme.shadows[8],
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: theme.customShadows?.card || theme.shadows[2],
        };
      case 'outlined':
        return {
          border: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          backgroundColor: 'transparent',
          boxShadow: 'none',
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.customShadows?.card || theme.shadows[2],
        };
    }
  };

  const getHoverEffect = () => {
    switch (hoverEffect) {
      case 'lift':
        return {
          transform: 'translateY(-8px)',
          boxShadow: theme.customShadows?.primary || theme.shadows[12],
        };
      case 'glow':
        return {
          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
          transform: 'translateY(-2px)',
        };
      case 'scale':
        return {
          transform: 'scale(1.02)',
        };
      case 'tilt':
        return {
          transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-4px)',
          transformStyle: 'preserve-3d',
        };
      case 'none':
      default:
        return {};
    }
  };

  const getAnimationVariants = (): Variants => {
    switch (animation) {
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, delay }
          },
        };
      case 'slideIn':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration, delay }
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration, delay, type: 'spring', stiffness: 100 }
          },
        };
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration, delay }
          },
        };
      case 'none':
      default:
        return {
          hidden: {},
          visible: {},
        };
    }
  };

  const getClickEffect = () => {
    switch (clickEffect) {
      case 'scale':
        return { scale: 0.98 };
      case 'ripple':
        // Note: Ripple effect would need additional implementation
        return { scale: 0.99 };
      case 'none':
      default:
        return {};
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={hoverEffect !== 'none' ? {} : undefined}
      whileTap={clickEffect !== 'none' ? getClickEffect() : undefined}
      style={{ width: '100%' }}
    >
      <Card
        {...props}
        onClick={onClick}
        sx={{
          ...getCardVariant(),
          borderRadius: 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': hoverEffect !== 'none' ? getHoverEffect() : {},
          '&::before': variant === 'glassmorphism' ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.1)} 0%, ${alpha(theme.palette.common.white, 0.05)} 100%)`,
            pointerEvents: 'none',
          } : {},
          ...sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;