import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';
import { Doctor } from '../models/User.js';

const router = express.Router();

// Create a new appointment (Client only)
router.post('/', authenticate, authorize('Client'), async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    // Validate required fields
    if (!doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Parse date string to Date object
    const appointmentDate = new Date(date);
    
    // Check if the appointment time is in the future
    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Check if the doctor is available at the requested time
    // 1. Get the day of the week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = daysOfWeek[appointmentDate.getDay()];
    
    // 2. Check if the doctor works on that day
    const doctorWorkingHours = doctor.workingHours[dayOfWeek];
    if (!doctorWorkingHours.start || !doctorWorkingHours.end) {
      return res.status(400).json({ message: `Doctor is not available on ${dayOfWeek}` });
    }
    
    // 3. Check if the requested time is within doctor's working hours
    if (timeSlot.start < doctorWorkingHours.start || timeSlot.end > doctorWorkingHours.end) {
      return res.status(400).json({ 
        message: `Doctor is only available from ${doctorWorkingHours.start} to ${doctorWorkingHours.end} on ${dayOfWeek}` 
      });
    }

    // 4. Check if the doctor already has an appointment at the requested time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      'timeSlot.start': timeSlot.start
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date: appointmentDate,
      timeSlot,
      reason
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment scheduled successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments for the logged-in client
router.get('/my-appointments', authenticate, authorize('Client'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization officeLocation')
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get client appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments for the logged-in doctor
router.get('/doctor-appointments', authenticate, authorize('Doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phoneNumber')
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/available-slots/:doctorId/:date', authenticate, async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Parse date string to Date object
    const appointmentDate = new Date(date);
    
    // Get the day of the week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = daysOfWeek[appointmentDate.getDay()];
    
    // Get doctor's working hours for that day
    const workingHours = doctor.workingHours[dayOfWeek];
    
    // If doctor doesn't work on that day, return empty slots
    if (!workingHours.start || !workingHours.end) {
      return res.json({ availableSlots: [] });
    }
    
    // Generate time slots (assuming 30-minute appointments)
    const slots = [];
    let currentTime = workingHours.start;
    
    while (currentTime < workingHours.end) {
      // Parse hours and minutes
      const [hours, minutes] = currentTime.split(':').map(Number);
      
      // Calculate end time (30 minutes later)
      let endHours = hours;
      let endMinutes = minutes + 30;
      
      if (endMinutes >= 60) {
        endHours += 1;
        endMinutes -= 60;
      }
      
      // Format end time
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Add slot to array
      slots.push({
        start: currentTime,
        end: endTime
      });
      
      // Move to next slot
      currentTime = endTime;
    }
    
    // Get booked appointments for that day
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      }
    }).select('timeSlot');
    
    // Filter out booked slots
    const bookedSlots = bookedAppointments.map(app => app.timeSlot.start);
    const availableSlots = slots.filter(slot => !bookedSlots.includes(slot.start));
    
    res.json({ availableSlots });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (both client and doctor can update)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to update this appointment
    const isDoctor = req.user.role === 'Doctor' && appointment.doctor.toString() === req.user._id.toString();
    const isPatient = req.user.role === 'Client' && appointment.patient.toString() === req.user._id.toString();
    
    if (!isDoctor && !isPatient) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    // Clients can only cancel appointments
    if (isPatient && status && status !== 'cancelled') {
      return res.status(403).json({ message: 'Clients can only cancel appointments' });
    }
    
    // Update appointment
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    
    await appointment.save();
    
    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;