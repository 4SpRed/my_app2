import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Assurez-vous que le fichier CSS est bien défini

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Vérification des champs vides
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Connexion réussie :", data);

        // ✅ Stocker le token et rediriger
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.error || "Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Connexion</h2>

        {/* ✅ Affichage d'un message d'erreur si le login échoue */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleLogin}>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-login">Se connecter</button>
        </form>

        {/* ✅ Bouton "S'inscrire" redirige vers `/register` */}
        <button className="btn-signup" onClick={() => navigate("/register")}>
          S'inscrire
        </button>
      </div>
    </div>
  );
}

export default Login;
