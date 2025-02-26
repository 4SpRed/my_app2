import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AccountInfo = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) return <p>Chargement des informations...</p>;

    const handleLogout = () => {
        logout();
        navigate("/login"); // ✅ Redirection après déconnexion
    };

    return (
        <div className="account-container">
            <h2>Mon Compte</h2>
            <p><strong>Nom :</strong> {user.lastName} {user.firstName}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Inscrit depuis :</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            
            <button className="logout-button" onClick={handleLogout}>
                Se déconnecter
            </button>
        </div>
    );
};

export default AccountInfo;
