import { useState } from 'react';
import AudioWaveform from './AudioWaveform';
import CameraCapture from './CameraCapture';
import ImageProcessingStatus from './ImageProcessingStatus';
import './App1.css';

const MultiStepForm = ({
  patientInfo,
  handleInputChange,
  handleConditionChange,
  handleImageChange,
  selectedImage,
  imagePreview,
  isRecording,
  startRecording,
  stopRecording,
  transcript,
  isLoading,
  handleSubmit,
  isAudioPlaying
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Move to next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  // Move to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle image capture from camera
  const handleCameraCapture = (imageFile) => {
    // Create a synthetic event object to reuse the existing handleImageChange function
    const syntheticEvent = {
      target: {
        files: [imageFile]
      }
    };
    handleImageChange(syntheticEvent);
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="step-indicators">
        <div 
          className={`step-indicator ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <span className="step-number">1</span>
          <span className="step-label">Patient Info</span>
        </div>
        <div className="step-connector"></div>
        <div 
          className={`step-indicator ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
          onClick={() => currentStep > 1 ? setCurrentStep(2) : null}
        >
          <span className="step-number">2</span>
          <span className="step-label">Consultation</span>
        </div>
      </div>
    );
  };

  // Step 1: Patient Information Form
  const renderPatientInfoForm = () => {
    return (
      <section className="patient-info-section slide-in-left">
        <h2><span className="icon">👤</span> Patient Information</h2>
        
        <div className="form-group">
          <label>Age:</label>
          <input 
            type="number" 
            name="age" 
            value={patientInfo.age} 
            onChange={handleInputChange} 
            min="0" 
            max="120"
          />
        </div>
        
        <div className="form-group">
          <label>Gender:</label>
          <select 
            name="gender" 
            value={patientInfo.gender} 
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Common Conditions:</label>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                value="fever" 
                checked={patientInfo.common_conditions.includes('fever')} 
                onChange={handleConditionChange} 
              />
              Fever
            </label>
            <label>
              <input 
                type="checkbox" 
                value="cough" 
                checked={patientInfo.common_conditions.includes('cough')} 
                onChange={handleConditionChange} 
              />
              Cough
            </label>
            <label>
              <input 
                type="checkbox" 
                value="headache" 
                checked={patientInfo.common_conditions.includes('headache')} 
                onChange={handleConditionChange} 
              />
              Headache
            </label>
            <label>
              <input 
                type="checkbox" 
                value="rash" 
                checked={patientInfo.common_conditions.includes('rash')} 
                onChange={handleConditionChange} 
              />
              Rash
            </label>
            <label>
              <input 
                type="checkbox" 
                value="pain" 
                checked={patientInfo.common_conditions.includes('pain')} 
                onChange={handleConditionChange} 
              />
              Pain
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Other Condition:</label>
          <input 
            type="text" 
            name="other_condition" 
            value={patientInfo.other_condition} 
            onChange={handleInputChange} 
            placeholder="Describe any other conditions"
          />
        </div>
        
        <div className="form-group">
          <label>Issue Type:</label>
          <select 
            name="issue_type" 
            value={patientInfo.issue_type} 
            onChange={handleInputChange}
          >
            <option value="">Select Issue Type</option>
            <option value="acute">Acute (Sudden)</option>
            <option value="chronic">Chronic (Long-term)</option>
            <option value="preventive">Preventive Care</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Specific Issue:</label>
          <textarea 
            name="specific_issue" 
            value={patientInfo.specific_issue} 
            onChange={handleInputChange} 
            placeholder="Describe your specific issue"
            rows="3"
          />
        </div>

        <div className="form-navigation">
          <button 
            type="button" 
            className="next-btn" 
            onClick={nextStep}
          >
            Next <span className="icon">→</span>
          </button>
        </div>
      </section>
    );
  };

  // Step 2: Consultation Form
  const renderConsultationForm = () => {
    return (
      <section className="consultation-section slide-in-right">
        <h2><span className="icon">💬</span> Consultation</h2>
        
        <div className="form-group">
          <label>Text Query:</label>
          <textarea 
            name="text_query" 
            value={patientInfo.text_query} 
            onChange={handleInputChange} 
            placeholder="Type your question for the doctor"
            rows="3"
          />
        </div>
        
        <div className="form-group voice-section">
          <label><span className="icon">🎤</span> Voice Input:</label>
          <div className="voice-controls">
            {!isRecording ? (
              <button 
                type="button" 
                onClick={startRecording} 
                className="record-btn"
                disabled={isLoading}
              >
                <span className="icon">●</span> Start Recording
              </button>
            ) : (
              <button 
                type="button" 
                onClick={stopRecording} 
                className="stop-btn recording-animation"
              >
                <span className="icon">■</span> Stop Recording
              </button>
            )}
          </div>
          
          {/* Audio waveform visualization */}
          <AudioWaveform isRecording={isRecording} isPlaying={isAudioPlaying} />
          
          {transcript && (
            <div className="transcript slide-in-bottom">
              <h4><span className="icon">📝</span> Transcript:</h4>
              <p>{transcript}</p>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label><span className="icon">🖼️</span> Upload Image:</label>
          <div className="file-input-container">
            <label className="file-input">
              <span className="file-input-text">Choose an image or drag it here</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                hidden
              />
            </label>
          </div>
          
          {/* Camera capture component */}
          <CameraCapture onImageCapture={handleCameraCapture} />
          
          {imagePreview && (
            <div className="image-preview fade-in">
              <img src={imagePreview} alt="Selected" className="pulse" />
              <div className="image-status">
                <span className="image-preview-caption">Image selected</span>
                <span className="processing-status">Ready for processing</span>
              </div>
              <ImageProcessingStatus 
                imageSelected={true} 
                processingComplete={false} 
                error={null} 
              />
            </div>
          )}
        </div>
        
        <div className="form-navigation">
          <button 
            type="button" 
            className="prev-btn" 
            onClick={prevStep}
          >
            <span className="icon">←</span> Back
          </button>
          
          <button 
            type="submit" 
            className={`submit-btn ${!isLoading ? 'pulse' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading"></span>
                Processing...
              </>
            ) : (
              <>
                <span className="icon">👨‍⚕️</span> Get Doctor's Consultation
              </>
            )}
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="multi-step-form">
      {renderStepIndicators()}
      
      {currentStep === 1 && renderPatientInfoForm()}
      {currentStep === 2 && renderConsultationForm()}
    </div>
  );
};

export default MultiStepForm;