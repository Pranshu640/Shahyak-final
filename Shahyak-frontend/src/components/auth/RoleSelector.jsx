import React from 'react';
import './RoleSelector.css';

const RoleSelector = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="role-selector">
      <h3>I am a:</h3>
      <div className="role-options">
        <div 
          className={`role-option ${selectedRole === 'Client' ? 'selected' : ''}`}
          onClick={() => onRoleChange('Client')}
        >
          <div className="role-icon client-icon">
            <i className="fas fa-user"></i>
          </div>
          <h4>Patient</h4>
          <p>I'm looking for medical consultation</p>
        </div>
        
        <div 
          className={`role-option ${selectedRole === 'Doctor' ? 'selected' : ''}`}
          onClick={() => onRoleChange('Doctor')}
        >
          <div className="role-icon doctor-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <h4>Doctor</h4>
          <p>I'm a healthcare professional</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;