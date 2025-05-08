import pg from "pg";
const { Pool } = pg;
import { DB_CONFIG, SALT_ROUNDS } from "../config.js";
import bcrypt from "bcrypt";
const pool = new Pool(DB_CONFIG);

export const obtenerInstitucion = async (nombre) => {
  try {
    const result = await pool.query(
      "SELECT * FROM institucion WHERE nombre = $1",
      [nombre]
    );

    if (result.rows.length === 0) {
      throw new Error("Institución no encontrada");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error en obtenerInstitucion", err);
    throw err;
  }
};

export const obtenerTodasInstituciones = async () => {
  try {
    const result = await pool.query("SELECT * FROM institucion");
    return result.rows;
  } catch (err) {
    console.error("Error en obtenerTodasInstituciones", err);
    throw err;
  }
};


export const existeInstitucion = async(nombre) =>{
  try{
    const validationResult = await pool.query(
      `SELECT 
        (SELECT 1 FROM institucion WHERE nombre = $1 LIMIT 1) AS nombre_exists`,
      [nombre]
    );

    const {nombre_exists} = validationResult.rows[0];
    const errors = {};

    if(nombre_exists)
      errors.nombre = "Este nombre de institucion ya existe";

    return Object.keys(errors).length === 0
      ? true
      : { error: true, details: errors };
  }catch(err){
    console.error("Error en existenDatos:", err);
    throw err;
  }
}
export const crearInstitucion = async (formData) => {
  try{
    const validation = await existeInstitucion(formData.nombre);
    if(validation.error){
      return validation;
    }

    const contraseñaHasheada = bcrypt.hashSync(formData.contraseña,SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO institucion
      (nombre,contraseña,color_primario,color_secundario,direccion)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        formData.nombre,
        contraseñaHasheada,
        formData.colorPrimario,
        formData.colorSecundario,
        formData.direccion,
      ]
    );

    return {succes: true, institucion: result.rows[0]};

  }catch(err){
    console.error("Error al crear el usuario", err);
    return {
      error: true,
      message: "Error al crear usuario",
      details: err.detail || err.message,
    };
  }
}