import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './RegistrationPage.css';
import { toast } from 'react-toastify'; // 1. IMPORT TOAST

const API_URL = "http://localhost:3001";

const RegistrationPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // 2. We no longer need the 'error' state
    // const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const payload = { fullName, email, password };
            const response = await axios.post(`${API_URL}/users/register`, payload, {
                withCredentials: true,
            });

            if (response.data && response.data.user) {
                login(response.data.user);
            }
            
            navigate('/');
            toast.success('Registration successful! Welcome to Scatch.'); // 3. SUCCESS TOAST

        } catch (err) {
            const errorMessage = err.response?.data || "Registration failed. Please try again.";
            toast.error(errorMessage); // 4. ERROR TOAST
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <form className="registration-form" onSubmit={handleRegister}>
                <h2>Create an Account</h2>
                {/* We removed the old error display */}
                
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

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
                        minLength="6"
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="form-button" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationPage;