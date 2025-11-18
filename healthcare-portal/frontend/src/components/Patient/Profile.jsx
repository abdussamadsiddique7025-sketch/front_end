import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../../services/api';
import './Patient.css';

function PatientProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientAPI.getProfile();
      setProfile(response.data.data);
      setFormData({
        dateOfBirth: response.data.data.profile.dateOfBirth?.split('T')[0] || '',
        gender: response.data.data.profile.gender || '',
        bloodGroup: response.data.data.profile.bloodGroup || '',
        height: response.data.data.profile.height || '',
        weight: response.data.data.profile.weight || '',
        allergies: response.data.data.profile.allergies?.join(', ') || '',
        currentMedications: response.data.data.profile.currentMedications?.join(', ') || '',
        chronicConditions: response.data.data.profile.chronicConditions?.join(', ') || '',
        emergencyContact: response.data.data.profile.emergencyContact || {
          name: '',
          relationship: '',
          phoneNumber: ''
        }
      });
    } catch (err) {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map(s => s.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : []
      };

      await patientAPI.updateProfile(updateData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your health information</p>
        </div>
        <button onClick={() => navigate('/patient/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </header>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-container">
        <div className="card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary">
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    placeholder="e.g., O+"
                  />
                </div>

                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Allergies (comma-separated)</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Penicillin, Peanuts"
                />
              </div>

              <div className="form-group">
                <label>Current Medications (comma-separated)</label>
                <input
                  type="text"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  placeholder="e.g., Lisinopril 10mg daily"
                />
              </div>

              <div className="form-group">
                <label>Chronic Conditions (comma-separated)</label>
                <input
                  type="text"
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  placeholder="e.g., Hypertension, Diabetes"
                />
              </div>

              <h4>Emergency Contact</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact?.name || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="emergencyContact.phoneNumber"
                    value={formData.emergencyContact?.phoneNumber || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-view">
              <div className="info-grid">
                <div className="info-item">
                  <label>Email</label>
                  <p>{profile?.email}</p>
                </div>
                <div className="info-item">
                  <label>Name</label>
                  <p>{profile?.firstName} {profile?.lastName}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{profile?.phoneNumber || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{profile?.profile.dateOfBirth ? new Date(profile.profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <p>{profile?.profile.gender || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Blood Group</label>
                  <p>{profile?.profile.bloodGroup || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Height</label>
                  <p>{profile?.profile.height ? `${profile.profile.height} cm` : 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Weight</label>
                  <p>{profile?.profile.weight ? `${profile.profile.weight} kg` : 'Not provided'}</p>
                </div>
                <div className="info-item full-width">
                  <label>Allergies</label>
                  <p>{profile?.profile.allergies?.join(', ') || 'None'}</p>
                </div>
                <div className="info-item full-width">
                  <label>Current Medications</label>
                  <p>{profile?.profile.currentMedications?.join(', ') || 'None'}</p>
                </div>
                <div className="info-item full-width">
                  <label>Chronic Conditions</label>
                  <p>{profile?.profile.chronicConditions?.join(', ') || 'None'}</p>
                </div>
              </div>

              {profile?.profile.emergencyContact?.name && (
                <>
                  <h4>Emergency Contact</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name</label>
                      <p>{profile.profile.emergencyContact.name}</p>
                    </div>
                    <div className="info-item">
                      <label>Relationship</label>
                      <p>{profile.profile.emergencyContact.relationship}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{profile.profile.emergencyContact.phoneNumber}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;