import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config.js";

import {
  existeUsuario,
  verificarContraseña,
  obtenerEstadoUsuario,
  crearUsuario,
} from "../controllers/usuario.controller.js";

import { obtenerInstitucion } from "../controllers/institucion.controller.js";
import cookieParser from "cookie-parser";

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

router.post("/verificar-contraseña", async (req, res) => {
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
    const coincide = await verificarContraseña(celular, contraseña);

    if (!coincide) {
      return res.json({
        coincide: false,
        error: "Contraseña incorrecta",
      });
    }

    const datos = await obtenerEstadoUsuario(celular);
    const payload = {
      coincide: true,
      estadoVerificacion: datos.estado_verificacion,
      celular: datos.celular,
      nombre: datos.nombre,
      correo: datos.correo,
      numeroIdentificacion: datos.numero_identificacion,
      tipoIdentificacion: datos.tipo_identificacion,
      institucion: datos.institucion_id,
      id: datos.id,
      tipo: datos.tipo,
      codigoEstudiante: datos.codigo_estudiante,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res
      .cookie('access_token', token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'Strict', // Adjust as needed
        maxAge: 1000*60*60
      })
      .send({celular, token})
  } catch (err) {
    console.error("Error login user:", err);
    res.status(500).json({
      error: "Error al hacer login",
      details: err.message,
    });
  }
});


router.get('/auth/verify', (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
  }
});





export default router;