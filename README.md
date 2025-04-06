# SHAHYAK – AI Health Assistant

SHAHYAK is an intelligent and interactive healthcare platform that simulates real-time consultation experiences using AI, voice, vision, and text capabilities. It supports users in understanding their health conditions and connects them with professionals when needed.

## Key Features

### AI Consultation (Multi-Modal)
- Text Input: Users can describe their symptoms in a textbox.
- Voice Input: Speech is converted to text and analyzed.
- Image Upload: Upload symptom images, prescriptions, or reports.
- Camera Input: Capture live images for consultation.

### Smart AI Diagnosis
- Processes multimodal input using NLP and computer vision.
- Provides possible diagnoses and health suggestions.
- Recommends tests or home remedies.
- Alerts users if they should consult a human doctor.

### Live Voice-Based AI Call
- Real-time two-way voice conversation with the AI assistant.
- Mute/unmute controls.
- Realistic spoken responses using ElevenLabs.

### Professional & Doctor Features
- Doctor sign-up and profile management.
- Doctors can view user consultation history and session summaries.
- Interactive dashboard for doctors to stay connected with patients.

### NGO & Health Organization Portal
- NGOs can register, manage profiles, and post upcoming health-related events.
- Events such as blood donation camps, awareness programs, and free health checkups can be listed.
- Public /events page to view upcoming camps with locations and descriptions.

## Technology Stack

### Frontend
- React.js
- HTML/CSS/JS (Vanilla)
- Gradio (used earlier for prototyping)

### Backend
- Node.js (Doctor sign-up, MongoDB integration, NGO event management)
- Python Flask (AI consultation logic, image analysis, and health diagnosis)

### Database
- MongoDB for storing users, doctors, sessions, and event data

### AI & Tools
- OpenAI or Groq API for natural language processing
- ElevenLabs API for realistic voice responses
- Image analysis model (custom or pretrained)
- OpenStreetMap for location-based features

## Project Structure

- **/client**: Frontend React app
- **/server**: Node.js backend
- **/flask-backend**: Python AI engine

## How It Works

1. User signs up or logs in.
2. Enters symptoms via text, voice, or image.
3. AI provides an instant consultation summary.
4. Summary is stored in the user profile.
5. Doctors log in to monitor patient summaries.
6. NGOs manage and list healthcare events.

## Setup Instructions

### Prerequisites
- Node.js
- Python 3.x
- MongoDB instance (local or Atlas)

### 1. Frontend
```
cd client
npm install
npm start
```

### 2. Node.js Backend
```
cd server
npm install
node index.js
```

### 3. Flask Backend
```
cd flask-backend
pip install -r requirements.txt
python app.py
```

## Future Scope
- SMS/Email reminders for consultations
- Health record uploads
- Real doctor appointment bookings
- Integration with wearable health devices
- Medical record analytics for chronic patients

## Contribution
Feel free to fork this repo, suggest improvements, and open issues. Let's make digital health more accessible.

## License
MIT License

