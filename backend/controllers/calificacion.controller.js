import pg from "pg";
import { DB_CONFIG } from "../config.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const calificarViaje = async(viajeId, calificacion, comentario) =>{
    try{
        const result = await pool.query(`
            INSERT INTO calificacion (puntuacion, comentario, viajeId)
            VALUES ($1,$2,$3)
            RETURNING *`, [calificacion,comentario,viajeId])

        return result.rows;
    }catch(error){
        throw error;
    }
};

