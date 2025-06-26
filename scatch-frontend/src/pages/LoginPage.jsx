import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';
import { toast } from 'react-toastify'; // 1. IMPORT TOAST

const API_URL = "http://localhost:3001";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // 2. We no longer need the 'error' state, toasts will handle it.
  // const [error, setError] = useState(null); 

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = { email, password };
      const response = await axios.post(`${API_URL}/users/login`, payload, {
        withCredentials: true
      });
      
      if (response.data && response.data.user) {
        login(response.data.user);
      }
      
      navigate('/');
      toast.success('Login successful! Welcome back.'); // 3. SUCCESS TOAST

    } catch (err) {
      console.error('Login failed:', err.response);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage); // 4. ERROR TOAST
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login to Scatch</h2>
        {/* We removed the old error message display */}
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

      <div className="form-link">
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;