import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCreditCard, FaGlobe, FaTrash, FaEdit } from "react-icons/fa";
import "./AccountInfo.css";

const AccountInfo = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return <p>Chargement des informations...</p>;

    return (
        <div className="account-container">
            <h2>Mon Compte</h2>

            {/* Bloc Identité */}
            <div className="account-section">
                <h3><FaUser /> Identité</h3>
                <p><strong>Nom :</strong> {user.lastName}</p>
                <p><strong>Prénom :</strong> {user.firstName}</p>
                <p><strong>Email :</strong> {user.email} <FaEnvelope className="verified-icon" /> Vérifié</p>
                <p><strong>Téléphone :</strong> {user.phone} <FaPhone className="verified-icon" /> Vérifié</p>
            </div>

            {/* Bloc Connexion & Sécurité */}
            <div className="account-section">
                <h3><FaLock /> Connexion & Sécurité</h3>
                <p><strong>Mot de passe :</strong> ●●●●●●●● <button className="edit-btn"><FaEdit /></button></p>
                <p><strong>Double authentification :</strong> <span className="active-status">Activée</span></p>
            </div>

            {/* Bloc Paiement & Facturation */}
            <div className="account-section">
                <h3><FaCreditCard /> Paiement & Facturation</h3>
                <p><strong>Méthodes de paiement :</strong> Visa **** 1234</p>
            </div>

            {/* Bloc Paramètres */}
            <div className="account-section">
                <h3><FaGlobe /> Paramètres</h3>
                <p><strong>Langue :</strong> Français</p>
                <p><strong>Pays :</strong> France</p>
            </div>

            {/* Bloc Confidentialité */}
            <div className="account-section">
                <h3><FaTrash /> Confidentialité</h3>
                <p>Supprimer mon compte <button className="delete-btn"><FaTrash /></button></p>
            </div>

            <button className="logout-button" onClick={logout}>
                Se déconnecter
            </button>
        </div>
    );
};

export default AccountInfo;
