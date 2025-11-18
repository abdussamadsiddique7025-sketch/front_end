const mongoose = require('mongoose');

const wellnessGoalSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalType: {
    type: String,
    enum: ['steps', 'water', 'sleep', 'exercise', 'weight', 'custom'],
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'missed', 'paused'],
    default: 'active'
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WellnessGoal', wellnessGoalSchema);