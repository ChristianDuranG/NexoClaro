-- Esquema Relacional de NexoClaro
-- Compatible con MySQL Workbench (para generar diagrama EER) y SQLite (expo-sqlite en la app móvil)

CREATE DATABASE IF NOT EXISTS nexoclaro_db;
USE nexoclaro_db;

CREATE TABLE perfil_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    grupo_objetivo VARCHAR(60) NOT NULL, -- 'adulto_mayor', 'migrante', 'primera_generacion', 'general'
    idioma VARCHAR(20) NOT NULL DEFAULT 'es', -- 'es', 'en'
    nivel_lectura VARCHAR(30) NOT NULL DEFAULT 'muy_sencillo', -- 'muy_sencillo', 'estandar'
    texto_grande TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(40) NOT NULL, -- 'Becas', 'Trámites', 'Salud', 'Empleo'
    titulo VARCHAR(150) NOT NULL,
    resumen_claro TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    fuente_oficial VARCHAR(200)
);

CREATE TABLE pasos_servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servicio_id INT NOT NULL,
    orden INT NOT NULL,
    instruccion TEXT NOT NULL,
    completado TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_pasos_servicio
        FOREIGN KEY (servicio_id) REFERENCES servicios(id)
        ON DELETE CASCADE
);

CREATE TABLE consultas_ia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    pregunta TEXT NOT NULL,
    respuesta_gemini TEXT NOT NULL,
    idioma VARCHAR(20) NOT NULL DEFAULT 'es',
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consultas_perfil
        FOREIGN KEY (perfil_id) REFERENCES perfil_usuario(id)
        ON DELETE CASCADE
);

