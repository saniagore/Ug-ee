import pg from "pg";
import { DB_CONFIG } from "../config.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const calificarViaje = async(viajeId, calificacion, comentario) => {
    try {

        const result = await pool.query(`
            INSERT INTO calificacion (puntuacion, comentario, viajeId)
            VALUES ($1, $2, $3)
            RETURNING *`, 
            [calificacion, comentario, viajeId]
        );

        await pool.query(`
            UPDATE conductor c
            SET puntuacionPromedio = (
                SELECT AVG(puntuacion) 
                FROM calificacion cal
                JOIN viaje v ON cal.viajeId = v.id
                JOIN vehiculo ve ON v.vehiculoId = ve.id
                WHERE ve.conductorId = c.cId
            )
            WHERE c.cId = (
                SELECT ve.conductorId
                FROM viaje v
                JOIN vehiculo ve ON v.vehiculoId = ve.id
                WHERE v.id = $1
            )`, 
            [viajeId]
        );

        return result.rows;
    } catch(error) {
        throw error;
    }
};

