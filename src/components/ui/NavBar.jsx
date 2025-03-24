import { FaCartShopping } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import styles from "./NavBar.module.css";
import NavBarLink from './NavBarLink';

const NavBar = ({}) => {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 ${styles.stickyNavbar}`}>
      <div className="container">
        <link className="navbar-brand fw-bold text-uppercase" to="/">SHOPPIT</link>
        <button
          className="navbar-toggler"
          type="button"
          dat-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <NavBarLink />
          <Link to="/cart" className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`}>
            <FaCartShopping />
            <span
            clasName="position-absolute top-0 start-100 translate-middle badge rounded-pill"
            style={{fontSize: "0.85rem", padding: "0.5rem 0.65rem", backgroundColor: "#6050DC"}}
            >
              12
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;