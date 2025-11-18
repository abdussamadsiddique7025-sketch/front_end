import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import PatientDetail from './pages/PatientDetail';
import { AuthProvider } from './AuthContext';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/patient" element={<Protected role='patient'><PatientDashboard/></Protected>} />
          <Route path="/provider" element={<Protected role='provider'><ProviderDashboard/></Protected>} />
          <Route path="/profile" element={<Protected><Profile/></Protected>} />
          <Route path="/patient/:id" element={<Protected role='provider'><PatientDetail/></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

function Protected({children, role}){
  const token = localStorage.getItem('well_token');
  if(!token) return <Navigate to="/login" replace />;
  if(role){
    try{
      const parsed = JSON.parse(atob(token));
      if(parsed.role !== role) return <Navigate to="/" replace />;
    }catch(e){
      return <Navigate to="/login" replace />;
    }
  }
  return children;
}
