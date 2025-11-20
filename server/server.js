import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { generarPacientes } from "./data/pacientes.js";
import { generarDoctores } from "./data/doctores.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Datos en memoria
let pacientes = generarPacientes(40);
let doctores = generarDoctores(20);
let citas = [];

console.log("👥 Pacientes generados:");
console.table(pacientes.slice(0, 5)); // muestra los primeros 5

console.log("👨‍⚕️ Doctores generados:");
console.table(doctores.slice(0, 5)); // muestra los primeros 5

const USERS = [
  { username: "profesor", password: "admin123", role: "profesor" },
  { username: "estudiante", password: "demo123", role: "estudiante" }
];

// --- LOGIN ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) res.json({ success: true, role: user.role });
  else res.json({ success: false, message: "Credenciales inválidas" });
});

// --- PACIENTES ---
app.get("/pacientes", (req, res) => res.json(pacientes));

app.get("/pacientes/:cedula", (req, res) => {
  const paciente = pacientes.find(p => p.cedula === req.params.cedula);
  if (paciente) res.json(paciente);
  else res.status(404).json({ message: "Paciente no encontrado" });
});

app.post("/pacientes", (req, res) => {
  const paciente = req.body;
  pacientes.push(paciente);
  res.json({ success: true, paciente });
});

// --- DOCTORES ---
app.get("/doctores", (req, res) => {
  const disponibles = doctores.filter(d => d.citas.length < 3);
  res.json(disponibles);
});

// --- CITAS ---
app.post("/citas", (req, res) => {
  const { pacienteCedula, doctorCedula, fecha, sintomas, alergias, centroMedico } = req.body;
  const doctor = doctores.find(d => d.cedula === doctorCedula);

  if (!doctor) return res.status(400).json({ success: false, message: "Doctor inválido" });
  if (doctor.citas.length >= 3)
    return res.status(400).json({ success: false, message: "Doctor sin cupos disponibles" });

  const nuevaCita = { pacienteCedula, doctorCedula, fecha, sintomas, alergias, centroMedico };
  citas.push(nuevaCita);
  doctor.citas.push(nuevaCita);
  res.json({ success: true });
});

app.get("/citas/:cedula", (req, res) => {
  const citasPaciente = citas.filter(c => c.pacienteCedula === req.params.cedula);
  res.json(citasPaciente);
});

app.delete("/citas/:cedula/:fecha", (req, res) => {
  const { cedula, fecha } = req.params;
  citas = citas.filter(c => !(c.pacienteCedula === cedula && c.fecha === fecha));
  doctores.forEach(d => {
    d.citas = d.citas.filter(c => !(c.pacienteCedula === cedula && c.fecha === fecha));
  });
  res.json({ success: true });
});

// --- Rutas para citas médicas ---
let idCita = 1; // Usaremos esta para generar IDs únicos a las citas

// Obtener paciente por cédula
app.get("/api/pacientes/:cedula", (req, res) => {
  const paciente = pacientes.find(p => p.cedula === req.params.cedula);
  res.json(paciente || null);
});

// Listar doctores disponibles
app.get("/api/doctores", (req, res) => {
  res.json(doctores);
});

// Listar citas por paciente
app.get("/api/citas/paciente/:cedula", (req, res) => {
  res.json(citas.filter(c => c.paciente.cedula === req.params.cedula));
});

// Crear una nueva cita
app.post("/api/citas", (req, res) => {
  const { paciente, doctorCedula, fecha, sintomas, alergias, centro } = req.body;
  const doctor = doctores.find(d => d.cedula === doctorCedula);

  if (!doctor) {
    return res.json({ success: false, message: "Doctor no encontrado." });
  }

  const citasDoctor = citas.filter(c => c.doctorCedula === doctorCedula);
  if (citasDoctor.length >= 3) {
    return res.json({ success: false, message: "El doctor ya tiene 3 citas asignadas." });
  }

  const cita = {
    id: idCita++,
    paciente,
    doctorCedula,
    doctor: doctor.nombre,
    fecha,
    sintomas,
    alergias,
    centro
  };

  citas.push(cita);
  res.json({ success: true, message: "Cita creada correctamente." });
});

// Cancelar una cita existente
app.delete("/api/citas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const antes = citas.length;
  citas = citas.filter(c => c.id !== id);
  const eliminadas = antes - citas.length;
  res.json({
    success: eliminadas > 0,
    message: eliminadas > 0 ? "Cita cancelada correctamente." : "No se encontró la cita."
  });
});

// --- ARRANQUE ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});