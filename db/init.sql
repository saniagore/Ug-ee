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

CREATE TYPE categoria_viaje AS ENUM(
    'campus', 'metropolitano', 'intermunicipal'
);

CREATE TYPE categoria_reporte AS ENUM(
    'reportes de movilidad y uso del servicio', 'reporte de desempeño de conductores y vehiculos', 'reporte de seguridad y geolocalizacion'
);

-- CREACION DE TABLAS --

CREATE TABLE institucion(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    colorPrimario VARCHAR(7) NOT NULL,
    colorSecundario VARCHAR(7) NOT NULL,
    logo BYTEA,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion VARCHAR(255) NOT NULL,
    estadoVerificacion BOOLEAN DEFAULT FALSE
);

CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    tipo tipo_cargo,
    contraseña VARCHAR(255) NOT NULL,
    celular VARCHAR(20) NOT NULL UNIQUE,
    estadoVerificacion BOOLEAN DEFAULT FALSE,
    codigoEstudiante VARCHAR(20) UNIQUE,
    carneEstudiante BYTEA,
    numeroIdentificacion VARCHAR(20) UNIQUE NOT NULL,
    tipoIdentificacion tipo_de_identificacion,
    institucionId INTEGER NOT NULL,
    FOREIGN KEY (institucionId) REFERENCES institucion(id) ON DELETE CASCADE
);

CREATE TABLE usuario(
    usId SERIAL NOT NULL UNIQUE
) INHERITS(persona);

CREATE TABLE conductor (
    cId SERIAL NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntuacionPromedio DECIMAL(3, 2) DEFAULT 0.00,
    categoriaViajes categoria_viaje,
    registroAcademico BYTEA,
    cantidadViajes INTEGER DEFAULT 0
) INHERITS (persona);

CREATE TABLE foto_documento (
    conductorId INTEGER NOT NULL,
    documento BYTEA NOT NULL,
    tipoDocumento tipo_de_documento NOT NULL DEFAULT 'identificacion',
    FOREIGN KEY (conductorId) REFERENCES conductor(CId) ON DELETE CASCADE,
    PRIMARY KEY (conductorId, tipoDocumento) 
);

CREATE TABLE vehiculo(
    id SERIAL PRIMARY KEY,
    categoria vehiculo_categoria NOT NULL,
    vencimientoSoat DATE NOT NULL,
    vencimientoTecnomecanica DATE NOT NULL,
    color VARCHAR(20) NOT NULL,
    estadoVerificacion BOOLEAN DEFAULT FALSE,
    placa VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    codigoQr BYTEA NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    conductorId INTEGER NOT NULL,
    cantidadPasajeros INTEGER NOT NULL,
    FOREIGN KEY (conductorId) REFERENCES conductor(cId) ON DELETE CASCADE
);

CREATE TABLE foto_documento_vehiculo (
    vehiculoId INTEGER NOT NULL,
    documento BYTEA NOT NULL,
    tipoDocumento categoria_de_documento NOT NULL, 
    FOREIGN KEY (vehiculoId) REFERENCES vehiculo(id) ON DELETE CASCADE,
    PRIMARY KEY (vehiculoId, tipoDocumento) 
);

CREATE TABLE reserva(
    id SERIAL PRIMARY KEY,
    estado estado_reserva NOT NULL DEFAULT 'pendiente',
    codigoQr BYTEA NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    horaSalida TIMESTAMP NOT NULL,
    puntoPartida VARCHAR(50) NOT NULL,
    puntoDestino VARCHAR(50) NOT NULL,
    usuarioId INTEGER NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES usuario(usId) ON DELETE CASCADE
);

CREATE TABLE viaje(
    id SERIAL PRIMARY KEY,
    estado categorias_estado_viaje NOT NULL DEFAULT 'pendiente',
    fechaSalida TIMESTAMP,
    puntoPartida VARCHAR(50) NOT NULL,
    rutaPlanificada GEOGRAPHY(LINESTRING, 4326),
    puntoDestino VARCHAR(50) NOT NULL,
    ubicacionActual GEOGRAPHY(POINT, 4326),
    tipoViaje categoria_viaje NOT NULL,
    cantidadPasajeros INTEGER NOT NULL,
    reservaId INT UNIQUE,
    vehiculoId INTEGER,
    FOREIGN KEY (vehiculoId) REFERENCES vehiculo(id) ON DELETE CASCADE,
    FOREIGN KEY (reservaId) REFERENCES reserva(id) ON DELETE CASCADE
);

CREATE TABLE pasajeros(
    id SERIAL PRIMARY KEY,
    viajeId INTEGER NOT NULL,
    usuarioId INTEGER,
    UNIQUE(viajeId, usuarioId),
    FOREIGN KEY (viajeId) REFERENCES viaje(id) ON DELETE CASCADE,
    FOREIGN KEY (usuarioId) REFERENCES usuario(usId) ON DELETE SET NULL
);

CREATE TABLE calificacion(
    id SERIAL PRIMARY KEY,
    puntuacion DECIMAL(3, 2) CHECK (puntuacion >= 0 AND puntuacion <= 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viajeId INTEGER NOT NULL,
    FOREIGN KEY (viajeId) REFERENCES viaje(id) ON DELETE CASCADE
);

CREATE TABLE reporte(
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    tipo categoria_reporte NOT NULL,
    viajeId INTEGER NOT NULL,
    FOREIGN KEY (viajeId) REFERENCES viaje(id) ON DELETE CASCADE
);

-- CREACION DE INDICES -- 

CREATE INDEX idx_persona_celular ON persona(celular);
CREATE INDEX idx_persona_id ON persona(id);
CREATE INDEX idx_persona_institucion ON persona(institucionId);
CREATE INDEX idx_persona_celular_institucion ON persona(celular, institucionId);

-- CARGAR UNIVERSIDAD ( BASE PARA PRUEBAS ) --

INSERT INTO institucion (nombre, contraseña, colorPrimario, colorSecundario, direccion, estadoVerificacion) VALUES
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