export function generarDoctores(n) {
  const nombres = ["Dr. José", "Dra. Marta", "Dr. Pablo", "Dra. Cecilia", "Dr. Fernando", "Dra. Laura"];
  const doctores = [];
  for (let i = 0; i < n; i++) {
    doctores.push({
      nombre: nombres[Math.floor(Math.random() * nombres.length)] + " " + (i + 1),
      cedula: String(200000000 + i),
      citas: []
    });
  }
  return doctores;
}