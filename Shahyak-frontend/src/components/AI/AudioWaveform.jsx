import { useEffect, useState } from 'react';
import './animations.css';
import './AudioWaveform.css';

const AudioWaveform = ({ isRecording, isPlaying }) => {
  // Create an array of 20 elements for the waveform bars
  const bars = Array.from({ length: 20 }, (_, i) => i);
  const [activeBar, setActiveBar] = useState(0);

  // Animate bars when playing audio
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveBar(prev => (prev + 1) % bars.length);
      }, 150);
    } else {
      setActiveBar(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bars.length]);

  return (
    <div className="audio-waveform-container">
      <div className={`waveform ${isRecording ? 'recording' : ''} ${isPlaying ? 'playing' : ''}`}>
        {bars.map((_, index) => (
          <div 
            key={index} 
            className={`waveform-bar ${isPlaying && index === activeBar ? 'active' : ''}`}
            style={isRecording ? {
              animation: `wave 1s ease-in-out infinite ${index * 0.05}s`
            } : {}}
          />
        ))}
      </div>
      
      {isRecording && (
        <div className="recording-status">
          <span className="status-dot"></span>
          Recording...
        </div>
      )}

      {isPlaying && (
        <div className="playing-status">
          <span className="status-dot playing"></span>
          Playing audio...
        </div>
      )}
    </div>
  );
};

export default AudioWaveform;