import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Vérifie l'utilisateur avec le token stocké
    const checkUser = async () => {
        const token = localStorage.getItem("token");
        console.log("🔍 Vérification du token dans localStorage :", token);
    
        if (!token) {
            console.log("❌ Aucun token trouvé !");
            setUser(null);
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) throw new Error("Token invalide");
    
            const data = await response.json();
            console.log("✅ Utilisateur authentifié :", data);
            setUser(data);
        } catch (error) {
            console.error("❌ Erreur lors de la vérification de l'utilisateur :", error);
            // ❌ Ne pas supprimer immédiatement le token, seulement après confirmation de l'erreur
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        checkUser(); // 🔥 Vérifie l'utilisateur au chargement
    }, []);

    const login = (token, userData) => {
        console.log("✅ Stockage du token après connexion...");
        localStorage.setItem("token", token); 
        setUser(userData);
    };

    const logout = () => {
        console.log("🔴 Déconnexion, suppression du token...");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
