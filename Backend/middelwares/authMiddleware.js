import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified; // Ajoute les infos utilisateur au `req`
        next();
    } catch (err) {
        res.status(403).json({ error: "Token invalide." });
    }
};