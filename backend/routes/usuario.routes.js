import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET,DB_CONFIG } from "../config.js";
import pg from "pg";
import bcrypt from "bcrypt";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);


import {
  existeUsuario,
  verificarContraseña,
  obtenerEstadoUsuario,
  crearUsuario,
  obtenerDatosUsuario,
} from "../controllers/usuario.controller.js";

import { obtenerInstitucion } from "../controllers/institucion.controller.js";

const router = Router();

router.get("/existe/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const existe = await existeUsuario(celular);
    res.json({ existe });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
})

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
    
    // 1. Obtener datos completos del usuario
    const usuario = await pool.query(
      `SELECT * FROM usuario WHERE celular = $1`,
      [celular]
    );

    if (!usuario.rows.length) {
      return res.status(401).json({ success: false, error: "Usuario no existe" });
    }

    const userData = usuario.rows[0];

    // 2. Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, userData.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ success: false, error: "Contraseña incorrecta" });
    }

    // 3. Crear payload COMPLETO para el token
    const payload = {
      id: userData.id,
      celular: userData.celular,  // Campo esencial
      nombre: userData.nombre,
      correo: userData.correo,
      estadoVerificacion: userData.estado_verificacion,
      numeroIdentificacion: userData.numero_identificacion,
      tipoIdentificacion: userData.tipo_identificacion,
      institucionId: userData.institucion_id,
      tipo: userData.tipo
    };

    // 4. Generar token con el payload completo
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // 5. Configurar cookie y responder
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hora
    }).json({
      success: true,
      token,
      user: payload
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});


router.get('/auth/verify', async (req, res) => {
  try {
    // 1. Obtener token de múltiples fuentes
    const token = req.cookies?.access_token || 
                 req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        error: "Token no proporcionado"
      });
    }

    // 2. Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);  // Para depuración

    // 3. Validar campos esenciales
    if (!decoded.celular) {
      console.error('Token no contiene celular:', decoded);
      return res.status(403).json({
        authenticated: false,
        error: "Token inválido: falta campo celular"
      });
    }

    // 4. Verificar usuario en base de datos
    const usuario = await obtenerDatosUsuario(decoded.celular);
    if (!usuario) {
      console.error(`Usuario ${decoded.celular} no encontrado en BD`);
      return res.status(404).json({
        authenticated: false,
        error: "Usuario no existe en la base de datos"
      });
    }

    // 5. Responder con datos actualizados
    return res.json({
      authenticated: true,
      user: {
        id: usuario.id,
        celular: usuario.celular,
        nombre: usuario.nombre,
        // otros campos necesarios
      }
    });

  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        authenticated: false,
        error: "Token inválido"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        authenticated: false,
        error: "Token expirado"
      });
    }

    return res.status(500).json({
      authenticated: false,
      error: "Error en el servidor"
    });
  }
});




export default router;