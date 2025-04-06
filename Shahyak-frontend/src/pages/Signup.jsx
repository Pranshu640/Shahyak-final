import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import { useAuth } from '../context/AuthContext';
import RoleSelector from '../components/auth/RoleSelector';
import DoctorProfileForm from '../components/auth/DoctorProfileForm';
import ClientProfileForm from '../components/auth/ClientProfileForm';
import './Auth.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('Client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Client',
    // Client specific fields
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
    medicalHistory: [''],
    allergies: [''],
    currentMedications: [''],
    // Doctor specific fields
    specialization: '',
    experience: '',
    qualifications: [''],
    licenseNumber: '',
    officeLocation: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    bio: '',
    acceptingNewPatients: true,
    languages: ['English'],
    consultationFee: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects like officeLocation
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate name
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      // Validate email
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
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
    } else if (step === 2) {
      // Role-specific validation
      if (selectedRole === 'Doctor') {
        // Validate doctor-specific fields
        if (!formData.specialization) {
          newErrors.specialization = 'Specialization is required';
        }
        
        if (!formData.experience) {
          newErrors.experience = 'Years of experience is required';
        }
        
        if (!formData.qualifications || !formData.qualifications[0]) {
          newErrors.qualifications = 'At least one qualification is required';
        }
        
        if (!formData.licenseNumber) {
          newErrors.licenseNumber = 'License number is required';
        }
        
        if (!formData.officeLocation?.address) {
          newErrors['officeLocation.address'] = 'Office address is required';
        }
        
        if (!formData.officeLocation?.city) {
          newErrors['officeLocation.city'] = 'City is required';
        }
        
        if (!formData.officeLocation?.state) {
          newErrors['officeLocation.state'] = 'State is required';
        }
        
        if (!formData.officeLocation?.zipCode) {
          newErrors['officeLocation.zipCode'] = 'Zip code is required';
        }
        
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        }
      }
      // Client validation can be added here if needed
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { signup, error: authError } = useAuth();
  
  // Set signup error from auth context if available
  useEffect(() => {
    if (authError) {
      setSignupError(authError);
    }
  }, [authError]);

  const nextStep = () => {
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setSignupError('');
      
      try {
        // Use the signup function from AuthContext to register the user with role-specific data
        await signup(formData);
        
        // User is now automatically logged in via AuthContext
        // Redirect to home page after successful registration
        navigate('/');
      } catch (error) {
        console.error('Signup error:', error);
        setSignupError(error.message || 'Registration failed. Please try again.');
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
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join our community for better healthcare</p>
          
          {signupError && (
            <div className="auth-error-message">{signupError}</div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <RoleSelector 
                  selectedRole={selectedRole} 
                  onRoleChange={handleRoleChange} 
                />
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
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
                  {errors.password && <div className="error-message">{errors.password}</div>}
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
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
                
                <div className="terms-privacy">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>
                
                <button 
                  type="button" 
                  className="auth-button"
                  onClick={nextStep}
                >
                  Next: Profile Information
                </button>
              </>
            )}
            
            {step === 2 && (
              <>
                {selectedRole === 'Doctor' ? (
                  <DoctorProfileForm 
                    formData={formData} 
                    onChange={handleChange} 
                    errors={errors} 
                  />
                ) : (
                  <ClientProfileForm 
                    formData={formData} 
                    onChange={handleChange} 
                    errors={errors} 
                  />
                )}
                
                <div className="form-navigation">
                  <button 
                    type="button" 
                    className="prev-btn"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className={`auth-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>
          
          <div className="auth-redirect">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signup;