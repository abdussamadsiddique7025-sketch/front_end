const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['nutrition', 'exercise', 'mental_health', 'sleep', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthTip', healthTipSchema);