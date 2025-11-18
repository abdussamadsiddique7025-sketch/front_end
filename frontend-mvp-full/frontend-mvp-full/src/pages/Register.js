import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { authRegister } from '../api';
import AuthContext from '../AuthContext';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('patient');
  const [err,setErr]=useState('');
  const {loginSuccess} = useContext(AuthContext);
  const nav = useNavigate();

  function onSubmit(e){
    e.preventDefault();
    const res = authRegister({name,email,password,role});
    if(res.error){ setErr(res.error); return; }
    const token = btoa(JSON.stringify({id:res.user.id,role:res.user.role,name:res.user.name}));
    loginSuccess(res.user, token);
    nav(role==='patient'?'/patient':'/provider');
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <div className="card" style={{maxWidth:520}}>
        <form onSubmit={onSubmit}>
          <div className="form-row"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="form-row"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="form-row"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <div className="form-row"><label>Role</label><select value={role} onChange={e=>setRole(e.target.value)}><option value="patient">Patient</option><option value="provider">Provider</option></select></div>
          <div className="form-row"><label><input type="checkbox" /> I consent to data usage</label></div>
          {err && <div style={{color:'red'}}>{err}</div>}
          <button className="cta" type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
}
