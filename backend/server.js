import { PORT, DB_CONFIG, SALT_ROUNDS } from "./config.js";

import express from 'express';
import pg from 'pg';
const { Pool } = pg;
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const pool = new Pool(DB_CONFIG);

app.use(cors(
  {origin: 'http://localhost:3000'}
));
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

//------------------------ USER FUNCTIONS -------------------------------------------

const userFunctions = {
  async obtener_datos(celular) {
    try {
      const result = await pool.query("SELECT * FROM usuario WHERE celular = $1", [celular]);
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
    const usuario = await userFunctions.obtenerUsuarioPorCelular(celular);
    const isValid = bcrypt.compareSync(contraseñaIngresada, usuario.contraseña);
    return isValid;
  },

  async obtenerEstado(celular) {
    const usuario = await userFunctions.obtener_datos(celular);
    return usuario.estado_verificacion;
  },


  async crearUsuario(array) {
    
  }
};


// -----------------------------------APP.GET----------------------------------------

app.get("/api/institucion", async (req, res) => {
  try {
    const result = await pool.query("SELECT nombre FROM institucion");
    res.json({
      instituciones: result.rows,
    });
  } catch (err) {
    console.error("Error detallado: ", err);
    res.status(500).json({
      error: "Error en el servidor",
      details: err.message,
    });
  }
});

//--------------------------------------------------------------------------------------------------

app.get("/api/usuario/existe/:celular", async (req, res) => {
  try {
    const { celular } = req.params;
    const existe = await userFunctions.existeUsuario(celular)
    res.json({ existe });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/api/usuario/verificar-contraseña", async (req, res) => {
  try {
    const { celular, contraseña } = req.body;
    const coincide = await userFunctions.verificarContraseña(celular, contraseña)
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

//---------------------------------REGISTRAR USUARIO-------------------------------------------

app.post("/api/usuario", async (req, res) => {
  try {
    const { nombre, telefono, nid, correo, tid, institucion, contraseña } =
      req.body;

    const validationResult = await pool.query(
      `SELECT 
        (SELECT 1 FROM usuario WHERE celular = $1 LIMIT 1) AS telefono_exists,
        (SELECT 1 FROM usuario WHERE numero_identificacion = $2 LIMIT 1) AS nid_exists,
        (SELECT 1 FROM usuario WHERE correo = $3 LIMIT 1) AS correo_exists`,
      [telefono, nid, correo]
    );

    const contraseñahasheada = bcrypt.hashSync(contraseña, SALT_ROUNDS);
    const { telefono_exists, nid_exists, correo_exists } =
      validationResult.rows[0];
    const errors = {};

    if (telefono_exists)
      errors.telefono = "Este número de teléfono ya está registrado";
    if (nid_exists)
      errors.nid = "Este número de identificación ya está registrado";
    if (correo_exists)
      errors.correo = "Este correo electrónico ya está registrado";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const institucionResult = await pool.query(
      "SELECT id FROM institucion WHERE nombre = $1",
      [institucion]
    );

    if (institucionResult.rows.length === 0) {
      return res.status(400).json({
        error: "La institución especificada no existe",
      });
    }

    const institucion_id = institucionResult.rows[0].id;

    if (
      !nombre ||
      !telefono ||
      !contraseña ||
      !tid ||
      !nid ||
      !institucion ||
      !correo
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const result = await pool.query(
      `INSERT INTO usuario 
       (nombre, correo, contraseña, celular, numero_identificacion, tipo_identificacion, institucion_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [nombre, correo, contraseñahasheada, telefono, nid, tid, institucion_id]
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    if (err.code === "23505") {
      return res.status(400).json({
        error: "El número de teléfono ya está registrado",
      });
    }

    res.status(500).json({
      error: "Error en el servidor al registrar usuario",
      details: err.message,
    });
  }
});
//---------------------------------------REGISTRAR USUARIO----------------------------
