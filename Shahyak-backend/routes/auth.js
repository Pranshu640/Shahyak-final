import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Doctor, Client } from '../models/User.js';
import Session from '../models/Session.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register new user (doctor or client)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;
    
    // Validate role
    if (!role || !['Doctor', 'Client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user based on role
    let user;
    
    if (role === 'Doctor') {
      // Validate required doctor fields
      const { specialization, experience, qualifications, licenseNumber, officeLocation, phoneNumber } = additionalData;
      
      if (!specialization || !experience || !qualifications || !licenseNumber || !officeLocation || !phoneNumber) {
        return res.status(400).json({ message: 'Missing required doctor information' });
      }
      
      user = new Doctor({
        name,
        email,
        password,
        ...additionalData
      });
    } else {
      // Client registration
      user = new Client({
        name,
        email,
        password,
        ...additionalData
      });
    }
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'shahyak_secret_key',
      { expiresIn: '7d' }
    );
    
    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    const session = new Session({
      userId: user._id,
      token,
      expiresAt
    });
    
    await session.save();
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'shahyak_secret_key',
      { expiresIn: '7d' }
    );
    
    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    const session = new Session({
      userId: user._id,
      token,
      expiresAt
    });
    
    await session.save();
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout user
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Delete session
    await Session.findOneAndDelete({ token: req.session.token });
    
    // Clear cookie
    res.clearCookie('token');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;