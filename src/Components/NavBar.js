import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Assets/Images/Logo.png"; 

function NavBar() {
  return (
    <nav className="navbar sticky">
      {/* Logo */}
      <div className="logo-container">
        <img src={Logo} alt="Divitia Cambios" className="logo" />
      </div>

      {/* Enlaces */}
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            Acerca de
          </Link>
        </li>
        <li>
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">
            Contacto
          </Link>
        </li>
      </ul>

      {/* Botón de inicio de sesión */}
      <div className="login-button-container">
        <Link to="/login" className="login-button">
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}

export { NavBar };
