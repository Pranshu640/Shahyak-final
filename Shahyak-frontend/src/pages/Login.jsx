import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login, currentUser, error: authError } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Set login error from auth context if available
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setLoginError('');
      
      try {
        // Use the login function from AuthContext
        await login(formData);
        // Navigation is handled by the useEffect that watches currentUser
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(error.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="app-container">
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <NavBar />
      <main className="container">
        <section className="auth-section">
          <h1>Login to SHAHYAK</h1>
          <p className="auth-subtitle">Access your AI Health Assistant</p>
          
          {loginError && (
            <div className="auth-error-message">
              {loginError}
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="auth-redirect">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;