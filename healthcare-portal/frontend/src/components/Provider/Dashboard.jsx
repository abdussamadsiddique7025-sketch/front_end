import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../../services/api';
import './Provider.css';

function ProviderDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await providerAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      console.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = async (patientId) => {
    try {
      const response = await providerAPI.getPatientDetails(patientId);
      setPatientDetails(response.data.data);
      setSelectedPatient(patientId);
    } catch (err) {
      alert('Failed to load patient details');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Provider Dashboard</h1>
          <p>Welcome, Dr. {dashboardData?.user.firstName}</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/health-info')} className="btn-secondary">
            Health Info
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{dashboardData?.stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardData?.stats.compliantPatients}</div>
          <div className="stat-label">Compliant Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardData?.stats.upcomingCheckups}</div>
          <div className="stat-label">Upcoming Checkups</div>
        </div>
      </div>

      <div className="provider-content">
        <div className="card patients-list">
          <h3>My Patients</h3>
          <div className="patients-table">
            {dashboardData?.patients.map((patient) => (
              <div 
                key={patient.id} 
                className={`patient-row ${selectedPatient === patient.id ? 'selected' : ''}`}
                onClick={() => handlePatientClick(patient.id)}
              >
                <div className="patient-info">
                  <div className="patient-name">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="patient-email">{patient.email}</div>
                </div>
                <div className="patient-stats">
                  <span className={`compliance-badge ${patient.complianceStatus}`}>
                    {patient.complianceStatus}
                  </span>
                  <span className="stat-item">
                    Goals: {patient.activeGoalsCount}/{patient.completedGoalsCount}
                  </span>
                  {patient.missedCheckups > 0 && (
                    <span className="alert">
                      ⚠️ {patient.missedCheckups} missed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {patientDetails && (
          <div className="card patient-details">
            <h3>Patient Details: {patientDetails.patient.firstName} {patientDetails.patient.lastName}</h3>
            
            <div className="details-section">
              <h4>Profile Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email</label>
                  <p>{patientDetails.patient.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{patientDetails.patient.phoneNumber || 'N/A'}</p>
                </div>
                {patientDetails.profile?.bloodGroup && (
                  <div className="info-item">
                    <label>Blood Group</label>
                    <p>{patientDetails.profile.bloodGroup}</p>
                  </div>
                )}
                {patientDetails.profile?.allergies?.length > 0 && (
                  <div className="info-item full-width">
                    <label>Allergies</label>
                    <p className="alert-text">{patientDetails.profile.allergies.join(', ')}</p>
                  </div>
                )}
                {patientDetails.profile?.currentMedications?.length > 0 && (
                  <div className="info-item full-width">
                    <label>Current Medications</label>
                    <p>{patientDetails.profile.currentMedications.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="details-section">
              <h4>Wellness Goals ({patientDetails.goals.length})</h4>
              {patientDetails.goals.length === 0 ? (
                <p className="empty-state">No goals set</p>
              ) : (
                <div className="goals-summary">
                  {patientDetails.goals.slice(0, 5).map((goal) => (
                    <div key={goal._id} className="goal-summary-item">
                      <div className="goal-name">{goal.goalName}</div>
                      <div className="goal-progress">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                        <span className={`status-badge ${goal.status}`}>{goal.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="details-section">
              <h4>Preventive Care Schedule ({patientDetails.reminders.length})</h4>
              {patientDetails.reminders.length === 0 ? (
                <p className="empty-state">No scheduled checkups</p>
              ) : (
                <div className="reminders-summary">
                  {patientDetails.reminders.slice(0, 5).map((reminder) => (
                    <div key={reminder._id} className="reminder-summary-item">
                      <div className="reminder-info">
                        <div className="reminder-name">{reminder.careName}</div>
                        <div className="reminder-date">
                          {new Date(reminder.scheduledDate).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`status-badge ${reminder.status}`}>
                        {reminder.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;