import { useAuth } from '../hooks/useAuth';

const ProtectedAction = ({ children, permiso, fallback = null }) => {
  const { tienePermiso } = useAuth();

  if (!tienePermiso(permiso)) {
    return fallback;
  }

  return children;
};

export default ProtectedAction;
