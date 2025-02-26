import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Vérifie si l'utilisateur est connecté

  // Fonction pour actualiser la page
  const handleHomeClick = () => {
    navigate("/"); // Redirige vers la home
    window.location.reload(); // Force le rafraîchissement
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    navigate("/login"); // Redirige vers la page de connexion
    window.location.reload(); // Rafraîchit la page pour mettre à jour le header
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

          {token ? (
            <>
              <li><Link to="/profile">Mon Profil</Link></li> {/* ✅ Ajout du lien vers le profil */}
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
