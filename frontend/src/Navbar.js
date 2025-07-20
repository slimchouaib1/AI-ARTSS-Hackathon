import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/">🏠 Chatbot</Link>
      <Link to="/patients">👩‍⚕️ Patients</Link>
      <button onClick={onLogout}>🔓 Logout</button>
    </nav>
  );
}

export default Navbar;
