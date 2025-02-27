import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AccountInfo from "../components/AccountInfo";
import AppointmentCard from "../components/AppointmentCard";
import "./Account.css";

const Account = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user, navigate]);

    useEffect(() => {
        if (user) {
            const fetchAppointments = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch("http://localhost:5000/api/appointments", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");

                    const data = await response.json();
                    setAppointments(data);
                } catch (err) {
                    setError("Impossible de charger les rendez-vous.");
                }
            };
            fetchAppointments();
        }
    }, [user]);

    if (loading) return <p>Chargement en cours...</p>;

    return (
        <div className="account-page">
            <h1>Mon Espace</h1>
            <AccountInfo />

            <h2>📅 Mes Rendez-vous</h2>
            {error && <p className="error-message">{error}</p>}
            {appointments.length > 0 ? (
                <div className="appointments-container">
                    {appointments.map((appt) => (
                        <AppointmentCard key={appt._id} appointment={appt} setAppointments={setAppointments} />
                    ))}
                </div>
            ) : (
                <p>Aucun rendez-vous prévu.</p>
            )}

            {/* ✅ Correction : Fermeture correcte du bouton */}
            <button onClick={() => navigate("/appointment")} className="btn-primary">
                Prendre un rendez-vous
            </button>
        </div>
    );
};

export default Account;
