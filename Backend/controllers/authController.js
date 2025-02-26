import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.STRING_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("medecinsDB");
    console.log("✅ Connexion à MongoDB réussie");
  }
}

// 🔹 **Contrôleur pour l'inscription**
export const registerUser = async (req, res) => {
  await connectDB();
  const { firstName, lastName, email, password } = req.body;

  try {
    console.log("➡️ Tentative d'inscription pour:", email);

    // Vérifier si l'utilisateur existe déjà
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Mot de passe haché");

    // Générer un token pour la vérification du compte
    const token = Math.random().toString(36).substring(2, 15);

    // Enregistrer l'utilisateur
    await db.collection("users").insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      token,
      verified: false,
    });

    console.log("✅ Utilisateur enregistré");

    // Vérification de la configuration des emails
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "Configuration email incorrecte" });
    }

    // Configurer le transporteur d'email (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Contenu de l'email de vérification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Vérification de votre compte",
      text: `Bonjour ${firstName},\n\nCliquez ici pour vérifier votre compte : http://localhost:5000/auth/verify/${token}\n\nMerci !`,
    };

    // Envoi de l'email de confirmation
    await transporter.sendMail(mailOptions);
    console.log("📧 Email de confirmation envoyé");

    res.json({ message: "Utilisateur enregistré ! Vérifiez votre email." });
  } catch (err) {
    console.error("❌ Erreur serveur:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 **Contrôleur pour la vérification du compte**
export const verifyUser = async (req, res) => {
  await connectDB();
  const { token } = req.params;

  try {
    console.log("🔍 Vérification du token:", token);
    
    // Rechercher l'utilisateur avec ce token
    const user = await db.collection("users").findOne({ token });
    if (!user) {
      return res.status(400).send("Lien invalide ou déjà utilisé.");
    }

    // Marquer l'utilisateur comme vérifié
    await db.collection("users").updateOne(
      { token },
      { $set: { verified: true, token: null } }
    );

    console.log("✅ Compte vérifié avec succès");
    res.send("Compte vérifié avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors de la vérification:", err);
    res.status(500).send("Erreur serveur");
  }
};

// 🔹 **Contrôleur pour la connexion**
export const loginUser = async (req, res) => {
  await connectDB();
  const { email, password } = req.body;

  try {
    console.log("➡️ Tentative de connexion pour:", email);

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (!user.verified) {
      return res.status(403).json({ error: "Compte non vérifié. Vérifiez votre email." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // ✅ Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "24h" }
    );

    console.log("✅ Connexion réussie pour:", email);
    res.json({ message: "Connexion réussie !", token });
  } catch (err) {
    console.error("❌ Erreur serveur:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
