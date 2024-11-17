// AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Auth Context
const AuthContext = createContext();

// AuthProvider to wrap your app and provide login state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load token and user data from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      // Decode or fetch user data based on token if needed
      // For simplicity, let's assume you are storing user info in localStorage as well
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, []);

  const login = (token, userData) => {
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth Context in any component
export const useAuth = () => useContext(AuthContext);