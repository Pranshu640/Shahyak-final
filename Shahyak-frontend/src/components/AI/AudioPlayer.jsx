import { useState, useEffect, useRef } from 'react';
import './AudioWaveform.css';
import './animations.css';
import './AudioPlayer.css';

const AudioPlayer = ({ audioSrc, onPlay, onPause, onEnded, doctorResponse }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const waveformBars = Array.from({ length: 40 }, (_, i) => i);
  
  // Initialize audio element and set up event listeners
  useEffect(() => {
    if (audioRef.current) {
      // Set up event listeners
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        updateProgressBar();
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (onEnded) onEnded();
      };
      
      // Add event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      // Clean up event listeners
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [onEnded]);
  
  // Update audio source when it changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.load();
    }
  }, [audioSrc]);
  
  // Play/pause toggle function
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      audio.play();
      setIsPlaying(true);
      if (onPlay) onPlay();
    }
  };
  
  // Update progress bar based on current time
  const updateProgressBar = () => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    progressBarRef.current.style.width = `${percent}%`;
  };
  
  // Handle click on progress bar to seek
  const handleProgressBarClick = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate active bar index based on current time
  const getActiveBarIndex = () => {
    if (!duration) return -1;
    const progressPercent = currentTime / duration;
    return Math.floor(progressPercent * waveformBars.length);
  };
  
  return (
    <div className="enhanced-audio-player slide-in-bottom">
      <div className="audio-player-header">
        <h4><span className="icon">🔊</span> Listen to Response</h4>
        <span className="audio-status">
          {isPlaying ? 'Playing audio' : 'Ready to play'}
        </span>
      </div>
      
      {/* Hidden native audio element */}
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        preload="metadata"
        className="native-audio-element"
      />
      
      {/* Custom audio waveform visualization */}
      <div className="audio-waveform-container enhanced">
        <div 
          className="audio-progress-bar-container"
          onClick={handleProgressBarClick}
        >
          <div className="audio-waveform-bars">
            {waveformBars.map((_, index) => {
              // Calculate height based on position (middle bars taller)
              const heightPercent = 40 + Math.sin((index / waveformBars.length) * Math.PI) * 60;
              const isActive = index <= getActiveBarIndex();
              
              return (
                <div 
                  key={index} 
                  className={`waveform-bar ${isActive ? 'active' : ''} ${isPlaying ? 'playing' : ''}`}
                  style={{
                    height: `${heightPercent}%`,
                    opacity: isActive ? 1 : 0.5
                  }}
                />
              );
            })}
          </div>
          <div 
            ref={progressBarRef} 
            className="audio-progress-overlay"
          />
        </div>
      </div>
      
      {/* Custom controls */}
      <div className="audio-controls">
        <div className="audio-time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="audio-control-buttons">
          <button 
            className={`play-pause-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                <rect x="14" y="4" width="4" height="16" fill="currentColor" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            )}
          </button>
          
          <div className="volume-control-container">
            <button 
              className="volume-btn"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              aria-label="Volume"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" fill="currentColor" />
                {volume > 0.5 && (
                  <path d="M14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z" fill="currentColor" />
                )}
              </svg>
            </button>
            
            {showVolumeControl && (
              <div className="volume-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume} 
                  onChange={handleVolumeChange} 
                  className="volume-slider"
                  aria-label="Volume level"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Text highlighting indicator */}
      {doctorResponse && (
        <div className="text-sync-indicator">
          <div className="sync-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" fill="currentColor" />
            </svg>
          </div>
          <span>Text highlighting synced with audio</span>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;