// src/components/ui/ProtectedSellerRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Spinner from './Spinner';

const ProtectedSellerRoute = ({ children }) => {
  const { isAuthenticated, username, userRole, isLoading } = useContext(AuthContext);
  const location = useLocation();
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (userRole !== 'seller') {
    return (
      <div className="alert alert-danger m-5">
        <h3>Acceso Denegado</h3>
        <p>Lo sentimos, solo los vendedores pueden acceder a esta página.</p>
        <p>Tu cuenta actual está registrada como usuario regular.</p>
        <a href="/" className="btn btn-primary">Volver al Inicio</a>
      </div>
    );
  }
  
  return children;
};

export default ProtectedSellerRoute;