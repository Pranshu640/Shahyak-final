import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  
  const contactInfoRef = useRef(null);
  const contactFormRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Contact Info section animation
      if (contactInfoRef.current) {
        const rect = contactInfoRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowContactInfo(true);
        }
      }
      
      // Contact Form section animation
      if (contactFormRef.current) {
        const rect = contactFormRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowContactForm(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
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
    
    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, you would send this data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5001);
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
      <main className="contact-container">
        <section className="contact-hero">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">Have questions or feedback? We'd love to hear from you.</p>
        </section>
        
        <div className="contact-content">
          {/* Contact Form */}
          <section className="contact-form-section" ref={contactFormRef}>
            <div className={`contact-form-container ${showContactForm ? 'visible' : ''}`}>
              <h2>Send Us a Message</h2>
              
              {submitted && (
                <div className="form-success-message">
                  <FaCheck /> Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
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
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? 'error' : ''}
                  />
                  {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                
                <button type="submit" className="contact-submit-btn">Send Message</button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Contact;