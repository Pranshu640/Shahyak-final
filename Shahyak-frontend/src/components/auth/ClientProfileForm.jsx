import React from 'react';
import './ClientProfileForm.css';

const ClientProfileForm = ({ formData, onChange, errors = {} }) => {
  const handleMedicalHistoryChange = (index, value) => {
    const updatedMedicalHistory = [...formData.medicalHistory];
    updatedMedicalHistory[index] = value;
    
    onChange({
      target: {
        name: 'medicalHistory',
        value: updatedMedicalHistory
      }
    });
  };

  const addMedicalHistory = () => {
    onChange({
      target: {
        name: 'medicalHistory',
        value: [...formData.medicalHistory, '']
      }
    });
  };

  const removeMedicalHistory = (index) => {
    const updatedMedicalHistory = [...formData.medicalHistory];
    updatedMedicalHistory.splice(index, 1);
    
    onChange({
      target: {
        name: 'medicalHistory',
        value: updatedMedicalHistory
      }
    });
  };

  const handleAllergyChange = (index, value) => {
    const updatedAllergies = [...formData.allergies];
    updatedAllergies[index] = value;
    
    onChange({
      target: {
        name: 'allergies',
        value: updatedAllergies
      }
    });
  };

  const addAllergy = () => {
    onChange({
      target: {
        name: 'allergies',
        value: [...formData.allergies, '']
      }
    });
  };

  const removeAllergy = (index) => {
    const updatedAllergies = [...formData.allergies];
    updatedAllergies.splice(index, 1);
    
    onChange({
      target: {
        name: 'allergies',
        value: updatedAllergies
      }
    });
  };

  const handleMedicationChange = (index, value) => {
    const updatedMedications = [...formData.currentMedications];
    updatedMedications[index] = value;
    
    onChange({
      target: {
        name: 'currentMedications',
        value: updatedMedications
      }
    });
  };

  const addMedication = () => {
    onChange({
      target: {
        name: 'currentMedications',
        value: [...formData.currentMedications, '']
      }
    });
  };

  const removeMedication = (index) => {
    const updatedMedications = [...formData.currentMedications];
    updatedMedications.splice(index, 1);
    
    onChange({
      target: {
        name: 'currentMedications',
        value: updatedMedications
      }
    });
  };

  return (
    <div className="client-profile-form">
      <h2>Personal Information</h2>
      <p className="form-subtitle">Please provide your personal details to complete your profile</p>
      
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={onChange}
              className={errors.dateOfBirth ? 'error' : ''}
            />
            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ''}
              onChange={onChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <div className="error-message">{errors.gender}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={onChange}
            placeholder="Enter your contact number"
            className={errors.phoneNumber ? 'error' : ''}
          />
          {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={onChange}
            placeholder="Enter your full address"
            rows="3"
            className={errors.address ? 'error' : ''}
          ></textarea>
          {errors.address && <div className="error-message">{errors.address}</div>}
        </div>
      </div>

      <div className="form-section">
        <h3>Medical History</h3>
        <p className="section-description">List any significant medical conditions you have or had in the past</p>
        
        {formData.medicalHistory && formData.medicalHistory.map((condition, index) => (
          <div className="input-with-button" key={index}>
            <input
              type="text"
              value={condition}
              onChange={(e) => handleMedicalHistoryChange(index, e.target.value)}
              placeholder="e.g., Diabetes, Hypertension, Asthma"
            />
            {formData.medicalHistory.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeMedicalHistory(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          className="add-btn"
          onClick={addMedicalHistory}
        >
          <i className="fas fa-plus"></i> Add Medical Condition
        </button>
      </div>

      <div className="form-section">
        <h3>Allergies</h3>
        <p className="section-description">List any allergies you have</p>
        
        {formData.allergies && formData.allergies.map((allergy, index) => (
          <div className="input-with-button" key={index}>
            <input
              type="text"
              value={allergy}
              onChange={(e) => handleAllergyChange(index, e.target.value)}
              placeholder="e.g., Penicillin, Peanuts, Latex"
            />
            {formData.allergies.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeAllergy(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          className="add-btn"
          onClick={addAllergy}
        >
          <i className="fas fa-plus"></i> Add Allergy
        </button>
      </div>

      <div className="form-section">
        <h3>Current Medications</h3>
        <p className="section-description">List any medications you are currently taking</p>
        
        {formData.currentMedications && formData.currentMedications.map((medication, index) => (
          <div className="input-with-button" key={index}>
            <input
              type="text"
              value={medication}
              onChange={(e) => handleMedicationChange(index, e.target.value)}
              placeholder="e.g., Aspirin 81mg daily, Lisinopril 10mg daily"
            />
            {formData.currentMedications.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeMedication(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          className="add-btn"
          onClick={addMedication}
        >
          <i className="fas fa-plus"></i> Add Medication
        </button>
      </div>
    </div>
  );
};

export default ClientProfileForm;