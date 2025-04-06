import mongoose from 'mongoose';

// Session Schema for authentication
const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  }
});

// Index to automatically expire sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create the Session model
const Session = mongoose.model('Session', sessionSchema);

export default Session;