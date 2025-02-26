
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";


const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+33",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@$!%*?&]/.test(password)
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setMessage("❌ Veuillez remplir tous les champs !");
      return;
    }
    if (!/^[0-9]+$/.test(formData.phone)) {
      setMessage("❌ Le numéro de téléphone doit contenir uniquement des chiffres !");
      return;
    }
    if (!validatePassword(formData.password)) {
      setMessage("❌ Le mot de passe doit respecter les critères de sécurité !");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Inscription réussie ! Vérifiez votre email.");
      } else {
        setMessage(`❌ Erreur : ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Erreur lors de l'inscription.");
    }
  };
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nom</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Prénom</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group phone-group">
            <label>Numéro de téléphone</label>
            <div className="phone-input">
              
            
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="phone-number-input" />
            </div>
          </div>
          <div className="input-group password-group">
            <label>Mot de passe</label>
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required onBlur={() => setPasswordTouched(true)} style={{ borderColor: passwordTouched && !validatePassword(formData.password) ? "red" : "" }} />
              <span className="toggle-password" onClick={() => togglePasswordVisibility("password")}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
          </div>
          <div className="input-group password-group">
            <label>Confirmer le mot de passe</label>
            <div className="password-input">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ borderColor: formData.password === formData.confirmPassword && validatePassword(formData.password) ? "green" : "red" }} />
              <span className="toggle-password" onClick={() => togglePasswordVisibility("confirmPassword")}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
          </div>
          <button type="submit" className="register-button">S'inscrire</button>
        </form>
        {message && <p className={`form-message ${message.includes("❌") ? "error" : "success"}`}>{message}</p>}
        <p className="login-link">Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
      </div>
    </div>
  );
};
export default Register;
