import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Appointment.css";

const Appointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch((error) => console.error("Erreur lors du chargement des médecins", error));
    }, []);

    const handleAppointment = async (e) => {
        e.preventDefault();

        const today = new Date();
        const selectedDate = new Date(`${date}T${time}`);
        if (selectedDate < today) {
            alert("❌ Impossible de sélectionner une date passée.");
            return;
        }

        const appointmentData = { doctorId: selectedDoctor, date, time };
        try {
            const response = await fetch("http://localhost:5000/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                alert("✅ Rendez-vous réservé avec succès !");
                navigate("/account");
            } else {
                alert("❌ Erreur lors de la réservation du rendez-vous.");
            }
        } catch (error) {
            console.error("❌ Erreur API:", error);
        }
    };

    return (
        <div className="appointment-container">
            <h2>Prendre un Rendez-vous</h2>
           
