import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
import multer from "multer";
import path from "path";
import QRCode from 'qrcode';

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);
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

router.post(
  "/registrar",
  upload.fields([
    { name: "soatFile", maxCount: 1 },
    { name: "tecnomecanicaFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const conductorId = decoded.id;

      const CId = await pool.query(`SELECT CId FROM conductor WHERE id = $1`, [conductorId]);
      const conductorIdFk = CId.rows[0].cid;

      const {
        categoria,
        color,
        placa,
        marca,
        modelo,
        cantidadPasajeros,
        vencimientoSoat,
        vencimientoTecnomecanica,
      } = req.body;

      const soatFile = req.files?.soatFile?.[0]; 
      const tecnomecanicaFile = req.files?.tecnomecanicaFile?.[0];

      if (!categoria || !placa || !marca || !modelo) {
        return res.status(400).json({ message: "Campos obligatorios faltantes" });
      }
      if (!soatFile || !tecnomecanicaFile) {
        return res.status(400).json({ message: "Debes subir ambos documentos" });
      }

      const qrData = `VEHICULO:${placa}:${marca}:${Date.now()}`;
      const qrCodeBuffer = await QRCode.toBuffer(qrData);

      const result = await pool.query(
        `INSERT INTO vehiculo 
        (categoria, color, placa, marca, modelo, 
         vencimientoSoat, vencimientoTecnomecanica, 
         codigoQr, conductorId, cantidadPasajeros)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
        [
          categoria,
          color,
          placa,
          marca,
          modelo,
          new Date(vencimientoSoat),
          new Date(vencimientoTecnomecanica),
          qrCodeBuffer,
          conductorIdFk,
          cantidadPasajeros,
        ]
      );

      const vehiculoId = result.rows[0].id;


      await pool.query(
        `INSERT INTO foto_documento_vehiculo 
        (vehiculoId, documento, tipoDocumento)
        VALUES ($1, $2, 'soat')`,
        [vehiculoId, soatFile.buffer] 
      );

      await pool.query(
        `INSERT INTO foto_documento_vehiculo 
        (vehiculoId, documento, tipoDocumento)
        VALUES ($1, $2, 'tecnomecanica')`,
        [vehiculoId, tecnomecanicaFile.buffer]
      );

      res.status(201).json({
        success: true,
        message: "Vehículo registrado exitosamente",
        vehiculoId: vehiculoId,
      });
    } catch (error) {
      console.error("Error al registrar vehículo:", error);
      res.status(500).json({
        success: false,
        message: "Error en el servidor",
        error: error.message,
      });
    }
  }
);

router.get("/vehiculos/:institucionId", async (req, res) => {
    try {
        const { institucionId } = req.params;
        const result = await pool.query(
            `SELECT DISTINCT ON (v.id)
                v.id,
                v.color,
                v.marca,
                v.placa,
                v.estadoVerificacion,
                v.categoria,
                v.modelo,
                v.vencimientoSoat,
                v.vencimientoTecnomecanica,
                c.CId AS conductorId,
                c.nombre AS conductorNombre,
                c.correo AS conductorCorreo,
                c.celular AS conductorCelular
            FROM Vehiculo v
            JOIN conductor c ON v.conductorId = c.CId
            JOIN institucion i ON c.institucionId = i.id
            WHERE i.id = $1
            ORDER BY v.id`, [institucionId]
        );

        const vehiculos = result.rows;
        for (const vehiculo of vehiculos) {
            const docsConductor = await pool.query(
                `SELECT documento, tipoDocumento 
                 FROM foto_documento 
                 WHERE conductorId = $1`, 
                [vehiculo.conductorId]
            );
            
            const docsVehiculo = await pool.query(
                `SELECT documento, tipoDocumento 
                 FROM foto_documento_vehiculo 
                 WHERE vehiculoId = $1`, 
                [vehiculo.id]
            );

            vehiculo.documentosConductor = docsConductor.rows;
            vehiculo.documentosVehiculo = docsVehiculo.rows;
        }
      

        res.status(200).json({ vehiculos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los vehículos" });
    }
});

router.get("/vehiculos/conductor/:conductorId", async (req, res) => {
    try {
        const { conductorId } = req.params;
        const CId = await pool.query(`SELECT CId FROM conductor WHERE id = $1`, [conductorId]);

        const result = await pool.query(
            `SELECT 
                v.id,
                v.categoria,
                v.color,
                v.placa,
                v.marca,
                v.modelo,
                v.estadoVerificacion,
                v.vencimientoSoat,
                v.vencimientoTecnomecanica,
                v.cantidadPasajeros
             FROM vehiculo v
             WHERE v.conductorId = $1
             ORDER BY v.id`,
            [CId.rows[0].cid]
        );

        res.status(200).json({ vehiculos: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los vehículos del conductor" });
    }
});

router.put("/vehiculos/:id/verificacion", async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (typeof estado !== "boolean") {
            return res.status(400).json({ error: "El estado debe ser un valor booleano" });
        }

        const result = await pool.query(
            `UPDATE vehiculo 
             SET estadoVerificacion = $1
             WHERE id = $2
             RETURNING *`,
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Vehículo no encontrado" });
        }

        res.status(200).json({ 
            message: "Estado de verificación actualizado correctamente",
            vehiculo: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el estado de verificación" });
    }
});

export default router;

