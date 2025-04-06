import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorListing.css';
import Navbar from '../components/Navbar/NavBar';
import Squares from '../components/squares/Squares';

const DoctorListing = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    acceptingNewPatients: false,
  });
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/profiles/doctors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch doctors');
        }

        setDoctors(data.doctors);
        setFilteredDoctors(data.doctors);

        // Extract unique specializations for filter dropdown
        const uniqueSpecializations = [...new Set(data.doctors.map(doctor => doctor.specialization))];
        setSpecializations(uniqueSpecializations);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...doctors];

    // Filter by specialization
    if (filters.specialization) {
      result = result.filter(doctor => doctor.specialization === filters.specialization);
    }

    // Filter by accepting new patients
    if (filters.acceptingNewPatients) {
      result = result.filter(doctor => doctor.acceptingNewPatients);
    }

    setFilteredDoctors(result);
  }, [filters, doctors]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleViewProfile = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const renderDoctorCard = (doctor) => {
    return (
      <div key={doctor._id} className="doctor-card">
        <div className="doctor-card-header">
          <h3>{doctor.name}</h3>
          <p className="doctor-specialization">{doctor.specialization}</p>
        </div>
        
        <div className="doctor-card-body">
          <div className="doctor-info">
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            <p><strong>Location:</strong> {doctor.officeLocation?.city}, {doctor.officeLocation?.state}</p>
            <p><strong>Languages:</strong> {doctor.languages?.join(', ') || 'Not specified'}</p>
            <p><strong>Consultation Fee:</strong> ${doctor.consultationFee || 'Not specified'}</p>
          </div>
          
          <div className="doctor-rating">
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
        
        <div className="doctor-card-footer">
          <span className={`status-badge ${doctor.acceptingNewPatients ? 'accepting' : 'not-accepting'}`}>
            {doctor.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
          </span>
          <button 
            className="view-profile-btn" 
            onClick={() => handleViewProfile(doctor._id)}
          >
            View Profile
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="doctors-container">
        <div className="loading-spinner">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctors-container">
        <div className="error-message">{error}</div>
        <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
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
    <div className="doctors-container">
      
      <div className="doctors-header">
        <h1>Find a Doctor</h1>
        <p className="doctors-subtitle">Browse our network of qualified healthcare professionals</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="specialization">Specialization</label>
          <select 
            id="specialization" 
            name="specialization" 
            value={filters.specialization} 
            onChange={handleFilterChange}
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="filter-group checkbox">
          <input 
            type="checkbox" 
            id="acceptingNewPatients" 
            name="acceptingNewPatients" 
            checked={filters.acceptingNewPatients} 
            onChange={handleFilterChange}
          />
          <label htmlFor="acceptingNewPatients">Accepting New Patients</label>
        </div>
      </div>

      <div className="doctors-results">
        <p className="results-count">{filteredDoctors.length} doctors found</p>
        
        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => renderDoctorCard(doctor))
          ) : (
            <div className="no-results">
              <p>No doctors match your search criteria.</p>
              <button className="clear-filters-btn" onClick={() => setFilters({ specialization: '', acceptingNewPatients: false })}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorListing;