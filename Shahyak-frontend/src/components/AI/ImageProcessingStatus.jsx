import { useState, useEffect } from 'react';
import './components.css';

const ImageProcessingStatus = ({ imageSelected, processingComplete, error }) => {
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info'); // 'info', 'success', 'error'

  useEffect(() => {
    if (!imageSelected) {
      setStatusMessage('No image selected');
      setStatusType('info');
    } else if (error) {
      setStatusMessage(`Error: ${error}`);
      setStatusType('error');
    } else if (processingComplete) {
      setStatusMessage('Image processed successfully');
      setStatusType('success');
    } else {
      setStatusMessage('Image ready for processing');
      setStatusType('info');
    }
  }, [imageSelected, processingComplete, error]);

  return (
    <div className={`image-processing-status ${statusType}`}>
      <div className="status-indicator">
        <div className={`status-dot ${statusType}`}></div>
        <span className="status-message">{statusMessage}</span>
      </div>
      
      {imageSelected && !error && !processingComplete && (
        <div className="processing-tips">
          <p>Tips:</p>
          <ul>
            <li>Make sure the image is clear and well-lit</li>
            <li>Center the affected area in the frame</li>
            <li>For best results, use natural lighting</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageProcessingStatus;