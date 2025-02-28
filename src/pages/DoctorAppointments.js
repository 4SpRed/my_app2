import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./DoctorAppointments.css";

const DoctorAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/appointments?doctorId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError("Impossible de charger les rendez-vous.");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (err) {
      setError("Erreur lors de l'annulation du rendez-vous.");
    }
  };

  return (
    <div className="doctor-appointments">
      <h2>📅 Mes Rendez-vous</h2>
      {error && <p className="error-message">{error}</p>}
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appt) => (
            <li key={appt._id}>
              <p><strong>Patient :</strong> {appt.patientName}</p>
              <p><strong>Date :</strong> {appt.date}</p>
              <p><strong>Heure :</strong> {appt.time}</p>
              <button onClick={() => cancelAppointment(appt._id)}>Annuler</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun rendez-vous pour l'instant.</p>
      )}
    </div>
  );
};

export default DoctorAppointments;
