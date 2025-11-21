export function generarDoctores(n) {
  const nombres = ["Dr. José Mora", "Dra. Marta Solis", "Dr. Pablo Castro", "Dra. Cecilia Zuñiga", "Dr. Fernando Soto", "Dra. Laura Alvarado", "Dr. Alex Arredondo", 
    "Dra. Melissa Pérez", "Dr. Joshua Parks", "Dra. Elieth Torres", "Dr. Gabriel Espinoza", "Dra. Alejandra Pereira", "Dr. Mark Arias"];
  const doctores = [];
  for (let i = 0; i < n; i++) {
    doctores.push({
      nombre: (i + 1)  + ". " + nombres[Math.floor(Math.random() * nombres.length)],
      cedula: String(200000000 + i),
      citas: []
    });
  }
  return doctores;
}