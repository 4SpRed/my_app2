import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AppointmentForm = () => {
    const { user } = useContext(AuthContext);
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!doctorId || !date || !time) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        const appointment = { patientId: user.id, doctorId, date, time };

        const response = await fetch("http://localhost:5000/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appointment),
        });

        if (response.ok) {
            alert("Rendez-vous enregistré !");
        } else {
            alert("Erreur lors de la prise de rendez-vous");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Prendre un rendez-vous</h3>
            <label>Médecin :</label>
            <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />

            <label>Date :</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

            <label>Heure :</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

            <button type="submit">Valider</button>
        </form>
    );
};

export default AppointmentForm;
