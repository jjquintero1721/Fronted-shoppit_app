// src/components/ui/UnauthorizedPage.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const { isAuthenticated, userRole, username } = useContext(AuthContext);

  return (
    <header className="py-3 my-5" style={{backgroundColor: "#dc3545"}}>
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bold">Acceso Denegado</h1>
          <p className="lead fw-normal text-white-75 mb-4">
            No tienes permiso para acceder a esta página. Esta sección requiere privilegios adicionales.
          </p>
          
          {isAuthenticated ? (
            <div>
              <p className="mb-4">
                Hola, <strong>{username}</strong>. Estás conectado como <strong>{userRole === 'user' ? 'Usuario' : userRole === 'vendor' ? 'Vendedor' : 'Administrador'}</strong>, 
                pero esta área requiere un nivel de acceso diferente.
              </p>
              
              {userRole === 'user' && (
                <p className="mb-4">
                  Si deseas vender productos en nuestra plataforma, puedes actualizar tu cuenta a vendedor
                  contactando con nuestro equipo de soporte.
                </p>
              )}
              
              <div className="mt-4">
                {userRole === 'vendor' && (
                  <Link to="/vendor/dashboard" className="btn btn-light btn-lg me-3">
                    Ir al panel de vendedor
                  </Link>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/dashboard" className="btn btn-light btn-lg me-3">
                    Ir al panel de administrador
                  </Link>
                )}
                <Link to="/" className="btn btn-light btn-lg">
                  Volver a la tienda
                </Link>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-light btn-lg">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default UnauthorizedPage;