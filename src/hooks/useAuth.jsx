import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Primero intenta leer del localStorage (usuario autenticado)
    const savedUser = localStorage.getItem('compradorAuth');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('compradorAuth', JSON.stringify(user));
    } else {
      localStorage.removeItem('compradorAuth');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
