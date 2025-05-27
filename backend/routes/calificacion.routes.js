import { Router } from "express";
import { calificarViaje } from "../controllers/calificacion.controller.js";

const router = Router();

router.post("/calificar", async(req,res) =>{
    try{
        const { viajeId, calificacion, comentario } = req.body;
        const result = await calificarViaje(viajeId,calificacion,comentario);
        res.status(200).json({result});
    } catch(error){
        console.error(error);
        res.status(500).json({error: "Error al calificar el viaje"});
    }
});







export default router;