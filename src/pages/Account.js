import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AccountInfo from "../components/AccountInfo";
import './Account.css';

const Account = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!user && !token) {
            navigate("/login"); // Redirige immédiatement si aucun utilisateur et aucun token
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Mon Compte</h1>
            {user ? <AccountInfo /> : <p className="loading-message">Chargement des informations...</p>}
        </div>
    );
};

export default Account;
