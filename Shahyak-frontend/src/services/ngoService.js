/**
 * NGO Service for SHAHYAK
 * Handles all NGO-related API calls
 */

const API_URL = 'http://localhost:5001/api';

export const NGOService = {
  // Register a new NGO
  register: async (ngoData) => {
    try {
      const response = await fetch(`${API_URL}/ngo/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ngoData),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('NGO Registration error:', error);
      throw error;
    }
  },
  
  // Get NGO profile
  getProfile: async (id) => {
    try {
      const response = await fetch(`${API_URL}/ngo/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch NGO profile');
      }
      
      return data;
    } catch (error) {
      console.error('Get NGO profile error:', error);
      throw error;
    }
  },

  // Create event
  createEvent: async (ngoId, eventData) => {
    try {
      const response = await fetch(`${API_URL}/ngo/${ngoId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }
      
      return data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },
};