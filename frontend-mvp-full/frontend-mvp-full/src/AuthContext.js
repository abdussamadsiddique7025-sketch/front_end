import React, {createContext, useState, useEffect} from 'react';

const AuthContext = createContext();

export function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(()=>{
    const raw = localStorage.getItem('well_token');
    if(raw){
      try{
        const parsed = JSON.parse(atob(raw));
        setUser({id:parsed.id, role:parsed.role, name: parsed.name || 'Demo'});
        setToken(raw);
      }catch(e){}
    }
  },[]);

  function loginSuccess(userObj, tokenStr){
    localStorage.setItem('well_token', tokenStr);
    setUser(userObj);
    setToken(tokenStr);
  }
  function logout(){
    localStorage.removeItem('well_token');
    setUser(null); setToken(null);
  }
  return <AuthContext.Provider value={{user, token, loginSuccess, logout}}>{children}</AuthContext.Provider>
}

export default AuthContext;
