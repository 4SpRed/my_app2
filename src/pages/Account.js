import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AccountInfo from "../components/AccountInfo";
import "./Account.css";

const Account = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user === null) {
            console.log("🔄 Redirection vers login car user est null...");
            navigate("/login");
        }
    }, [loading, user, navigate]);

    if (loading) return <p>Chargement en cours...</p>;
    if (!user) return null; 

    return (
        <div className="account-page">
            <h1>Mon Compte</h1>
            <AccountInfo />
        </div>
    );
};

export default Account;
