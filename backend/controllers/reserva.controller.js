import pg from "pg";
import QRCode from "qrcode";
import { DB_CONFIG } from "../config.js";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

import { obtenerDireccion, obtenerCoordenadas } from "../utils/geocoding.js";

export const crearReserva = async (formData) => {
  try {
    const fecha = formData.fechaHora.split("T")[0];
    const hora = fecha + " " + formData.fechaHora.split("T")[1] + ":00";

    const qrContent = JSON.stringify(formData.rutaPlanificada);
    const qrCode = await QRCode.toDataURL(qrContent);

    const [direccionOrigen, direccionDestino] = await Promise.all([
      obtenerDireccion(
        formData.ubicacionPartida.lat,
        formData.ubicacionPartida.lng
      ),
      obtenerDireccion(
        formData.ubicacionDestino.lat,
        formData.ubicacionDestino.lng
      ),
    ]);

    const result = await pool.query(
      `
            INSERT INTO reserva(usuarioId, fecha, horaSalida, puntoPartida, puntoDestino, codigoQr)
            VALUES ((SELECT usId FROM usuario WHERE id = $1), $2, $3, $4, $5, $6)`,
      [
        formData.usuarioId,
        fecha,
        hora,
        direccionOrigen,
        direccionDestino,
        qrCode,
      ]
    );

    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerHistorialReservas = async (usuarioId) => {
  try {
    const result = await pool.query(
      `
            SELECT r.id, r.estado, r.codigoQr, r.fecha, r.horaSalida, r.puntoPartida, r.puntoDestino
            FROM reserva r
            INNER JOIN usuario u ON r.usuarioId = u.usId
            WHERE u.id = $1
            ORDER BY r.horaSalida DESC
            `,
      [usuarioId]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const obtenerReservasDisponibles = async (conductorId) => {
  try {
    const result = await pool.query(
      `
      SELECT r.id, r.estado, r.codigoQr, r.fecha, r.horaSalida, r.puntoPartida, r.puntoDestino, r.usuarioId
      FROM reserva r
      JOIN usuario u ON r.usuarioId = u.usId
      WHERE u.institucionId = (SELECT institucionId FROM conductor WHERE id = $1) AND r.estado = 'pendiente'`,
      [conductorId]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const aceptarReserva = async (reservaId, conductorId) => {
  try {
    await pool.query(
      `
      UPDATE reserva
      SET estado = 'confirmada', conductorId = (SELECT cId FROM conductor WHERE id = $1)
      WHERE id = $2`,
      [conductorId, reservaId]
    );

    const reserva = await pool.query(`SELECT * FROM reserva WHERE id = $1`, [
      reservaId,
    ]);
    const reservaData = reserva.rows[0];

    const qrContent = JSON.stringify(reservaData.id);
    const qrCode = await QRCode.toDataURL(qrContent);

    const coordenadasOrigen = await obtenerCoordenadas(
      reservaData.puntopartida
    );
    const coordenadasDestino = await obtenerCoordenadas(
      reservaData.puntodestino
    );
    const RutaPlanificadaStringWKT = `LINESTRING(${coordenadasOrigen.lon} ${coordenadasOrigen.lat}, ${coordenadasDestino.lon} ${coordenadasDestino.lat})`;

    const result = await pool.query(
      `
      INSERT INTO viaje
      (fechaSalida, puntoPartida, puntoDestino, tipoViaje, cantidadPasajeros, rutaPlanificada, reservaId,codigoQr)
      VALUES 
      ($1, $2, $3, (SELECT categoriaViajes FROM conductor WHERE id = $4), 1, $5, $6, $7)`,
      [
        reservaData.horasalida,
        reservaData.puntopartida,
        reservaData.puntodestino,
        conductorId,
        RutaPlanificadaStringWKT,
        reservaId,
        qrCode,
      ]
    );

    await pool.query(
      `
      INSERT INTO pasajeros
      (viajeId, usuarioId)
      VALUES((SELECT id FROM viaje WHERE reservaId = $1), (SELECT usId FROM usuario WHERE id = (SELECT usuarioId FROM reserva WHERE id = $1)))`,
      [reservaId]
    );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
