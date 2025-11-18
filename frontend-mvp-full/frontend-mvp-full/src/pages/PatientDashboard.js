import React, {useState, useEffect} from 'react';
import { getDashboardData, logGoal } from '../api';

export default function PatientDashboard(){
  const token = localStorage.getItem('well_token');
  const parsed = token ? JSON.parse(atob(token)) : null;
  const userId = parsed ? parsed.id : 1;

  const [data, setData] = useState({goals:[], latest:null, reminders:[]});
  const [steps, setSteps] = useState('');
  const [sleep, setSleep] = useState('');

  function load(){ const d = getDashboardData(userId); setData(d); }
  useEffect(()=>{ load(); },[]);

  function onLog(e){
    e.preventDefault();
    logGoal(userId, {date: new Date().toISOString().slice(0,10), steps: parseInt(steps||0), sleep: parseFloat(sleep||0)});
    setSteps(''); setSleep('');
    load();
  }

  return (
    <div className="container">
      <h2>Patient Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Daily Goals</h3>
          <div>Steps: {data.latest?.steps || 0}</div>
          <div className="progress"><i style={{width: ((data.latest?.steps||0)/10000*100)+'%'}}></i></div>
          <div style={{marginTop:10}}>Sleep: {data.latest?.sleep || 0} hrs</div>
        </div>
        <div className="card">
          <h3>Upcoming Reminders</h3>
          <ul>{data.reminders.map((r,i)=>(<li key={i}>{r.title} — Due {r.due}</li>))}</ul>
        </div>
        <div className="card">
          <h3>Log Goal</h3>
          <form onSubmit={onLog}>
            <div className="form-row"><label>Steps</label><input value={steps} onChange={e=>setSteps(e.target.value)} /></div>
            <div className="form-row"><label>Sleep (hrs)</label><input value={sleep} onChange={e=>setSleep(e.target.value)} /></div>
            <button className="cta" type="submit">Log</button>
          </form>
        </div>
        <div className="card">
          <h3>Health Tip</h3>
          <p>Stay hydrated and take short walks every hour.</p>
        </div>
      </div>
    </div>
  );
}
