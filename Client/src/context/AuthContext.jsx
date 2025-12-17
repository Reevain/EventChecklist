import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Verify authentication by calling the backend verify endpoint
      // This checks if the cookie is valid and returns user info
      const response = await authAPI.verify();
      if (response && response.data && response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // If verify fails, user is not authenticated
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      // After successful login, verify to get user info
      const verifyResponse = await authAPI.verify();
      if (verifyResponse && verifyResponse.data && verifyResponse.data.user) {
        setUser(verifyResponse.data.user);
      }
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      // After successful registration, verify to get user info
      const verifyResponse = await authAPI.verify();
      if (verifyResponse && verifyResponse.data && verifyResponse.data.user) {
        setUser(verifyResponse.data.user);
      }
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register,
      logout, 
      isLoading,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
