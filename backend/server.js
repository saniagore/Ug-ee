const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const config = {
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'uguee_db',
  port: parseInt(process.env.DB_PORT) || 5432
};

const pool = new Pool(config);
app.use(cors());
app.use(express.json());


app.get('/api/usuario/:telefono', async (req, res) => {
  try {
    const { telefono } = req.params;
    if (!/^\d+$/.test(telefono)) {
      return res.status(400).json({ 
        error: 'El teléfono solo debe contener números' 
      });
    }
    const result = await pool.query(
      'SELECT * FROM usuario WHERE celular = $1', 
      [telefono]
    );
    res.json({ 
      exists: result.rows.length > 0,
      user: result.rows[0] || null
    });
    
  } catch (err) {
    console.error('Error detallado:', err);
    res.status(500).json({ 
      error: 'Error en el servidor',
      details: err.message  
    });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});


app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});


pool.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión a PostgreSQL:', err));



app.get('/api/institucion', async (req,res) => {
  try{
    const result = await pool.query('SELECT nombre FROM institucion');
    res.json({ 
      instituciones: result.rows
    });
  
  }catch(err){
    console.error('Error detallado: ', err);
    res.status(500).json({
      error: 'Error en el servidor',
      details: err.message
    });
  }
});

app.post('/api/usuario', async (req, res) => {
  try {
    const { nombre,telefono,nid,correo,tid,institucion,contraseña } = req.body; 

    const validationResult = await pool.query(
      `SELECT 
        (SELECT 1 FROM usuario WHERE celular = $1 LIMIT 1) AS telefono_exists,
        (SELECT 1 FROM usuario WHERE numero_identificacion = $2 LIMIT 1) AS nid_exists,
        (SELECT 1 FROM usuario WHERE correo = $3 LIMIT 1) AS correo_exists`,
      [telefono, nid, correo]
    );

    const { telefono_exists, nid_exists, correo_exists } = validationResult.rows[0];
    const errors = {};
    
    if (telefono_exists) errors.telefono = 'Este número de teléfono ya está registrado';
    if (nid_exists) errors.nid = 'Este número de identificación ya está registrado';
    if (correo_exists) errors.correo = 'Este correo electrónico ya está registrado';
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const institucionResult = await pool.query(
      'SELECT id FROM institucion WHERE nombre = $1', 
      [institucion]
    );

    if (institucionResult.rows.length === 0) {
      return res.status(400).json({ 
        error: 'La institución especificada no existe' 
      });
    }

    const institucion_id = institucionResult.rows[0].id;

    if (!nombre || !telefono || !contraseña|| !tid || !nid|| !institucion|| !correo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (!/^\d+$/.test(telefono)) {
      return res.status(400).json({ 
        error: 'El teléfono solo debe contener números' 
      });
    }
    const result = await pool.query(
      `INSERT INTO usuario 
       (nombre, correo, contraseña, celular, numero_identificacion, tipo_identificacion, institucion_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [nombre, correo, contraseña, telefono, nid, tid, institucion_id]
    );

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    if (err.code === '23505') {
      return res.status(400).json({ 
        error: 'El número de teléfono ya está registrado' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error en el servidor al registrar usuario',
      details: err.message  
    });
  }
});

app.get('/api/usuario/:telefono/estado', async (req, res) => {
  try {
    const { telefono } = req.params;
    
    if (!/^\d+$/.test(telefono)) {
      return res.status(400).json({ 
        error: 'El teléfono solo debe contener números' 
      });
    }
    
    const result = await pool.query(
      'SELECT estado_verificacion FROM usuario WHERE celular = $1', 
      [telefono]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    

    res.json({ 
      estado: result.rows[0].estado_verificacion
    });
    
  } catch (err) {
    console.error('Error al consultar estado del usuario:', err);
    res.status(500).json({ 
      error: 'Error en el servidor',
      details: err.message  
    });
  }
})




