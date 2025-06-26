// src/utils/OwnerProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3001";

// This component will check for a valid owner session on the backend
const OwnerProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null to indicate loading state

  useEffect(() => {
    const checkOwnerAuth = async () => {
      try {
        // We use our protected /owners/admin route to verify the cookie
        await axios.get(`${API_URL}/owners/admin`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkOwnerAuth();
  }, []);

  if (isAuthenticated === null) {
    // While checking, show a loading message or a spinner
    return <p style={{ textAlign: 'center' }}>Verifying owner access...</p>;
  }

  // If authenticated, render the component that was passed in (the dashboard)
  // If not, redirect them to the owner login page
  return isAuthenticated ? children : <Navigate to="/owner/login" />;
};

export default OwnerProtectedRoute;