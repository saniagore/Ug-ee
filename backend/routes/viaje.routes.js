import { Router } from "express";
import { DB_CONFIG } from "../config.js";
import {
  viajesDisponibles,
  crearRutaViaje,
  viajesActivos,
  terminarViaje,
  cancelarViaje,
} from "../controllers/viaje.controller.js";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);
const router = Router();

router.post("/crear", async (req, res) => {
  try{
    const viajeData = req.body;
    const result = await crearRutaViaje(viajeData);
    return res.status(201).json({ result });

  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Error al crear el viaje" });
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
