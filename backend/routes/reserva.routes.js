import { Router } from "express";
import {
  crearReserva,
  obtenerHistorialReservas,
  obtenerReservasDisponibles,
} from "../controllers/reserva.controller.js";

const router = Router();

router.post("/registrar", async (req, res) => {
  try {
    const { formData } = req.body;
    const result = await crearReserva(formData);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la reserva" });
  }
});

router.get("/historial/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const result = await obtenerHistorialReservas(usuarioId);

    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el historial de reservas" });
  }
});

router.get("/disponibles/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    const result = await obtenerReservasDisponibles(conductorId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas disponibles" });
  }
});

export default router;
