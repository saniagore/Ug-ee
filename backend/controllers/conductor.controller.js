import pg from "pg";
import bcrypt from "bcrypt";
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
        (SELECT 1 FROM conductor WHERE numero_identificacion = $2 LIMIT 1) AS nid_exists,
        (SELECT 1 FROM conductor WHERE correo = $3 LIMIT 1) AS correo_exists,
        ${placa ? `(SELECT 1 FROM vehiculo WHERE placa = $4 LIMIT 1) AS placa_exists` : 'NULL AS placa_exists'}`,
      placa ? [telefono, nid, correo, placa] : [telefono, nid, correo]
    );

    const { telefono_exists, nid_exists, correo_exists, placa_exists } =
      validationResult.rows[0];
    const errors = {};

    if (telefono_exists)
      errors.telefono = "Este número de teléfono ya está registrado";
    if (nid_exists)
      errors.nid = "Este número de identificación ya está registrado";
    if (correo_exists)
      errors.correo = "Este correo electrónico ya está registrado";
    if (placa_exists)
      errors.placa = "Esta placa ya está registrada";

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
      "SELECT estado_verificacion FROM vehiculo WHERE conductor_id = $1 LIMIT 1",
      [conductor.id]
    );
    
    const vehiculoVerificado = vehiculoResult.rows.length > 0 ? vehiculoResult.rows[0].estado_verificacion : false;

    return {
      conductor_verificado: conductor.estado_verificacion,
      vehiculo_verificado: vehiculoVerificado,
      completo: conductor.estado_verificacion && vehiculoVerificado
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
      formData.placa
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
        (nombre, correo, contraseña, celular, numero_identificacion, 
         tipo_identificacion, institucion_id, direccion, tipo) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'profesor'::tipo_cargo) 
        RETURNING *`,
        [
          formData.nombre,
          formData.correo,
          contraseñaHasheada,
          formData.celular,
          formData.numeroIdentificacion,
          formData.tipoIdentificacion,
          datosInstitucion.id,
          formData.direccion
        ]
      );

      const conductor = conductorResult.rows[0];

      // Insertar vehículo
      const vehiculoResult = await client.query(
        `INSERT INTO vehiculo 
        (categoria, vencimiento_soat, vencimiento_tecnomecanica, color, 
         placa, marca, modelo, codigo_qr, conductor_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          formData.categoriaVehiculo,
          formData.vencimientoSoat,
          formData.vencimientoTecnomecanica,
          formData.colorVehiculo,
          formData.placa,
          formData.marcaVehiculo,
          formData.modeloVehiculo,
          formData.codigoQR || '', // Asumiendo que el QR viene en los datos
          conductor.id
        ]
      );

      const vehiculo = vehiculoResult.rows[0];

      // Insertar documentos del conductor (licencia)
      if (formData.licencia) {
        await client.query(
          `INSERT INTO foto_documento 
          (conductor_id, documento, tipo_documento) 
          VALUES ($1, $2, 'licencia'::tipo_de_documento)`,
          [conductor.id, formData.licencia]
        );
      }

      // Insertar documentos del vehículo (soat y tecnomecanica)
      if (formData.soat) {
        await client.query(
          `INSERT INTO foto_documento_vehiculo 
          (vehiculo_id, documento, tipo_documento) 
          VALUES ($1, $2, 'soat'::categoria_de_documento)`,
          [vehiculo.id, formData.soat]
        );
      }

      if (formData.tecnomecanica) {
        await client.query(
          `INSERT INTO foto_documento_vehiculo 
          (vehiculo_id, documento, tipo_documento) 
          VALUES ($1, $2, 'tecnomecanica'::categoria_de_documento)`,
          [vehiculo.id, formData.tecnomecanica]
        );
      }

      await client.query('COMMIT');

      return { 
        success: true, 
        conductor: conductor,
        vehiculo: vehiculo
      };
    } catch (err) {
      await client.query('ROLLBACK');
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
          `INSERT INTO foto_documento 
          (conductor_id, documento, tipo_documento) 
          VALUES ($1, $2, 'licencia'::tipo_de_documento)
          ON CONFLICT (conductor_id, tipo_documento) 
          DO UPDATE SET documento = EXCLUDED.documento`,
          [conductorId, documentos.licencia]
        );
      }

      // Actualizar identificación si existe
      if (documentos.identificacion) {
        await client.query(
          `INSERT INTO foto_documento 
          (conductor_id, documento, tipo_documento) 
          VALUES ($1, $2, 'identificacion'::tipo_de_documento)
          ON CONFLICT (conductor_id, tipo_documento) 
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
      "SELECT * FROM vehiculo WHERE conductor_id = $1",
      [conductorId]
    );
    return result.rows;
  } catch (err) {
    console.error("Error en obtenerVehiculosConductor:", err);
    throw err;
  }
};

export const actualizarUbicacionConductor = async (conductorId, ubicacion) => {
  try {
    // Primero obtenemos el vehículo del conductor
    const vehiculoResult = await pool.query(
      "SELECT id FROM vehiculo WHERE conductor_id = $1 LIMIT 1",
      [conductorId]
    );

    if (vehiculoResult.rows.length === 0) {
      throw new Error('Conductor no tiene vehículo registrado');
    }

    const vehiculoId = vehiculoResult.rows[0].id;

    // Actualizamos la ubicación en los viajes activos
    await pool.query(
      `UPDATE viaje 
       SET ubicacion_actual = ST_SetSRID(ST_MakePoint($1, $2), 4326)
       WHERE vehiculo_id = $3 AND estado = 'en curso'::categorias_estado_viaje`,
      [ubicacion.longitud, ubicacion.latitud, vehiculoId]
    );

    return { success: true };
  } catch (err) {
    console.error("Error en actualizarUbicacionConductor:", err);
    throw err;
  }
};