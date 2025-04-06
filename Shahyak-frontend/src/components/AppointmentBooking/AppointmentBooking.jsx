import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppointmentService } from '../../services/appointmentService';
import './AppointmentBooking.css';

const AppointmentBooking = ({ doctor, onClose, onSuccess }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!date || !doctor._id) return;

    const fetchAvailableSlots = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await AppointmentService.getAvailableTimeSlots(doctor._id, date);
        setAvailableSlots(response.availableSlots);
      } catch (err) {
        console.error('Error fetching available slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date, doctor._id]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('You must be logged in to book an appointment');
      return;
    }

    if (!date || !selectedSlot || !reason.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const appointmentData = {
        doctorId: doctor._id,
        date,
        timeSlot: selectedSlot,
        reason: reason.trim()
      };

      await AppointmentService.createAppointment(appointmentData);
      setSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after successful submission
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 3000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format time for display (e.g., "09:00" to "9:00 AM")
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (success) {
    return (
      <div className="appointment-booking-container">
        <div className="appointment-success">
          <h2>Appointment Booked!</h2>
          <p>Your appointment with {doctor.name} has been scheduled successfully.</p>
          <p>Date: {new Date(date).toLocaleDateString()}</p>
          <p>Time: {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</p>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-booking-container">
      <div className="appointment-booking-header">
        <h2>Schedule an Appointment</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {!isAuthenticated ? (
        <div className="login-required">
          <p>Please log in to book an appointment</p>
          <a href="/login" className="login-btn">Log In</a>
        </div>
      ) : (
        <form className="appointment-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              min={today}
              required
            />
          </div>

          {date && (
            <div className="form-group">
              <label>Select Time Slot:</label>
              {loading ? (
                <p>Loading available slots...</p>
              ) : availableSlots.length > 0 ? (
                <div className="time-slots">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`time-slot ${selectedSlot && selectedSlot.start === slot.start ? 'selected' : ''}`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No available slots for this date. Please select another date.</p>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reason">Reason for Visit:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please briefly describe your symptoms or reason for the appointment"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="book-btn"
            disabled={loading || !date || !selectedSlot || !reason.trim()}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AppointmentBooking;