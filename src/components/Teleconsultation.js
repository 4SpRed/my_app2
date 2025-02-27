import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import "./Teleconsultation.css";

const Teleconsultation = () => {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        document.title = "Téléconsultation";

        // Récupérer les détails du rendez-vous
        fetch(`http://localhost:5000/appointments/${appointmentId}`)
            .then(res => res.json())
            .then(data => setAppointment(data))
            .catch(err => console.error("Erreur :", err));
    }, [appointmentId]);

    return (
        <div className="teleconsultation-container">
            <h2>Consultation en ligne</h2>
            {appointment ? (
                <div>
                    <p><strong>Médecin :</strong> {appointment.doctorName}</p>
                    <p><strong>Date :</strong> {appointment.date}</p>
                    <p><strong>Heure :</strong> {appointment.time}</p>

                    {/* Intégration de Jitsi */}
                    <JitsiMeeting
                        roomName={appointmentId}
                        configOverwrite={{ startWithAudioMuted: true, startWithVideoMuted: false }}
                        interfaceConfigOverwrite={{ TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"] }}
                        userInfo={{ displayName: "Patient" }}
                    />
                </div>
            ) : (
                <p>Chargement des informations du rendez-vous...</p>
            )}
        </div>
    );
};

export default Teleconsultation;
