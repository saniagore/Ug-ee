import pg from "pg";
import { DB_CONFIG } from "../config.js";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const registrarReporte = async (viajeId, descripcion, categoria) => {
    try {
        const result = await pool.query(
            "INSERT INTO reporte (viajeId, descripcion, tipo) VALUES ($1, $2, $3) RETURNING *",
            [viajeId, descripcion, categoria]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error en registrarReporte:", error);
        throw error;
    }
};