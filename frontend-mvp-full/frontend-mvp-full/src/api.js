// Mock API using localStorage to simulate backend behavior.
// In real deployment, replace with axios calls to your backend.
const DB_KEY = 'wellcare_db_v1';

// initialize sample users and data
function loadDB(){
  const raw = localStorage.getItem(DB_KEY);
  if(raw) return JSON.parse(raw);
  const db = {
    users: [
      {id:1, role:'patient', name:'Demo Patient', email:'patient@example.com', password:'patient', allergies:'None', medications:'None'},
      {id:2, role:'provider', name:'Demo Provider', email:'provider@example.com', password:'provider'}
    ],
    goals: [
      {userId:1, date:'2025-11-18', steps:6200, sleep:7.2, water:6}
    ],
    reminders: [
      {userId:1, title:'Annual blood test', due:'2026-01-12'}
    ]
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

export function authLogin(email, password){
  const db = loadDB();
  const user = db.users.find(u=>u.email===email && u.password===password);
  if(!user) return {error:'Invalid credentials'};
  // create fake token
  const token = btoa(JSON.stringify({id:user.id,role:user.role}));
  return {user:{id:user.id,name:user.name,email:user.email,role:user.role}, token};
}

export function authRegister({name,email,password,role}){
  const db = loadDB();
  if(db.users.find(u=>u.email===email)) return {error:'Email exists'};
  const id = db.users.reduce((a,b)=>Math.max(a,b.id),0)+1;
  const user = {id,name,email,password,role,allergies:'',medications:''};
  db.users.push(user); saveDB(db);
  const token = btoa(JSON.stringify({id:user.id,role:user.role}));
  return {user:{id:user.id,name:user.name,email:user.email,role:user.role}, token};
}

export function getProfile(userId){
  const db = loadDB();
  const user = db.users.find(u=>u.id===userId);
  if(!user) return {error:'Not found'};
  return {...user};
}

export function updateProfile(userId, payload){
  const db = loadDB();
  const idx = db.users.findIndex(u=>u.id===userId);
  if(idx===-1) return {error:'Not found'};
  db.users[idx] = {...db.users[idx], ...payload};
  saveDB(db);
  return {...db.users[idx]};
}

export function getDashboardData(userId){
  const db = loadDB();
  const goals = db.goals.filter(g=>g.userId===userId);
  const reminders = db.reminders.filter(r=>r.userId===userId);
  const latest = goals[goals.length-1] || null;
  return {goals, latest, reminders};
}

export function logGoal(userId, payload){
  const db = loadDB();
  db.goals.push({...payload, userId});
  saveDB(db);
  return {ok:true};
}

export function getAssignedPatients(providerId){
  // simplistic: return all patients
  const db = loadDB();
  const patients = db.users.filter(u=>u.role==='patient');
  // compute compliance
  const res = patients.map(p=>{
    const reminders = db.reminders.filter(r=>r.userId===p.id);
    const missed = reminders.some(r=>new Date(r.due) < new Date());
    return {id:p.id,name:p.name,status: missed ? 'Missed Checkup' : 'Goal Met'};
  });
  return res;
}

export function getPatientDetails(patientId){
  const db = loadDB();
  const user = db.users.find(u=>u.id===patientId);
  const goals = db.goals.filter(g=>g.userId===patientId);
  const reminders = db.reminders.filter(r=>r.userId===patientId);
  return {user, goals, reminders};
}
