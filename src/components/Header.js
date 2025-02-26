import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    console.error("❌ AuthContext est undefined dans Header.js !");
    return null;
  }

  const { user, logout } = auth;

  // Gestion du clic sur le logo pour rafraîchir la page
  const handleHomeClick = () => {
    navigate("/");
    window.location.reload();
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    logout(); // ✅ Déconnecte l'utilisateur et supprime le token via AuthContext
    navigate("/login");
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

          {user ? (
            <>
              <li><Link to="/account">Mon Profil</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Se Déconnecter</button></li>
            </>
          ) : (
            <li><Link to="/login">Se connecter</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
