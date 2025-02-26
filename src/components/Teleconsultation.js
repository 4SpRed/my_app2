import React, { useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import "./Teleconsultation.css";

const Teleconsultation = ({ meetingRoom }) => {
  useEffect(() => {
    document.title = "Téléconsultation";
  }, []);

  return (
    <div className="teleconsultation-container">
      <h2>Consultation en ligne</h2>
      <JitsiMeeting
        roomName={meetingRoom}
        configOverwrite={{ startWithAudioMuted: true, startWithVideoMuted: false }}
        interfaceConfigOverwrite={{ TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"] }}
        userInfo={{ displayName: "Patient" }}
      />
    </div>
  );
};

export default Teleconsultation;
