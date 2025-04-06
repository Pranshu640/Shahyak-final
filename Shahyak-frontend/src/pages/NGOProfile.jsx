import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NGOService } from '../services/ngoService';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import './NGOProfile.css';

const NGOProfile = () => {
  const { id } = useParams();
  const [ngo, setNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Health Camp',
    maxParticipants: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNGODetails = async () => {
      try {
        const ngoData = await NGOService.getProfile(id);
        setNGO(ngoData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NGO details:', err);
        setError(err.message || 'Failed to load organization details');
        setLoading(false);
      }
    };

    if (id) {
      fetchNGODetails();
    } else {
      setError('Invalid organization ID');
      setLoading(false);
    }
  }, [id]);

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await NGOService.createEvent(id, eventForm);
      setShowEventModal(false);
      // Reset form
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Health Camp',
        maxParticipants: ''
      });
      // Refresh NGO data to show new event
      const updatedNGO = await NGOService.getProfile(id);
      setNGO(updatedNGO);
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ngo) return <div className="not-found">Organization not found</div>;

  return (
    <div className="app-container">
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <NavBar />
      <main className="ngo-profile-container">
        <section className="ngo-info">
          <h1>{ngo.name}</h1>
          <div className="ngo-type">{ngo.type}</div>
          <div className="ngo-details">
            <p><strong>Location:</strong> {ngo.location}</p>
            <p><strong>Contact:</strong> {ngo.phone}</p>
            {ngo.website && (
              <p>
                <strong>Website:</strong>
                <a href={ngo.website} target="_blank" rel="noopener noreferrer">
                  {ngo.website}
                </a>
              </p>
            )}
            <p className="ngo-description">{ngo.description}</p>
          </div>
        </section>

        <section className="ngo-events">
          <div className="events-header">
            <h2>Events</h2>
            <button
              className="create-event-btn"
              onClick={() => setShowEventModal(true)}
            >
              Create Event
            </button>
          </div>

          <div className="events-list">
            {ngo.events && ngo.events.length > 0 ? (
              ngo.events.map(event => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-details">
                    <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                    <span><strong>Time:</strong> {event.time}</span>
                    <span><strong>Location:</strong> {event.location}</span>
                    <span><strong>Type:</strong> {event.type}</span>
                    <span><strong>Available Spots:</strong> {event.maxParticipants}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-events">No events scheduled</p>
            )}
          </div>
        </section>

        {showEventModal && (
          <div className="modal-overlay">
            <div className="event-modal">
              <h2>Create New Event</h2>
              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Event Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={eventForm.time}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Event Type</label>
                  <select
                    id="type"
                    name="type"
                    value={eventForm.type}
                    onChange={handleEventFormChange}
                    required
                  >
                    <option value="Health Camp">Health Camp</option>
                    <option value="Medical Checkup">Medical Checkup</option>
                    <option value="Awareness Program">Awareness Program</option>
                    <option value="Blood Donation">Blood Donation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="maxParticipants">Maximum Participants</label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={eventForm.maxParticipants}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    Create Event
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NGOProfile;