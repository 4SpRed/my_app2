import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./Payment.css";

const stripePromise = loadStripe("pk_test_yourStripePublicKey");

const Payment = ({ consultationFee }) => {
  const [loading, setLoading] = useState(false);

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
    <div className="payment-container">
      <h2>Paiement de la consultation</h2>
      <p>Montant : {consultationFee} €</p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Redirection..." : "Payer maintenant"}
      </button>
    </div>
  );
};

export default Payment;
