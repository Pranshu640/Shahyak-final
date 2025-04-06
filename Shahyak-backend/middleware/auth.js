import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import Session from '../models/Session.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shahyak_secret_key');
    
    // Check if session exists
    const session = await Session.findOne({ 
      token, 
      userId: decoded.userId,
      expiresAt: { $gt: new Date() }
    });
    
    if (!session) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const authorize = (roles = []) => {
  // Convert string to array if only one role is provided
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has required role
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have permission to access this resource'
      });
    }

    next();
  };
};