const mongoose = require('mongoose');

const goalLogSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WellnessGoal',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logDate: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('GoalLog', goalLogSchema);