# SHAHYAK - AI Health Assistant

SHAHYAK is an intelligent and interactive platform designed to simulate a real-time consultation experience with a virtual doctor. The assistant collects relevant health data through various input modes and provides personalized feedback, guidance, and recommendations based on the provided data.

## Features

### Multi-Modal Input System
- Text Input: Describe symptoms via a textbox
- Voice Input: Convert spoken symptoms to text
- Image Upload: Upload images of symptoms, prescriptions, or reports
- Camera Input: Capture real-time pictures of symptoms or conditions

### Smart AI Consultation
- Analyzes text, voice, and visual data using NLP and computer vision
- Provides preliminary diagnosis suggestions
- Recommends tests or home remedies
- Suggests when to consult a human doctor

### Live AI Call (Voice)
- Real-time voice consultation
- Mute/unmute toggle
- Real-time spoken responses

## Tech Stack

### Frontend
- ReactJS with Vite
- React Router for navigation
- CSS for styling
- React Icons for UI elements

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

#### Frontend
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

#### Backend
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the provided example
4. Start the server:
   ```
   npm run dev
   ```

## Usage

1. Register a new account or login with existing credentials
2. Navigate through the application using the navbar
3. Explore the different features:
   - Health monitoring
   - Smart reminders
   - Professional connect
   - AI insights

## Project Structure

```
├── public/             # Static files
├── server/             # Backend server
│   ├── server.js       # Express server setup
│   └── package.json    # Backend dependencies
└── src/                # Frontend source code
    ├── components/     # Reusable components
    ├── pages/          # Page components
    ├── assets/         # Images, fonts, etc.
    ├── App.jsx         # Main application component
    └── main.jsx        # Entry point
```

## Team

- FullStack Developer: Pranshu
- AI Developer: Moksh
- Design & UX: Pranshu
