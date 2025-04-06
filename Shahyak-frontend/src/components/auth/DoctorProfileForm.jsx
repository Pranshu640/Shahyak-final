import React, { useState } from 'react';
import './DoctorProfileForm.css';

const DoctorProfileForm = ({ formData, onChange, errors = {} }) => {
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });

  const handleWorkingDayChange = (day) => {
    setWorkingDays(prev => {
      const newWorkingDays = { ...prev, [day]: !prev[day] };
      
      // Update the formData with the new working hours
      const updatedWorkingHours = { ...formData.workingHours };
      if (!newWorkingDays[day]) {
        // If day is unchecked, remove the hours
        delete updatedWorkingHours[day];
      } else if (!updatedWorkingHours[day]) {
        // If day is checked and no hours set, add default hours
        updatedWorkingHours[day] = { start: '09:00', end: '17:00' };
      }
      
      onChange({
        target: {
          name: 'workingHours',
          value: updatedWorkingHours
        }
      });
      
      return newWorkingDays;
    });
  };

  const handleWorkingHoursChange = (day, field, value) => {
    const updatedWorkingHours = { ...formData.workingHours };
    if (!updatedWorkingHours[day]) {
      updatedWorkingHours[day] = { start: '09:00', end: '17:00' };
    }
    updatedWorkingHours[day][field] = value;
    
    onChange({
      target: {
        name: 'workingHours',
        value: updatedWorkingHours
      }
    });
  };

  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = value;
    
    onChange({
      target: {
        name: 'qualifications',
        value: updatedQualifications
      }
    });
  };

  const addQualification = () => {
    onChange({
      target: {
        name: 'qualifications',
        value: [...formData.qualifications, '']
      }
    });
  };

  const removeQualification = (index) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications.splice(index, 1);
    
    onChange({
      target: {
        name: 'qualifications',
        value: updatedQualifications
      }
    });
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = value;
    
    onChange({
      target: {
        name: 'languages',
        value: updatedLanguages
      }
    });
  };

  const addLanguage = () => {
    onChange({
      target: {
        name: 'languages',
        value: [...formData.languages, '']
      }
    });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages.splice(index, 1);
    
    onChange({
      target: {
        name: 'languages',
        value: updatedLanguages
      }
    });
  };

  return (
    <div className="doctor-profile-form">
      <h2>Professional Information</h2>
      <p className="form-subtitle">Please provide your professional details to complete your doctor profile</p>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="specialization">Specialization*</label>
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization || ''}
            onChange={onChange}
            className={errors.specialization ? 'error' : ''}
          >
            <option value="">Select your specialization</option>
            <option value="General Physician">General Physician</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Ophthalmologist">Ophthalmologist</option>
            <option value="ENT Specialist">ENT Specialist</option>
            <option value="Dentist">Dentist</option>
            <option value="Other">Other</option>
          </select>
          {errors.specialization && <div className="error-message">{errors.specialization}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="experience">Years of Experience*</label>
          <input
            type="number"
            id="experience"
            name="experience"
            min="0"
            max="70"
            value={formData.experience || ''}
            onChange={onChange}
            className={errors.experience ? 'error' : ''}
          />
          {errors.experience && <div className="error-message">{errors.experience}</div>}
        </div>
      </div>

      <div className="form-section">
        <h3>Qualifications*</h3>
        {formData.qualifications && formData.qualifications.map((qualification, index) => (
          <div className="input-with-button" key={index}>
            <input
              type="text"
              value={qualification}
              onChange={(e) => handleQualificationChange(index, e.target.value)}
              placeholder="e.g., MBBS, MD, MS"
              className={errors.qualifications ? 'error' : ''}
            />
            {formData.qualifications.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeQualification(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          className="add-btn"
          onClick={addQualification}
        >
          <i className="fas fa-plus"></i> Add Qualification
        </button>
        {errors.qualifications && <div className="error-message">{errors.qualifications}</div>}
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="licenseNumber">Medical License Number*</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber || ''}
            onChange={onChange}
            placeholder="Enter your medical license number"
            className={errors.licenseNumber ? 'error' : ''}
          />
          {errors.licenseNumber && <div className="error-message">{errors.licenseNumber}</div>}
        </div>
      </div>

      <div className="form-section">
        <h3>Office Location*</h3>
        <div className="form-group">
          <label htmlFor="officeAddress">Address</label>
          <input
            type="text"
            id="officeAddress"
            name="officeLocation.address"
            value={formData.officeLocation?.address || ''}
            onChange={onChange}
            placeholder="Street address"
            className={errors['officeLocation.address'] ? 'error' : ''}
          />
          {errors['officeLocation.address'] && <div className="error-message">{errors['officeLocation.address']}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="officeCity">City</label>
            <input
              type="text"
              id="officeCity"
              name="officeLocation.city"
              value={formData.officeLocation?.city || ''}
              onChange={onChange}
              className={errors['officeLocation.city'] ? 'error' : ''}
            />
            {errors['officeLocation.city'] && <div className="error-message">{errors['officeLocation.city']}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="officeState">State</label>
            <input
              type="text"
              id="officeState"
              name="officeLocation.state"
              value={formData.officeLocation?.state || ''}
              onChange={onChange}
              className={errors['officeLocation.state'] ? 'error' : ''}
            />
            {errors['officeLocation.state'] && <div className="error-message">{errors['officeLocation.state']}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="officeZipCode">Zip Code</label>
            <input
              type="text"
              id="officeZipCode"
              name="officeLocation.zipCode"
              value={formData.officeLocation?.zipCode || ''}
              onChange={onChange}
              className={errors['officeLocation.zipCode'] ? 'error' : ''}
            />
            {errors['officeLocation.zipCode'] && <div className="error-message">{errors['officeLocation.zipCode']}</div>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Working Hours</h3>
        <div className="working-days">
          {Object.keys(workingDays).map((day) => (
            <div key={day} className="working-day-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={workingDays[day]}
                  onChange={() => handleWorkingDayChange(day)}
                />
                <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
              </label>
              
              {workingDays[day] && (
                <div className="working-hours">
                  <div className="time-input">
                    <label>From</label>
                    <input
                      type="time"
                      value={formData.workingHours?.[day]?.start || '09:00'}
                      onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                    />
                  </div>
                  <div className="time-input">
                    <label>To</label>
                    <input
                      type="time"
                      value={formData.workingHours?.[day]?.end || '17:00'}
                      onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number*</label>
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
          <label htmlFor="consultationFee">Consultation Fee (₹)</label>
          <input
            type="number"
            id="consultationFee"
            name="consultationFee"
            min="0"
            value={formData.consultationFee || ''}
            onChange={onChange}
            placeholder="Enter your consultation fee"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="bio">Professional Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={onChange}
            placeholder="Tell patients about your professional background, approach, and expertise"
            rows="4"
          ></textarea>
        </div>
      </div>

      <div className="form-section">
        <h3>Languages Spoken</h3>
        {formData.languages && formData.languages.map((language, index) => (
          <div className="input-with-button" key={index}>
            <input
              type="text"
              value={language}
              onChange={(e) => handleLanguageChange(index, e.target.value)}
              placeholder="e.g., English, Hindi, Spanish"
            />
            {formData.languages.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeLanguage(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          className="add-btn"
          onClick={addLanguage}
        >
          <i className="fas fa-plus"></i> Add Language
        </button>
      </div>

      <div className="form-section">
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="acceptingNewPatients"
              checked={formData.acceptingNewPatients || false}
              onChange={(e) => onChange({
                target: {
                  name: 'acceptingNewPatients',
                  value: e.target.checked
                }
              })}
            />
            <span>I am currently accepting new patients</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileForm;