import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await authAPI.checkAuthStatus();
      
      if (response.data.success && response.data.isAuthenticated) {
        dispatch({ type: actionTypes.SET_USER, payload: response.data.user });
      } else {
        dispatch({ type: actionTypes.LOGOUT });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: actionTypes.LOGOUT });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });
      
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        dispatch({ type: actionTypes.SET_USER, payload: response.data.user });
        return { success: true, message: response.data.message };
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });
      
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        dispatch({ type: actionTypes.SET_USER, payload: response.data.user });
        return { success: true, message: response.data.message };
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: actionTypes.LOGOUT });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: actionTypes.CLEAR_ERROR });
      
      const response = await authAPI.updateProfile(profileData);
      
      if (response.data.success) {
        dispatch({ type: actionTypes.SET_USER, payload: response.data.user });
        return { success: true, message: response.data.message };
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: actionTypes.CLEAR_ERROR });
      
      const response = await authAPI.changePassword(passwordData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 