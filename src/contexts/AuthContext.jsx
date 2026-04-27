import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken && storedUserType) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem('user')
        localStorage.removeItem('userType')
        localStorage.removeItem('token')
      } else {
        try {
          setUser(JSON.parse(storedUser));
          setUserType(storedUserType);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          localStorage.removeItem('user');
          localStorage.removeItem('userType');
          localStorage.removeItem('token');
        }
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, type, jwt) => {
    setUser(userData);
    setUserType(type);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
    localStorage.setItem('token', jwt);
  };

  const logout = async () => {
    // Chamar endpoint de logout no backend para invalidar token
    if (token) {
      try {
        const API_URL = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'http://localhost:8080/api';
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Erro ao fazer logout no backend:', error);
      }
    }
    
    setUser(null);
    setUserType(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, userType, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
