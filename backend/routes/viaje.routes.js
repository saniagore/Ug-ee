import { Router } from "express";
import { DB_CONFIG } from "../config.js";
import {
  viajesDisponibles,
  aceptarViaje,
  viajesActivos,
  terminarViaje,
  cancelarViaje,
} from "../controllers/viaje.controller.js";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);
const router = Router();

router.post("/solicitar-viaje", async (req, res) => {
  try {
    const { puntoPartida, puntoDestino, tipoViaje, usuarioId } = req.body;

    const crearViaje = await pool.query(
      `INSERT INTO viaje(puntoPartida, puntoDestino, usuarioId, tipoViaje) 
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
    const result = await terminarViaje(viajeId);

    res.status(200).json({ result });
  }catch(error){
    res.status(500).json({ error: "Error al terminar el viaje" });
  }
});

router.post("/cancelar-viaje", async(req,res) =>{
  try{
    const { viajeId } = req.body;
    const result = await cancelarViaje(viajeId);

    res.status(200).json({ result });
  }catch(error){
    res.status(500).json({ error: "Error al cancelar el viaje" });
  }
});

export default router;
