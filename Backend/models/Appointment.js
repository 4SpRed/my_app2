import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
