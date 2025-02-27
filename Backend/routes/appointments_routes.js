import express from "express";
import Stripe from "stripe";
import authMiddleware from "../middlewares/authMiddleware.js";
import { bookAppointment, getUserAppointments, cancelAppointment, updateAppointment } from "../controllers/appointmentController.js";

const appointmentRoutes = (db) => {
    if (!db) {
        console.error("❌ ERREUR : Base de données non reçue !");
        return express.Router();
    }

    const router = express.Router();
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

    // ✅ Route publique : Liste des médecins
    router.get("/doctors", async (req, res) => {
        try {
            const doctors = await db.collection("medecins").find().toArray();
            res.json(doctors);
        } catch (error) {
            res.status(500).json({ error: "Erreur récupération médecins." });
        }
    });

    // 🔒 Routes protégées par authentification
    router.post("/", authMiddleware, bookAppointment);
    router.get("/", authMiddleware, getUserAppointments);
    router.delete("/:id", authMiddleware, cancelAppointment);
    router.put("/:id", authMiddleware, updateAppointment);

    // 🔒 Route PROTÉGÉE : Ajouter une disponibilité (réservée aux médecins)
    router.post("/availabilities", authMiddleware, async (req, res) => {
        console.log("📥 Requête reçue pour disponibilités:", req.body);

        const { date, time } = req.body;
        if (!date || !time) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        try {
            const doctorId = req.user.id; // Associer la disponibilité au médecin connecté
            const result = await db.collection("availabilities").insertOne({
                doctorId, date, time
            });

            res.json({ message: "✅ Disponibilité enregistrée.", availabilityId: result.insertedId });
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout de disponibilité :", error);
            res.status(500).json({ error: "Erreur lors de l'ajout de disponibilité." });
        }
    });

    // 🔒 Route PROTÉGÉE : Paiement via Stripe
    router.post("/create-checkout-session", authMiddleware, async (req, res) => {
        try {
            console.log("📥 Données reçues pour le paiement:", req.body);
            const { amount } = req.body;

            if (!amount || isNaN(amount)) {
                return res.status(400).json({ error: "Montant invalide." });
            }

            const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{
                    price_data: {
                        currency: "eur",
                        product_data: { name: "Consultation Médicale" },
                        unit_amount: amount * 100,  // Convertir en centimes
                    },
                    quantity: 1
                }],
                mode: "payment",
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
            });

            res.json({ id: session.id });
        } catch (error) {
            console.error("❌ Erreur Stripe :", error);
            res.status(500).json({ error: "Erreur paiement." });
        }
    });

    return router;
};

export default appointmentRoutes;
