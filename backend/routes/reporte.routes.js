import { Router } from "express";
import {
    registrarReporte,
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


export default router;