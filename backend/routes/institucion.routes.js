import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
import bcrypt from "bcrypt";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

import {
  crearInstitucion,
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


router.post("/login", async(req,res) =>{
  try{
    const { nombre, contraseña} = req.body;

    const institucion = await pool.query(
      `SELECT * FROM institucion WHERE nombre = $1`,
      [nombre]
    );

    if (!institucion.rows.length) {
      return res
        .status(200)
        .json({ success: false, error: "Institucion no existe" });
    }

    const institucionData = institucion.rows[0];

    const contraseñaValida = await bcrypt.compare(contraseña,institucionData.contraseña);

    if(!contraseñaValida){

    return res
        .status(200)
        .json({ success: false, error: "Contraseña incorrecta" });
    }

    const payload = {
      id: institucionData.id,
      nombre: institucionData.nombre,
      colorPrimario: institucionData.color_primario,
      colorSecundario: institucionData.color_secundario,
      logo: institucionData.logo,
      direccion: institucionData.direccion,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRATION});

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .json({
        success: true,
        token,
        user: payload,
      });
  }catch(error){
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

router.get("/auth/verify", async (req,res) =>{
  try{
    const token = 
      req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
    
    if(!token){
      return res.status(200).json({
        authenticated: false,
        error: "Token no proporcionado",
      })
    }
    const decoded  = jwt.verify(token, JWT_SECRET);
    if(!decoded.nombre){
      console.error("Token no contiene nombre", decoded);
      return res.status(403).json({
        authenticated:false,
        error: "Token inválido: falta campo nombre",
      });
    }

    const institucion = await obtenerInstitucion(decoded.nombre);
    if(!institucion){
      console.error("institucion no encontrada");
      return res.status(404).json({
        authenticated:false,
        error: "Institucion inexistente en la base de datos",
      });
    }
    return res.json({
      authenticated:true,
      institucion:{
        id: institucion.id,
        nombre: institucion.nombre,
        estado: institucion.estado_verificacion,
      },
    });

    }catch(error){
      console.error("Error en verificacion de token: ", error.message);
      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({
          authenticated: false,
          error: "Token inválido",
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({
          authenticated: false,
          error: "Token expirado",
        });
      }
      return res.status(500).json({
        authenticated: false,
        error: "Error en el servidor",
      });
    }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({
      success: true,
      message: "Logout exitoso",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      error: "Error en el servidor durante el logout",
    });
  }
});


router.post("/crearinstitucion", async(req,res) =>{
  try{
    const formData = req.body;
    const result = await crearInstitucion(formData);
    res.json(result);
  }catch(error){
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Error al crear usuario",
      details: error.message,
    });
  }
})

router.post("/login", async(req,res)=>{
  try{
    const { nombre, contraseña} = req.body;

    const institucion = await pool.query(`SELECT * FROM institucion WHERE nombre = $1`,
      [nombre]
    );

    if(!institucion.rows.length){
      return res
        .status(401)
        .json({success: false, error: "Institucion no existe"});
    }

    const institucionData = institucion.rows[0];

    const contraseñaValida = await bcrypt.compare(
      contrase,
      institucionData.contrase
    );

    if(!contraseñaValida){
      return res
        .status(401)
        .json({
          succes: false,
          error: "Contraseña invalida"
        });
    }

    const payload = {
      id: institucionData.id,
      nombre: institucionData.nombre,
      estadoVerificacion: institucionData.estado_verificacion,
      colorPrimario: institucionData.color_primario,
      colorSecundario: institucionData.color_secundario,
      direccion: institucionData.direccion,
    };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .json({
        success: true,
        token,
        institucion: payload,
      });

  }catch(error){
    console.error("Error en login:", error);
    res.status(500).json({success:false,error:"Error en el servidor"});
  }
})

export default router;