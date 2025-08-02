// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Configure axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/verify');
          if (response.data.success) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('adminToken');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('adminToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};