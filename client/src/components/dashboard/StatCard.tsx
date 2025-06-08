import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  percentage?: boolean;
  loading?: boolean;
  onClick?: () => void;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  percentage = false,
  loading = false,
  onClick,
  delay = 0,
}) => {
  const theme = useTheme();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const trendColor = trend && trend > 0 ? theme.palette.success.main : theme.palette.error.main;
  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  if (loading) {
    return (
      <Card sx={{ cursor: onClick ? 'pointer' : 'default' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
              <Skeleton width="80%" height={40} />
              <Skeleton width="40%" height={16} sx={{ mt: 2 }} />
            </Box>
            <Skeleton variant="circular" width={56} height={56} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'white',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          } : {},
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.6)} 100%)`,
          },
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                color="text.secondary"
                gutterBottom
                variant="body2"
                fontWeight={500}
              >
                {title}
              </Typography>
              
              <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                {inView && (
                  <CountUp
                    start={0}
                    end={value}
                    duration={2}
                    separator=","
                    suffix={percentage ? '%' : ''}
                    decimals={percentage ? 1 : 0}
                  />
                )}
              </Typography>

              {trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <TrendIcon
                    sx={{
                      fontSize: 16,
                      color: trendColor,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: trendColor,
                      fontWeight: 600,
                    }}
                  >
                    {Math.abs(trend)}%
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    vs last month
                  </Typography>
                </Box>
              )}
            </Box>

            <Avatar
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;