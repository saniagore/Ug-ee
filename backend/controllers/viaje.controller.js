import pg from "pg";
import { DB_CONFIG } from "../config.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);
import QRCode from "qrcode";

import { obtenerDireccion, wktToRutaPlanificada } from "../utils/geocoding.js";

export const viajesDisponibles = async (usuarioId) => {
  try {
    const viajes = await pool.query(
      `
      SELECT 
        v.id, 
        v.estado, 
        v.fechaSalida, 
        v.puntoPartida, 
        v.puntoDestino, 
        v.tipoViaje, 
        v.cantidadPasajeros, 
        ST_AsText(v.rutaPlanificada) as rutaPlanificada,
        v.codigoQr,
        ve.id AS vehiculoId, 
        ve.categoria, 
        ve.color, 
        ve.placa, 
        ve.marca, 
        ve.modelo, 
        ve.conductorId,
        c.nombre AS conductorNombre,
        c.celular AS conductorCelular,
        c.correo AS conductorCorreo,
        c.puntuacionPromedio AS conductorPuntuacion,
        v.cantidadPasajeros - COALESCE((
          SELECT COUNT(*) 
          FROM pasajeros pa 
          WHERE pa.viajeId = v.id
        ), 0) AS pasajerosDisponibles
      FROM viaje v
      JOIN vehiculo ve ON v.vehiculoId = ve.id
      JOIN conductor c ON ve.conductorId = c.cId
      JOIN usuario u ON u.id = $1
      LEFT JOIN pasajeros pa ON pa.viajeId = v.id
      WHERE v.estado = 'pendiente' 
      AND c.institucionId = (SELECT institucionId FROM persona WHERE id = $1)
      AND NOT EXISTS (
        SELECT 1 FROM pasajeros p 
        WHERE p.viajeId = v.id AND p.usuarioId = u.id
      )
      GROUP BY v.id, ve.id, c.cId, u.id, c.nombre, c.celular, c.correo, c.puntuacionpromedio
      `,
      [usuarioId]
    );

    viajes.rows.forEach((element) => {
      element.rutaplanificada = wktToRutaPlanificada(element.rutaplanificada);
    });
    
    return viajes.rows;
  } catch (error) {
    console.error("Error en viajesDisponibles:", error);
    throw error;
  }
};

