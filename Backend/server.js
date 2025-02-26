import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";  // 👈 Ajout pour autoriser le front à communiquer avec le back
import authRoutes from "./routes/authRoutes.js"; // ✅ Importation du fichier routes

// Initialisation de l'application Express
const app = express();
const port = 5000;

// Middleware pour gérer JSON et CORS
app.use(express.json());
app.use(cors());  // 👈 Autorise les requêtes depuis le frontend

// 📌 Utilisation des routes d'authentification
app.use("/auth", authRoutes);

// Chargement des variables d'environnement
dotenv.config();

// Vérification de l'URI MongoDB
const uri = process.env.STRING_URI;

if (!uri) {
  console.error("❌ Erreur : STRING_URI n'est pas défini dans .env");
  process.exit(1);
}

// Connexion à MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; 

async function connectDB() {
  try {
    await client.connect();
    db = client.db("medecinsDB"); // ⚠ Assurez-vous que "medecinsDB" est bien le bon nom
    console.log("✅ Connexion réussie à MongoDB !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
}

connectDB();

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("🚀 Serveur Express est bien en ligne !");
});


// 🔎 **Route `/search` pour rechercher des médecins**
app.get("/search", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Connexion à la base de données non établie" });
    }

    const { query, location } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { Nom: { $regex: query, $options: "i" } },         // Recherche par Nom
        { Prénom: { $regex: query, $options: "i" } },      // Recherche par Prénom
        { Adresse: { $regex: query, $options: "i" } },     // Recherche par Adresse
        { Wilaya: { $regex: query, $options: "i" } }       // Recherche par Wilaya
      ];
    }

    if (location) {
      filter.Wilaya = { $regex: location, $options: "i" };
    }

    const doctors = await db.collection("medecins").find(filter).toArray();

    if (doctors.length === 0) {
      return res.status(404).json({ message: "Aucun médecin trouvé pour cette recherche." });
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔎 **Route `/autocomplete` améliorée pour chercher dans tout le nom**
app.get("/autocomplete", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Connexion à la base de données non établie" });
    }

    const { query } = req.query;
    if (!query) return res.json([]);

    const suggestions = await db.collection("medecins")
      .find({
        $or: [
          { Nom: { $regex: query, $options: "i" } },  // Recherche n'importe où dans le nom
          { Prénom: { $regex: query, $options: "i" } } // Recherche aussi dans le prénom
        ]
      })
      .project({ Nom: 1, Prénom: 1, Spécialité: 1, Wilaya: 1, Photo: 1 }) // Sélectionner les champs utiles
      .limit(5)
      .toArray();

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/autocomplete-location", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Connexion à la base de données non établie" });
    }

    const { query } = req.query;
    if (!query) return res.json([]);

    // Recherche par wilaya ou ville en fonction de la saisie
    const suggestions = await db.collection("locations")
      .find({ $or: [
        { Wilaya: { $regex: `^${query}`, $options: "i" } },
        { Ville: { $regex: `^${query}`, $options: "i" } }
      ]})
      .limit(5)
      .toArray();

    res.json(suggestions.map(loc => loc.Wilaya || loc.Ville)); // Retourne seulement les noms
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// 🚀 **Démarrage du serveur**
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});