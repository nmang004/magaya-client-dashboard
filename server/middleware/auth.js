const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
      companyName: user.companyName
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { 
      expiresIn: '7d' // Token expires in 7 days
    }
  );
};

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    return res.status(500).json({ 
      error: 'Token verification failed.',
      code: 'TOKEN_ERROR'
    });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Client data isolation middleware
const isolateClientData = (req, res, next) => {
  // Ensure clients can only access their own data
  if (req.user.role === 'client') {
    req.clientId = req.user.clientId;
  } else if (req.user.role === 'admin') {
    // Admins can access all data or specific client data if specified
    req.clientId = req.query.clientId || req.params.clientId || null;
  }
  next();
};

// Rate limiting for auth endpoints
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generateToken,
  authenticateToken,
  authorize,
  isolateClientData,
  authRateLimit
};