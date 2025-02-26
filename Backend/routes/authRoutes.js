import express from "express";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { loginUser, registerUser, verifyUser } from "../controllers/authController.js";

dotenv.config();
const router = express.Router();
const uri = process.env.STRING_URI;
const client = new MongoClient(uri);
let db;

// Connexion à MongoDB
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("medecinsDB");
  }
}
connectDB();

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accès refusé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};

// Route pour la connexion
router.post("/login", loginUser);

// Route pour l'inscription
router.post("/register", registerUser);

// Route pour la vérification de compte
router.get("/verify/:token", verifyUser);

// Route pour récupérer l'utilisateur connecté
router.get("/me", authMiddleware, async (req, res) => {
  await connectDB();
  const user = await db.collection("users").findOne(
    { _id: req.user.id },
    { projection: { password: 0 } } // Ne pas renvoyer le mot de passe
  );

  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

  res.json(user);
});

export default router;
