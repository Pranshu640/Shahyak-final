import { useState, useRef, useEffect } from 'react'
import './App1.css'
import './animations.css'
import MultiStepForm from '../components/AI/MultiStepForm'
import '../components/AI/components.css'
import '../components/AI/AudioPlayer.css'
import ChatHistory from '../components/AI/ChatHistory'
import AudioPlayer from '../components/AI/AudioPlayer'
import NavBar from '../components/Navbar/NavBar'
import Squares from '../components/squares/Squares'

function AIConsulatationPage() {
  const [patientInfo, setPatientInfo] = useState({
    common_conditions: [],
    other_condition: '',
    issue_type: '',
    specific_issue: '',
    age: '',
    gender: '',
    text_query: ''
  })
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [doctorResponse, setDoctorResponse] = useState('')
  const [audioData, setAudioData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPatientInfo({
      ...patientInfo,
      [name]: value
    })
  }

  // Handle checkbox changes for common conditions
  const handleConditionChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setPatientInfo({
        ...patientInfo,
        common_conditions: [...patientInfo.common_conditions, value]
      })
    } else {
      setPatientInfo({
        ...patientInfo,
        common_conditions: patientInfo.common_conditions.filter(condition => condition !== value)
      })
    }
  }

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  // Transcribe recorded audio
  const transcribeAudio = async (audioBlob) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.mp3')

      const response = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.transcript) {
        setTranscript(data.transcript)
      } else if (data.error) {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      alert('Failed to transcribe audio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Submit consultation
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setDoctorResponse('')
    setAudioData('')

    try {
      const formData = new FormData()
      
      // Add patient info
      formData.append('patientInfo', JSON.stringify(patientInfo))
      
      // Add query (either from text input or transcript)
      if (transcript) {
        formData.append('query', transcript)
      } else if (patientInfo.text_query) {
        formData.append('query', patientInfo.text_query)
      }
      
      // Add image if selected
      if (selectedImage) {
        // Ensure the image is properly named with an extension for the backend to process
        const imageWithExtension = new File(
          [selectedImage], 
          selectedImage.name || 'image.jpg', 
          { type: selectedImage.type || 'image/jpeg' }
        );
        formData.append('image', imageWithExtension);
      }
      
      // Add audio recording if available
      if (audioChunksRef.current && audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        formData.append('audio', audioBlob, 'recording.mp3');
      }

      const response = await fetch('http://localhost:8000/api/consultation', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.error) {
        alert(`Error: ${data.error}`)
        return
      }

      // Set doctor response immediately
      setDoctorResponse(data.doctor_response)
      
      // Check if audio is pending
      if (data.audio_pending) {
        // Poll for audio completion
        const pollAudio = async () => {
          try {
            const audioResponse = await fetch('http://localhost:8000/api/consultation', {
              method: 'POST',
              body: formData
            })
            const audioData = await audioResponse.json()
            
            if (!audioData.audio_pending && audioData.audio_data) {
              const audioDataUrl = `data:audio/mp3;base64,${audioData.audio_data}`;
              setAudioData(audioDataUrl);
              return true;
            } else if (audioData.audio_error) {
              console.error('Audio generation failed:', audioData.audio_error);
              return true;
            }
            return false;
          } catch (error) {
            console.error('Error polling for audio:', error);
            return true;
          }
        };

        // Poll every 1 second until audio is ready
        const pollInterval = setInterval(async () => {
          const shouldStop = await pollAudio();
          if (shouldStop) {
            clearInterval(pollInterval);
          }
        }, 1000);
      } else if (data.audio_data) {
        const audioDataUrl = `data:audio/mp3;base64,${data.audio_data}`;
        setAudioData(audioDataUrl);
        
        // Scroll to response section
        setTimeout(() => {
          const responseSection = document.querySelector('.response-section')
          if (responseSection) {
            responseSection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        
        // We're now using the AudioPlayer component which handles the audio element internally
        // No need to set up the audio element here anymore
        // The AudioPlayer component will handle playback, events, and UI
      }
    } catch (error) {
      console.error('Error submitting consultation:', error)
      alert('Failed to submit consultation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Check server health
  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health')
      const data = await response.json()
      alert(`Server status: ${data.status}`)
    } catch (error) {
      console.error('Error checking server health:', error)
      alert('Server is not responding. Please make sure the backend is running.')
    }
  }

  // Animation delay for staggered elements
  const [showContent, setShowContent] = useState(false)
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowContent(true)
  }, [])

  return (
    <div className="app-container">
      <Squares 
speed={0.5} 
squareSize={40}
direction='diagonal' // up, down, left, right, diagonal
borderColor='#fff'
hoverFillColor='#222'
/>
      <NavBar/>
      <header className={showContent ? 'fade-in' : ''}>
        <h1 className="slide-in-top">AI Consultation</h1>
        <button onClick={checkServerHealth} className="health-check-btn pulse">
          <span className="icon">✓</span> Check Server Status
        </button>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <MultiStepForm 
            patientInfo={patientInfo}
            handleInputChange={handleInputChange}
            handleConditionChange={handleConditionChange}
            handleImageChange={handleImageChange}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            transcript={transcript}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            isAudioPlaying={isAudioPlaying}
          />
        </form>

        {doctorResponse && (
          <section className="response-section slide-in-bottom">
            <h2><span className="icon">👨‍⚕️</span> Doctor's Response</h2>
            <div className="response-container">
              <div className="doctor-response fade-in">
                <div className="response-text">{doctorResponse}</div>
                <div className="text-highlight-indicator"></div>
              </div>
              {audioData && (
                <AudioPlayer 
                  audioSrc={audioData}
                  onPlay={() => {
                    const responseContainer = document.querySelector('.doctor-response');
                    if (responseContainer) {
                      responseContainer.classList.add('playing');
                    }
                    setIsAudioPlaying(true);
                  }}
                  onPause={() => {
                    const responseContainer = document.querySelector('.doctor-response');
                    if (responseContainer) {
                      responseContainer.classList.remove('playing');
                    }
                    setIsAudioPlaying(false);
                  }}
                  onEnded={() => {
                    const responseContainer = document.querySelector('.doctor-response');
                    if (responseContainer) {
                      responseContainer.classList.remove('playing');
                    }
                    setIsAudioPlaying(false);
                  }}
                  doctorResponse={doctorResponse}
                />
              )}
            </div>
          </section>
        )}
      </main>
        <ChatHistory/>
      <footer className={showContent ? 'fade-in' : ''}>
        <p>© 2025 AI Medical Consultation App - For Educational Purposes Only</p>
        <div className="footer-decoration"></div>
      </footer>
    </div>
  )
}

export default AIConsulatationPage
