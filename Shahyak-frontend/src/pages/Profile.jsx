import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DoctorAppointments from '../components/DoctorAppointments/DoctorAppointments';
import PatientAppointments from '../components/PatientAppointments/PatientAppointments';
import './Profile.css';

const Profile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch profile data based on user role
        const response = await fetch(
          `http://localhost:5001/api/profiles/${currentUser.role.toLowerCase()}/${currentUser._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data');
        }

        // Set profile data based on user role
        if (currentUser.role === 'Doctor') {
          setProfileData(data.doctor);
        } else if (currentUser.role === 'Client') {
          setProfileData(data.client);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, isAuthenticated, navigate]);

  // Render doctor profile
  const renderDoctorProfile = () => {
    return (
      <div className="profile-content">
        <div className="profile-header">
          <h2>{profileData.name}</h2>
          <p className="profile-subtitle">{profileData.specialization}</p>
          <p className="profile-experience">{profileData.experience} years of experience</p>
        </div>

        <div className="profile-section">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phoneNumber}</p>
        </div>

        <div className="profile-section">
          <h3>Office Location</h3>
          <p>{profileData.officeLocation?.address}</p>
          <p>{profileData.officeLocation?.city}, {profileData.officeLocation?.state} {profileData.officeLocation?.zipCode}</p>
        </div>

        <div className="profile-section">
          <h3>Working Hours</h3>
          <div className="working-hours">
            {Object.entries(profileData.workingHours || {}).map(([day, hours]) => (
              hours.start && hours.end ? (
                <div key={day} className="working-day">
                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                  <span className="hours">{hours.start} - {hours.end}</span>
                </div>
              ) : null
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>About Me</h3>
          <p>{profileData.bio || 'No bio available'}</p>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          {profileData.education && profileData.education.length > 0 ? (
            <ul className="education-list">
              {profileData.education.map((edu, index) => (
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

        <div className="profile-section">
          <h3>Certifications</h3>
          {profileData.certifications && profileData.certifications.length > 0 ? (
            <ul className="certification-list">
              {profileData.certifications.map((cert, index) => (
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

        <div className="profile-section">
          <h3>Languages</h3>
          {profileData.languages && profileData.languages.length > 0 ? (
            <div className="languages-list">
              {profileData.languages.map((language, index) => (
                <span key={index} className="language-tag">{language}</span>
              ))}
            </div>
          ) : (
            <p>No language information available</p>
          )}
        </div>

        <div className="profile-section">
          <h3>Consultation Fee</h3>
          <p>${profileData.consultationFee || 'Not specified'}</p>
        </div>

        <div className="profile-actions">
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
        
        <div className="profile-section appointments-section">
          <h3>My Appointments</h3>
          <DoctorAppointments />
        </div>
      </div>
    );
  };

  // Render client profile
  const renderClientProfile = () => {
    return (
      <div className="profile-content">
        <div className="profile-header">
          <h2>{profileData.name}</h2>
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phoneNumber || 'Not provided'}</p>
          <p><strong>Gender:</strong> {profileData.gender || 'Not provided'}</p>
          <p><strong>Date of Birth:</strong> {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
          <p><strong>Address:</strong> {profileData.address || 'Not provided'}</p>
        </div>

        <div className="profile-section">
          <h3>Medical Information</h3>
          <div className="medical-info">
            <h4>Medical History</h4>
            {profileData.medicalHistory && profileData.medicalHistory.length > 0 ? (
              <ul>
                {profileData.medicalHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No medical history recorded</p>
            )}
          </div>

          <div className="medical-info">
            <h4>Allergies</h4>
            {profileData.allergies && profileData.allergies.length > 0 ? (
              <ul>
                {profileData.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            ) : (
              <p>No allergies recorded</p>
            )}
          </div>

          <div className="medical-info">
            <h4>Current Medications</h4>
            {profileData.currentMedications && profileData.currentMedications.length > 0 ? (
              <ul>
                {profileData.currentMedications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
            ) : (
              <p>No current medications recorded</p>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-profile-btn">Edit Profile</button>
          <button className="find-doctor-btn" onClick={() => navigate('/doctors')}>Find a Doctor</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
        <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {profileData && (
        <>
          {currentUser.role === 'Doctor' ? renderDoctorProfile() : renderClientProfile()}
        </>
      )}
    </div>
  );
};

export default Profile;