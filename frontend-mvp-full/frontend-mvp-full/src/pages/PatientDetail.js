import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { getPatientDetails } from '../api';

export default function PatientDetail(){
  const {id} = useParams();
  const [data,setData] = useState(null);
  useEffect(()=>{ setData(getPatientDetails(parseInt(id))); },[id]);
  if(!data) return <div className="container">Loading...</div>;
  return (
    <div className="container">
      <h2>Patient: {data.user.name}</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Profile</h3>
          <div><strong>Allergies:</strong> {data.user.allergies}</div>
          <div><strong>Medications:</strong> {data.user.medications}</div>
        </div>
        <div className="card">
          <h3>Recent Goals</h3>
          <ul>{data.goals.map((g,i)=>(<li key={i}>{g.date} — Steps: {g.steps} — Sleep: {g.sleep}</li>))}</ul>
        </div>
        <div className="card">
          <h3>Reminders</h3>
          <ul>{data.reminders.map((r,i)=>(<li key={i}>{r.title} — Due {r.due}</li>))}</ul>
        </div>
      </div>
    </div>
  );
}
