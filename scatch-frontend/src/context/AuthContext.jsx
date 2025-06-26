// /src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Create the context
export const AuthContext = createContext();

// Create an axios instance for API calls
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
      setUser(null);
    }
  };

  // --- THIS IS THE FIX ---
  // We need to add `setUser` to the value object so other components can use it.
  const value = { user, setUser, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};