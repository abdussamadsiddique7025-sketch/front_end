# front_end
Healthcare Wellness &amp; Preventive Care Portal frontend

Project Overview:

The Healthcare Wellness & Preventive Care Portal is a full-stack web application designed to promote wellness tracking, preventive care compliance, and secure interactions between patients and healthcare providers.
The solution was developed as part of a hackathon, with a focus on usability, security, personalization, and healthcare privacy considerations.

Technologies Used:
Frontend
React.js (Vite)
React Router
TailwindCSS
Axios
Context API for authentication state management

Backend:
Node.js with Express.js
MongoDB Atlas (NoSQL)
Mongoose
JWT Authentication
bcryptjs for password hashing

DevOps / Deployment:
Render (Backend Hosting)
Vercel / Netlify (Frontend Hosting)
GitHub Actions (CI/CD workflow)

Key Features
1. Authentication System:
Login and Registration for two roles: Patient and Healthcare Provider
JWT-based user session handling
Role-based access control to restrict views and API access

2. Patient Dashboard:
Wellness goal tracking (steps, sleep, water intake)
Progress bars for each goal
Preventive care reminders
Daily health tips
Option to add user-defined goals

3. Provider Dashboard:
View all assigned patients
Check compliance (Goal Met / Missed Checkup)
View individual patient details including goals and reminders

4. Profile Management:
Patients can view and edit profile information
Fields include name, allergies, medications, and basic details

5. Public Health Information Page:
General preventive health guidelines
Cards for vaccines, screenings, and privacy
Informational content accessible without login

6. Privacy and Security Practices:
Role-restricted access
Consent checkbox during registration
Secure password hashing
Environment variables stored securely


Pages Included in the Final Website
Landing Page
Project hero section
Overview content
Call-to-action button
Feature highlights
Navigation bar including Home, Dashboard, Providers, Info, Login, Signup

Login Page:
Email and password fields
Role selection dropdown

Register Page:
Full name, email, and role selection
Data consent checkbox

Patient Dashboard:
List of wellness goals
Add new goal option
Preventive reminders
Health tip of the day section

Provider Dashboard:
List of patients under the provider
Compliance status
Detailed patient page

Patient Detail Page:
Summary of goals and compliance
Placeholder data for demonstration

Profile Page:
Edit name, allergies, and other health information
