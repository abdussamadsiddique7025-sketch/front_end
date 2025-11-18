const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  bloodGroup: String,
  height: Number,
  weight: Number,
  allergies: [String],
  currentMedications: [String],
  chronicConditions: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  assignedProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  consentGiven: {
    type: Boolean,
    required: true,
    default: false
  },
  consentDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('PatientProfile', patientProfileSchema);