import React, { useState, useEffect } from 'react';
import { AppointmentService } from '../../services/appointmentService';
import './PatientAppointments.css';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await AppointmentService.getClientAppointments();
      setAppointments(response.appointments);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await AppointmentService.updateAppointment(appointmentId, { status: 'cancelled' });
      // Update the local state to reflect the change
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return appointmentDate >= today && appointment.status !== 'cancelled' && appointment.status !== 'completed';
    } else if (activeTab === 'past') {
      return appointmentDate < today || appointment.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return appointment.status === 'cancelled';
    }
    return true;
  });

  // Sort appointments by date (most recent first for past, earliest first for upcoming)
  filteredAppointments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return activeTab === 'past' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="patient-appointments-container">
      <h2>My Appointments</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="appointment-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          <p>No {activeTab} appointments found.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map(appointment => (
            <div key={appointment._id} className={`appointment-card ${appointment.status}`}>
              <div className="appointment-header">
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                <span className="appointment-date">{formatDate(appointment.date)}</span>
              </div>
              
              <div className="appointment-details">
                <div className="doctor-info">
                  <h3>Doctor</h3>
                  <p><strong>Name:</strong> {appointment.doctor.name}</p>
                  <p><strong>Specialization:</strong> {appointment.doctor.specialization}</p>
                  <p><strong>Location:</strong> {appointment.doctor.officeLocation?.city}, {appointment.doctor.officeLocation?.state}</p>
                </div>
                
                <div className="appointment-info">
                  <h3>Appointment Details</h3>
                  <p><strong>Time:</strong> {formatTime(appointment.timeSlot.start)} - {formatTime(appointment.timeSlot.end)}</p>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                </div>
              </div>
              
              {activeTab === 'upcoming' && appointment.status !== 'cancelled' && (
                <div className="appointment-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;