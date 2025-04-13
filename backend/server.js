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