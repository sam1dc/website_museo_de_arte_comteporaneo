import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      // Verificar si hay sesión de admin o comprador
      const savedAdminAuth = localStorage.getItem('adminAuth');
      const savedCompradorAuth = localStorage.getItem('compradorAuth');
      
      if (savedAdminAuth) {
        try {
          const authData = JSON.parse(savedAdminAuth);
          
          // Obtener perfil actualizado del admin
          if (authData.data?.empleado_id) {
            const response = await authService.obtenerPerfil(authData.data.empleado_id);
            setUser({
              ...authData,
              data: {
                ...authData.data,
                ...response.data
              }
            });
          } else {
            setUser(authData);
          }
        } catch (error) {
          console.error('Error al cargar perfil admin:', error);
          setUser(JSON.parse(savedAdminAuth));
        }
      } else if (savedCompradorAuth) {
        try {
          const authData = JSON.parse(savedCompradorAuth);
          setUser(authData);
        } catch (error) {
          console.error('Error al cargar perfil comprador:', error);
        }
      }
      
      setLoading(false);
    };

    cargarPerfil();
  }, []);

  const login = (userData) => {
    setUser(userData);
    
    // Guardar en localStorage según el tipo de usuario
    if (userData.tipo === 'admin' || userData.tipo === 'empleado') {
      localStorage.setItem('adminAuth', JSON.stringify(userData));
      localStorage.removeItem('compradorAuth'); // Limpiar sesión de comprador si existe
    } else {
      localStorage.setItem('compradorAuth', JSON.stringify(userData));
      localStorage.removeItem('adminAuth'); // Limpiar sesión de admin si existe
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('compradorAuth');
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
