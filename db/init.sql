CREATE EXTENSION IF NOT EXISTS postgis;

 -- CREACION DE TIPO DE DATOS --

CREATE TYPE tipo_cargo AS ENUM(
    'estudiante', 'administrativo', 'profesor'
);

CREATE TYPE tipo_de_identificacion AS ENUM(
    'CC', 'TI', 'CE', 'PP'
);

CREATE TYPE vehiculo_categoria AS ENUM(
    'camioneta', 'bus', 'moto', 'carro'
);

CREATE TYPE tipo_de_documento AS ENUM(
    'licencia', 'identificacion'
);

CREATE TYPE categorias_estado_viaje AS ENUM(
    'pendiente', 'en curso', 'finalizado'
);

CREATE TYPE categoria_de_documento AS ENUM(
    'tecnomecanica', 'soat'
);

CREATE TYPE estado_reserva AS ENUM(
    'pendiente', 'confirmada', 'cancelada'
);

-- CREACION DE TABLAS --

CREATE TABLE institucion(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    color_primario VARCHAR(7) NOT NULL,
    color_secundario VARCHAR(7) NOT NULL,
    logo BYTEA,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion VARCHAR(255) NOT NULL,
    estado_verificacion BOOLEAN DEFAULT TRUE
);

CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    tipo tipo_cargo,
    contraseña VARCHAR(255) NOT NULL,
    celular VARCHAR(20) NOT NULL UNIQUE,
    estado_verificacion BOOLEAN DEFAULT FALSE,
    codigo_estudiante VARCHAR(20) UNIQUE,
    carne_estudiante BYTEA,
    numero_identificacion VARCHAR(20) UNIQUE NOT NULL,
    tipo_identificacion tipo_de_identificacion,
    institucion_id INTEGER NOT NULL,
    FOREIGN KEY (institucion_id) REFERENCES institucion(id) ON DELETE CASCADE
);

CREATE TABLE usuario() INHERITS(persona);

CREATE TABLE conductor (
    direccion VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntuacion_promedio DECIMAL(3, 2) DEFAULT 0.00
) INHERITS (persona);

CREATE TABLE foto_documento (
    conductor_id INTEGER NOT NULL,
    documento BYTEA NOT NULL,
    tipo_documento tipo_de_documento NOT NULL,
    FOREIGN KEY (conductor_id) REFERENCES persona(id) ON DELETE CASCADE,
    PRIMARY KEY (conductor_id, tipo_documento) 
);

CREATE TABLE vehiculo(
    id SERIAL PRIMARY KEY,
    categoria vehiculo_categoria NOT NULL,
    vencimiento_soat DATE NOT NULL,
    vencimiento_tecnomecanica DATE NOT NULL,
    color VARCHAR(20) NOT NULL,
    estado_verificacion BOOLEAN DEFAULT FALSE,
    placa VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    codigo_qr BYTEA NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    conductor_id INTEGER NOT NULL,
    FOREIGN KEY (conductor_id) REFERENCES persona(id) ON DELETE CASCADE
);

CREATE TABLE foto_documento_vehiculo (
    vehiculo_id INTEGER NOT NULL,
    documento BYTEA NOT NULL,
    tipo_documento categoria_de_documento NOT NULL, 
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id) ON DELETE CASCADE,
    PRIMARY KEY (vehiculo_id, tipo_documento) 
);

CREATE TABLE viaje(
    id SERIAL PRIMARY KEY,
    estado categorias_estado_viaje NOT NULL,
    punto_partida GEOGRAPHY(POINT, 4326) NOT NULL,
    ruta_planificada GEOGRAPHY(LINESTRING, 4326) NOT NULL,
    hora_salida TIMESTAMP NOT NULL,
    punto_destino GEOGRAPHY(POINT, 4326) NOT NULL,
    ubicacion_actual GEOGRAPHY(POINT, 4326) NOT NULL,
    usuario_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES persona(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id) ON DELETE CASCADE
);

CREATE TABLE calificacion(
    id SERIAL PRIMARY KEY,
    puntuacion DECIMAL(3, 2) CHECK (puntuacion >= 0 AND puntuacion <= 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viaje_id INTEGER NOT NULL,
    FOREIGN KEY (viaje_id) REFERENCES viaje(id) ON DELETE CASCADE
);

CREATE TABLE reserva(
    id SERIAL PRIMARY KEY,
    estado estado_reserva NOT NULL,
    codigo_qr BYTEA NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora_salida TIMESTAMP NOT NULL,
    punto_partida GEOGRAPHY(POINT, 4326) NOT NULL
);

-- CREACION DE INDICES -- 

CREATE INDEX idx_persona_celular ON persona(celular);
CREATE INDEX idx_persona_correo ON persona(correo);
CREATE INDEX idx_persona_institucion ON persona(institucion_id);
CREATE INDEX idx_persona_celular_institucion ON persona(celular, institucion_id);


-- CARGAR UNIVERSIDAD ( BASE PARA PRUEBAS ) -- 

INSERT INTO institucion (nombre, contraseña, color_primario, color_secundario, direccion, estado_verificacion) VALUES 
('Universidad Nacional de Colombia', 'Un4l2023!', '#FFCD00', '#004B87', 'Carrera 45 # 26-85, Bogotá', TRUE),
('Universidad de los Andes', 'And3s2023!', '#005FAB', '#FFFFFF', 'Carrera 1 # 18A-12, Bogotá', TRUE),
('Pontificia Universidad Javeriana', 'J4v3r2023!', '#003366', '#FFFFFF', 'Carrera 7 # 40-62, Bogotá', TRUE),
('Universidad del Rosario', 'R0s4r2023!', '#8B2635', '#F1D3B2', 'Carrera 6 # 12B-40, Bogotá', TRUE),
('Universidad Externado de Colombia', 'Ext3rn2023!', '#005FAB', '#FFD700', 'Calle 12 # 1-17 Este, Bogotá', TRUE),
('Colegio Gimnasio Moderno', 'G1m4s2023!', '#003366', '#FFCC00', 'Carrera 9 # 74-99, Bogotá', FALSE),
('Colegio Anglo Colombiano', 'Angl02023!', '#00205B', '#FFFFFF', 'Calle 152 # 45-20, Bogotá', FALSE),
('Universidad de Antioquia', 'Ant1oqu2023!', '#005A8C', '#FFFFFF', 'Calle 67 # 53-108, Medellín', TRUE),
('Universidad del Valle', 'V4ll32023!', '#005A29', '#FFFFFF', 'Calle 13 # 100-00, Cali', TRUE),
('Universidad Industrial de Santander', 'U1S2023!', '#E2001A', '#FFFFFF', 'Carrera 27 # 9, Bucaramanga', TRUE);