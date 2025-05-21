import pg from "pg";
import bcrypt from "bcryptjs";
import { DB_CONFIG, SALT_ROUNDS } from "../config.js";
import { obtenerInstitucion } from "./institucion.controller.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const viajesDisponibles = async (conductorId, categoria) => {
  try {
    const query = `
      SELECT 
        v.id AS viaje_id,
        v.punto_partida,
        v.punto_destino,
        v.tipo_viaje,
        u.nombre AS nombre_usuario,
        u.celular AS contacto_usuario
      FROM 
        viaje v
      JOIN 
        usuario u ON v.usuario_id = u.UsId
      JOIN 
        conductor c ON c.institucion_id = u.institucion_id
      WHERE 
        c.CId = $1
        AND v.tipo_viaje = $2
        AND v.estado = 'pendiente'
        AND v.vehiculo_id IS NULL
    `;
    
    const values = [conductorId, categoria];
    
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error en viajesDisponibles:', error);
    throw error;
  }
};
