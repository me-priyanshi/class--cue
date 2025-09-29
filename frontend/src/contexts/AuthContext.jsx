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

      const persistentToken = localStorage.getItem('access_token');
      const sessionToken = localStorage.getItem('access_token');
      const token = persistentToken || sessionToken;

      if (token) {
        try {
          const userProfile = await apiService.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Auth validation failed:', error);
          clearTokens();
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const login = async (identifier, password, role = 'student', remember = false) => {
    try {
      const response = await apiService.login(identifier, password, role);

      if(!response || !response.access){
        throw new Error('Invalid response from server');
      }

      // Store tokens based on remember preference
      const storage = remember ? localStorage : sessionStorage;
      
      // Store tokens and user data
      storage.setItem('access_token', response.access);
      storage.setItem('refresh_token', response.refresh);

      if(response.user) {
        storage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }

      return { 
        success: true, 
        user: response.user 
      };
    } catch (error) {
      console.error('Login failed:', error);
      clearTokens();
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
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

  const updateUserProfile = async (profileData) => {
    try {
      const updatedProfile = await apiService.updateUserProfile(profileData);
      setUser(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update user profile:', error);
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
    refreshUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};