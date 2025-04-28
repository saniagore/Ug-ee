import pg from "pg";
const { Pool } = pg;
import { DB_CONFIG } from "../config.js";

const pool = new Pool(DB_CONFIG);

export const obtenerInstitucion = async (nombre) => {
  try {
    const result = await pool.query(
      "SELECT * FROM institucion WHERE nombre = $1",
      [nombre]
    );

    if (result.rows.length === 0) {
      throw new Error("Institución no encontrada");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error en obtenerInstitucion", err);
    throw err;
  }
};

export const obtenerTodasInstituciones = async () => {
  try {
    const result = await pool.query("SELECT * FROM institucion");
    return result.rows;
  } catch (err) {
    console.error("Error en obtenerTodasInstituciones", err);
    throw err;
  }
};