export const viajesActivos = async (conductorId) => {
  try {
    const viajesEnCurso = await pool.query(
      `
      SELECT 
        v.id, 
        v.estado, 
        v.fechaSalida, 
        v.puntoPartida, 
        v.puntoDestino, 
        v.tipoViaje, 
        v.cantidadPasajeros, 
        v.rutaPlanificada,
        COUNT(pa.usuarioId) AS pasajerosDisponibles
      FROM viaje v
      JOIN vehiculo ve ON v.vehiculoId = ve.id
      JOIN conductor c ON ve.conductorId = c.cId
      LEFT JOIN pasajeros pa ON v.id = pa.viajeId
      WHERE c.id = $1
      GROUP BY v.id, v.estado, v.fechaSalida, v.puntoPartida, v.puntoDestino, v.tipoViaje, v.cantidadPasajeros, v.rutaPlanificada
    `,
      [conductorId]
    );

    return viajesEnCurso.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const terminarViaje = async (viajeId) => {
  try {
    const result = await pool.query(
      `
      UPDATE viaje
      SET estado = 'finalizado'
      WHERE id = $1`,
      [viajeId]
    );

    const cId = await pool.query(`
      SELECT c.cId FROM viaje v 
      JOIN vehiculo ve ON v.vehiculoId = ve.id
      JOIN conductor c ON ve.conductorId = c.cId
      WHERE v.id = $1`, [viajeId]);
    const conductorId = cId.rows[0].cId;

    await pool.query(`UPDATE conductor SET cantidadViajes = cantidadViajes + 1 WHERE cId = $1`, [conductorId]);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const cancelarViaje = async (viajeId) => {
  try {
    await pool.query(`DELETE FROM viaje WHERE id = $1`, [viajeId]);
  } catch (error) {
    throw error;
  }
};

export const crearRutaViaje = async (viajeData) => {
  try {
    const Origenlatitud = viajeData.rutaPlanificada[0].latitud;
    const Origenlongitud = viajeData.rutaPlanificada[0].longitud;
    const destinoLatitud = viajeData.rutaPlanificada[1].latitud;
    const destinoLongitud = viajeData.rutaPlanificada[1].longitud;

    const [direccionOrigen, direccionDestino] = await Promise.all([
      obtenerDireccion(Origenlatitud, Origenlongitud),
      obtenerDireccion(destinoLatitud, destinoLongitud),
    ]);

    const coordenadasWKT = viajeData.rutaPlanificada
      .map((punto) => `${punto.longitud} ${punto.latitud}`)
      .join(", ");
    const rutaPlanificadaWKT = `LINESTRING(${coordenadasWKT})`;

    const fechaHoraSalida = `${viajeData.fechaSalida} ${viajeData.horaSalida}`;

    const qrData = JSON.stringify({
      tipo: "viaje",
      origen: direccionOrigen,
      destino: direccionDestino,
      fechaSalida: fechaHoraSalida,
      tipoViaje: viajeData.tipoViaje,
      pasajeros: viajeData.cantidadPasajeros,
      vehiculoId: viajeData.vehiculoId,
    });

    const qrBuffer = await new Promise((resolve, reject) => {
      QRCode.toBuffer(
        qrData,
        {
          errorCorrectionLevel: "H",
          type: "png",
          quality: 0.9,
          margin: 1,
          scale: 4,
        },
        (err, buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        }
      );
    });

    const result = await pool.query(
      `
      INSERT INTO viaje (
        puntoPartida, 
        puntoDestino, 
        fechaSalida,
        tipoViaje,
        cantidadPasajeros,
        rutaPlanificada,
        vehiculoId,
        codigoQr,
        estado,
        ubicacionActual
      )
      VALUES (
        $1, $2, $3, $4, $5, 
        ST_GeomFromText($6, 4326), 
        $7, $8, 'pendiente',
        ST_GeomFromText('POINT(${Origenlongitud} ${Origenlatitud})', 4326)
    ) 
      RETURNING *`,
      [
        direccionOrigen,
        direccionDestino,
        fechaHoraSalida,
        viajeData.tipoViaje,
        viajeData.cantidadPasajeros,
        rutaPlanificadaWKT,
        viajeData.vehiculoId,
        qrBuffer,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear ruta de viaje:", error);
    throw error;
  }
};

export const unirseViaje = async (viajeId, usuarioId) => {
  try {

    const result = await pool.query(
      `INSERT INTO pasajeros (viajeId, usuarioId) VALUES ($1, (SELECT usId FROM usuario WHERE id = $2)) RETURNING *`,
      [viajeId, usuarioId]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const historialViajes = async (usuarioId) => {
  try {
    const viajes1 = await pool.query(
      `SELECT 
        v.id, 
        v.estado, 
        v.fechaSalida, 
        v.puntoPartida, 
        v.puntoDestino, 
        v.tipoViaje, 
        v.cantidadPasajeros, 
        ST_AsText(v.rutaPlanificada) as rutaPlanificada,
        v.codigoQr,
        ve.id AS vehiculoId, 
        ve.categoria, 
        ve.color, 
        ve.placa, 
        ve.marca, 
        ve.modelo, 
        ve.conductorId,
        c.nombre AS conductorNombre,
        c.celular AS conductorCelular,
        c.correo AS conductorCorreo,
        c.puntuacionPromedio AS conductorPuntuacion
      FROM viaje v
      JOIN vehiculo ve ON v.vehiculoId = ve.id
      JOIN conductor c ON ve.conductorId = c.cId
      WHERE v.id IN (
        SELECT viajeId FROM pasajeros WHERE usuarioId = (SELECT usId FROM usuario WHERE id = $1)
      )`,
      [usuarioId]
    );

    const viajes2 = await pool.query(
      `SELECT
      v.id,
      v.estado,
      v.fechaSalida,
      v.puntoPartida,
      v.puntoDestino,
      v.tipoViaje,
      v.cantidadPasajeros,
      ST_AsText(v.rutaPlanificada) as rutaPlanificada,
      v.codigoQr,
      c.nombre AS conductorNombre,
      c.celular AS conductorCelular,
      c.correo AS conductorCorreo,
      c.puntuacionPromedio AS conductorPuntuacion
    FROM viaje v
    JOIN reserva r on v.reservaId = r.id
    JOIN conductor c ON r.conductorId = c.cId
    WHERE r.usuarioId = (SELECT usId FROM usuario WHERE id = $1)`,
      [usuarioId]
    );

    const viajes = {
      rows: [...viajes1.rows, ...viajes2.rows]
    };

    viajes.rows.forEach((element) => {
      element.rutaplanificada = wktToRutaPlanificada(element.rutaplanificada);
    });

    return viajes.rows;
  } catch (error) {
    throw error;
  }
};

export const cancelarViajeUsuario = async (viajeId, usuarioId) => {
  try {
    const result = await pool.query(
      `DELETE FROM pasajeros WHERE viajeId = $1 AND usuarioId = (SELECT usId FROM usuario WHERE id = $2) RETURNING *`,
      [viajeId, usuarioId]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
