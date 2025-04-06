import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import { useAuth } from '../context/AuthContext';
import { NGOService } from '../services/ngoService';
import './Auth.css';

const NGOSignup = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    type: 'NGO',
    location: '',
    phoneNumber: '',
    email: '',
    website: '',
    description: '',
    licenseNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();
  const { error: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      setSignupError(authError);
    }
  }, [authError]);

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
    
    // Clear general signup error
    if (signupError) {
      setSignupError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate organization name
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    // Validate location
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Validate website (optional)
    if (formData.website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Validate license number
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setSignupError('');
      
      try {
        const payload = {
          name: formData.organizationName,
          type: formData.type,
          location: formData.location,
          phone: formData.phoneNumber,
          email: formData.email,
          website: formData.website || undefined,
          description: formData.description,
          licenseNumber: formData.licenseNumber,
          password: formData.password
        };

        const response = await NGOService.register(payload);
        
        if (response.ngo) {
          // Store NGO data in local storage
          localStorage.setItem('ngoData', JSON.stringify(response.ngo));
          // Show success message
          alert('Registration successful! Please log in to continue.');
          // Redirect to login page
          navigate('/login');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0]?.msg ||
                          'Failed to create account. Please try again.';
        setSignupError(errorMessage);
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
          <h1>Organization Signup</h1>
          <p className="auth-subtitle">Register your organization with SHAHYAK</p>
          
          {signupError && (
            <div className="auth-error-message">{signupError}</div>
          )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="organizationName">Organization Name</label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className={errors.organizationName ? 'error' : ''}
            />
            {errors.organizationName && (
              <span className="error-message">{errors.organizationName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="type">Organization Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="NGO">NGO</option>
              <option value="Clinic">Clinic</option>
              <option value="Hospital">Hospital</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
            />
            {errors.location && (
              <span className="error-message">{errors.location}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
              placeholder="+1234567890"
            />
            {errors.phoneNumber && (
              <span className="error-message">{errors.phoneNumber}</span>
            )}
          </div>

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
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="website">Website (Optional)</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={errors.website ? 'error' : ''}
              placeholder="https://"
            />
            {errors.website && (
              <span className="error-message">{errors.website}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="4"
              placeholder="Tell us about your organization"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber">License Number</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className={errors.licenseNumber ? 'error' : ''}
              placeholder="Enter your organization's license number"
            />
            {errors.licenseNumber && (
              <span className="error-message">{errors.licenseNumber}</span>
            )}
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
              placeholder="Choose a secure password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </section>
    </main>
  </div>
  );
};

export default NGOSignup;