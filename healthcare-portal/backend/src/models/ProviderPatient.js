const mongoose = require('mongoose');

const providerPatientSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relationshipStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ProviderPatient', providerPatientSchema);