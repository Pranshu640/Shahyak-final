import { useState, useRef, useEffect } from 'react';
import './App1.css';
import './animations.css';

const CameraCapture = ({ onImageCapture }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
        
        // Ensure video plays when loaded
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.error('Error playing video:', e);
            setCameraError('Could not start video stream. Please try again.');
          });
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Could not access camera. Please check permissions.');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOpen(false);
    }
  };

  // Capture image from video stream
  const captureImage = () => {
    if (videoRef.current && isCameraOpen) {
      // Flash effect
      const flashElement = document.createElement('div');
      flashElement.className = 'camera-flash';
      videoRef.current.parentNode.appendChild(flashElement);
      
      // Remove flash after animation
      setTimeout(() => {
        if (flashElement.parentNode) {
          flashElement.parentNode.removeChild(flashElement);
        }
      }, 750);
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob for upload
      canvas.toBlob(blob => {
        if (blob) {
          const imageFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setCapturedImage(URL.createObjectURL(blob));
          onImageCapture(imageFile);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="camera-capture-container">
      {!isCameraOpen && !capturedImage && (
        <div className="camera-prompt">
          <button 
            type="button" 
            className="camera-btn pulse" 
            onClick={startCamera}
          >
            <span className="icon">📷</span> Open Camera
          </button>
          <p className="camera-instruction">Take a photo of the affected area for better diagnosis</p>
        </div>
      )}

      {cameraError && (
        <div className="camera-error slide-in-bottom">
          <p><span className="icon">⚠️</span> {cameraError}</p>
          <button 
            type="button" 
            className="retry-btn" 
            onClick={() => {
              setCameraError(null);
              startCamera();
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {  (
        <div className="camera-view slide-in-bottom">
          <div className="camera-frame-guide">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-video"
            />
            <div className="camera-overlay">
              <div className="camera-focus-area"></div>
            </div>
          </div>
          <div className="camera-controls">
            <button 
              type="button" 
              className="capture-btn pulse" 
              onClick={captureImage}
            >
              <span className="icon">📸</span> Take Photo
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={stopCamera}
            >
              <span className="icon">✖</span> Cancel
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="captured-image-container fade-in">
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <div className="image-controls">
            <button 
              type="button" 
              className="retake-btn" 
              onClick={() => {
                setCapturedImage(null);
                startCamera();
              }}
            >
              <span className="icon">🔄</span> Retake
            </button>
            <p className="image-success"><span className="icon">✓</span> Image ready for analysis</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;