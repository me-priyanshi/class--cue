import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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

  useEffect(() => {
    // Check if user is logged in and validate token
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userProfile = await apiService.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Auth validation failed:', error);
          // Clear invalid tokens
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (identifier, password, role = 'student') => {
    try {
      const response = await apiService.login(identifier, password, role);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const registerStudent = async (studentData) => {
    try {
      const response = await apiService.registerStudent(studentData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Student registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const registerTeacher = async (teacherData) => {
    try {
      const response = await apiService.registerTeacher(teacherData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Teacher registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  const refreshUserProfile = async () => {
    try {
      const userProfile = await apiService.getUserProfile();
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateUser,
    registerStudent,
    registerTeacher,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
