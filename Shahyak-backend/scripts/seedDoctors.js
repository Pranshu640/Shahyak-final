import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Doctor } from '../models/User.js';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Dummy doctor data from the map
const dummyDoctors = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'password123', // Will be hashed by the pre-save hook
    role: 'Doctor',
    specialization: 'Cardiologist',
    experience: 15,
    qualifications: ['MBBS', 'MD - Cardiology', 'DM - Cardiology'],
    licenseNumber: 'MCI-12345',
    officeLocation: {
      address: '123 Heart Care Center, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543210',
    bio: 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1500, // ₹1500
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2000 },
      { degree: 'MD - Cardiology', institution: 'PGIMER Chandigarh', year: 2004 },
      { degree: 'DM - Cardiology', institution: 'SGPGI Lucknow', year: 2007 }
    ],
    certifications: [
      { name: 'Board Certified Cardiologist', issuingOrganization: 'Medical Council of India', year: 2008 },
      { name: 'Advanced Cardiac Life Support', issuingOrganization: 'American Heart Association', year: 2015 }
    ],
    // Additional map data
    latitude: 28.6129,
    longitude: 77.2295
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Dermatologist',
    experience: 10,
    qualifications: ['MBBS', 'MD - Dermatology'],
    licenseNumber: 'MCI-23456',
    officeLocation: {
      address: '456 Skin Clinic, Karol Bagh',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110005'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543211',
    bio: 'Specialized in cosmetic dermatology and skin disorders with a focus on holistic skin health.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Bengali'],
    consultationFee: 1200, // ₹1200
    education: [
      { degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 2005 },
      { degree: 'MD - Dermatology', institution: 'Lady Hardinge Medical College', year: 2010 }
    ],
    certifications: [
      { name: 'Certified Dermatologist', issuingOrganization: 'Indian Association of Dermatologists', year: 2011 },
      { name: 'Advanced Cosmetic Procedures', issuingOrganization: 'American Academy of Dermatology', year: 2016 }
    ],
    latitude: 28.6356,
    longitude: 77.2217
  },
  {
    name: 'Dr. Amit Patel',
    email: 'amit.patel@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Orthopedic Surgeon',
    experience: 12,
    qualifications: ['MBBS', 'MS - Orthopedics'],
    licenseNumber: 'MCI-34567',
    officeLocation: {
      address: '789 Bone & Joint Hospital, South Extension',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110049'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543212',
    bio: 'Specializing in joint replacements and sports injuries with a minimally invasive approach.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1800, // ₹1800
    education: [
      { degree: 'MBBS', institution: 'KEM Hospital Mumbai', year: 2003 },
      { degree: 'MS - Orthopedics', institution: 'AIIMS Delhi', year: 2008 }
    ],
    certifications: [
      { name: 'Fellowship in Joint Replacement', issuingOrganization: 'Royal College of Surgeons', year: 2010 },
      { name: 'Sports Medicine Certification', issuingOrganization: 'International Society of Arthroscopy', year: 2014 }
    ],
    latitude: 28.5921,
    longitude: 77.2264
  },
  {
    name: 'Dr. Sunita Gupta',
    email: 'sunita.gupta@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Pediatrician',
    experience: 8,
    qualifications: ['MBBS', 'MD - Pediatrics'],
    licenseNumber: 'MCI-45678',
    officeLocation: {
      address: '234 Child Care Center, Civil Lines',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110054'
    },
    workingHours: {
      monday: { start: '09:00', end: '16:00' },
      tuesday: { start: '09:00', end: '16:00' },
      wednesday: { start: '09:00', end: '16:00' },
      thursday: { start: '09:00', end: '16:00' },
      friday: { start: '09:00', end: '16:00' },
      saturday: { start: '10:00', end: '13:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543213',
    bio: 'Dedicated to providing comprehensive pediatric care with a focus on developmental health.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 1000, // ₹1000
    education: [
      { degree: 'MBBS', institution: 'Grant Medical College Mumbai', year: 2008 },
      { degree: 'MD - Pediatrics', institution: 'JIPMER Puducherry', year: 2012 }
    ],
    certifications: [
      { name: 'Pediatric Advanced Life Support', issuingOrganization: 'American Academy of Pediatrics', year: 2013 },
      { name: 'Child Development Specialist', issuingOrganization: 'Indian Academy of Pediatrics', year: 2015 }
    ],
    latitude: 28.6508,
    longitude: 77.2359
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Neurologist',
    experience: 14,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Neurology'],
    licenseNumber: 'MCI-56789',
    officeLocation: {
      address: '567 Brain & Nerve Clinic, Rajouri Garden',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110027'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543214',
    bio: 'Expert in neurological disorders with special interest in stroke management and neurorehabilitation.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 2000, // ₹2000
    education: [
      { degree: 'MBBS', institution: 'Christian Medical College Vellore', year: 2001 },
      { degree: 'MD - Medicine', institution: 'PGIMER Chandigarh', year: 2005 },
      { degree: 'DM - Neurology', institution: 'NIMHANS Bangalore', year: 2009 }
    ],
    certifications: [
      { name: 'Fellowship in Stroke Medicine', issuingOrganization: 'World Stroke Organization', year: 2010 },
      { name: 'Certification in Neurorehabilitation', issuingOrganization: 'International Neurological Society', year: 2012 }
    ],
    latitude: 28.6406,
    longitude: 77.1746
  },
  {
    name: 'Dr. Meera Reddy',
    email: 'meera.reddy@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Gynecologist',
    experience: 11,
    qualifications: ['MBBS', 'MS - Obstetrics & Gynecology'],
    licenseNumber: 'MCI-67890',
    officeLocation: {
      address: '890 Women\'s Health Center, Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201301'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543215',
    bio: 'Dedicated to women\'s health with expertise in high-risk pregnancies and gynecological surgeries.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
    consultationFee: 1500, // ₹1500
    education: [
      { degree: 'MBBS', institution: 'Madras Medical College', year: 2004 },
      { degree: 'MS - Obstetrics & Gynecology', institution: 'JIPMER Puducherry', year: 2009 }
    ],
    certifications: [
      { name: 'Fellowship in Reproductive Medicine', issuingOrganization: 'Federation of Obstetric and Gynecological Societies of India', year: 2011 },
      { name: 'Certification in Laparoscopic Surgery', issuingOrganization: 'World Association of Laparoscopic Surgeons', year: 2013 }
    ],
    latitude: 28.5983,
    longitude: 77.3055
  },
  {
    name: 'Dr. Arjun Malhotra',
    email: 'arjun.malhotra@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Cardiologist',
    experience: 16,
    qualifications: ['MBBS', 'MD - Cardiology', 'DNB - Cardiology'],
    licenseNumber: 'MCI-78901',
    officeLocation: {
      address: '321 Heart Institute, Nehru Place',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110019'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543216',
    bio: 'Specialized in interventional cardiology with extensive experience in complex cardiac procedures.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 2000, // ₹2000
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 1998 },
      { degree: 'MD - Cardiology', institution: 'PGIMER Chandigarh', year: 2002 },
      { degree: 'DNB - Cardiology', institution: 'National Board of Examinations', year: 2004 }
    ],
    certifications: [
      { name: 'Fellowship in Interventional Cardiology', issuingOrganization: 'American College of Cardiology', year: 2006 },
      { name: 'Advanced Cardiac Imaging', issuingOrganization: 'European Society of Cardiology', year: 2010 }
    ],
    latitude: 28.5622,
    longitude: 77.2332
  },
  {
    name: 'Dr. Neha Kapoor',
    email: 'neha.kapoor@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Psychiatrist',
    experience: 9,
    qualifications: ['MBBS', 'MD - Psychiatry'],
    licenseNumber: 'MCI-89012',
    officeLocation: {
      address: '654 Mind Wellness Clinic, Janakpuri',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110058'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543217',
    bio: 'Compassionate psychiatrist specializing in mood disorders, anxiety, and stress management.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Urdu'],
    consultationFee: 1800, // ₹1800
    education: [
      { degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 2007 },
      { degree: 'MD - Psychiatry', institution: 'NIMHANS Bangalore', year: 2012 }
    ],
    certifications: [
      { name: 'Cognitive Behavioral Therapy', issuingOrganization: 'Beck Institute for Cognitive Behavior Therapy', year: 2014 },
      { name: 'Certification in Addiction Psychiatry', issuingOrganization: 'Indian Psychiatric Society', year: 2016 }
    ],
    latitude: 28.6129,
    longitude: 77.1575
  },
  // East Delhi Doctors
  {
    name: 'Dr. Ananya Verma',
    email: 'ananya.verma@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Pediatrician',
    experience: 10,
    qualifications: ['MBBS', 'MD - Pediatrics'],
    licenseNumber: 'MCI-90123',
    officeLocation: {
      address: '123 Child Care Center, Mayur Vihar Phase 1',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110091'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543218',
    bio: 'Dedicated pediatrician with expertise in childhood development and preventive care.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Bengali'],
    consultationFee: 1200, // ₹1200
    education: [
      { degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 2006 },
      { degree: 'MD - Pediatrics', institution: 'AIIMS Delhi', year: 2010 }
    ],
    certifications: [
      { name: 'Pediatric Advanced Life Support', issuingOrganization: 'American Heart Association', year: 2012 },
      { name: 'Child Development Specialist', issuingOrganization: 'Indian Academy of Pediatrics', year: 2014 }
    ],
    latitude: 28.6073,
    longitude: 77.2937
  },
  {
    name: 'Dr. Rahul Mehta',
    email: 'rahul.mehta@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Orthopedic Surgeon',
    experience: 15,
    qualifications: ['MBBS', 'MS - Orthopedics'],
    licenseNumber: 'MCI-90124',
    officeLocation: {
      address: '456 Bone & Joint Clinic, Laxmi Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '10:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543219',
    bio: 'Experienced orthopedic surgeon specializing in joint replacements and sports injuries.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1800, // ₹1800
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2001 },
      { degree: 'MS - Orthopedics', institution: 'PGIMER Chandigarh', year: 2005 }
    ],
    certifications: [
      { name: 'Fellowship in Joint Replacement', issuingOrganization: 'Royal College of Surgeons', year: 2007 },
      { name: 'Sports Medicine Certification', issuingOrganization: 'International Society of Arthroscopy', year: 2010 }
    ],
    latitude: 28.6311,
    longitude: 77.2756
  },
  {
    name: 'Dr. Kavita Sharma',
    email: 'kavita.sharma@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Gynecologist',
    experience: 12,
    qualifications: ['MBBS', 'MS - Obstetrics & Gynecology'],
    licenseNumber: 'MCI-90125',
    officeLocation: {
      address: '789 Women\'s Health Center, Preet Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543220',
    bio: 'Compassionate gynecologist specializing in women\'s health and reproductive medicine.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 1500, // ₹1500
    education: [
      { degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 2005 },
      { degree: 'MS - Obstetrics & Gynecology', institution: 'AIIMS Delhi', year: 2010 }
    ],
    certifications: [
      { name: 'Fellowship in Reproductive Medicine', issuingOrganization: 'Federation of Obstetric and Gynecological Societies of India', year: 2012 },
      { name: 'Certification in Laparoscopic Surgery', issuingOrganization: 'World Association of Laparoscopic Surgeons', year: 2014 }
    ],
    latitude: 28.6418,
    longitude: 77.2971
  },
  {
    name: 'Dr. Vivek Joshi',
    email: 'vivek.joshi@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Dermatologist',
    experience: 8,
    qualifications: ['MBBS', 'MD - Dermatology'],
    licenseNumber: 'MCI-90126',
    officeLocation: {
      address: '101 Skin Care Clinic, Mayur Vihar Phase 2',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110091'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543221',
    bio: 'Skilled dermatologist specializing in cosmetic dermatology and skin disorders.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1300, // ₹1300
    education: [
      { degree: 'MBBS', institution: 'Grant Medical College Mumbai', year: 2009 },
      { degree: 'MD - Dermatology', institution: 'PGIMER Chandigarh', year: 2013 }
    ],
    certifications: [
      { name: 'Certified Dermatologist', issuingOrganization: 'Indian Association of Dermatologists', year: 2014 },
      { name: 'Advanced Cosmetic Procedures', issuingOrganization: 'American Academy of Dermatology', year: 2016 }
    ],
    latitude: 28.6106,
    longitude: 77.3086
  },
  {
    name: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Cardiologist',
    experience: 18,
    qualifications: ['MBBS', 'MD - Cardiology', 'DM - Cardiology'],
    licenseNumber: 'MCI-90127',
    officeLocation: {
      address: '202 Heart Care Center, Patparganj',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543222',
    bio: 'Renowned cardiologist with expertise in interventional cardiology and heart disease management.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Bengali'],
    consultationFee: 2200, // ₹2200
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 1997 },
      { degree: 'MD - Cardiology', institution: 'PGIMER Chandigarh', year: 2001 },
      { degree: 'DM - Cardiology', institution: 'SGPGI Lucknow', year: 2004 }
    ],
    certifications: [
      { name: 'Fellowship in Interventional Cardiology', issuingOrganization: 'American College of Cardiology', year: 2006 },
      { name: 'Advanced Cardiac Imaging', issuingOrganization: 'European Society of Cardiology', year: 2009 }
    ],
    latitude: 28.6223,
    longitude: 77.2907
  },
  {
    name: 'Dr. Neha Singh',
    email: 'neha.singh@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Neurologist',
    experience: 11,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Neurology'],
    licenseNumber: 'MCI-90128',
    officeLocation: {
      address: '303 Brain & Nerve Center, Vasundhara Enclave',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110096'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543223',
    bio: 'Specialized neurologist focusing on stroke management and neurodegenerative disorders.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1900, // ₹1900
    education: [
      { degree: 'MBBS', institution: 'PGIMER Chandigarh', year: 2004 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2008 },
      { degree: 'DM - Neurology', institution: 'NIMHANS Bangalore', year: 2012 }
    ],
    certifications: [
      { name: 'Fellowship in Stroke Medicine', issuingOrganization: 'World Stroke Organization', year: 2013 },
      { name: 'Certification in Neurorehabilitation', issuingOrganization: 'International Neurological Society', year: 2015 }
    ],
    latitude: 28.6068,
    longitude: 77.3220
  },
  {
    name: 'Dr. Rajat Khanna',
    email: 'rajat.khanna@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Psychiatrist',
    experience: 9,
    qualifications: ['MBBS', 'MD - Psychiatry'],
    licenseNumber: 'MCI-90129',
    officeLocation: {
      address: '404 Mind Wellness Clinic, Krishna Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110051'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543224',
    bio: 'Compassionate psychiatrist specializing in mood disorders, anxiety, and stress management.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1700, // ₹1700
    education: [
      { degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 2008 },
      { degree: 'MD - Psychiatry', institution: 'NIMHANS Bangalore', year: 2013 }
    ],
    certifications: [
      { name: 'Cognitive Behavioral Therapy', issuingOrganization: 'Beck Institute for Cognitive Behavior Therapy', year: 2015 },
      { name: 'Certification in Addiction Psychiatry', issuingOrganization: 'Indian Psychiatric Society', year: 2017 }
    ],
    latitude: 28.6558,
    longitude: 77.2789
  },
  {
    name: 'Dr. Pooja Agarwal',
    email: 'pooja.agarwal@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Endocrinologist',
    experience: 10,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Endocrinology'],
    licenseNumber: 'MCI-90130',
    officeLocation: {
      address: '505 Diabetes & Hormone Center, Vivek Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110095'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543225',
    bio: 'Specialized in diabetes management, thyroid disorders, and hormonal imbalances.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1800, // ₹1800
    education: [
      { degree: 'MBBS', institution: 'KEM Hospital Mumbai', year: 2005 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2009 },
      { degree: 'DM - Endocrinology', institution: 'PGIMER Chandigarh', year: 2013 }
    ],
    certifications: [
      { name: 'Fellowship in Diabetes Management', issuingOrganization: 'Research Society for the Study of Diabetes in India', year: 2014 },
      { name: 'Advanced Endocrinology Certification', issuingOrganization: 'Endocrine Society', year: 2016 }
    ],
    latitude: 28.6698,
    longitude: 77.3105
  },
  {
    name: 'Dr. Alok Mishra',
    email: 'alok.mishra@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Pulmonologist',
    experience: 14,
    qualifications: ['MBBS', 'MD - Pulmonary Medicine'],
    licenseNumber: 'MCI-90131',
    officeLocation: {
      address: '606 Respiratory Care Center, Shahdara',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110032'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543226',
    bio: 'Expert in respiratory disorders, sleep apnea, and pulmonary rehabilitation.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Bengali'],
    consultationFee: 1600, // ₹1600
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2002 },
      { degree: 'MD - Pulmonary Medicine', institution: 'PGIMER Chandigarh', year: 2007 }
    ],
    certifications: [
      { name: 'Fellowship in Interventional Pulmonology', issuingOrganization: 'American College of Chest Physicians', year: 2009 },
      { name: 'Sleep Medicine Certification', issuingOrganization: 'World Association of Sleep Medicine', year: 2012 }
    ],
    latitude: 28.6688,
    longitude: 77.2923
  },
  {
    name: 'Dr. Ritu Saxena',
    email: 'ritu.saxena@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Ophthalmologist',
    experience: 12,
    qualifications: ['MBBS', 'MS - Ophthalmology'],
    licenseNumber: 'MCI-90132',
    officeLocation: {
      address: '707 Eye Care Center, Mayur Vihar Phase 3',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110096'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543227',
    bio: 'Specialized in cataract surgery, glaucoma management, and refractive errors.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 1400, // ₹1400
    education: [
      { degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 2004 },
      { degree: 'MS - Ophthalmology', institution: 'AIIMS Delhi', year: 2008 }
    ],
    certifications: [
      { name: 'Fellowship in Cornea and Refractive Surgery', issuingOrganization: 'All India Ophthalmological Society', year: 2010 },
      { name: 'Certification in Glaucoma Management', issuingOrganization: 'International Council of Ophthalmology', year: 2013 }
    ],
    latitude: 28.6047,
    longitude: 77.3332
  },
  {
    name: 'Dr. Deepak Verma',
    email: 'deepak.verma@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Gastroenterologist',
    experience: 15,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Gastroenterology'],
    licenseNumber: 'MCI-90133',
    officeLocation: {
      address: '808 Digestive Health Clinic, Dilshad Garden',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110095'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543228',
    bio: 'Expert in digestive disorders, liver diseases, and advanced endoscopic procedures.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 2000, // ₹2000
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2000 },
      { degree: 'MD - Medicine', institution: 'PGIMER Chandigarh', year: 2004 },
      { degree: 'DM - Gastroenterology', institution: 'SGPGI Lucknow', year: 2008 }
    ],
    certifications: [
      { name: 'Fellowship in Advanced Endoscopy', issuingOrganization: 'American Society for Gastrointestinal Endoscopy', year: 2010 },
      { name: 'Certification in Hepatology', issuingOrganization: 'International Association for the Study of the Liver', year: 2012 }
    ],
    latitude: 28.6828,
    longitude: 77.3207
  },
  {
    name: 'Dr. Anjali Desai',
    email: 'anjali.desai@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Nephrologist',
    experience: 11,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Nephrology'],
    licenseNumber: 'MCI-90134',
    officeLocation: {
      address: '909 Kidney Care Center, Anand Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543229',
    bio: 'Specialized in kidney diseases, dialysis management, and transplant medicine.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1900, // ₹1900
    education: [
      { degree: 'MBBS', institution: 'Seth GS Medical College Mumbai', year: 2004 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2008 },
      { degree: 'DM - Nephrology', institution: 'PGIMER Chandigarh', year: 2012 }
    ],
    certifications: [
      { name: 'Fellowship in Transplant Nephrology', issuingOrganization: 'American Society of Nephrology', year: 2014 },
      { name: 'Certification in Dialysis Management', issuingOrganization: 'International Society of Nephrology', year: 2016 }
    ],
    latitude: 28.6519,
    longitude: 77.3152
  },
  {
    name: 'Dr. Manish Arora',
    email: 'manish.arora@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'ENT Specialist',
    experience: 9,
    qualifications: ['MBBS', 'MS - ENT'],
    licenseNumber: 'MCI-90135',
    officeLocation: {
      address: '111 ENT Care Center, Karkardooma',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543230',
    bio: 'Expert in ear, nose, and throat disorders with special interest in sinus surgery.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1500, // ₹1500
    education: [
      { degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 2007 },
      { degree: 'MS - ENT', institution: 'AIIMS Delhi', year: 2012 }
    ],
    certifications: [
      { name: 'Fellowship in Rhinology', issuingOrganization: 'Association of Otolaryngologists of India', year: 2014 },
      { name: 'Certification in Sleep Medicine', issuingOrganization: 'International Federation of Otorhinolaryngological Societies', year: 2016 }
    ],
    latitude: 28.6564,
    longitude: 77.3018
  },
  {
    name: 'Dr. Shikha Malhotra',
    email: 'shikha.malhotra@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Dentist',
    experience: 8,
    qualifications: ['BDS', 'MDS - Orthodontics'],
    licenseNumber: 'MCI-90136',
    officeLocation: {
      address: '222 Dental Care Center, Surajmal Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543231',
    bio: 'Specialized in orthodontics, cosmetic dentistry, and pediatric dental care.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Bengali'],
    consultationFee: 1200, // ₹1200
    education: [
      { degree: 'BDS', institution: 'Maulana Azad Institute of Dental Sciences', year: 2009 },
      { degree: 'MDS - Orthodontics', institution: 'King George\'s Medical University', year: 2013 }
    ],
    certifications: [
      { name: 'Fellowship in Implant Dentistry', issuingOrganization: 'Indian Dental Association', year: 2015 },
      { name: 'Certification in Cosmetic Dentistry', issuingOrganization: 'Academy of Cosmetic Dentistry', year: 2017 }
    ],
    latitude: 28.6476,
    longitude: 77.3076
  },
  {
    name: 'Dr. Rohit Kapoor',
    email: 'rohit.kapoor@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Urologist',
    experience: 13,
    qualifications: ['MBBS', 'MS - General Surgery', 'MCh - Urology'],
    licenseNumber: 'MCI-90137',
    officeLocation: {
      address: '333 Urology Center, Geeta Colony',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110031'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543232',
    bio: 'Expert in urological disorders, kidney stones, and minimally invasive urological surgeries.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1800, // ₹1800
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2002 },
      { degree: 'MS - General Surgery', institution: 'PGIMER Chandigarh', year: 2006 },
      { degree: 'MCh - Urology', institution: 'SGPGI Lucknow', year: 2010 }
    ],
    certifications: [
      { name: 'Fellowship in Endourology', issuingOrganization: 'Urological Society of India', year: 2012 },
      { name: 'Certification in Robotic Surgery', issuingOrganization: 'International Society of Urology', year: 2014 }
    ],
    latitude: 28.6584,
    longitude: 77.2684
  },
  {
    name: 'Dr. Preeti Chadha',
    email: 'preeti.chadha@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Rheumatologist',
    experience: 10,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Rheumatology'],
    licenseNumber: 'MCI-90138',
    officeLocation: {
      address: '444 Arthritis Care Center, Yamuna Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110053'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543233',
    bio: 'Specialized in autoimmune disorders, arthritis, and musculoskeletal conditions.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1700, // ₹1700
    education: [
      { degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 2006 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2010 },
      { degree: 'DM - Rheumatology', institution: 'PGIMER Chandigarh', year: 2014 }
    ],
    certifications: [
      { name: 'Fellowship in Clinical Immunology', issuingOrganization: 'Indian Rheumatology Association', year: 2015 },
      { name: 'Certification in Musculoskeletal Ultrasound', issuingOrganization: 'International Society for Clinical Densitometry', year: 2017 }
    ],
    latitude: 28.6914,
    longitude: 77.2651
  },
  {
    name: 'Dr. Vikas Sharma',
    email: 'vikas.sharma@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Oncologist',
    experience: 16,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Medical Oncology'],
    licenseNumber: 'MCI-90139',
    officeLocation: {
      address: '555 Cancer Care Center, Shastri Park',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110053'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543234',
    bio: 'Expert in cancer diagnosis, treatment, and palliative care with a holistic approach.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 2200, // ₹2200
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 1999 },
      { degree: 'MD - Medicine', institution: 'PGIMER Chandigarh', year: 2003 },
      { degree: 'DM - Medical Oncology', institution: 'Tata Memorial Hospital', year: 2007 }
    ],
    certifications: [
      { name: 'Fellowship in Hematological Oncology', issuingOrganization: 'American Society of Clinical Oncology', year: 2009 },
      { name: 'Certification in Palliative Medicine', issuingOrganization: 'Indian Association of Palliative Care', year: 2012 }
    ],
    latitude: 28.6761,
    longitude: 77.2562
  },
  {
    name: 'Dr. Nandini Patel',
    email: 'nandini.patel@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Pediatric Neurologist',
    experience: 12,
    qualifications: ['MBBS', 'MD - Pediatrics', 'DM - Neurology'],
    licenseNumber: 'MCI-90140',
    officeLocation: {
      address: '666 Child Neurology Center, Shakarpur',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543235',
    bio: 'Specialized in pediatric neurological disorders, developmental delays, and epilepsy management.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1900, // ₹1900
    education: [
      { degree: 'MBBS', institution: 'Seth GS Medical College Mumbai', year: 2003 },
      { degree: 'MD - Pediatrics', institution: 'AIIMS Delhi', year: 2007 },
      { degree: 'DM - Neurology', institution: 'NIMHANS Bangalore', year: 2011 }
    ],
    certifications: [
      { name: 'Fellowship in Pediatric Epilepsy', issuingOrganization: 'International League Against Epilepsy', year: 2013 },
      { name: 'Certification in Neurodevelopmental Disorders', issuingOrganization: 'Child Neurology Society', year: 2015 }
    ],
    latitude: 28.6323,
    longitude: 77.2831
  },
  {
    name: 'Dr. Suresh Kumar',
    email: 'suresh.kumar@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Diabetologist',
    experience: 14,
    qualifications: ['MBBS', 'MD - Medicine'],
    licenseNumber: 'MCI-90141',
    officeLocation: {
      address: '777 Diabetes Care Center, Mandawali',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543236',
    bio: 'Expert in diabetes management, metabolic disorders, and preventive healthcare.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: 1600, // ₹1600
    education: [
      { degree: 'MBBS', institution: 'Madras Medical College', year: 2002 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2006 }
    ],
    certifications: [
      { name: 'Fellowship in Diabetology', issuingOrganization: 'Research Society for the Study of Diabetes in India', year: 2008 },
      { name: 'Certification in Insulin Pump Therapy', issuingOrganization: 'International Diabetes Federation', year: 2011 }
    ],
    latitude: 28.6248,
    longitude: 77.3014
  },
  {
    name: 'Dr. Meenakshi Reddy',
    email: 'meenakshi.reddy@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Geriatrician',
    experience: 11,
    qualifications: ['MBBS', 'MD - Medicine', 'Fellowship in Geriatrics'],
    licenseNumber: 'MCI-90142',
    officeLocation: {
      address: '888 Senior Care Center, Pandav Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110092'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543237',
    bio: 'Specialized in elderly care, age-related conditions, and maintaining quality of life in seniors.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Telugu'],
    consultationFee: 1500, // ₹1500
    education: [
      { degree: 'MBBS', institution: 'Osmania Medical College', year: 2005 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2009 },
      { degree: 'Fellowship in Geriatrics', institution: 'All India Institute of Medical Sciences', year: 2011 }
    ],
    certifications: [
      { name: 'Certification in Palliative Care', issuingOrganization: 'Indian Association of Palliative Care', year: 2013 },
      { name: 'Geriatric Mental Health Certification', issuingOrganization: 'International Psychogeriatric Association', year: 2015 }
    ],
    latitude: 28.6176,
    longitude: 77.2867
  },
  {
    name: 'Dr. Arun Mathur',
    email: 'arun.mathur@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Hematologist',
    experience: 13,
    qualifications: ['MBBS', 'MD - Medicine', 'DM - Clinical Hematology'],
    licenseNumber: 'MCI-90143',
    officeLocation: {
      address: '999 Blood Disorders Clinic, Kondli',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110096'
    },
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543238',
    bio: 'Expert in blood disorders, leukemia, anemia, and stem cell transplantation.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 2100, // ₹2100
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2003 },
      { degree: 'MD - Medicine', institution: 'PGIMER Chandigarh', year: 2007 },
      { degree: 'DM - Clinical Hematology', institution: 'Christian Medical College Vellore', year: 2011 }
    ],
    certifications: [
      { name: 'Fellowship in Bone Marrow Transplantation', issuingOrganization: 'American Society of Hematology', year: 2013 },
      { name: 'Certification in Hemato-Oncology', issuingOrganization: 'International Society of Hematology', year: 2015 }
    ],
    latitude: 28.6086,
    longitude: 77.3376
  },
  {
    name: 'Dr. Jyoti Sharma',
    email: 'jyoti.sharma@example.com',
    password: 'password123',
    role: 'Doctor',
    specialization: 'Allergist',
    experience: 9,
    qualifications: ['MBBS', 'MD - Medicine', 'Fellowship in Allergy & Immunology'],
    licenseNumber: 'MCI-90144',
    officeLocation: {
      address: '123 Allergy Care Center, Mayur Vihar Phase 1',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110091'
    },
    workingHours: {
      monday: { start: '09:30', end: '17:30' },
      tuesday: { start: '09:30', end: '17:30' },
      wednesday: { start: '09:30', end: '17:30' },
      thursday: { start: '09:30', end: '17:30' },
      friday: { start: '09:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '', end: '' }
    },
    phoneNumber: '+91-9876543239',
    bio: 'Specialized in allergies, asthma, immunodeficiency disorders, and immunotherapy.',
    acceptingNewPatients: true,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 1600, // ₹1600
    education: [
      { degree: 'MBBS', institution: 'Grant Medical College Mumbai', year: 2008 },
      { degree: 'MD - Medicine', institution: 'AIIMS Delhi', year: 2012 },
      { degree: 'Fellowship in Allergy & Immunology', institution: 'PGIMER Chandigarh', year: 2014 }
    ],
    certifications: [
      { name: 'Certification in Immunotherapy', issuingOrganization: 'World Allergy Organization', year: 2016 },
      { name: 'Advanced Asthma Management', issuingOrganization: 'Global Initiative for Asthma', year: 2018 }
    ],
    latitude: 28.6073,
    longitude: 77.2937
  }
];

// Function to seed doctors
const seedDoctors = async () => {
  try {
    // Connect to MongoDB
    const conn = await connectDB();
    
    // Clear existing doctors (optional)
    await Doctor.deleteMany({ role: 'Doctor' });
    console.log('Existing doctors cleared');
    
    // Insert new doctors
    const createdDoctors = await Doctor.insertMany(dummyDoctors);
    console.log(`${createdDoctors.length} doctors seeded successfully`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding doctors: ${error.message}`);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

// Run the seeding function
seedDoctors();