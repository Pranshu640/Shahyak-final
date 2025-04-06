import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { Doctor, Client } from '../models/User.js';

const router = express.Router();

// Get doctor profile
router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ doctor });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client profile - only accessible by the client themselves or doctors
router.get('/client/:id', authenticate, async (req, res) => {
  try {
    // Check if user is the client or a doctor
    if (req.user.role !== 'Doctor' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }
    
    const client = await Client.findById(req.params.id).select('-password');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ client });
  } catch (error) {
    console.error('Get client profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile
router.put('/doctor', authenticate, authorize('Doctor'), async (req, res) => {
  try {
    const {
      specialization,
      experience,
      qualifications,
      officeLocation,
      workingHours,
      phoneNumber,
      bio,
      acceptingNewPatients,
      languages,
      consultationFee,
      education,
      certifications
    } = req.body;
    
    // Find doctor and update
    const doctor = await Doctor.findById(req.user._id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Update fields if provided
    if (specialization) doctor.specialization = specialization;
    if (experience) doctor.experience = experience;
    if (qualifications) doctor.qualifications = qualifications;
    if (officeLocation) doctor.officeLocation = officeLocation;
    if (workingHours) doctor.workingHours = workingHours;
    if (phoneNumber) doctor.phoneNumber = phoneNumber;
    if (bio !== undefined) doctor.bio = bio;
    if (acceptingNewPatients !== undefined) doctor.acceptingNewPatients = acceptingNewPatients;
    if (languages) doctor.languages = languages;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (education) doctor.education = education;
    if (certifications) doctor.certifications = certifications;
    
    await doctor.save();
    
    // Return updated doctor without password
    const updatedDoctor = doctor.toObject();
    delete updatedDoctor.password;
    
    res.json({
      message: 'Doctor profile updated successfully',
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update client profile
router.put('/client', authenticate, authorize('Client'), async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      medicalHistory,
      allergies,
      currentMedications
    } = req.body;
    
    // Find client and update
    const client = await Client.findById(req.user._id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Update fields if provided
    if (dateOfBirth) client.dateOfBirth = dateOfBirth;
    if (gender) client.gender = gender;
    if (phoneNumber) client.phoneNumber = phoneNumber;
    if (address) client.address = address;
    if (medicalHistory) client.medicalHistory = medicalHistory;
    if (allergies) client.allergies = allergies;
    if (currentMedications) client.currentMedications = currentMedications;
    
    await client.save();
    
    // Return updated client without password
    const updatedClient = client.toObject();
    delete updatedClient.password;
    
    res.json({
      message: 'Client profile updated successfully',
      client: updatedClient
    });
  } catch (error) {
    console.error('Update client profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctors (for client to browse)
router.get('/doctors', async (req, res) => {
  try {
    const { specialization, acceptingNewPatients } = req.query;
    
    // Build query
    const query = {};
    if (specialization) query.specialization = specialization;
    if (acceptingNewPatients) query.acceptingNewPatients = acceptingNewPatients === 'true';
    
    const doctors = await Doctor.find(query)
      .select('-password -reviews')
      .sort({ 'ratings.average': -1 });
    
    res.json({ doctors });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;