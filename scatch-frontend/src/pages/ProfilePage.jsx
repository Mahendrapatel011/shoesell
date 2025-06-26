import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ProfilePage.css'; // Updated styles will be in this file

const API_URL = "http://localhost:3001";

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);

    const [fullName, setFullName] = useState('');
    const [contact, setContact] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setContact(user.contact || '');
        }
    }, [user]);

    // Helper function to get initials from name or email
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ');
        if (words.length > 1 && words[0] && words[words.length - 1]) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.put(
                `${API_URL}/users/profile/update`,
                { fullName, contact },
                { withCredentials: true }
            );
            setUser(response.data.user);
            setMessage(response.data.message);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
            setError(errorMessage);
            console.error("Profile update error:", err);
        }
    };

    if (!user) {
        return <div className="loading-container">Loading your profile...</div>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                {/* Left Sidebar for Avatar and Info */}
                <aside className="profile-sidebar">
                    <div className="profile-avatar">
                        <span className="avatar-initials">
                            {getInitials(user.fullName || user.email)}
                        </span>
                    </div>
                    <h2 className="profile-name">{user.fullName || 'New User'}</h2>
                    <p className="profile-email">{user.email}</p>
                </aside>

                {/* Right side for the form */}
                <main className="profile-form-container">
                    <h1>Edit Profile</h1>
                    <p>Update your personal information below.</p>
                    
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={user.email}
                                disabled
                            />
                            <small>Your email address cannot be changed.</small>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact">Contact Number</label>
                            <input
                                id="contact"
                                type="tel"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Enter your contact number"
                            />
                        </div>

                        <button type="submit" className="update-button">Save Changes</button>

                        {message && <p className="success-message">{message}</p>}
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;