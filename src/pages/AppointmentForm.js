import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import "./AppointmentForm.css";
import dayjs from "dayjs";

const AppointmentForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Récupération des médecins
    useEffect(() => {
        fetch("http://localhost:5000/api/appointments/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch((error) => console.error("❌ Erreur chargement médecins :", error));
    }, []);

    // Récupération des dates disponibles
    useEffect(() => {
        if (doctorId) {
            fetch(`http://localhost:5000/api/appointments/available-dates?doctorId=${doctorId}`)
                .then((res) => res.json())
                .then((dates) => {
                    console.log("📅 Dates disponibles :", dates);
                    setAvailableDates(dates || []);
                })
                .catch((error) => {
                    console.error("❌ Erreur chargement dates :", error);
                    setAvailableDates([]);
                });
        }
    }, [doctorId]);
    
    useEffect(() => {
        if (doctorId && date) {
            setLoading(true);
            fetch(`http://localhost:5000/api/appointments/available?doctorId=${doctorId}&date=${dayjs(date).format("YYYY-MM-DD")}`)
                .then((res) => res.json())
                .then((times) => {
                    console.log("⏰ Créneaux disponibles :", times);
                    setAvailableTimes(Array.isArray(times) ? times : []);
                })
                .catch((error) => {
                    console.error("❌ Erreur chargement créneaux :", error);
                    setAvailableTimes([]);
                })
                .finally(() => setLoading(false));
        }
    }, [doctorId, date]);
    
    // Soumission du rendez-vous
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!doctorId || !date || !time) {
            setMessage("❌ Tous les champs sont obligatoires !");
            return;
        }

        const appointment = { 
            userId: user.id, 
            doctorId, 
            date: dayjs(date).format("YYYY-MM-DD"), 
            time 
        };

        try {
            const response = await fetch("http://localhost:5000/api/appointments", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(appointment),
            });

            if (!response.ok) {
                throw new Error(`❌ Erreur serveur : ${response.status}`);
            }

            setMessage("✅ Rendez-vous pris avec succès !");
            setTimeout(() => navigate("/account"), 2000);
        } catch (error) {
            console.error("❌ Erreur lors de la requête :", error);
            setMessage("❌ Erreur lors de la réservation du rendez-vous.");
        }
    };

    return (
        <div className="appointment-form-container">
            <h3>📅 Prendre un rendez-vous</h3>
            {message && <p className="form-message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Médecin :</label>
                <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                    <option value="">Sélectionner un médecin</option>
                    {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                            {doc.Nom} {doc.Prénom} - {doc.Spécialité}
                        </option>
                    ))}
                </select>

                <label>Date :</label>
                {availableDates.length === 0 ? (
                    <p style={{ color: "red" }}>❌ Aucune date disponible</p>
                ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Choisissez une date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            shouldDisableDate={(day) => !availableDates.includes(day.format("YYYY-MM-DD"))}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </LocalizationProvider>
                )}

                <label>Heure :</label>
                {loading ? (
                    <p>🔄 Chargement des créneaux disponibles...</p>
                ) : availableTimes.length === 0 ? (
                    <p style={{ color: "red" }}>❌ Aucune heure disponible</p>
                ) : (
                    <select value={time} onChange={(e) => setTime(e.target.value)} required>
                        <option value="">Sélectionner une heure</option>
                        {availableTimes.map((t, index) => (
                            <option key={index} value={t}>{t}</option>
                        ))}
                    </select>
                )}

                <button type="submit" className="btn-primary">Confirmer</button>
            </form>
        </div>
    );
};

export default AppointmentForm;
