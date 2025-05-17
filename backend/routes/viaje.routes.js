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

export default router;