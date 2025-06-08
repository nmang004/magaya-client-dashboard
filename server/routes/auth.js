const express = require('express');
const router = express.Router();
const { users, verifyPassword } = require('../mock-data/users');
const { generateToken, authRateLimit, authenticateToken } = require('../middleware/auth');

// Login endpoint with rate limiting
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    user.lastLogin = new Date();

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        profile: user.profile,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'An error occurred during login',
      code: 'LOGIN_ERROR'
    });
  }
});

// Get current user endpoint
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        profile: user.profile,
        permissions: user.permissions,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching user data',
      code: 'FETCH_ERROR'
    });
  }
});

// Refresh token endpoint
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate new token
    const token = generateToken(user);

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'An error occurred while refreshing token',
      code: 'REFRESH_ERROR'
    });
  }
});

// Logout endpoint (optional - for token blacklisting in production)
router.post('/logout', authenticateToken, (req, res) => {
  // In production, you might want to blacklist the token here
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;