import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBox from './ChatBox';
import LoginPage from './Login';
import RegisterPage from './Register';
import PatientsList from './PatientsList';
import Navbar from './Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));

  const handleLogin = (username) => {
    localStorage.setItem('user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <h1 className="app-title">💬 Chemo Assistant</h1>
        {user && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={user ? <ChatBox /> : <Navigate to="/login" />} />
          <Route path="/patients" element={user ? <PatientsList /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
