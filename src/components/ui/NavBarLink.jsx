// src/components/ui/NavBarLink.jsx
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const NavBarLink = () => {
    const { isAuthenticated, setIsAuthenticated, username, userRole, isAdmin } = useContext(AuthContext);

    function logout(){
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
    }

    return (
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <NavLink
                to="/contacto"
                className={({isActive}) => 
                    isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                }
                >
                    Contacto
                </NavLink>
            </li>
            
            {isAuthenticated ? (
                <>
                {/* If user is a seller, show seller dashboard link */}
                {userRole === 'seller' && (
                    <li className="nav-item">
                        <NavLink
                        to="/seller"
                        className={({isActive}) => 
                        isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                        }
                        end
                        >
                            Dashboard Vendedor
                        </NavLink>
                    </li>
                )}
                
                {/* If user is an admin, show admin dashboard link */}
                {isAdmin && (
                    <li className="nav-item">
                        <NavLink
                        to="/admin"
                        className={({isActive}) => 
                        isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                        }
                        end
                        >
                            Panel Admin
                        </NavLink>
                    </li>
                )}
                
                <li className="nav-item">
                    <NavLink
                    to="/profile"
                    className={({isActive}) => 
                    isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                    }
                    end
                    >
                        {`Hola, ${username}`}
                    </NavLink>
                </li>

                <li className='nav-item' onClick={logout}>
                    <NavLink
                    to="/"
                    className={({isActive}) =>
                        isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                    }
                    end
                    >
                        Cerrar Sesión
                    </NavLink>
                </li>
                </>
            ):(
                <>
                <li className="nav-item">
                <NavLink
                    to="/login"
                    className={({isActive}) =>
                        isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                    }
                    end
                    >
                        Iniciar Sesión
                    </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                        to="/register"
                        className={({isActive}) =>
                            isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                        }
                        end
                        >
                            Registrarse
                        </NavLink>
                    </li>
                </>
            )}
        </ul>
    )
}

export default NavBarLink;