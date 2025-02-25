
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
const Header = () => {
  const navigate = useNavigate();
  // Fonction pour actualiser la page
  const handleHomeClick = () => {
    navigate("/"); // Redirige vers la home
    window.location.reload(); // Force le rafraîchissement
  };
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" onClick={handleHomeClick} className="logo-link">Dawi</Link>
      </div>
      <nav>
        <ul className="nav-menu">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/search">Rechercher</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Se connecter</Link></li> {/* ✅ Ajout du lien */}
        </ul>
      </nav>
    </header>
  );
};
export default Header;
