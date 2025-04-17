import { PORT, DB_CONFIG, SALT_ROUNDS } from "./config.js";

import express from "express";
import pg from "pg";
const { Pool } = pg;
import cors from "cors";
import bcrypt, { compareSync, hashSync } from "bcrypt";

const app = express();
const pool = new Pool(DB_CONFIG);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

pool
  .connect()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error de conexión a PostgreSQL:", err));

//------------------------ INSTITUCION FUNCTIONS -------------------------------------------

const institucionFunctions = {
  async obtenerInstitucion(nombre) {
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
  },

  async obtenerTodasInstituciones() {
    try {
      const result = await pool.query("SELECT * FROM institucion");
      return result.rows;
    } catch (err) {
      console.error("Error en obtenerTodasInstituciones", err);
      throw err;
    }
  },
};

//------------------------ USER FUNCTIONS -------------------------------------------

const userFunctions = {
  async obtener_datos(celular) {
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
  },

  async existeUsuario(celular) {
    try {
      const usuario = await this.obtener_datos(celular);
      return usuario !== null;
    } catch (err) {
      console.error("Error en existeUsuario:", err);
      throw err;
    }
  },

  async verificarContraseña(celular, contraseñaIngresada) {
    const usuario = await this.obtener_datos(celular);
    const isValid = bcrypt.compareSync(contraseñaIngresada, usuario.contraseña);
    return isValid;
  },

  async existenDatos(telefono, nid, correo) {
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
  },

  async obtenerEstado(celular) {
    const usuario = await this.obtener_datos(celular);
    return usuario.estado_verificacion;
  },

  async verificarContraseña(celular, contraseñaIngresada) {
    const usuario = await this.obtener_datos(celular);
    if (!usuario) return false;
    return bcrypt.compareSync(contraseñaIngresada, usuario.contraseña);
  },

  async crearUsuario(formData) {
    try {
      const validation = await this.existenDatos(
        formData.celular,
        formData.numeroIdentificacion,
        formData.correo
      );

      if (validation.error) {
        return validation;
      }

      let datosInstitucion;
      try {
        datosInstitucion = await institucionFunctions.obtenerInstitucion(
          formData.institucion
        );
      } catch (err) {
        return {
          error: true,
          details: {
            institucion: "Institución no encontrada en el sistema",
          },
        };
      }

      const contraseñaHasheada = bcrypt.hashSync(
        formData.contraseña,
        SALT_ROUNDS
      );

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
  },
};

// -----------------------------------APP.GET----------------------------------------

app.get("/api/usuario/existe/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const existe = await userFunctions.existeUsuario(celular);
    res.json({ existe });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/api/usuario/verificar-contraseña", async (req, res) => {
  try {
    const { celular, contraseña } = req.body;
    const coincide = await userFunctions.verificarContraseña(
      celular,
      contraseña
    );
    res.json({ coincide });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/api/usuario/estado/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const estado = await userFunctions.obtenerEstado(celular);
    res.json({ estado });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.post("/api/usuario/crearusuario", async (req, res) => {
  try {
    const formData = req.body;
    const result = await userFunctions.crearUsuario(formData);
    res.json(result);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      error: "Error al crear usuario",
      details: err.message,
    });
  }
});

app.get("/api/institucion/nombres", async (req, res) => {
  try {
    const instituciones = await institucionFunctions.obtenerTodasInstituciones();
    const nombres = instituciones.map(inst => inst.nombre);
    res.json({ instituciones: nombres });
  } catch (err) {
    console.error("Error obteniendo instituciones:", err);
    res.status(500).json({ error: "Error al obtener instituciones" });
  }
});

app.post("/api/usuario/login", async (req, res) => {
  try {
    const {celular, contraseña} = req.body;
    const result = await userFunctions.verificarContraseña(celular,contraseña);
    res.json(result);
  } catch (err) {
    console.error("Error login user:", err);
    res.status(500).json({
      error: "Error al crear usuario",
      details: err.message,
    });
  }
});
