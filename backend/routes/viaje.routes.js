import { Router } from "express";
import {
  viajesDisponibles,
  crearRutaViaje,
  viajesActivos,
  terminarViaje,
  cancelarViaje,
  unirseViaje,
  historialViajes,
  cancelarViajeUsuario
} from "../controllers/viaje.controller.js";

const router = Router();

router.post("/crear", async (req, res) => {
  try {
    const viajeData = req.body;
    const result = await crearRutaViaje(viajeData);
    return res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el viaje" });
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

router.post("/terminar-viaje", async (req, res) => {
  try {
    const { viajeId } = req.body;
    const result = await terminarViaje(viajeId);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al terminar el viaje" });
  }
});

router.post("/cancelar-viaje", async (req, res) => {
  try {
    const { viajeId } = req.body;
    const result = await cancelarViaje(viajeId);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar el viaje" });
  }
});

router.get("/viajes-disponibles/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const result = await viajesDisponibles(usuarioId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los viajes disponibles" });
  }
});

router.post("/unirse-viaje", async (req, res) => {
  try {
    const { viajeId, usuarioId } = req.body;
    const result = await unirseViaje(viajeId, usuarioId);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al unirse al viaje" });
  }
});

router.get("/historial/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    console.log("A");
    const result = await historialViajes(usuarioId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial de viajes" });
  }
});

router.post("/cancelar-viaje-usuario", async (req, res) => {
  try {
    const { viajeId, usuarioId } = req.body;
    const result = await cancelarViajeUsuario(viajeId, usuarioId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar el viaje" });
  }
});

export default router;
