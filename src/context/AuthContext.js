import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(() => setUser(null));
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        fetchUser(token);  // ✅ Met à jour immédiatement les infos utilisateur
    };
    

    const fetchUser = (token) => {
        fetch("http://localhost:5000/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
