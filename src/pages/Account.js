import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AccountInfo from "../components/AccountInfo";
import './Account.css';



const Account = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    return (
        <div>
            <h1>Mon Compte</h1>
            <AccountInfo />
        </div>
    );
};

export default Account;
