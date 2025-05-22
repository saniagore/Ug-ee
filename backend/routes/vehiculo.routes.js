import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
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
    { name: "soat_file", maxCount: 1 },
    { name: "tecnomecanica_file", maxCount: 1 },
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
        vencimiento_soat,
        vencimiento_tecnomecanica,
      } = req.body;

      const soatFile = req.files?.soat_file?.[0]; 
      const tecnomecanicaFile = req.files?.tecnomecanica_file?.[0];

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
         vencimiento_soat, vencimiento_tecnomecanica, 
         codigo_qr, conductor_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          categoria,
          color,
          placa,
          marca,
          modelo,
          new Date(vencimiento_soat),
          new Date(vencimiento_tecnomecanica),
          qrCodeBuffer,
          conductorIdFk,
        ]
      );

      const vehiculoId = result.rows[0].id;


      await pool.query(
        `INSERT INTO foto_documento_vehiculo 
        (vehiculo_id, documento, tipo_documento)
        VALUES ($1, $2, 'soat')`,
        [vehiculoId, soatFile.buffer] 
      );

      await pool.query(
        `INSERT INTO foto_documento_vehiculo 
        (vehiculo_id, documento, tipo_documento)
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

router.get("/vehiculos", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT ON (v.id)
                v.id,
                v.color,
                v.marca,
                v.placa,
                v.estado_verificacion,
                v.categoria,
                v.modelo,
                v.vencimiento_soat,
                v.vencimiento_tecnomecanica,
                c.CId AS conductor_id,
                c.nombre AS conductor_nombre,
                c.correo AS conductor_correo,
                c.celular AS conductor_celular
            FROM Vehiculo v
            JOIN conductor c ON v.conductor_id = c.CId
            ORDER BY v.id`
        );
        
        // Ahora obtenemos los documentos por separado
        const vehiculos = result.rows;
        
        // Para cada vehículo, obtenemos sus documentos
        for (const vehiculo of vehiculos) {
            // Documentos del conductor
            const docsConductor = await pool.query(
                `SELECT documento, tipo_documento 
                 FROM foto_documento 
                 WHERE conductor_id = $1`, 
                [vehiculo.conductor_id]
            );
            
            // Documentos del vehículo
            const docsVehiculo = await pool.query(
                `SELECT documento, tipo_documento 
                 FROM foto_documento_vehiculo 
                 WHERE vehiculo_id = $1`, 
                [vehiculo.id]
            );
            
            vehiculo.documentos_conductor = docsConductor.rows;
            vehiculo.documentos_vehiculo = docsVehiculo.rows;
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
                v.estado_verificacion,
                v.vencimiento_soat,
                v.vencimiento_tecnomecanica
             FROM vehiculo v
             WHERE v.conductor_id = $1
             ORDER BY v.id`,
            [CId.rows[0].cid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron vehículos para este conductor" });
        }
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
             SET estado_verificacion = $1
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

