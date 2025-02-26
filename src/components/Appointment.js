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
    // Récupérer la liste des médecins disponibles
    fetch("http://localhost:5000/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error("Erreur lors du chargement des médecins", error));
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      doctorId: selectedDoctor,
      date,
      time,
    };

    try {
      const response = await fetch("http://localhost:5000/appointments", {
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
      <form onSubmit={handleAppointment}>
        <label>Médecin :</label>
        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
          <option value="">Sélectionnez un médecin</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>{`${doc.Nom} ${doc.Prénom}`}</option>
          ))}
        </select>

        <label>Date :</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Heure :</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

        <button type="submit">Réserver</button>
      </form>
    </div>
  );
};

export default Appointment;
