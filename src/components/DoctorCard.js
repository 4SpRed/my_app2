import React, { useState } from "react";
import "./DoctorCard.css"; 

const DoctorCard = ({ doctor }) => {
  const [showModal, setShowModal] = useState(false); // ✅ Ajout de useState pour gérer l'affichage du modal

  if (!doctor) return null; // ✅ Évite les erreurs si doctor est null

  return (
    <div className="doctor-card">
      <h3>Dr {doctor.Nom} {doctor.Prénom}</h3>
      <p><strong>Spécialité :</strong> {doctor.Spécialité || "Non précisée"}</p>
      <p><strong>Hôpital ou Adresse du cabinet :</strong> {doctor["Hôpital ou adresse du cabinet"] || "Non disponible"}</p>
      <p><strong>Wilaya :</strong> {doctor.Wilaya || "Non précisée"}</p>
      <p><strong>Contact :</strong> {doctor["N° téléphone / email"] || "Non disponible"}</p>

      {/* Bouton Prendre Rendez-vous */}
      <button className="appointment-btn" onClick={() => setShowModal(true)}>
        Prendre Rendez-vous
      </button>

      {/* Modal (popup) de prise de rendez-vous */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Prendre Rendez-vous avec Dr {doctor.Nom}</h3>
            <p>Entrez vos informations pour confirmer votre rendez-vous.</p>
            <input type="text" placeholder="Votre nom" className="input-field"/>
            <input type="date" className="input-field"/>
            <input type="time" className="input-field"/>
            <button className="confirm-btn">Confirmer</button>
            <button className="close-btn" onClick={() => setShowModal(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
