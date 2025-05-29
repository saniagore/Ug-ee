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

export const obtenerReportes = async (institucionId) => {
    try{
        const result = await pool.query(`
            SELECT r.id, r.descripcion, r.tipo, c.nombre AS conductorNombre, c.celular, c.correo, v.fechaSalida
            FROM reporte r
            JOIN viaje v on r.viajeId = v.id
            JOIN vehiculo ve on v.vehiculoId = ve.id
            JOIN conductor c on ve.conductorId = c.cId
            JOIN institucion i on c.institucionId = i.id
            WHERE i.id = $1
        `, [institucionId]);

        return result.rows;
    }catch(error){
        throw error;
    }
};