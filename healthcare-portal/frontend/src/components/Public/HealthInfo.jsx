import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Public.css';

function HealthInfo() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="public-container">
      <header className="public-header">
        <h1>Healthcare Portal</h1>
        {user.role ? (
          <button 
            onClick={() => navigate(`/${user.role}/dashboard`)} 
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="btn-primary">
            Login
          </button>
        )}
      </header>

      <div className="public-content">
        <section className="info-section">
          <h2>About Our Healthcare Portal</h2>
          <p>
            Our Healthcare Wellness & Preventive Care Portal is designed to help patients 
            take control of their health through proactive wellness tracking and timely 
            preventive care reminders.
          </p>
        </section>

        <section className="info-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Wellness Goals</h3>
              <p>Set and track daily wellness goals like steps, water intake, sleep, and exercise.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Preventive Care</h3>
              <p>Never miss important health checkups with automated reminders.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Provider Access</h3>
              <p>Healthcare providers can monitor patient compliance and health progress.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>HIPAA-compliant platform with encrypted data and audit logging.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>Health Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <h4>Stay Hydrated</h4>
              <p>Drink at least 8 glasses of water daily to maintain optimal health and energy levels.</p>
            </div>
            <div className="tip-item">
              <h4>Regular Exercise</h4>
              <p>Aim for at least 150 minutes of moderate aerobic activity per week.</p>
            </div>
            <div className="tip-item">
              <h4>Quality Sleep</h4>
              <p>Adults should get 7-9 hours of sleep each night for optimal health.</p>
            </div>
            <div className="tip-item">
              <h4>Preventive Screenings</h4>
              <p>Keep up with regular health screenings and checkups as recommended by your doctor.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>Privacy Policy</h2>
          <p>
            We are committed to protecting your health information. Our platform complies with 
            HIPAA regulations and implements industry-standard security measures including:
          </p>
          <ul>
            <li>End-to-end encryption for all health data</li>
            <li>Secure authentication with JWT tokens</li>
            <li>Comprehensive audit logging of all data access</li>
            <li>Role-based access control</li>
            <li>Regular security audits and updates</li>
          </ul>
          <p>
            Your health data is never shared with third parties without your explicit consent. 
            You have full control over your information and can request data deletion at any time.
          </p>
        </section>

        <section className="info-section">
          <h2>Contact & Support</h2>
          <p>
            For questions, technical support, or to report issues, please contact our support team:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> support@healthcareportal.com</p>
            <p><strong>Phone:</strong> 1-800-HEALTH-1</p>
            <p><strong>Hours:</strong> Monday-Friday, 9 AM - 5 PM EST</p>
          </div>
        </section>
      </div>

      <footer className="public-footer">
        <p>&copy; 2024 Healthcare Portal. All rights reserved.</p>
        <p>HIPAA Compliant | Secure | Private</p>
      </footer>
    </div>
  );
}

export default HealthInfo;