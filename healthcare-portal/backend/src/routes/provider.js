const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLog');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const WellnessGoal = require('../models/WellnessGoal');
const PreventiveCare = require('../models/PreventiveCare');
const ProviderPatient = require('../models/ProviderPatient');

// Get provider dashboard
router.get('/dashboard', protect, authorize('provider'), logAction('view_dashboard'), async (req, res) => {
  try {
    const relationships = await ProviderPatient.find({
      providerId: req.user._id,
      relationshipStatus: 'active'
    }).populate('patientId', 'firstName lastName email');

    const patientIds = relationships.map(rel => rel.patientId._id);

    const patientsData = await Promise.all(
      relationships.map(async (rel) => {
        const patientId = rel.patientId._id;
        
        const activeGoals = await WellnessGoal.countDocuments({
          patientId,
          status: 'active'
        });

        const completedGoals = await WellnessGoal.countDocuments({
          patientId,
          status: 'completed'
        });

        const upcomingCheckups = await PreventiveCare.countDocuments({
          patientId,
          status: 'upcoming',
          scheduledDate: { $gte: new Date() }
        });

        const missedCheckups = await PreventiveCare.countDocuments({
          patientId,
          status: 'missed'
        });

        const lastCheckup = await PreventiveCare.findOne({
          patientId,
          status: 'completed'
        }).sort({ completedDate: -1 });

        const complianceStatus = missedCheckups === 0 && upcomingCheckups >= 0 ? 'compliant' : 'at-risk';

        return {
          id: rel.patientId._id,
          firstName: rel.patientId.firstName,
          lastName: rel.patientId.lastName,
          email: rel.patientId.email,
          complianceStatus,
          activeGoalsCount: activeGoals,
          completedGoalsCount: completedGoals,
          upcomingCheckups,
          missedCheckups,
          lastVisit: lastCheckup ? lastCheckup.completedDate : null
        };
      })
    );

    const compliantPatients = patientsData.filter(p => p.complianceStatus === 'compliant').length;
    const totalUpcomingCheckups = patientsData.reduce((sum, p) => sum + p.upcomingCheckups, 0);

    res.json({
      success: true,
      data: {
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role
        },
        patients: patientsData,
        stats: {
          totalPatients: patientsData.length,
          compliantPatients,
          upcomingCheckups: totalUpcomingCheckups
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get patient details
router.get('/patients/:id', protect, authorize('provider'), logAction('access_patient_data', 'patient_profile'), async (req, res) => {
  try {
    const relationship = await ProviderPatient.findOne({
      providerId: req.user._id,
      patientId: req.params.id,
      relationshipStatus: 'active'
    });

    if (!relationship) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this patient' });
    }

    const patient = await User.findById(req.params.id).select('-password');
    const profile = await PatientProfile.findOne({ userId: req.params.id });
    const goals = await WellnessGoal.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    const reminders = await PreventiveCare.find({ patientId: req.params.id }).sort({ scheduledDate: 1 });

    res.json({
      success: true,
      data: {
        patient,
        profile,
        goals,
        reminders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create preventive care reminder for patient
router.post('/patients/:id/reminders', protect, authorize('provider'), async (req, res) => {
  try {
    const relationship = await ProviderPatient.findOne({
      providerId: req.user._id,
      patientId: req.params.id,
      relationshipStatus: 'active'
    });

    if (!relationship) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this patient' });
    }

    const reminder = await PreventiveCare.create({
      ...req.body,
      patientId: req.params.id,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;