import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointments_routes.js";



// ✅ Chargement des variables d'environnement
dotenv.config();

// ✅ Vérification des variables essentielles
if (!process.env.STRING_URI) {
    console.error("❌ STRING_URI manquant dans .env");
    process.exit(1);
}

// ✅ Initialisation du serveur Express
const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(cors());




// ✅ Connexion MongoDB avec `mongoose`
mongoose.connect(process.env.STRING_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connexion MongoDB réussie !"))
.catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1);
});

// ✅ Connexion à MongoDB via `MongoClient` pour certaines fonctionnalités
const client = new MongoClient(process.env.STRING_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let db;
async function connectDB() {
    try {
        await client.connect();
        db = client.db("medecinsDB"); // ⚠️ Vérifie que ce nom de base est correct !
        console.log("✅ Connexion MongoDB (via MongoClient) réussie !");
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB :", error);
        process.exit(1);
    }
}

// ✅ Ajout des routes après connexion réussie
connectDB().then(() => {
    if (db) {
        console.log("✅ Routes MongoDB activées !");
        app.use("/api/appointments", appointmentRoutes(db));
    } else {
        console.error("❌ La base de données n'est pas connectée !");
    }
});

// ✅ Routes d'authentification
app.use("/auth", authRoutes);

// ✅ Route principale
app.get("/", (req, res) => {
    res.send("🚀 Serveur Express en ligne !");
});

// 🔎 **Route `/search` pour rechercher des médecins**
app.get("/search", async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: "Connexion à la base de données non établie" });
        }
        const { query, location } = req.query;
        console.log("🔍 Recherche demandée :", { query, location });
        let filter = {};
        if (query) {
            filter.$or = [
                { Nom: { $regex: query, $options: "i" } },
                { Prénom: { $regex: query, $options: "i" } },
                { Spécialité: { $regex: query, $options: "i" } },
                { Wilaya: { $regex: query, $options: "i" } }
            ];
        }
        if (location) {
            filter.Wilaya = { $regex: location, $options: "i" };
        }
        const doctors = await db.collection("medecins").find(filter).toArray();
        console.log(`✅ ${doctors.length} médecin(s) trouvé(s).`);
        if (doctors.length === 0) {
            return res.status(404).json({ message: "Aucun médecin trouvé." });
        }
        res.json(doctors);
    } catch (err) {
        console.error("❌ Erreur lors de la recherche :", err);
        res.status(500).json({ error: err.message });
    }
});

// 🔎 **Route `/autocomplete` pour les noms et spécialités de médecins**
app.get("/autocomplete", async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: "Connexion à la base de données non établie" });
        }
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.json([]);
        }
        const suggestions = await db.collection("medecins")
            .find({
                $or: [
                    { Nom: { $regex: query, $options: "i" } },
                    { Prénom: { $regex: query, $options: "i" } },
                    { Spécialité: { $regex: query, $options: "i" } }
                ]
            })
            .project({ Nom: 1, Prénom: 1, Spécialité: 1, Wilaya: 1, Photo: 1 })
            .limit(5)
            .toArray();
        console.log(`🔍 Suggestions médecins : ${suggestions.length} résultats.`);
        res.json(suggestions);
    } catch (err) {
        console.error("❌ Erreur dans /autocomplete :", err);
        res.status(500).json({ error: err.message });
    }
});

// 🔎 **Route `/autocomplete-location` pour la recherche de wilayas et villes**
app.get("/autocomplete-location", async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: "Connexion à la base de données non établie" });
        }
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.json([]);
        }
        const suggestions = await db.collection("locations")
            .find({
                $or: [
                    { Wilaya: { $regex: `^${query}`, $options: "i" } },
                    { Ville: { $regex: `^${query}`, $options: "i" } }
                ]
            })
            .limit(5)
            .toArray();
        console.log(`📍 Suggestions lieux : ${suggestions.length} résultats.`);
        res.json(suggestions.map(loc => loc.Wilaya || loc.Ville));
    } catch (err) {
        console.error("❌ Erreur dans /autocomplete-location :", err);
        res.status(500).json({ error: err.message });
    }
});

// 🚀 **Démarrage du serveur**
app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
