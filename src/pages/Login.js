import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
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
      if (!response.ok) throw new Error(data.error || "Échec de la connexion.");

      console.log("✅ Connexion réussie :", data);

      localStorage.setItem("token", data.token);
      setUser(data.user);

      if (data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/account");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Connexion</h2>
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
        <button className="btn-signup" onClick={() => navigate("/register")}>
          S'inscrire
        </button>
      </div>
    </div>
  );
}

export default Login;