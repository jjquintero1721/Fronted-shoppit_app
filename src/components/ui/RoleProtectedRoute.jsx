// src/components/ui/RoleProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Spinner from './Spinner';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, username } = useContext(AuthContext);
  const location = useLocation();

  // Si todavía no se ha verificado la autenticación o no hay nombre de usuario todavía
  if (isAuthenticated && !username) {
    return <Spinner loading={true} />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Comprobar si el usuario tiene el rol adecuado
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si pasa todas las comprobaciones, renderizar el componente hijo
  return children;
};

export default RoleProtectedRoute;