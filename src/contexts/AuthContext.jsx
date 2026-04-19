import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega do localStorage uma única vez quando inicializa
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken && storedUserType) {
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
    
    // Pequeno delay arquitetural para não estourar o layout na validação
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

  const logout = () => {
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
