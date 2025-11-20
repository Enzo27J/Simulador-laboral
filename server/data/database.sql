-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS simulador_laboral
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE simulador_laboral;

-- ===========================
-- Tabla de Pacientes
-- ===========================
CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  direccion VARCHAR(200)
);

-- ===========================
-- Tabla de Doctores
-- ===========================
CREATE TABLE IF NOT EXISTS doctores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL
);

-- ===========================
-- Tabla de Citas Médicas
-- ===========================
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  doctor_id INT NOT NULL,
  fecha DATETIME NOT NULL,
  sintomas TEXT,
  alergias TEXT,
  centro VARCHAR(100),
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE
);

-- ===========================
-- Tabla de Usuarios para Login
-- ===========================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('profesor', 'estudiante') NOT NULL
);

-- ===========================
-- Datos de prueba
-- ===========================

-- Doctores de prueba
INSERT INTO doctores (nombre, cedula)
VALUES 
('Carlos Sánchez', '101010101'),
('María Fernández', '202020202'),
('José Mora', '303030303'),
('Lucía Gómez', '404040404');

-- Pacientes de prueba
INSERT INTO pacientes (nombre, cedula, fecha_nacimiento, correo, telefono, direccion)
VALUES
('Ana Pérez', '123456789', '1995-04-21', 'ana@gmail.com', '8888-0000', 'San José'),
('Luis Ramírez', '987654321', '1988-11-12', 'luis@gmail.com', '8700-1234', 'Heredia');

-- Usuario de ejemplo
INSERT INTO usuarios (username, password_hash, rol)
VALUES
('estudiante', '$2b$10$hashedPassword', 'estudiante'),
('profesor', '$2b$10$hashedPassword', 'profesor');