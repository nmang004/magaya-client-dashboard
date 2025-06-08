import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalShipping,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
// import Particles from 'react-particles';
// import { loadSlim } from 'tsparticles-slim';
import toast from 'react-hot-toast';

// Validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  rememberMe: yup.boolean().default(false),
}).required();

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      
      // Show success animation
      toast.success('Welcome back! Redirecting to dashboard...', {
        icon: '🚀',
        duration: 2000,
      });

      // Redirect after animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password', {
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const particlesInit = async (engine: any) => {
  //   await loadSlim(engine);
  // };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background with CSS gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 50%, #1e3a8a 0%, transparent 70%),
            radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 70%),
            radial-gradient(circle at 40% 80%, #1e3a8a 0%, transparent 70%)
          `,
        }}
      />

      <Container component="main" maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Logo and Title */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <LocalShipping sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                </motion.div>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  W.M. Stone Command Center
                </Typography>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Welcome back to W.M. Stone Command Center! Please login to your account.
              </Typography>
            </motion.div>

            {/* Demo Credentials Alert */}
            <motion.div variants={itemVariants} style={{ width: '100%' }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Demo Credentials:</strong><br />
                  Email: demo@client1.com<br />
                  Password: demo123
                </Typography>
              </Alert>
            </motion.div>

            {/* Login Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1, width: '100%' }}
            >
              <motion.div variants={itemVariants}>
                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextField
                  {...register('password')}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                  <FormControlLabel
                    control={<Checkbox {...register('rememberMe')} defaultChecked />}
                    label="Remember me"
                  />
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Forgot Password?
                    </Typography>
                  </Link>
                </Box>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    boxShadow: '0 4px 15px 0 rgba(30, 58, 138, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                      boxShadow: '0 6px 20px 0 rgba(30, 58, 138, 0.5)',
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      Sign In
                      <ArrowForward sx={{ ml: 1 }} />
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Divider sx={{ my: 3 }}>OR</Divider>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" component="span" color="primary" sx={{ fontWeight: 600 }}>
                        Sign Up
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;