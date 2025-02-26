

import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // ✅ Correction du nom du middleware

const router = express.Router();

// ✅ Route protégée : nécessite un token valide
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ 
    message: "Bienvenue sur ton profil !", 
    user: req.user // ✅ Retourne les infos de l'utilisateur authentifié
  });
});

export default router;

