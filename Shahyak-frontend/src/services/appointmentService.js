/**
 * Appointment Service for SHAHYAK
 * Handles all appointment-related API calls to the backend server
 */

const API_URL = 'http://localhost:5001/api';

export const AppointmentService = {
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
        credentials: 'include', // Include cookies for session management
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }
      
      return data;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  },
  
  // Get available time slots for a doctor on a specific date
  getAvailableTimeSlots: async (doctorId, date) => {
    try {
      const response = await fetch(`${API_URL}/appointments/available-slots/${doctorId}/${date}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get available time slots');
      }
      
      return data;
    } catch (error) {
      console.error('Get available time slots error:', error);
      throw error;
    }
  },
  
  // Get all appointments for the logged-in client
  getClientAppointments: async () => {
    try {
      const response = await fetch(`${API_URL}/appointments/my-appointments`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get appointments');
      }
      
      return data;
    } catch (error) {
      console.error('Get client appointments error:', error);
      throw error;
    }
  },
  
  // Get all appointments for the logged-in doctor
  getDoctorAppointments: async () => {
    try {
      const response = await fetch(`${API_URL}/appointments/doctor-appointments`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get appointments');
      }
      
      return data;
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      throw error;
    }
  },
  
  // Update appointment status
  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update appointment');
      }
      
      return data;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  },
};

export default AppointmentService;