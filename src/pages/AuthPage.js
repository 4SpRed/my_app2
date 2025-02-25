import React from "react";
import { Link } from "react-router-dom";
import "./AuthPage.css"; // Ajouter un fichier CSS pour le style

function AuthPage() {
  return (
    <div className="auth-container">
      <h2>Inscrivez-vous ou connectez-vous</h2>
      <p>Nouveau sur notre plateforme ?</p>

      <Link to="/register" className="btn btn-primary">S'INSCRIRE</Link>
      <Link to="/login" className="btn btn-secondary">SE CONNECTER</Link>
    </div>
  );
}

export default AuthPage;
