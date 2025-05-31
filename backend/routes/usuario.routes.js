import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
import bcrypt from "bcryptjs";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

import {
  existeUsuario,
  verificarContraseña,
  obtenerEstadoUsuario,
  crearUsuario,
  obtenerDatosUsuario,
  obtenerUsuarios,
  actualizarEstado,
} from "../controllers/usuario.controller.js";

const router = Router();

router.get("/existe/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const existe = await existeUsuario(celular);
    res.json({ existe });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/verificar-contra", async (req, res) => {
  try {
    const { celular, contraseña } = req.body;
    const coincide = await verificarContraseña(celular, contraseña);
    res.json({ coincide });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/estado/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const estado = await obtenerEstadoUsuario(celular);
    res.json({ estado });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/crearusuario", async (req, res) => {
  try {
    const formData = req.body;
    const result = await crearUsuario(formData);
    res.json(result);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      error: "Error al crear usuario",
      details: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { celular, contraseña } = req.body;

    const usuario = await pool.query(
      `SELECT * FROM usuario WHERE celular = $1`,
      [celular]
    );

    if (!usuario.rows.length) {
      return res
        .status(401)
        .json({ success: false, error: "Usuario no existe" });
    }

    const userData = usuario.rows[0];

    const contraseñaValida = await bcrypt.compare(
      contraseña,
      userData.contraseña
    );
    if (!contraseñaValida) {
      return res
        .status(401)
        .json({ success: false, error: "Contraseña incorrecta" });
    }

    const payload = {
      id: userData.id,
      celular: userData.celular,
      nombre: userData.nombre,
      correo: userData.correo,
      estadoVerificacion: userData.estadoVerificacion,
      numeroIdentificacion: userData.numeroIdentificacion,
      tipoIdentificacion: userData.tipoIdentificacion,
      institucionId: userData.institucionId,
      tipo: userData.tipo,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
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
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

router.get("/auth/verify", async (req, res) => {
  try {
    const token =
      req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(200).json({
        authenticated: false,
        error: "Token no proporcionado",
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.celular) {
      console.error("Token no contiene celular:", decoded);
      return res.status(403).json({
        authenticated: false,
        error: "Token inválido: falta campo celular",
      });
    }
    const usuario = await obtenerDatosUsuario(decoded.celular);
    if (!usuario) {
      return res.status(404).json({
        authenticated: false,
        error: "Usuario no existe en la base de datos",
      });
    }
    return res.json({
      authenticated: true,
      user: {
        id: usuario.id,
        celular: usuario.celular,
        nombre: usuario.nombre,
        estado: usuario.estadoverificacion
      },
    });
  } catch (error) {
    console.error("Error en verificación de token:", error.message);

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

router.get("/obtenerUsuarios", async (req, res) => {
    try {
        const token = req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const data = await obtenerUsuarios(decoded.id);
        res.json(data);
    } catch(error) {
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});

router.post("/actualizar/estado", async(req,res)=> {
  try{
    const { celular, estado } = req.body;
    await actualizarEstado(celular, estado);
    res.json({ success: true, message: "Estado actualizado correctamente" });
  }catch(error){
    res.status(500).json({success:false, error: "Error en el servidor"});
  }
});

router.get("/id/:celular", async (req, res) => {
  try{
    const { celular } = req.params;
    const usuario = await pool.query(
      `SELECT id FROM usuario WHERE celular = $1`,
      [celular]
    );
    return usuario.rows;
  }catch(error){
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

export default router;
