import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../../services/api';
import './Patient.css';

function PatientDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await patientAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {dashboardData?.user.firstName}!</h1>
          <p>Your Wellness Dashboard</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/patient/profile')} className="btn-secondary">
            Profile
          </button>
          <button onClick={() => navigate('/patient/goals')} className="btn-secondary">
            Goals
          </button>
          <button onClick={() => navigate('/health-info')} className="btn-secondary">
            Health Info
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Health Tip */}
        {dashboardData?.healthTip && (
          <div className="card health-tip">
            <h3>💡 Health Tip of the Day</h3>
            <h4>{dashboardData.healthTip.title}</h4>
            <p>{dashboardData.healthTip.content}</p>
          </div>
        )}

        {/* Active Goals */}
        <div className="card">
          <h3>🎯 Your Wellness Goals</h3>
          {dashboardData?.activeGoals.length === 0 ? (
            <p className="empty-state">No active goals. Create one to get started!</p>
          ) : (
            <div className="goals-list">
              {dashboardData?.activeGoals.map((goal) => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-header">
                    <span className="goal-name">{goal.goalName}</span>
                    <span className="goal-progress">{goal.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="goal-details">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate('/patient/goals')} className="btn-link">
            View All Goals →
          </button>
        </div>

        {/* Upcoming Reminders */}
        <div className="card">
          <h3>📅 Upcoming Preventive Care</h3>
          {dashboardData?.upcomingReminders.length === 0 ? (
            <p className="empty-state">No upcoming appointments</p>
          ) : (
            <div className="reminders-list">
              {dashboardData?.upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="reminder-item">
                  <div className="reminder-icon">
                    {reminder.daysUntil <= 7 ? '🔴' : '🟢'}
                  </div>
                  <div className="reminder-content">
                    <h4>{reminder.careName}</h4>
                    <p>{reminder.description}</p>
                    <span className="reminder-date">
                      {reminder.daysUntil === 0 ? 'Today' : 
                       reminder.daysUntil === 1 ? 'Tomorrow' :
                       `In ${reminder.daysUntil} days`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;