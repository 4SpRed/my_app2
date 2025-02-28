import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
        }

        const token = authHeader.split(" ")[1]; // Récupère le token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Ajoute les infos utilisateur au `req`
        next(); // Passe au prochain middleware
    

    } catch (error) {
        res.status(403).json({ error: "Token invalide." });
    }
    console.log("🔑 Clé utilisée pour vérifier le token:", SECRET_KEY);
};

export default authMiddleware;
