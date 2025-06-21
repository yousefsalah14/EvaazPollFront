import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error('Failed to parse auth data from localStorage', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userToken) => {
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};