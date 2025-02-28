import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./DoctorCalendar.css";
import "./Payment.css";

const stripePromise = loadStripe("pk_test_yourStripePublicKey");

const DoctorCalendar = ({ doctorId, consultationFee }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/available-dates?doctorId=${doctorId}`)
      .then((res) => res.json())
      .then((data) => setAvailabilities(data))
      .catch(() => setAvailabilities([]));
  }, [doctorId]);

  const handlePayment = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: consultationFee * 100 }),
    });

    const session = await response.json();
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };

  return (
    <div className="doctor-calendar">
      <h3>Disponibilités du médecin</h3>
      <ul>
        {availabilities.map((slot, index) => (
          <li key={index}>
            {slot.date} à {slot.time}
          </li>
        ))}
      </ul>
      <div className="payment-container">
        <h2>Paiement de la consultation</h2>
        <p>Montant : {consultationFee} €</p>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Redirection..." : "Payer maintenant"}
        </button>
      </div>
    </div>
  );
};

export default DoctorCalendar;
