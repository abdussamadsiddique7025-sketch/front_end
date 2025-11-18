import React, {useEffect, useState} from 'react';
import { getProfile, updateProfile } from '../api';

export default function Profile(){
  const token = localStorage.getItem('well_token');
  const parsed = token ? JSON.parse(atob(token)) : null;
  const userId = parsed ? parsed.id : 1;

  const [profile, setProfile] = useState({name:'',email:'',allergies:'',medications:''});
  const [msg,setMsg] = useState('');

  useEffect(()=>{ const p = getProfile(userId); setProfile(p); },[]);

  function onSave(e){
    e.preventDefault();
    const res = updateProfile(userId, {name:profile.name,allergies:profile.allergies,medications:profile.medications});
    setMsg('Saved');
    setTimeout(()=>setMsg(''),2000);
  }

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="card" style={{maxWidth:600}}>
        <form onSubmit={onSave}>
          <div className="form-row"><label>Name</label><input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} /></div>
          <div className="form-row"><label>Email</label><input value={profile.email} readOnly /></div>
          <div className="form-row"><label>Allergies</label><input value={profile.allergies} onChange={e=>setProfile({...profile,allergies:e.target.value})} /></div>
          <div className="form-row"><label>Medications</label><input value={profile.medications} onChange={e=>setProfile({...profile,medications:e.target.value})} /></div>
          <button className="cta" type="submit">Save</button>
          {msg && <div style={{marginTop:10}}>{msg}</div>}
        </form>
      </div>
    </div>
  );
}
