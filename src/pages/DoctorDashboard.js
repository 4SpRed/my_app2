import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [availabilities, setAvailabilities] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/available-dates?doctorId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des disponibilités");

      const data = await response.json();
      setAvailabilities(data);
    } catch (err) {
      setError("Impossible de charger les disponibilités.");
    }
  };

  const addAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/availabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date, time }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout de la disponibilité");
      fetchAvailabilities();
      setDate("");
      setTime("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAvailability = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/availabilities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAvailabilities();
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="doctor-dashboard">
      <h2>Tableau de bord du Médecin</h2>
      <nav>
        <ul>
          <li><Link to="/doctor-appointments">📅 Voir mes rendez-vous</Link></li>
          <li><Link to="/doctor-calendar">🗓 Gérer mes disponibilités</Link></li>
        </ul>
      </nav>

      <h3>Ajouter une disponibilité</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={addAvailability}>Ajouter</button>

      <h3>Mes disponibilités</h3>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {availabilities.map((slot, index) => (
          <li key={index}>
            {slot.date} à {slot.time}
            <button onClick={() => deleteAvailability(slot.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
