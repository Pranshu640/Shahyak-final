/**
 * API Service for SHAHYAK
 * Handles all API calls to the backend server
 */

const API_URL = 'http://localhost:5001/api';

/**
 * Authentication Services
 */
export const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include', // Include cookies for session management
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store user in localStorage if returned from server
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Remove user from localStorage
      localStorage.removeItem('user');
      
      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove user from localStorage even if API call fails
      localStorage.removeItem('user');
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user');
      }
      
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },
  
  // Get user from localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

/**
 * Contact Services
 */
export const ContactService = {
  // Send contact form
  sendContactForm: async (formData) => {
    try {
      // This is a mock implementation since we don't have a real endpoint yet
      // In a real application, this would send the form data to the backend
      console.log('Sending contact form:', formData);
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Message sent successfully' });
        }, 1000);
      });
    } catch (error) {
      console.error('Send contact form error:', error);
      throw error;
    }
  },
};

/**
 * Health Services
 */
export const HealthService = {
  // Get health data
  getHealthData: async () => {
    try {
      // This is a mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            vitals: {
              heartRate: 75,
              bloodPressure: '120/80',
              temperature: 98.6,
            },
            medications: [
              { name: 'Medication A', dosage: '10mg', frequency: 'Daily' },
              { name: 'Medication B', dosage: '5mg', frequency: 'Twice daily' },
            ],
            appointments: [
              { doctor: 'Dr. Smith', date: '2023-06-15', time: '10:00 AM' },
              { doctor: 'Dr. Johnson', date: '2023-07-01', time: '2:30 PM' },
            ],
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Get health data error:', error);
      throw error;
    }
  },
};

export default {
  AuthService,
  ContactService,
  HealthService,
};