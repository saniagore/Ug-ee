import { Router } from "express";
import {
  obtenerInstitucion,
  obtenerTodasInstituciones,
} from "../controllers/institucion.controller.js";

const router = Router();

router.get("/nombres", async (req, res) => {
  try {
    const instituciones = await obtenerTodasInstituciones();
    const nombres = instituciones.map((inst) => inst.nombre);
    res.json({ instituciones: nombres });
  } catch (err) {
    console.error("Error obteniendo instituciones:", err);
    res.status(500).json({ error: "Error al obtener instituciones" });
  }
});

export default router;