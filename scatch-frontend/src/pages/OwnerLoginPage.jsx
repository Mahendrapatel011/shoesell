// src/pages/OwnerLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // We can reuse the same CSS for a consistent look

const API_URL = "http://localhost:3001";

const OwnerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { email, password };
      // --- CHANGED: Hitting the owner login endpoint ---
      await axios.post(`${API_URL}/owners/login`, payload, {
        withCredentials: true
      });
      
      // --- CHANGED: Redirect to the owner's dashboard ---
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Owner login failed:', err.response);
      const errorMessage = err.response?.data || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        {/* --- CHANGED: Title --- */}
        <h2>Owner Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {/* --- REMOVED: The "Register" link is not needed for owners --- */}
    </div>
  );
};

export default OwnerLoginPage;