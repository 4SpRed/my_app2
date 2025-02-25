import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Assurez-vous que le style est bien défini

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Connexion</h2>
        <label>Email :</label>
        <input type="email" placeholder="Entrez votre email" />

        <label>Mot de passe :</label>
        <input type="password" placeholder="Entrez votre mot de passe" />

        <button className="btn-primary">Se connecter</button>

        {/* ✅ Bouton S'inscrire */}
        <button className="btn-secondary" onClick={() => navigate("/auth")}>
          S'inscrire
        </button>
      </div>
    </div>
  );
}

export default Login;
