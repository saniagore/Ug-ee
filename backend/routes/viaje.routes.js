import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

const router = Router();

router.post("/solicitar-viaje", async(req,res) =>{
    try{
        const {puntoPartida, puntoDestino, tipoViaje, usuarioId} = req.body;
        const result = await pool.query('SELECT UsId FROM usuario WHERE id = $1', [usuarioId]);

        const crearViaje = await pool.query(
            `INSERT INTO viaje(punto_partida, punto_destino, usuario_id, tipo_viaje) 
             VALUES ($1, $2, $3, $4)`, 
            [puntoPartida, puntoDestino, result.rows[0].usid, tipoViaje]
        );
        res.status(201).json({message: "Viaje solicitado correctamente"});
    }catch(error){
        res.status(500).json({error: "Error en el servidor"});
    }
});

router.get("/historial/:usuarioId", async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const userResult = await pool.query('SELECT UsId FROM usuario WHERE id = $1', [usuarioId]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const viajesResult = await pool.query(
            `SELECT tipo_viaje, punto_partida, punto_destino, estado, vehiculo_id, fecha_creacion
             FROM viaje 
             WHERE usuario_id = $1 
             ORDER BY fecha_creacion DESC 
             LIMIT 10`, 
            [userResult.rows[0].usid]
        );

        res.status(200).json({ viajes: viajesResult.rows });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el historial de viajes" });
    }
});

export default router;