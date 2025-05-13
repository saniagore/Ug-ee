import pg from "pg";
import bcrypt from "bcryptjs";
import { DB_CONFIG, SALT_ROUNDS } from "../config.js";
import { obtenerInstitucion } from "./institucion.controller.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const obtenerDatosUsuario = async (celular) => {
  try {
    const result = await pool.query(
      "SELECT * FROM usuario WHERE celular = $1",
      [celular]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error en obtener_datos:", err);
    throw err;
  }
};

export const existeUsuario = async (celular) => {
  try {
    const usuario = await obtenerDatosUsuario(celular);
    return usuario !== null;
  } catch (err) {
    console.error("Error en existeUsuario:", err);
    throw err;
  }
};

export const verificarContraseña = async (celular, contraseñaIngresada) => {
  try {
    const usuario = await obtenerDatosUsuario(celular);
    if (!usuario) {
      return false;
    }
    const coincide = await bcrypt.compare(contraseñaIngresada, usuario.contraseña);
    return coincide;
    
  } catch (err) {
    console.error("Error en verificarContraseña:", err);
    throw err;
  }
};

export const existenDatos = async (telefono, nid, correo) => {
  try {
    const validationResult = await pool.query(
      `SELECT 
        (SELECT 1 FROM usuario WHERE celular = $1 LIMIT 1) AS telefono_exists,
        (SELECT 1 FROM usuario WHERE numero_identificacion = $2 LIMIT 1) AS nid_exists,
        (SELECT 1 FROM usuario WHERE correo = $3 LIMIT 1) AS correo_exists`,
      [telefono, nid, correo]
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
    console.error("Error en existenDatos:", err);
    throw err;
  }
};

export const obtenerEstadoUsuario = async (celular) => {
  try {
    const usuario = await obtenerDatosUsuario(celular);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return {
      estado_verificacion: usuario.estado_verificacion,
    };
  } catch (err) {
    console.error("Error en obtenerEstadoUsuario:", err);
    throw err;
  }
};

export const crearUsuario = async (formData) => {
  try {
    const validation = await existenDatos(
      formData.celular,
      formData.numeroIdentificacion,
      formData.correo
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

    const result = await pool.query(
      `INSERT INTO usuario 
      (nombre, correo, contraseña, celular, numero_identificacion, tipo_identificacion, institucion_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        formData.nombre,
        formData.correo,
        contraseñaHasheada,
        formData.celular,
        formData.numeroIdentificacion,
        formData.tipoIdentificacion,
        datosInstitucion.id,
      ]
    );

    return { success: true, usuario: result.rows[0] };
  } catch (err) {
    console.error("Error al crear el usuario", err);
    return {
      error: true,
      message: "Error al crear usuario",
      details: err.detail || err.message,
    };
  }
};

export const obtenerUsuarios = async(institucionId) => {
    try {
        const result = await pool.query(
            `SELECT nombre, correo, tipo, celular, 
             estado_verificacion, codigo_estudiante,
             numero_identificacion, tipo_identificacion 
             FROM usuario WHERE institucion_id = $1`, 
            [institucionId]
        );
        return result.rows || [];
    } catch(error) {
        console.error("Error en obtenerUsuarios:", error);
        throw error;
    }
}