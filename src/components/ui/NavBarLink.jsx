// src/components/ui/NavBarLink.jsx
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Dropdown } from 'react-bootstrap'
import { FaUser, FaStore, FaShieldAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'

const NavBarLink = () => {
    const { isAuthenticated, setIsAuthenticated, username, userRole, isAdmin, isVendor } = useContext(AuthContext)

    function logout(){
        localStorage.removeItem("access")
        setIsAuthenticated(false)
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
                <li className="nav-item dropdown">
                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="dark" 
                            id="user-dropdown"
                            className="nav-link fw-semibold"
                            style={{ background: 'transparent', border: 'none', padding: '0.5rem 1rem' }}
                        >
                            <FaUserCircle className="me-1" /> {username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu 
                            variant="dark"
                            style={{ 
                                backgroundColor: '#252525', 
                                borderColor: '#444', 
                                marginTop: '8px',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.3)' 
                            }}
                        >
                            <Dropdown.Item as={NavLink} to="/profile">
                                <FaUser className="me-2" /> Mi perfil
                            </Dropdown.Item>
                            
                            {(isVendor || isAdmin) && (
                                <Dropdown.Item as={NavLink} to="/vendor/dashboard">
                                    <FaStore className="me-2" /> Panel de vendedor
                                </Dropdown.Item>
                            )}
                            
                            {isAdmin && (
                                <Dropdown.Item as={NavLink} to="/admin/dashboard">
                                    <FaShieldAlt className="me-2" /> Panel de administrador
                                </Dropdown.Item>
                            )}
                            
                            <Dropdown.Divider style={{ borderColor: '#444' }} />
                            
                            <Dropdown.Item onClick={logout} as={NavLink} to="/">
                                <FaSignOutAlt className="me-2" /> Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            ) : (
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

export default NavBarLink