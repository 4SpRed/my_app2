const checkAuth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: "Token invalide." });
    }
   

};

export default checkAuth; // ✅ Assurez-vous que cette ligne est présente
