import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../../services/api';
import './Patient.css';

function GoalTracker() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    goalType: 'steps',
    goalName: '',
    targetValue: '',
    unit: 'steps',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'daily'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await patientAPI.getGoals();
      setGoals(response.data.data);
    } catch (err) {
      console.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'goalType') {
      const units = {
        steps: 'steps',
        water: 'liters',
        sleep: 'hours',
        exercise: 'minutes',
        weight: 'kg'
      };
      setFormData({ ...formData, goalType: value, unit: units[value] || 'units' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.createGoal(formData);
      setShowCreateForm(false);
      setFormData({
        goalType: 'steps',
        goalName: '',
        targetValue: '',
        unit: 'steps',
        startDate: new Date().toISOString().split('T')[0],
        frequency: 'daily'
      });
      fetchGoals();
    } catch (err) {
      alert('Failed to create goal');
    }
  };

  const handleLogProgress = async (goalId) => {
    const value = prompt('Enter today\'s value:');
    if (value) {
      try {
        await patientAPI.logGoalProgress(goalId, { value: parseFloat(value) });
        fetchGoals();
      } catch (err) {
        alert('Failed to log progress');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Goal Tracker</h1>
          <p>Track and manage your wellness goals</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            {showCreateForm ? 'Cancel' : '+ Create Goal'}
          </button>
          <button onClick={() => navigate('/patient/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </header>

      {showCreateForm && (
        <div className="card">
          <h3>Create New Goal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Goal Type</label>
                <select name="goalType" value={formData.goalType} onChange={handleChange} required>
                  <option value="steps">Steps</option>
                  <option value="water">Water Intake</option>
                  <option value="sleep">Sleep</option>
                  <option value="exercise">Exercise</option>
                  <option value="weight">Weight</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleChange}
                  placeholder="e.g., Daily Walking Goal"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Value</label>
                <input
                  type="number"
                  name="targetValue"
                  value={formData.targetValue}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary">Create Goal</button>
          </form>
        </div>
      )}

      <div className="goals-grid">
        {goals.map((goal) => (
          <div key={goal._id} className="card goal-card">
            <div className="goal-header">
              <h3>{goal.goalName}</h3>
              <span className={`status-badge ${goal.status}`}>{goal.status}</span>
            </div>
            <div className="goal-type">{goal.goalType}</div>
            <div className="goal-progress-large">
              <div className="progress-circle">
                <div className="progress-value">
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                </div>
              </div>
              <div className="progress-details">
                <p>{goal.currentValue} / {goal.targetValue} {goal.unit}</p>
                <p className="frequency">{goal.frequency}</p>
              </div>
            </div>
            {goal.status === 'active' && (
              <button 
                onClick={() => handleLogProgress(goal._id)} 
                className="btn-primary"
              >
                Log Progress
              </button>
            )}
          </div>
        ))}

        {goals.length === 0 && (
          <div className="empty-state-large">
            <h3>No goals yet</h3>
            <p>Create your first wellness goal to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalTracker;