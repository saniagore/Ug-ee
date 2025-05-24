import pg from "pg";
import bcrypt from "bcryptjs";
import { DB_CONFIG, SALT_ROUNDS } from "../config.js";
import { obtenerInstitucion } from "./institucion.controller.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const obtenerDatosConductor = async (celular) => {
  try {
    const result = await pool.query(
      "SELECT * FROM conductor WHERE celular = $1",
      [celular]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error en obtenerDatosConductor:", err);
    throw err;
  }
};

export const existeConductor = async (celular) => {
  try {
    const conductor = await obtenerDatosConductor(celular);
    return conductor !== null;
  } catch (err) {
    console.error("Error en existeConductor:", err);
    throw err;
  }
};

export const verificarContraseñaConductor = async (celular, contraseñaIngresada) => {
  try {
    const conductor = await obtenerDatosConductor(celular);
    if (!conductor) {
      return false;
    }
    const coincide = await bcrypt.compare(contraseñaIngresada, conductor.contraseña);
    return coincide;
  } catch (err) {
    console.error("Error en verificarContraseñaConductor:", err);
    throw err;
  }
};

export const existenDatosConductor = async (telefono, nid, correo, placa = null) => {
  try {
    const validationResult = await pool.query(
      `SELECT 
        (SELECT 1 FROM conductor WHERE celular = $1 LIMIT 1) AS telefono_exists,
        (SELECT 1 FROM conductor WHERE numeroIdentificacion = $2 LIMIT 1) AS nid_exists,
        (SELECT 1 FROM conductor WHERE correo = $3 LIMIT 1) AS correo_exists`, [telefono, nid, correo]
    );

    const { telefono_exists, nid_exists, correo_exists } =
      validationResult.rows[0];
    const errors = {};

    if (telefono_exists)
      errors.telefono = "Este número de teléfono ya está registrado";
    if (nid_exists)
      errors.nid = "Este número de identificación ya está registrado";
    if (correo_exists)
      errors.correo = "Este correo electrónico ya está registrado";

    return Object.keys(errors).length === 0
      ? true
      : { error: true, details: errors };
  } catch (err) {
    console.error("Error en existenDatosConductor:", err);
    throw err;
  }
};

export const obtenerEstadoConductor = async (celular) => {
  try {
    const conductor = await obtenerDatosConductor(celular);
    if (!conductor) {
      throw new Error('Conductor no encontrado');
    }
    
    // Verificar estado de verificación del conductor y su vehículo
    const vehiculoResult = await pool.query(
      "SELECT estadoVerificacion FROM vehiculo WHERE conductorId = $1 LIMIT 1",
      [conductor.id]
    );
    
    const vehiculoVerificado = vehiculoResult.rows.length > 0 ? vehiculoResult.rows[0].estadoVerificacion : false;

    return {
      conductorVerificado: conductor.estadoVerificacion,
      vehiculoVerificado: vehiculoVerificado,
      completo: conductor.estadoVerificacion && vehiculoVerificado
    };
  } catch (err) {
    console.error("Error en obtenerEstadoConductor:", err);
    throw err;
  }
};

export const crearConductor = async (formData) => {
  try {
    const validation = await existenDatosConductor(
      formData.celular,
      formData.numeroIdentificacion,
      formData.correo,
    );

    if (validation.error) {
      return validation;
    }

    let datosInstitucion;
    try {
      datosInstitucion = await obtenerInstitucion(formData.institucion);
    } catch (err) {
      return {
        error: true,
        details: {
          institucion: "Institución no encontrada en el sistema",
        },
      };
    }

    const contraseñaHasheada = bcrypt.hashSync(formData.contraseña, SALT_ROUNDS);

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insertar conductor
      const conductorResult = await client.query(
        `INSERT INTO conductor 
        (nombre, correo, contraseña, celular, numeroIdentificacion, 
         tipoIdentificacion, institucionId, direccion, categoriaViajes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING cid`,  // Cambiado para retornar específicamente el CId
        [
          formData.nombre,
          formData.correo,
          contraseñaHasheada,
          formData.celular,
          formData.numeroIdentificacion,
          formData.tipoIdentificacion,
          datosInstitucion.id,
          formData.direccion,
          formData.tipo
        ]
      );

      const conductorId = conductorResult.rows[0].cid;

      if (formData.documentoIdentificacion) {
        await client.query(
          `INSERT INTO fotoDocumento 
          (conductorId, documento) 
          VALUES ($1, $2)`,
          [conductorId, formData.documentoIdentificacion.buffer]
        );
      }

      await client.query('COMMIT');
      return { 
        success: true, 
        conductor: conductorResult.rows[0]
      };
    } catch (err) {
      await client.query('ROLLBACK');
      console.error("Error en transacción:", err);
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error al crear el conductor", err);
    return {
      error: true,
      message: "Error al crear conductor",
      details: err.detail || err.message,
    };
  }
};

export const actualizarDocumentosConductor = async (conductorId, documentos) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Actualizar licencia si existe
      if (documentos.licencia) {
        await client.query(
          `INSERT INTO fotoDocumento 
          (conductorId, documento, tipoDocumento) 
          VALUES ($1, $2, 'licencia'::tipo_de_documento)
          ON CONFLICT (conductorId, tipoDocumento) 
          DO UPDATE SET documento = EXCLUDED.documento`,
          [conductorId, documentos.licencia]
        );
      }

      // Actualizar identificación si existe
      if (documentos.identificacion) {
        await client.query(
          `INSERT INTO fotoDocumento 
          (conductorId, documento, tipoDocumento) 
          VALUES ($1, $2, 'identificacion'::tipo_de_documento)
          ON CONFLICT (conductorId, tipoDocumento) 
          DO UPDATE SET documento = EXCLUDED.documento`,
          [conductorId, documentos.identificacion]
        );
      }

      await client.query('COMMIT');
      return { success: true };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error en actualizarDocumentosConductor:", err);
    throw err;
  }
};

export const obtenerVehiculosConductor = async (conductorId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vehiculo WHERE conductorId = $1",
      [conductorId]
    );
    return result.rows;
  } catch (err) {
    console.error("Error en obtenerVehiculosConductor:", err);
    throw err;
  }
};

export const obtenerConductoresInstitucion = async (institucionId) => {
  try {
    // Primero obtenemos los conductores básicos
    const conductoresResult = await pool.query(
      `SELECT id,cid, nombre, correo, celular, estadoVerificacion, 
       codigoEstudiante, tipoIdentificacion, direccion 
       FROM conductor WHERE institucionId = $1`,
      [institucionId]
    );

    // Luego obtenemos los documentos para cada conductor
    const conductoresConDocumentos = await Promise.all(
      conductoresResult.rows.map(async (conductor) => {
        const documentosResult = await pool.query(
          `SELECT documento, tipoDocumento 
           FROM fotoDocumento 
           WHERE conductorId = $1`,
          [conductor.cid]
        );
        return {
          ...conductor,
          documentos: documentosResult.rows
        };
      })
    );

    return conductoresConDocumentos;
  } catch (err) {
    console.error("Error en obtenerConductoresInstitucion:", err);
    throw err;
  }
};

export const actualizarEstadoConductor = async (conductorId, estado) => {
  try {
    await pool.query(
      "UPDATE conductor SET estadoVerificacion = $1 WHERE id = $2",
      [estado, conductorId]
    );
    
    return { success: true };
  } catch (err) {
    console.error("Error en actualizarEstadoConductor:", err);
    throw err;
  }
};

export const actualizarEstadoVehiculo = async (vehiculoId, estado) => {
  try {
    await pool.query(
      "UPDATE vehiculo SET estadoVerificacion = $1 WHERE id = $2",
      [estado, vehiculoId]
    );
    
    return { success: true };
  } catch (err) {
    console.error("Error en actualizarEstadoVehiculo:", err);
    throw err;
  }
};