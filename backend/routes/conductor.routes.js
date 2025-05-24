import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

import {
  existeConductor,
  verificarContraseñaConductor,
  obtenerEstadoConductor,
  crearConductor,
  obtenerDatosConductor,
  actualizarDocumentosConductor,
  obtenerVehiculosConductor,
  actualizarUbicacionConductor,
  obtenerConductoresInstitucion,
  actualizarEstadoConductor,
  actualizarEstadoVehiculo
} from "../controllers/conductor.controller.js";


const storage = multer.memoryStorage();
const router = Router();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Solo se permiten archivos PDF, JPEG, JPG o PNG"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Verificar si existe un conductor
router.get("/existe/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const existe = await existeConductor(celular);
    res.json({ existe });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Verificar contraseña del conductor
router.post("/verificar-contraseña", async (req, res) => {
  try {
    const { celular, contraseña } = req.body;
    const coincide = await verificarContraseñaConductor(celular, contraseña);
    res.json({ coincide });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Obtener estado de verificación del conductor
router.get("/estado/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const estado = await obtenerEstadoConductor(celular);
    res.json({ estado });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Registrar nuevo conductor
router.post("/registro", upload.single('documentoIdentificacion'), async (req, res) => {
  try {
    const formData = {
      nombre: req.body.nombre,
      contraseña: req.body.contrasena,
      correo: req.body.correo,
      celular: req.body.celular,
      numeroIdentificacion: req.body.numeroIdentificacion,
      tipoIdentificacion: req.body.tipoIdentificacion,
      institucion: req.body.institucion,
      direccion: req.body.direccion,
      tipo: req.body.tipo,
      documentoIdentificacion: req.file,
    };
    const result = await crearConductor(formData);
    res.json(result);
  } catch (err) {
    console.error("Error creando conductor:", err);
    res.status(500).json({
      error: "Error al crear conductor",
      details: err.message,
    });
  }
});

// Login de conductor
router.post("/login", async (req, res) => {
  try {
    const { celular, contraseña } = req.body;

    const conductor = await obtenerDatosConductor(celular);
    
    if (!conductor) {
      return res.status(401).json({ 
        success: false, 
        error: "Conductor no existe" 
      });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, conductor.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ 
        success: false, 
        error: "Contraseña incorrecta" 
      });
    }

    const payload = {
      id: conductor.id,
      celular: conductor.celular,
      nombre: conductor.nombre,
      correo: conductor.correo,
      estadoVerificacion: conductor.estadoVerificacion,
      numeroIdentificacion: conductor.numeroIdentificacion,
      tipoIdentificacion: conductor.tipoIdentificacion,
      institucionId: conductor.institucionId,
      tipo: conductor.categoriaViajes,
      esConductor: true
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
    console.error("Error en login de conductor:", error);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// Verificar autenticación del conductor
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
    
    if (!decoded.celular || !decoded.esConductor) {
      return res.status(403).json({
        authenticated: false,
        error: "Token inválido para conductor",
      });
    }

    const conductor = await obtenerDatosConductor(decoded.celular);
    if (!conductor) {
      return res.status(404).json({
        authenticated: false,
        error: "Conductor no encontrado",
      });
    }

    // Obtener vehículos del conductor
    const vehiculos = await obtenerVehiculosConductor(conductor.id);

    return res.json({
      authenticated: true,
      user: {
        id: conductor.id,
        celular: conductor.celular,
        nombre: conductor.nombre,
        estado: conductor.estadoVerificacion,
        vehiculos: vehiculos
      },
    });
  } catch (error) {
    console.error("Error en verificación de token de conductor:", error.message);

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

// Actualizar documentos del conductor
router.put("/documentos/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    const { documentos } = req.body;

    const result = await actualizarDocumentosConductor(conductorId, documentos);
    res.json(result);
  } catch (err) {
    console.error("Error actualizando documentos:", err);
    res.status(500).json({ error: "Error al actualizar documentos" });
  }
});

// Obtener vehículos del conductor
router.get("/vehiculos/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    const vehiculos = await obtenerVehiculosConductor(conductorId);
    res.json({ vehiculos });
  } catch (err) {
    console.error("Error obteniendo vehículos:", err);
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
});

// Actualizar ubicación del conductor
router.post("/ubicacion", async (req, res) => {
  try {
    const { conductorId, latitud, longitud } = req.body;
    
    const result = await actualizarUbicacionConductor(conductorId, { 
      latitud, 
      longitud 
    });
    
    res.json(result);
  } catch (err) {
    console.error("Error actualizando ubicación:", err);
    res.status(500).json({ error: "Error al actualizar ubicación" });
  }
});

// Logout del conductor
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
    console.error("Error en logout de conductor:", error);
    res.status(500).json({
      success: false,
      error: "Error en el servidor durante el logout",
    });
  }
});

router.get("/institucion/:institucionId", async (req, res) => {
  try {
    const { institucionId } = req.params;
    const conductores = await obtenerConductoresInstitucion(institucionId);
    res.json(conductores);
  } catch (err) {
    console.error("Error obteniendo conductores:", err);
    res.status(500).json({ error: "Error al obtener conductores" });
  }
});

// Actualizar estado de verificación del conductor
router.put("/estado/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    const { estado } = req.body;
    const result = await actualizarEstadoConductor(conductorId, estado);
    res.json(result);
  } catch (err) {
    console.error("Error actualizando estado de conductor:", err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

// Actualizar estado de verificación del vehículo
router.put("/vehiculo/estado/:vehiculoId", async (req, res) => {
  try {
    const { vehiculoId } = req.params;
    const { estado } = req.body;
    const result = await actualizarEstadoVehiculo(vehiculoId, estado);
    res.json(result);
  } catch (err) {
    console.error("Error actualizando estado de vehículo:", err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});


export default router;