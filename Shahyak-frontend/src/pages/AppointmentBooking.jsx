import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppointmentService } from '../services/appointmentService';
import NavBar from '../components/Navbar/NavBar';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Date, 2: Select Time, 3: Appointment Details

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Fetch doctor information
  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorProfile = async () => {
      try {
        setDoctorLoading(true);
        const response = await fetch(`http://localhost:5001/api/profiles/doctor/${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch doctor profile');
        }

        setDoctor(data.doctor);
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load doctor profile. Please try again later.');
      } finally {
        setDoctorLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!date || !doctorId) return;

    const fetchAvailableSlots = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await AppointmentService.getAvailableTimeSlots(doctorId, date);
        setAvailableSlots(response.availableSlots);
      } catch (err) {
        console.error('Error fetching available slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date, doctorId]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot(null); // Reset selected slot when date changes
    setStep(2); // Move to time slot selection
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(3); // Move to appointment details
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Save the current state and redirect to login
      sessionStorage.setItem('appointmentBookingState', JSON.stringify({
        doctorId,
        date,
        selectedSlot,
        reason
      }));
      navigate('/login?redirect=appointment-booking');
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
        doctorId: doctorId,
        date,
        timeSlot: selectedSlot,
        reason: reason.trim()
      };

      await AppointmentService.createAppointment(appointmentData);
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/profile');
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

  // Handle back button
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  if (doctorLoading) {
    return (
      <div className="page-container">
        <NavBar />
        <div className="appointment-page-container">
          <div className="loading-spinner">Loading doctor information...</div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page-container">
        <NavBar />
        <div className="appointment-page-container">
          <div className="error-message">Doctor not found</div>
          <button className="back-btn" onClick={() => navigate('/doctors')}>Back to Doctors</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-container">
        <NavBar />
        <div className="appointment-page-container">
          <div className="appointment-success">
            <h2>Appointment Booked!</h2>
            <p>Your appointment with {doctor.name} has been scheduled successfully.</p>
            <p>Date: {new Date(date).toLocaleDateString()}</p>
            <p>Time: {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</p>
            <button className="primary-btn" onClick={() => navigate('/profile')}>View My Appointments</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />
      <div className="appointment-page-container">
        <div className="appointment-page-header">
          <h1>Book an Appointment</h1>
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="appointment-doctor-info">
          <h2>{doctor.name}</h2>
          <p className="doctor-specialization">{doctor.specialization}</p>
          <p className="doctor-experience">{doctor.experience} years of experience</p>
          <p className="doctor-fee">Consultation Fee: ${doctor.consultationFee || 'Not specified'}</p>
        </div>

        <div className="appointment-booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Select Date</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Choose Time</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Confirm Details</div>
        </div>

        <div className="appointment-booking-form-container">
          {step === 1 && (
            <div className="appointment-step">
              <h3>Select a Date</h3>
              <div className="date-selection">
                <div className="calendar-container">
                  <input
                    type="date"
                    id="appointment-date"
                    value={date}
                    onChange={handleDateChange}
                    min={today}
                    required
                  />
                </div>
                <div className="date-instructions">
                  <p>Please select a date to see available time slots.</p>
                  <p>Dr. {doctor.name} is available on:</p>
                  <div className="working-hours">
                    {Object.entries(doctor.workingHours || {}).map(([day, hours]) => (
                      hours.start && hours.end ? (
                        <div key={day} className="working-day">
                          <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                          <span className="hours">{hours.start} - {hours.end}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="appointment-step">
              <div className="step-header">
                <button className="back-step-btn" onClick={handleBack}>← Back</button>
                <h3>Select a Time Slot</h3>
              </div>
              <p className="selected-date">Date: {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              {loading ? (
                <div className="loading-spinner">Loading available slots...</div>
              ) : availableSlots.length > 0 ? (
                <div className="time-slots-container">
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
                </div>
              ) : (
                <div className="no-slots-message">
                  <p>No available slots for this date.</p>
                  <p>Please select another date or check back later.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="appointment-step">
              <div className="step-header">
                <button className="back-step-btn" onClick={handleBack}>← Back</button>
                <h3>Appointment Details</h3>
              </div>
              
              <div className="appointment-summary">
                <h4>Appointment Summary</h4>
                <div className="summary-item">
                  <span>Doctor:</span>
                  <span>{doctor.name}</span>
                </div>
                <div className="summary-item">
                  <span>Specialization:</span>
                  <span>{doctor.specialization}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <span>{formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</span>
                </div>
                <div className="summary-item">
                  <span>Fee:</span>
                  <span>${doctor.consultationFee || 'Not specified'}</span>
                </div>
              </div>
              
              <form className="appointment-form" onSubmit={handleSubmit}>
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

                {!isAuthenticated && (
                  <div className="login-notice">
                    <p>You'll need to log in to complete your booking.</p>
                    <p>Your appointment details will be saved.</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="book-btn"
                  disabled={loading || !reason.trim()}
                >
                  {loading ? 'Processing...' : isAuthenticated ? 'Confirm Appointment' : 'Continue to Login'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;