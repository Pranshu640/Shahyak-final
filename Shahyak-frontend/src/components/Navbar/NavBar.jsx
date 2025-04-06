import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">SHAHYAK</Link>
        </div>
        <div className={`navbar-center ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/Doctors" className="navbar-link">Doctors</Link>
            </li>
            <li className="navbar-item">
              <Link to="/Doctor-map" className="navbar-link">Regional</Link>
            </li>
            <li className="navbar-item">
              <Link to="/test" className="navbar-link">Consultation</Link>
            </li>
            <li className="navbar-item">
              <Link to="/events" className="navbar-link">Camps</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-buttons">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="navbar-button profile">Profile</Link>
              <button onClick={handleLogout} className="navbar-button logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button login">Login</Link>
              <Link to="/signup" className="navbar-button signup">Sign Up</Link>
              <Link to="/NGOsignup" className="navbar-button signup ngo">Organization Sign Up</Link>
            </>
          )}
        </div>
        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;