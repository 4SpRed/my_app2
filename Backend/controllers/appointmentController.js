import Appointment from "../models/Appointment.js";

// ✅ Fonction pour réserver un rendez-vous avec vérification
export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, type } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const appointmentDate = new Date(`${date}T${time}`);
        if (appointmentDate < new Date()) {
            return res.status(400).json({ error: "Vous ne pouvez pas réserver un rendez-vous dans le passé." });
        }

        const existingAppointment = await Appointment.findOne({ doctorId, date, time });
        if (existingAppointment) {
            return res.status(400).json({ error: "Ce créneau est déjà réservé." });
        }

        const newAppointment = new Appointment({
            userId: req.user.id,
            doctorId,
            date,
            time,
            type
        });

        await newAppointment.save();
        res.status(201).json({ message: "Rendez-vous réservé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la réservation du rendez-vous." });
    }
};

// ✅ Récupérer tous les RDV d'un utilisateur
export const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id })
            .populate("doctorId", "Nom Prénom Spécialité")
            .sort({ date: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous." });
    }
};

// ✅ Annuler un rendez-vous avec vérification
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ error: "Rendez-vous introuvable." });
        }

        if (appointment.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Action non autorisée." });
        }

        await appointment.deleteOne();
        res.status(200).json({ message: "Rendez-vous annulé avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'annulation du rendez-vous." });
    }
};

// ✅ Modifier un rendez-vous
export const updateAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ error: "Rendez-vous introuvable." });
        }

        if (appointment.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Action non autorisée." });
        }

        appointment.date = date;
        appointment.time = time;
        await appointment.save();

        res.status(200).json({ message: "Rendez-vous mis à jour avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification du rendez-vous." });
    }
};

// ✅ Vérification des disponibilités
export const checkAvailability = async (req, res) => {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
        return res.status(400).json({ message: "Doctor ID et date requis" });
    }

    try {
        console.log("🔍 Vérification des disponibilités pour :", doctorId, date);

        // ✅ Vérification du format de la date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Format de date invalide. Utilisez YYYY-MM-DD." });
        }

        // ✅ Définir la journée complète pour MongoDB
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

        // ✅ Trouver les rendez-vous existants ce jour-là
        const appointments = await Appointment.find({
            doctorId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // ✅ Liste des créneaux horaires possibles (ex: de 8h à 20h)
        const allTimes = [];
        for (let heure = 8; heure <= 20; heure++) {
            allTimes.push(`${heure}:00`);
        }

        const bookedTimes = appointments.map(appt => appt.time);
        const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));

        console.log("✅ Créneaux disponibles :", availableTimes);
        res.json(availableTimes);
    } catch (error) {
        console.error("❌ Erreur dans checkAvailability :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
