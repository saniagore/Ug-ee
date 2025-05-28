import pg from "pg";
import QRCode from "qrcode";
import { DB_CONFIG } from "../config.js";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

import { obtenerDireccion } from "../utils/geocoding.js";

export const crearReserva = async (formData) => {
  try {
    const fecha = formData.fechaHora.split("T")[0];
    const hora = fecha + " " + formData.fechaHora.split("T")[1] + ":00";
    
    const qrContent = JSON.stringify(formData);
    const qrCode = await QRCode.toDataURL(qrContent);
    
    const [direccionOrigen, direccionDestino] = await Promise.all([
      obtenerDireccion(formData.ubicacionPartida.lat, formData.ubicacionPartida.lng),
      obtenerDireccion(formData.ubicacionDestino.lat, formData.ubicacionDestino.lng)
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
    const result = await pool.query(`
      SELECT r.id, r.estado, r.codigoQr, r.fecha, r.horaSalida, r.puntoPartida, r.puntoDestino, r.usuarioId
      FROM reserva r
      JOIN usuario u ON r.usuarioId = u.usId
      WHERE u.institucionId = (SELECT institucionId FROM conductor WHERE id = $1) AND r.estado = 'pendiente'`, [conductorId]);
    
    return result.rows;
  }catch(error){
    throw error;
  }
};