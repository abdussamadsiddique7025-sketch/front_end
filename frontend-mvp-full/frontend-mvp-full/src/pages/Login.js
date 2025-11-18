import React, {useState, useContext} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authLogin } from '../api';
import AuthContext from '../AuthContext';

export default function Login(){
  const [email,setEmail] = useState('patient@example.com');
  const [password,setPassword] = useState('patient');
  const [err,setErr] = useState('');
  const {loginSuccess} = useContext(AuthContext);
  const nav = useNavigate();

  function onSubmit(e){
    e.preventDefault();
    const res = authLogin(email,password);
    if(res.error){ setErr(res.error); return; }
    // store token and user
    const token = btoa(JSON.stringify({id:res.user.id,role:res.user.role,name:res.user.name}));
    loginSuccess(res.user, token);
    nav(res.user.role==='patient' ? '/patient' : '/provider');
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="card" style={{maxWidth:480}}>
        <form onSubmit={onSubmit}>
          <div className="form-row"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="form-row"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {err && <div style={{color:'red'}}>{err}</div>}
          <div style={{marginTop:12}}>
            <button className="cta" type="submit">Sign in</button>
            <Link to="/register" style={{marginLeft:12}} className="small">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
