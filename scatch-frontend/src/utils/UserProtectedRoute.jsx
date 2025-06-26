// /src/utils/UserProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// 1. IMPORT THE CORRECT CONTEXT: AuthContext
import { AuthContext } from '../context/AuthContext'; 

const UserProtectedRoute = ({ children }) => {
    // 2. USE THE CORRECT CONTEXT
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // You might want to show a spinner here
        return <div>Loading user state...</div>;
    }

    if (!user) {
        // If user is not logged in, redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    // If user is logged in, render the child component (e.g., MyOrders, CartPage)
    return children;
};

export default UserProtectedRoute;