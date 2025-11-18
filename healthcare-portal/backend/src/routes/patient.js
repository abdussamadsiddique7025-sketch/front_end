const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLog');
const PatientProfile = require('../models/PatientProfile');
const WellnessGoal = require('../models/WellnessGoal');
const GoalLog = require('../models/GoalLog');
const PreventiveCare = require('../models/PreventiveCare');
const HealthTip = require('../models/HealthTip');

// Get patient dashboard
router.get('/dashboard', protect, authorize('patient'), logAction('view_dashboard'), async (req, res) => {
  try {
    const activeGoals = await WellnessGoal.find({
      patientId: req.user._id,
      status: 'active'
    }).limit(5);

    const upcomingReminders = await PreventiveCare.find({
      patientId: req.user._id,
      status: 'upcoming',
      scheduledDate: { $gte: new Date() }
    }).sort({ scheduledDate: 1 }).limit(5);

    const healthTip = await HealthTip.findOne({
      isActive: true
    }).sort({ createdAt: -1 });

    const goalsWithProgress = activeGoals.map(goal => ({
      id: goal._id,
      goalType: goal.goalType,
      goalName: goal.goalName,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      progress: Math.round((goal.currentValue / goal.targetValue) * 100),
      unit: goal.unit,
      status: goal.status
    }));

    const remindersWithDays = upcomingReminders.map(reminder => {
      const daysUntil = Math.ceil((new Date(reminder.scheduledDate) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        id: reminder._id,
        careName: reminder.careName,
        careType: reminder.careType,
        scheduledDate: reminder.scheduledDate,
        daysUntil,
        status: reminder.status,
        description: reminder.description
      };
    });

    res.json({
      success: true,
      data: {
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role
        },
        activeGoals: goalsWithProgress,
        upcomingReminders: remindersWithDays,
        healthTip: healthTip ? {
          title: healthTip.title,
          content: healthTip.content,
          category: healthTip.category
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get patient profile
router.get('/profile', protect, authorize('patient'), logAction('view_profile', 'patient_profile'), async (req, res) => {
  try {
    let profile = await PatientProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await PatientProfile.create({
        userId: req.user._id,
        consentGiven: false
      });
    }

    res.json({
      success: true,
      data: {
        ...req.user.toObject(),
        profile: profile.toObject()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update patient profile
router.put('/profile', protect, authorize('patient'), logAction('update_profile', 'patient_profile'), async (req, res) => {
  try {
    const profile = await PatientProfile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all wellness goals
router.get('/goals', protect, authorize('patient'), async (req, res) => {
  try {
    const goals = await WellnessGoal.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create wellness goal
router.post('/goals', protect, authorize('patient'), logAction('create_goal', 'wellness_goal'), async (req, res) => {
  try {
    const goal = await WellnessGoal.create({
      ...req.body,
      patientId: req.user._id
    });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update wellness goal
router.put('/goals/:id', protect, authorize('patient'), logAction('update_goal', 'wellness_goal'), async (req, res) => {
  try {
    const goal = await WellnessGoal.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Log goal progress
router.post('/goals/:id/log', protect, authorize('patient'), async (req, res) => {
  try {
    const { value, notes } = req.body;
    const goal = await WellnessGoal.findOne({ _id: req.params.id, patientId: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const log = await GoalLog.create({
      goalId: goal._id,
      patientId: req.user._id,
      logDate: new Date(),
      value,
      notes
    });

    goal.currentValue = value;
    await goal.save();

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get goal logs
router.get('/goals/:id/logs', protect, authorize('patient'), async (req, res) => {
  try {
    const logs = await GoalLog.find({
      goalId: req.params.id,
      patientId: req.user._id
    }).sort({ logDate: -1 }).limit(30);

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;