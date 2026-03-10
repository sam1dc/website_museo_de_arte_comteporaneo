import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      const savedAuth = localStorage.getItem('compradorAuth');
      
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          
          // Si es empleado/admin, obtener perfil actualizado
          if (authData.tipo === 'empleado' && authData.data?.empleado_id) {
            const response = await authService.obtenerPerfil(authData.data.empleado_id);
            setUser({
              ...authData,
              data: {
                ...authData.data,
                ...response.data
              }
            });
          } else {
            // Para compradores, usar datos guardados
            setUser(authData);
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
          // Si falla, usar datos guardados
          setUser(JSON.parse(savedAuth));
        }
      }
      
      setLoading(false);
    };

    cargarPerfil();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('compradorAuth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('compradorAuth');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
