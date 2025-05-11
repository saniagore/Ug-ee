import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config.js";
import bcrypt from "bcrypt";

import {
  crearInstitucion,
  obtenerInstitucion,
  obtenerTodasInstituciones,
  obtenerInstitucionPorId,
  actualizarInstitucion,
  eliminarInstitucion,
  verificarLoginInstitucion,
  obtenerEstadisticasInstitucion,
  actualizarLogoInstitucion,
  existeInstitucion
} from "../controllers/institucion.controller.js";

const router = Router();

// Obtener nombres de todas las instituciones
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

// Obtener todas las instituciones (con paginación)
router.get("/", async (req, res) => {
  try {
    const { pagina = 1, limite = 10, verificadas } = req.query;
    const instituciones = await obtenerTodasInstituciones(
      parseInt(pagina),
      parseInt(limite),
      verificadas === 'true' ? true : verificadas === 'false' ? false : null
    );
    res.json({ instituciones });
  } catch (err) {
    console.error("Error obteniendo instituciones:", err);
    res.status(500).json({ error: "Error al obtener instituciones" });
  }
});

// Obtener institución por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const institucion = await obtenerInstitucionPorId(id);
    res.json({ institucion });
  } catch (err) {
    console.error("Error obteniendo institución:", err);
    res.status(err.message === "Institución no encontrada" ? 404 : 500).json({ 
      error: err.message || "Error al obtener institución" 
    });
  }
});

// Crear nueva institución
router.post("/", async (req, res) => {
  try {
    const result = await crearInstitucion(req.body);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creando institución:", err);
    res.status(500).json({ 
      error: "Error al crear institución",
      details: err.message 
    });
  }
});

// Actualizar institución
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await actualizarInstitucion(id, req.body);
    
    if (result.error) {
      const statusCode = result.details?.nombre ? 409 : 400;
      return res.status(statusCode).json(result);
    }
    
    res.json(result);
  } catch (err) {
    console.error("Error actualizando institución:", err);
    res.status(err.message === "Institución no encontrada" ? 404 : 500).json({ 
      error: err.message || "Error al actualizar institución" 
    });
  }
});

// Eliminar institución (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarInstitucion(id);
    
    if (result.error) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (err) {
    console.error("Error eliminando institución:", err);
    res.status(err.message === "Institución no encontrada" ? 404 : 500).json({ 
      error: err.message || "Error al eliminar institución" 
    });
  }
});

// Login de institución
router.post("/login", async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;
    const result = await verificarLoginInstitucion(nombre, contraseña);

    if (result.error) {
      return res.status(200).json({ 
        success: false, 
        error: result.message 
      });
    }

    const payload = {
      id: result.institucion.id,
      nombre: result.institucion.nombre,
      colorPrimario: result.institucion.color_primario,
      colorSecundario: result.institucion.color_secundario,
      direccion: result.institucion.direccion,
      estadoVerificacion: result.institucion.estado_verificacion,
      esInstitucion: true
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
        institucion: payload,
      });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error en el servidor" 
    });
  }
});

// Verificar autenticación
router.get("/auth/verify", async (req, res) => {
  try {
    const token = req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(200).json({
        authenticated: false,
        error: "Token no proporcionado",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.nombre || !decoded.esInstitucion) {
      return res.status(403).json({
        authenticated: false,
        error: "Token inválido para institución",
      });
    }

    const institucion = await obtenerInstitucion(decoded.nombre);
    if (!institucion) {
      return res.status(404).json({
        authenticated: false,
        error: "Institución no encontrada",
      });
    }

    return res.json({
      authenticated: true,
      institucion: {
        id: institucion.id,
        nombre: institucion.nombre,
        estado: institucion.estado_verificacion,
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

// Logout
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

// Obtener estadísticas de la institución
router.get("/:id/estadisticas", async (req, res) => {
  try {
    const { id } = req.params;
    const estadisticas = await obtenerEstadisticasInstitucion(id);
    res.json({ estadisticas });
  } catch (err) {
    console.error("Error obteniendo estadísticas:", err);
    res.status(500).json({ 
      error: "Error al obtener estadísticas",
      details: err.message 
    });
  }
});

// Actualizar logo de la institución
router.put("/:id/logo", async (req, res) => {
  try {
    const { id } = req.params;
    const { logo } = req.body;
    
    if (!logo) {
      return res.status(400).json({ 
        error: "Datos de logo no proporcionados" 
      });
    }

    const result = await actualizarLogoInstitucion(id, logo);
    
    if (result.error) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (err) {
    console.error("Error actualizando logo:", err);
    res.status(err.message === "Institución no encontrada" ? 404 : 500).json({ 
      error: err.message || "Error al actualizar logo" 
    });
  }
});

// Verificar existencia de institución
router.get("/existe/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const existe = await existeInstitucion(nombre);
    res.json({ existe: existe.error ? true : false });
  } catch (err) {
    console.error("Error verificando institución:", err);
    res.status(500).json({ 
      error: "Error al verificar institución",
      details: err.message 
    });
  }
});

export default router;