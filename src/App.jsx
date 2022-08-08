
import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './helpers/AuthContext';

import Registration from './newComponents/Registration';
import UsersBase from './newComponents/UsersBase';
import Login from './newComponents/Login';

function App() {
  const [authState, setAuthState] = useState({ email: '', id: 0, status: false });

  const nav = useNavigate();

  const PrivateRoute = ({ children }) => (
    authState.status ? children : nav('/newlogin')
  );

  useEffect(() => {
    axios.get('http://localhost:3001/authentification/auth', {
      headers: { accessToken: localStorage.getItem('accessToken') },
    })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ email: '', id: 0, status: false });
        } else {
          setAuthState({ email: response.data.email, id: response.data.id, status: true });
        }
      });
  }, []);

  const logOut = () => {
    localStorage.removeItem('accessToken');
    setAuthState({ username: '', id: 0, status: false });
    nav('/newlogin');
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState, logOut }}>
        <Routes>
          <Route path="/" element={(<PrivateRoute><UsersBase /></PrivateRoute>)} />
          <Route path="/newRegistration" element={<Registration />} />
          <Route path="/newlogin" element={<Login />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
