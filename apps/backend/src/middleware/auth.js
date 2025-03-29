
const jwt = require('jsonwebtoken');

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};

// Check if user is already logged in (for login/register pages)
const isAlreadyLoggedIn = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // User is logged in, redirect based on role
    return res.status(200).json({ 
      isLoggedIn: true, 
      message: 'User is already logged in',
      role: decoded.role,
      redirectTo: decoded.role === 'ADMIN' ? '/dashboard' : '/'
    });
  } catch (error) {
    // Token is invalid, proceed to login/register
    next();
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isAlreadyLoggedIn
};
