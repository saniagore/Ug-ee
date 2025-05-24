import pg from "pg";
import { DB_CONFIG } from "../config.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const viajesDisponibles = async (conductorId, categoria) => {
  try {
    const query = `
      SELECT 
        v.id AS viajeId,
        v.puntoPartida,
        v.puntoDestino,
        v.tipoViaje,
        u.nombre AS nombreUsuario,
        u.celular AS contactoUsuario
      FROM 
        viaje v
      JOIN 
        usuario u ON v.usuarioId = u.UsId
      JOIN 
        conductor c ON c.institucionId = u.institucionId
      WHERE 
        c.CId = $1
        AND v.tipoViaje = $2
        AND v.estado = 'pendiente'
        AND v.vehiculoId IS NULL
    `;

    const values = [conductorId, categoria];

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error en viajesDisponibles:", error);
    throw error;
  }
};

export const aceptarViaje = async (vehiculoId, viajeId) => {
  try {
    const result = await pool.query(
      `UPDATE viaje SET vehiculoId = $1, estado = 'en curso' WHERE id = $2`,
      [vehiculoId, viajeId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const viajesActivos = async (conductorId) => {
  try {
    const viajesEnCurso = await pool.query(
      `SELECT v.id  AS viajeId, v.puntoPartida, v.puntoDestino, v.usuarioId, v.tipoViaje, v.estado, u.nombre, u.celular
        FROM viaje v
        JOIN usuario u ON v.usuarioId = u.UsId
        JOIN vehiculo b ON v.vehiculoId = b.id
        JOIN conductor c ON b.conductorId = c.CId
        WHERE c.id = $1  
        AND v.estado = 'en curso'
        OR v.estado = 'finalizado'`,
      [conductorId]
    );

    return viajesEnCurso.rows;
  } catch (error) {
    throw error;
  }
};

export const terminarViaje = async(viajeId) =>{
  try{
    const result = await pool.query(`
      UPDATE viaje
      SET estado = 'finalizado'
      WHERE id = $1`,
    [viajeId])

    return result.rows;
  }catch(error){
    throw error;
  }
};


export const cancelarViaje = async(viajeId) => {
  try{
    const result = await pool.query(`
      UPDATE viaje
      SET vehiculoId = NULL, estado = 'pendiente'
      WHERE id = $1`,
    [viajeId]);

    return result;
  }catch(error){
    throw error;
  }
};