import React, {useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function App(){
  const {user, logout} = useContext(AuthContext);
  const nav = useNavigate();
  function onLogout(){ logout(); nav('/'); }
  return (
    <div className="container">
      <header className="header">
        <h1>WellCare</h1>
        <nav>
          <Link to="/" className="btn">Home</Link>
          {user ? <>
            <Link to="/profile" className="btn ghost">Profile</Link>
            {user.role==='patient' ? <Link to="/patient" className="btn">Dashboard</Link> : <Link to="/provider" className="btn">Provider</Link>}
            <button onClick={onLogout} className="btn ghost">Logout</button>
          </> : <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn ghost">Register</Link>
          </>}
        </nav>
      </header>

      <main className="hero center">
        <h2>Your preventive care hub</h2>
        <p>Track goals, receive reminders, and collaborate with your healthcare provider.</p>
        {!user && <div style={{marginTop:20}}>
          <Link to="/login" className="cta">Sign in</Link>
        </div>}
      </main>
    </div>
  );
}
