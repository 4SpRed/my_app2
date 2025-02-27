import React from "react";
import { useNavigate } from "react-router-dom";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment, setAppointments }) => {
    const navigate = useNavigate();

    const handleCancel = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/appointments/${appointment._id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setAppointments((prev) => prev.filter(appt => appt._id !== appointment._id));
            alert("Rendez-vous annulé !");
        } else {
            alert("Erreur lors de l'annulation du rendez-vous.");
        }
    };

    return (
        <div className="appointment-card">
            <h3>👨‍⚕️ {appointment.doctorName}</h3>
            <p><strong>Date :</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Heure :</strong> {appointment.time}</p>

            <button className="btn-modify" onClick={() => navigate(`/appointment/edit/${appointment._id}`)}>
                Modifier
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
                Annuler
            </button>
        </div>
    );
};

export default AppointmentCard;
