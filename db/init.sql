CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE institucion(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    color_primario VARCHAR(7) NOT NULL,
    color_secundario VARCHAR(7) NOT NULL,
    logo BYTEA NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion VARCHAR(255) NOT NULL,
    estado_verificacion BOOLEAN DEFAULT TRUE
);

CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN ('estudiante', 'administrativo', 'profesor')),
    contraseña VARCHAR(255) NOT NULL,
    celular VARCHAR(20) NOT NULL UNIQUE,
    estado_verificacion BOOLEAN DEFAULT FALSE,
    codigo_estudiante VARCHAR(20) UNIQUE,
    carne_estudiante BYTEA,
    numero_identificacion VARCHAR(20) UNIQUE NOT NULL,
    tipo_identificacion VARCHAR(50) CHECK (tipo_identificacion IN ('CC', 'TI', 'CE', 'PP')),
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
    tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('licencia', 'identificación')),
    FOREIGN KEY (conductor_id) REFERENCES persona(id) ON DELETE CASCADE,
    PRIMARY KEY (conductor_id, tipo_documento) 
);

CREATE TABLE vehiculo(
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('camioneta', 'bus', 'moto', 'carro')),
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
    tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('tecnomecanica', 'soat')),
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id) ON DELETE CASCADE,
    PRIMARY KEY (vehiculo_id, tipo_documento) 
);

CREATE TABLE viaje(
    id SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'en curso', 'finalizado')),
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
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    codigo_qr BYTEA NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora_salida TIMESTAMP NOT NULL,
    punto_partida GEOGRAPHY(POINT, 4326) NOT NULL
);


-- 1. Estudiante
INSERT INTO usuario (nombre, correo, tipo, contraseña, celular, estado_verificacion, codigo_estudiante, numero_identificacion, tipo_identificacion, institucion_id)
VALUES ('Juan Pérez', 'juan.perez@example.com', 'estudiante', 'hashedpassword123', '3101234567', TRUE, '20231001', '1234567890', 'CC', 1);

-- 2. Profesor
INSERT INTO usuario (nombre, correo, tipo, contraseña, celular, estado_verificacion, numero_identificacion, tipo_identificacion, institucion_id)
VALUES ('María Gómez', 'maria.gomez@example.edu', 'profesor', 'profpassword456', '3157654321', TRUE, '987654321', 'CC', 1);

-- 3. Administrativo
INSERT INTO usuario (nombre, correo, tipo, contraseña, celular, estado_verificacion, numero_identificacion, tipo_identificacion, institucion_id)
VALUES ('Carlos Ruiz', 'carlos.ruiz@admin.edu', 'administrativo', 'adminpass789', '3201112233', FALSE, '543216789', 'CE', 2);