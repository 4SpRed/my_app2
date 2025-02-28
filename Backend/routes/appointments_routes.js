import express from "express";
import Stripe from "stripe";
import checkAuth from "../middlewares/checkAuth.js";
import {
    bookAppointment,
    getUserAppointments,
    cancelAppointment,
    updateAppointment,
} from "../controllers/appointmentController.js";

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

    // ✅ Route pour récupérer les disponibilités d'un médecin
    router.get("/available-dates", async (req, res) => {
        try {
            const { doctorId } = req.query;
            if (!doctorId) {
                return res.status(400).json({ error: "L'ID du médecin est requis." });
            }

            const appointments = await db.collection("availabilities").find({ doctorId }).toArray();
            const availableDates = [...new Set(appointments.map(appt => appt.date))]; 

            res.json(availableDates);
        } catch (error) {
            console.error("❌ Erreur récupération dates disponibles :", error);
            res.status(500).json({ error: "Erreur serveur." });
        }
    });

    // 🔒 Routes protégées par authentification
    router.post("/", checkAuth, bookAppointment);
    router.get("/", checkAuth, getUserAppointments);
    router.delete("/:id", checkAuth, cancelAppointment);
    router.put("/:id", checkAuth, updateAppointment);

    // 🔒 Route PROTÉGÉE : Ajouter une disponibilité (réservée aux médecins)
    router.post("/availabilities", checkAuth, async (req, res) => {
        console.log("📥 Requête reçue pour ajout de disponibilités:", req.body);

        const { date, time } = req.body;
        if (!date || !time) {
            return res.status(400).json({ error: "❌ Tous les champs sont requis." });
        }

        try {
            // Vérification que l'utilisateur est un médecin
            if (req.user.role !== "doctor") {
                return res.status(403).json({ error: "❌ Accès refusé. Seuls les médecins peuvent ajouter des disponibilités." });
            }

            const result = await db.collection("availabilities").insertOne({
                doctorId: req.user.id, date, time
            });

            console.log(`✅ Disponibilité enregistrée pour le médecin ID: ${req.user.id} (ID: ${result.insertedId})`);
            res.json({ message: "✅ Disponibilité enregistrée avec succès.", availabilityId: result.insertedId });

        } catch (error) {
            console.error("❌ Erreur lors de l'ajout de disponibilité :", error);
            res.status(500).json({ error: "❌ Erreur serveur lors de l'ajout de disponibilité." });
        }
    });

    // 🔒 Route PROTÉGÉE : Paiement via Stripe
    router.post("/create-checkout-session", checkAuth, async (req, res) => {
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
