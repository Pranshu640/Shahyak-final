import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicalCampsListing.css';
import Navbar from '../components/Navbar/NavBar';
import Squares from '../components/squares/Squares';

const MedicalCampsListing = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    campType: '',
    freeServices: false,
  });
  const [campTypes, setCampTypes] = useState([]);

  // Fake data for medical camps
  const fakeCamps = [
    {
      _id: '1',
      name: 'Annual Health Checkup Camp',
      campType: 'General Checkup',
      organizer: 'City Health Department',
      date: '2025-04-15',
      time: '9:00 AM - 5:00 PM',
      location: {
        venue: 'Community Center',
        city: 'New Delhi',
        state: 'Delhi'
      },
      services: ['Blood Pressure', 'Blood Sugar', 'BMI', 'Eye Checkup'],
      freeServices: true,
      registrationRequired: true,
      contactInfo: '+91-98765-43210',
      ratings: {
        average: 4.5,
        count: 28
      }
    },
    {
      _id: '2',
      name: 'Diabetes Awareness Camp',
      campType: 'Diabetes',
      organizer: 'Diabetes Care Foundation',
      date: '2025-04-22',
      time: '10:00 AM - 3:00 PM',
      location: {
        venue: 'Public Hospital',
        city: 'New Delhi',
        state: 'Delhi'
      },
      services: ['Blood Sugar Testing', 'Nutrition Counseling', 'Free Medicines'],
      freeServices: true,
      registrationRequired: false,
      contactInfo: '+91-98765-12345',
      ratings: {
        average: 4.2,
        count: 15
      }
    },
    {
      _id: '3',
      name: 'Eye Care Camp',
      campType: 'Ophthalmology',
      organizer: 'Vision Care NGO',
      date: '2025-04-25',
      time: '9:00 AM - 4:00 PM',
      location: {
        venue: 'Govt. School Ground',
        city: 'New Delhi',
        state: 'Delhi'
      },
      services: ['Vision Testing', 'Cataract Screening', 'Free Spectacles'],
      freeServices: true,
      registrationRequired: true,
      contactInfo: '+91-99876-54321',
      ratings: {
        average: 4.7,
        count: 32
      }
    },
    {
      _id: '4',
      name: 'Womens Health Camp',
      campType: 'Gynecology',
      organizer: 'Womens Health Initiative',
      date: '2025-05-02',
      time: '10:00 AM - 4:00 PM',
      location: {
        venue: 'Private Hospital',
        city: 'New Delhi',
        state: 'Delhi'
      },
      services: ['Breast Cancer Screening', 'PAP Smear', 'Bone Density Test', 'Consultation'],
      freeServices: false,
      registrationRequired: true,
      contactInfo: '+91-88765-43210',
      ratings: {
        average: 4.4,
        count: 18
      }
    },
    {
      _id: '5',
      name: 'Dental Health Camp',
      campType: 'Dental',
      organizer: 'Smile Foundation',
      date: '2025-05-10',
      time: '9:00 AM - 3:00 PM',
      location: {
        venue: 'Community Hall',
        city: 'New Delhi',
        state: 'Delhi'
      },
      services: ['Dental Checkup', 'Cleaning', 'Fillings', 'Extraction'],
      freeServices: false,
      registrationRequired: false,
      contactInfo: '+91-77654-32109',
      ratings: {
        average: 4.1,
        count: 12
      }
    },
    {
      _id: '6',
      name: 'Child Vaccination Drive',
      campType: 'Pediatric',
      organizer: 'Child Care Association',
      date: '2025-05-15',
      time: '8:00 AM - 2:00 PM',
      location: {
        venue: 'Primary Health Center',
        city: 'New Delhi',
        state: 'Delhi'
      },
      services: ['Routine Vaccinations', 'Growth Monitoring', 'Nutrition Advice'],
      freeServices: true,
      registrationRequired: true,
      contactInfo: '+91-66543-21098',
      ratings: {
        average: 4.8,
        count: 35
      }
    }
  ];

  useEffect(() => {
    // Simulate fetching camps data
    const fetchCamps = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        // const response = await fetch('http://localhost:5001/api/medical-camps');
        // const data = await response.json();
        
        // Using fake data instead
        const data = { camps: fakeCamps };
        
        setCamps(data.camps);
        setFilteredCamps(data.camps);

        // Extract unique camp types for filter dropdown
        const uniqueCampTypes = [...new Set(data.camps.map(camp => camp.campType))];
        setCampTypes(uniqueCampTypes);
      } catch (err) {
        console.error('Error fetching medical camps:', err);
        setError('Failed to load medical camps. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...camps];

    // Filter by camp type
    if (filters.campType) {
      result = result.filter(camp => camp.campType === filters.campType);
    }

    // Filter by free services
    if (filters.freeServices) {
      result = result.filter(camp => camp.freeServices);
    }

    setFilteredCamps(result);
  }, [filters, camps]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleViewDetails = (campId) => {
    navigate(`/medical-camp/${campId}`);
  };

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderCampCard = (camp) => {
    return (
      <div key={camp._id} className="camp-card">
        <div className="camp-card-header">
          <h3>{camp.name}</h3>
          <p className="camp-type">{camp.campType}</p>
        </div>
        
        <div className="camp-card-body">
          <div className="camp-info">
            <p><strong>Date:</strong> {formatDate(camp.date)}</p>
            <p><strong>Time:</strong> {camp.time}</p>
            <p><strong>Location:</strong> {camp.location.venue}, {camp.location.city}</p>
            <p><strong>Services:</strong> {camp.services.join(', ')}</p>
            <p><strong>Organizer:</strong> {camp.organizer}</p>
          </div>
          
          <div className="camp-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(camp.ratings?.average || 0) ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
            </div>
            <p className="rating-text">{camp.ratings?.average?.toFixed(1) || 'No ratings'} ({camp.ratings?.count || 0} reviews)</p>
          </div>
        </div>
        
        <div className="camp-card-footer">
          <span className={`status-badge ${camp.freeServices ? 'free' : 'paid'}`}>
            {camp.freeServices ? 'Free Services' : 'Paid Services'}
          </span>
          <span className={`registration-badge ${camp.registrationRequired ? 'required' : 'not-required'}`}>
            {camp.registrationRequired ? 'Registration Required' : 'Walk-in Welcome'}
          </span>
          <button 
            className="view-details-btn" 
            onClick={() => handleViewDetails(camp._id)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="camps-container">
        <div className="loading-spinner">Loading medical camps...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="camps-container">
        <div className="error-message">{error}</div>
        <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <Squares 
        speed={0.5} 
        squareSize={40}
        direction='diagonal'
        borderColor='#fff'
        hoverFillColor='#222'
      />
      <div className="camps-container">
        
        <div className="camps-header">
          <h1>Nearby Medical Camps & Events</h1>
          <p className="camps-subtitle">Find and register for upcoming health camps in your area</p>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="campType">Camp Type</label>
            <select 
              id="campType" 
              name="campType" 
              value={filters.campType} 
              onChange={handleFilterChange}
            >
              <option value="">All Camp Types</option>
              {campTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group checkbox">
            <input 
              type="checkbox" 
              id="freeServices" 
              name="freeServices" 
              checked={filters.freeServices} 
              onChange={handleFilterChange}
            />
            <label htmlFor="freeServices">Free Services Only</label>
          </div>
        </div>

        <div className="camps-results">
          <p className="results-count">{filteredCamps.length} medical camps found</p>
          
          <div className="camps-grid">
            {filteredCamps.length > 0 ? (
              filteredCamps.map(camp => renderCampCard(camp))
            ) : (
              <div className="no-results">
                <p>No medical camps match your search criteria.</p>
                <button className="clear-filters-btn" onClick={() => setFilters({ campType: '', freeServices: false })}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalCampsListing;