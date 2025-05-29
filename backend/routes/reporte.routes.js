import { Router } from "express";
import {
    registrarReporte,
    obtenerReportes
} from "../controllers/reporte.controller.js";

const router = Router();

router.post("/registrar", async (req, res) => {
    try{
        const { viajeId, descripcion, categoria} = req.body;
        await registrarReporte(viajeId, descripcion, categoria);
        res.status(201).json({ message: "Reporte registrado exitosamente" });
    }catch(error) {
        res.status(500).json({ error: "Error al registrar el reporte" });
    }
});

router.get("/obtener/:institucionId", async (req, res) => {
    try{
        const { institucionId } = req.params;
        const reportes = await obtenerReportes(institucionId);
        res.status(200).json({ reportes });
    }catch(error){
        res.status(500).json({ error: "Error al obtener los reportes" });
    }
});

export default router;