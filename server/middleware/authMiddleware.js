// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path to your User model
const AppErr = require('../utils/appErr'); // Adjust path to your error handler

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // 1. Check authorization header
  if (!authHeader) {
    return next(new AppErr("Authorization header missing", 401));
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // 2. Verify JWT token
    const decoded = await jwt.verify(token, "anykey"); // Use environment variable
    
    // 3. Fetch user from database
    const user = await User.findById(decoded.userId).select('-password -__v');
    
    if (!user) {
      return next(new AppErr('User not found', 404));
    }
    
    // 4. Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return next(new AppErr('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppErr('Token expired', 401));
    }
    next(error);
  }
};

module.exports = authenticateUser;
