import { Router } from "express";
import { crearReserva } from "../controllers/reserva.controller.js";

const router = Router();

router.post("/registrar", async(req,res) =>{
    try{
        const { formData } = req.body;
        const result = await crearReserva(formData);
        res.status(200).json({result});
    }catch(error){
        res.status(500).json({ error: "Error al registrar la reserva" });      
    }
});






export default router;