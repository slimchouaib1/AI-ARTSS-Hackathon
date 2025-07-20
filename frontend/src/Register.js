import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', { username, password });
      setMessage(res.data.message);
      if (res.data.success) {
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Register</button>
      {message && <p className="info">{message}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default RegisterPage;
