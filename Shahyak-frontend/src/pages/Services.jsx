import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import SpotlightCard from '../components/spotlightcard/SpotlightCard';
import { FaHeartbeat, FaBell, FaUserMd, FaBrain, FaMobileAlt, FaChartLine, FaLock, FaClipboardCheck } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const [showHealthMonitoring, setShowHealthMonitoring] = useState(false);
  const [showMedication, setShowMedication] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  
  const healthMonitoringRef = useRef(null);
  const medicationRef = useRef(null);
  const consultationRef = useRef(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Health Monitoring section animation
      if (healthMonitoringRef.current) {
        const rect = healthMonitoringRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowHealthMonitoring(true);
        }
      }
      
      // Medication Management section animation
      if (medicationRef.current) {
        const rect = medicationRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowMedication(true);
        }
      }
      
      // Consultation section animation
      if (consultationRef.current) {
        const rect = consultationRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowConsultation(true);
        }
      }
      
      // Pricing section animation
      if (pricingRef.current) {
        const rect = pricingRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowPricing(true);
          // Add staggered animation to pricing cards
          const cards = document.querySelectorAll('.pricing-card');
          cards.forEach((card, index) => {
            const delay = index * 200;
            setTimeout(() => {
              card.classList.add('visible');
            }, delay);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <NavBar />
      <main className="services-container">
        <section className="services-hero">
          <h1 className="services-title">Our Services</h1>
          <p className="services-subtitle">Comprehensive healthcare solutions designed for your needs</p>
        </section>
        
        {/* Health Monitoring Section */}
        <section className="service-section" ref={healthMonitoringRef}>
          <h2 className={`section-heading ${showHealthMonitoring ? 'visible' : ''}`}>Health Monitoring</h2>
          <div className={`service-content ${showHealthMonitoring ? 'visible' : ''}`}>
            <div className="service-image">
              <div className="service-image-placeholder">
                <FaHeartbeat className="service-icon-large" />
              </div>
            </div>
            <div className="service-details">
              <p className="service-description">
                Our advanced health monitoring system tracks your vital signs and health metrics in real-time, providing you with valuable insights about your wellbeing.
              </p>
              <div className="service-features">
                <div className="feature-item">
                  <FaChartLine className="feature-icon" />
                  <div>
                    <h3>Real-time Tracking</h3>
                    <p>Monitor your heart rate, blood pressure, sleep patterns, and more in real-time</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaBrain className="feature-icon" />
                  <div>
                    <h3>AI Analysis</h3>
                    <p>Receive AI-powered insights and trend analysis of your health data</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaMobileAlt className="feature-icon" />
                  <div>
                    <h3>Device Integration</h3>
                    <p>Seamlessly connect with popular wearable devices and health monitors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Medication Management Section */}
        <section className="service-section alt-bg" ref={medicationRef}>
          <h2 className={`section-heading ${showMedication ? 'visible' : ''}`}>Medication Management</h2>
          <div className={`service-content reverse ${showMedication ? 'visible' : ''}`}>
            <div className="service-details">
              <p className="service-description">
                Never miss a dose again with our intelligent medication management system that helps you stay on track with your prescriptions.
              </p>
              <div className="service-features">
                <div className="feature-item">
                  <FaBell className="feature-icon" />
                  <div>
                    <h3>Smart Reminders</h3>
                    <p>Receive timely notifications for medication doses based on your schedule</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaClipboardCheck className="feature-icon" />
                  <div>
                    <h3>Adherence Tracking</h3>
                    <p>Track your medication adherence and identify patterns to improve compliance</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaLock className="feature-icon" />
                  <div>
                    <h3>Secure Prescription Storage</h3>
                    <p>Safely store your prescription information with end-to-end encryption</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="service-image">
              <div className="service-image-placeholder">
                <FaBell className="service-icon-large" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Professional Consultation Section */}
        <section className="service-section" ref={consultationRef}>
          <h2 className={`section-heading ${showConsultation ? 'visible' : ''}`}>Professional Consultation</h2>
          <div className={`service-content ${showConsultation ? 'visible' : ''}`}>
            <div className="service-image">
              <div className="service-image-placeholder">
                <FaUserMd className="service-icon-large" />
              </div>
            </div>
            <div className="service-details">
              <p className="service-description">
                Connect with healthcare professionals instantly for consultations, advice, and personalized guidance on your health concerns.
              </p>
              <div className="service-features">
                <div className="feature-item">
                  <FaUserMd className="feature-icon" />
                  <div>
                    <h3>On-demand Access</h3>
                    <p>Connect with doctors, nurses, and specialists when you need them most</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaMobileAlt className="feature-icon" />
                  <div>
                    <h3>Video Consultations</h3>
                    <p>Have face-to-face conversations with healthcare providers from anywhere</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaClipboardCheck className="feature-icon" />
                  <div>
                    <h3>Follow-up Care</h3>
                    <p>Receive personalized follow-up care and recommendations after consultations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="pricing-section" ref={pricingRef}>
          <h2 className={`section-heading ${showPricing ? 'visible' : ''}`}>Pricing Plans</h2>
          <p className={`pricing-intro ${showPricing ? 'visible' : ''}`}>Choose the plan that fits your healthcare needs</p>
          
          <div className="pricing-grid">
            <SpotlightCard className="pricing-card" spotlightColor="rgba(132, 0, 255, 0.14)">
              <h3 className="plan-name">Basic</h3>
              <p className="plan-price">$9.99<span>/month</span></p>
              <ul className="plan-features">
                <li>Health metrics tracking</li>
                <li>Basic medication reminders</li>
                <li>Limited health insights</li>
                <li>Email support</li>
              </ul>
              <a href="#" className="plan-button">Get Started</a>
            </SpotlightCard>
            
            <SpotlightCard className="pricing-card featured" spotlightColor="rgba(132, 0, 255, 0.14)">
              <div className="popular-tag">Most Popular</div>
              <h3 className="plan-name">Premium</h3>
              <p className="plan-price">$19.99<span>/month</span></p>
              <ul className="plan-features">
                <li>Advanced health monitoring</li>
                <li>Smart medication management</li>
                <li>Personalized AI insights</li>
                <li>2 professional consultations/month</li>
                <li>Priority support</li>
              </ul>
              <a href="#" className="plan-button featured">Get Started</a>
            </SpotlightCard>
            
            <SpotlightCard className="pricing-card" spotlightColor="rgba(132, 0, 255, 0.14)">
              <h3 className="plan-name">Family</h3>
              <p className="plan-price">$29.99<span>/month</span></p>
              <ul className="plan-features">
                <li>Up to 5 family members</li>
                <li>All Premium features</li>
                <li>Family health dashboard</li>
                <li>5 professional consultations/month</li>
                <li>24/7 emergency support</li>
              </ul>
              <a href="#" className="plan-button">Get Started</a>
            </SpotlightCard>
          </div>
          
          <div className={`pricing-cta ${showPricing ? 'visible' : ''}`}>
            <p>Need a custom solution for your organization?</p>
            <a href="/contact" className="cta-button cta-primary">Contact Us</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;