import React, {useEffect, useState} from 'react';
import { getAssignedPatients } from '../api';
import { Link } from 'react-router-dom';

export default function ProviderDashboard(){
  const [patients,setPatients] = useState([]);
  useEffect(()=>{ setPatients(getAssignedPatients(2)); },[]);
  return (
    <div className="container">
      <h2>Provider Dashboard</h2>
      <div className="card">
        <h3>Assigned Patients</h3>
        <ul>
          {patients.map(p=>(
            <li key={p.id}>{p.name} — <strong style={{color: p.status==='Goal Met'?'green':'red'}}>{p.status}</strong> &nbsp; <Link to={'/patient/'+p.id} className="small">View</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
