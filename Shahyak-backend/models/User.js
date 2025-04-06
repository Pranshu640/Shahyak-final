import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Base User Schema - common fields for all user types
const baseOptions = {
  discriminatorKey: 'role', // field to distinguish between user types
  collection: 'users', // all users will be stored in the same collection
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, baseOptions);

// Client Schema - extends User Schema
const clientSchema = new mongoose.Schema({
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phoneNumber: { type: String },
  address: { type: String },
  medicalHistory: [{ type: String }],
  allergies: [{ type: String }],
  currentMedications: [{ type: String }]
});

// Doctor Schema - extends User Schema
const doctorSchema = new mongoose.Schema({
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  qualifications: [{ type: String, required: true }],
  licenseNumber: { type: String, required: true },
  officeLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  phoneNumber: { type: String, required: true },
  bio: { type: String },
  acceptingNewPatients: { type: Boolean, default: true },
  languages: [{ type: String }],
  profilePicture: { type: String },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  consultationFee: { type: Number },
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: Number }
  }],
  certifications: [{
    name: { type: String },
    issuingOrganization: { type: String },
    year: { type: Number }
  }]
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the base User model
const User = mongoose.model('User', userSchema);

// Create Client and Doctor models using discriminator
const Client = User.discriminator('Client', clientSchema);
const Doctor = User.discriminator('Doctor', doctorSchema);

export { User, Client, Doctor };