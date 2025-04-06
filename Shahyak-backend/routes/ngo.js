const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateNGOSignup = [
  body('name').trim().notEmpty().withMessage('Organization name is required'),
  body('type').isIn(['NGO', 'Clinic', 'Hospital']).withMessage('Invalid organization type'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('website').optional().isURL().withMessage('Please enter a valid website URL'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// POST /api/ngo/signup
router.post('/signup', validateNGOSignup, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if email already exists
    const existingEmail = await NGO.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if license number already exists
    const existingLicense = await NGO.findOne({ licenseNumber: req.body.licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number already registered' });
    }

    // Create new NGO
    const ngo = new NGO({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      description: req.body.description,
      licenseNumber: req.body.licenseNumber,
      password: req.body.password
    });

    // Save NGO to database
    await ngo.save();

    // Return success response
    res.status(201).json({
      message: 'Organization registered successfully',
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        type: ngo.type
      }
    });
  } catch (error) {
    console.error('NGO Signup Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;