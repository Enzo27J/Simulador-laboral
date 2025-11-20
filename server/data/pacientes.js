export function generarPacientes(n) {
  const nombres = ["María", "Carlos", "Ana", "Luis", "Elena", "Jorge", "Laura", "Pedro", "Sofía", "Andrés"];
  const apellidos = ["Pérez", "Gómez", "Rodríguez", "Jiménez", "Mora", "Rojas"];
  const pacientes = [];

  for (let i = 0; i < n; i++) {
    const nombre = `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
    const cedula = String(100000000 + Math.floor(Math.random() * 899999999));
    const fechaNacimiento = `19${70 + Math.floor(Math.random() * 30)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, "0")}`;
    pacientes.push({
      nombre,
      cedula,
      fechaNacimiento,
      correo: `${nombre.replace(" ", ".").toLowerCase()}@example.com`,
      telefono: "8" + Math.floor(Math.random() * 8999999 + 1000000),
      direccion: "San José, Costa Rica"
    });
  }
  return pacientes;
}