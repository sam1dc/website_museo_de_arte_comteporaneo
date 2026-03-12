import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, esAdmin } = useAuth();
  
  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere admin y el usuario no es admin, redirigir al sitio público
  if (requireAdmin && !esAdmin()) {
    return <Navigate to="/museo-de-arte-contemporaneo" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
