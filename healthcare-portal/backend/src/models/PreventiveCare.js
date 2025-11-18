const mongoose = require('mongoose');

const preventiveCareSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careType: {
    type: String,
    enum: ['blood_test', 'dental', 'eye_exam', 'vaccination', 'physical_exam', 'screening', 'custom'],
    required: true
  },
  careName: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: Date,
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed', 'cancelled'],
    default: 'upcoming'
  },
  description: String,
  location: String,
  reminderDays: {
    type: Number,
    default: 7
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PreventiveCare', preventiveCareSchema);