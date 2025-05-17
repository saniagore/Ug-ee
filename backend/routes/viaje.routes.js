import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
import bcrypt from "bcryptjs";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

const router = Router();

router.post("/solicitar-viaje", async(req,res) =>{
    try{
        const {puntoPartida,puntoDestino,tipoViaje,celular} = req.body;
    }catch(error){

    }
});




export default router;