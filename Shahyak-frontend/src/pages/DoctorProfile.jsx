import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DoctorProfile.css';
import Navbar from '../components/Navbar/NavBar';
import Squares from '../components/squares/Squares';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/profiles/doctor/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch doctor profile');
        }

        setDoctor(data.doctor);
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load doctor profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorProfile();
    }
  }, [id]);

  const handleBackToListing = () => {
    navigate('/doctors');
  };

  if (loading) {
    return (
      <div className="doctor-profile-container">
        <div className="loading-spinner">Loading doctor profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-profile-container">
        <div className="error-message">{error}</div>
        <button className="back-btn" onClick={handleBackToListing}>Back to Doctors</button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-container">
        <div className="error-message">Doctor not found</div>
        <button className="back-btn" onClick={handleBackToListing}>Back to Doctors</button>
      </div>
    );
  }

  return (<>
          <Navbar/>
      <Squares 
speed={0.5} 
squareSize={40}
direction='diagonal' // up, down, left, right, diagonal
borderColor='#fff'
hoverFillColor='#222'
/>
    <div className="doctor-profile-container">
      <button className="back-btn" onClick={handleBackToListing}>
        ← Back to Doctors
      </button>
      
      <div className="doctor-profile-content">
        <div className="doctor-profile-header">
          <h1>{doctor.name}</h1>
          <p className="doctor-profile-subtitle">{doctor.specialization}</p>
          <div className="doctor-rating-display">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(doctor.ratings?.average || 0) ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
            </div>
            <p className="rating-text">{doctor.ratings?.average?.toFixed(1) || 'No ratings'} ({doctor.ratings?.count || 0} reviews)</p>
          </div>
        </div>

        <div className="doctor-profile-section">
          <h2>About</h2>
          <p>{doctor.bio || 'No bio available'}</p>
        </div>

        <div className="doctor-profile-section">
          <h2>Specialization</h2>
          <p>{doctor.specialization}</p>
          <p><strong>Experience:</strong> {doctor.experience} years</p>
        </div>

        <div className="doctor-profile-section">
          <h2>Contact Information</h2>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
        </div>

        <div className="doctor-profile-section">
          <h2>Office Location</h2>
          <p>{doctor.officeLocation?.address}</p>
          <p>{doctor.officeLocation?.city}, {doctor.officeLocation?.state} {doctor.officeLocation?.zipCode}</p>
        </div>

        <div className="doctor-profile-section">
          <h2>Working Hours</h2>
          <div className="working-hours">
            {Object.entries(doctor.workingHours || {}).map(([day, hours]) => (
              hours.start && hours.end ? (
                <div key={day} className="working-day">
                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                  <span className="hours">{hours.start} - {hours.end}</span>
                </div>
              ) : null
            ))}
          </div>
        </div>

        <div className="doctor-profile-section">
          <h2>Education</h2>
          {doctor.education && doctor.education.length > 0 ? (
            <ul className="education-list">
              {doctor.education.map((edu, index) => (
                <li key={index}>
                  <p><strong>{edu.degree}</strong></p>
                  <p>{edu.institution}, {edu.year}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No education information available</p>
          )}
        </div>

        <div className="doctor-profile-section">
          <h2>Certifications</h2>
          {doctor.certifications && doctor.certifications.length > 0 ? (
            <ul className="certification-list">
              {doctor.certifications.map((cert, index) => (
                <li key={index}>
                  <p><strong>{cert.name}</strong></p>
                  <p>{cert.issuingOrganization}, {cert.year}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No certification information available</p>
          )}
        </div>

        <div className="doctor-profile-section">
          <h2>Languages</h2>
          {doctor.languages && doctor.languages.length > 0 ? (
            <div className="languages-list">
              {doctor.languages.map((language, index) => (
                <span key={index} className="language-tag">{language}</span>
              ))}
            </div>
          ) : (
            <p>No language information available</p>
          )}
        </div>

        <div className="doctor-profile-section">
          <h2>Consultation Fee</h2>
          <p>${doctor.consultationFee || 'Not specified'}</p>
        </div>

        <div className="doctor-profile-actions">
          <button 
            className="schedule-btn" 
            onClick={() => navigate(`/book-appointment/${doctor._id}`)}
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </div></>
  );
};

export default DoctorProfile;