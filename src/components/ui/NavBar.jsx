// src/components/ui/NavBar.jsx
import { HiMiniShoppingCart } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import styles from "./NavBar.module.css";
import NavBarLink from './NavBarLink';
import SearchBar from '../search/SearchBar';

const NavBar = ({ numCartItems }) => {
  return (
    <Navbar expand="lg" className={`navbar-dark bg-dark shadow-sm py-3 ${styles.stickyNavbar}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase text-light">A.I.A.G</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarContent" />
        <Navbar.Collapse id="navbarContent">
          {/* Agregar el componente SearchBar */}
          <div className="d-flex flex-grow-1 mx-lg-3">
            <SearchBar />
          </div>
          <NavBarLink />
          <Link to="/cart" className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`}>
          <HiMiniShoppingCart color="white" />
            {numCartItems > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ fontSize: '0.85rem', padding: '0.5em 0.65em', backgroundColor: '#6050DC' }}
              >
                {numCartItems}
              </span>
            )}
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;