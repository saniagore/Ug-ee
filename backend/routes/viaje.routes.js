import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

const router = Router();

router.post("/solicitar-viaje", async (req, res) => {
    try {
        const { puntoPartida, puntoDestino, tipoViaje, usuarioId } = req.body;

        const crearViaje = await pool.query(
            `INSERT INTO viaje(punto_partida, punto_destino, usuario_id, tipo_viaje) 
             SELECT $1, $2, usid, $4 
             FROM usuario 
             WHERE id = $3
             RETURNING *`,
            [puntoPartida, puntoDestino, usuarioId, tipoViaje]
        );

        if (crearViaje.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(201).json({ 
            message: "Viaje solicitado correctamente",
            viaje: crearViaje.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

router.get("/historial/:usuarioId", async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const result = await pool.query(
            `SELECT 
                v.tipo_viaje, 
                v.punto_partida, 
                v.punto_destino, 
                v.estado, 
                v.vehiculo_id, 
                v.fecha_creacion,
                u.usid
             FROM usuario u
             LEFT JOIN viaje v ON v.usuario_id = u.usid
             WHERE u.id = $1
             ORDER BY v.fecha_creacion DESC
             LIMIT 10`,
            [usuarioId]
        );

        if (result.rows.length === 0 || !result.rows[0].usid) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const viajes = result.rows.filter(row => row.tipo_viaje !== null);

        res.status(200).json({ viajes });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el historial de viajes" });
    }
});

export default router;