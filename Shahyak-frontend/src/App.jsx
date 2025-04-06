import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Import pages
import Landing from './pages/Landing'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AIConsulatationPage from './pages/AIConsultationPage'
import Profile from './pages/Profile'
import DoctorListing from './pages/DoctorListing'
import DoctorProfile from './pages/DoctorProfile'
import DoctorMapPage from './pages/DoctorMapPage'
import AppointmentBooking from './pages/AppointmentBooking'
import NGOSignup from './pages/NGOSignup'
import MedicalCampsListing from './pages/MedicalCampsListing'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<AIConsulatationPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctors" element={<DoctorListing />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/doctor-map" element={<DoctorMapPage />} />
          <Route path="/book-appointment/:doctorId" element={<AppointmentBooking />} />
          <Route path="/NGOsignup" element={<NGOSignup />} />
          <Route path="/events" element={<MedicalCampsListing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
