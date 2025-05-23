import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import {
  viajesDisponibles,
  aceptarViaje,
  viajesActivos,
} from "../controllers/viaje.controller.js";
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
      viaje: crearViaje.rows[0],
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
      b.placa,
      u.usid
   FROM usuario u
   LEFT JOIN viaje v ON v.usuario_id = u.usid
   LEFT JOIN vehiculo b ON v.vehiculo_id = b.id  
   WHERE u.id = $1  
   ORDER BY v.fecha_creacion DESC
   LIMIT 10`,
      [usuarioId]
    );

    if (result.rows.length === 0 || !result.rows[0].usid) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const viajes = result.rows.filter((row) => row.tipo_viaje !== null);

    res.status(200).json({ viajes });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial de viajes" });
  }
});

router.post("/viajes-disponibles", async (req, res) => {
  try {
    const { conductorId, categoriaViaje } = req.body;
    const result = await viajesDisponibles(conductorId, categoriaViaje);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los viajes disponibles" });
  }
});

router.post("/aceptar-viaje", async (req, res) => {
  try {
    const { vehiculoId, viajeId } = req.body;
    const result = await aceptarViaje(vehiculoId, viajeId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al aceptar el viaje" });
  }
});

router.get("/viajes-activos/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    const result = await viajesActivos(conductorId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los viajes activos" });
  }
});

router.post("/terminar-viaje", async(req,res) =>{
  try{
    const { viajeId } = req.body;

  }catch(error){
    res.status(500).json({ error: "Error al terminar el viaje" });
  }
});

export default router;
