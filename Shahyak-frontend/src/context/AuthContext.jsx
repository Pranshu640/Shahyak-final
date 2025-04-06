import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);

    // Optionally verify token with backend
    const verifyToken = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        setCurrentUser(response.user);
      } catch (err) {
        // If token is invalid, clear localStorage
        localStorage.removeItem('user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      verifyToken();
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    setError('');
    try {
      const data = await AuthService.login(credentials);
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Signup function
  const signup = async (userData) => {
    setError('');
    try {
      const data = await AuthService.register(userData);
      
      // After successful registration, automatically log in the user
      if (data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    setError('');
    try {
      await AuthService.logout();
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};