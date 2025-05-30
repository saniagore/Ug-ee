import pg from "pg";
const { Pool } = pg;
import { DB_CONFIG, SALT_ROUNDS } from "../config.js";
import bcrypt from "bcryptjs";
const pool = new Pool(DB_CONFIG);

// Obtener institución por nombre
export const obtenerInstitucion = async (nombre) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, colorPrimario, colorSecundario, logo, fechaRegistro, direccion, estadoVerificacion FROM institucion WHERE nombre = $1",
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

// Obtener institución por ID
export const obtenerInstitucionPorId = async (id) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, colorPrimario, colorSecundario, logo, fechaRegistro, direccion, estadoVerificacion FROM institucion WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Institución no encontrada");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error en obtenerInstitucionPorId", err);
    throw err;
  }
};

// Obtener todas las instituciones (con paginación)
export const obtenerTodasInstituciones = async (
  pagina = 1,
  limite = 10,
  verificadas = null
) => {
  const offset = (pagina - 1) * limite;
  const params = [];
  let query = `
    SELECT id, nombre, colorPrimario, colorSecundario, direccion, estadoVerificacion
    FROM institucion
  `;

  if (verificadas !== null) {
    query += ` WHERE estadoVerificacion = $1`;
    params.push(verificadas);
  }

  query += ` ORDER BY nombre LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`;
  params.push(limite, offset);

  const { rows } = await pool.query(query, params);
  return rows;
};

// Verificar existencia de institución
export const existeInstitucion = async (nombre) => {
  try {
    const validationResult = await pool.query(
      `SELECT (SELECT 1 FROM institucion WHERE nombre = $1 LIMIT 1) AS nombre_exists`,
      [nombre]
    );

    const { nombre_exists } = validationResult.rows[0];
    return nombre_exists
      ? {
          error: true,
          details: { nombre: "Este nombre de institución ya existe" },
        }
      : true;
  } catch (err) {
    console.error("Error en existeInstitucion:", err);
    throw err;
  }
};

// Crear nueva institución
export const crearInstitucion = async (formData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const validation = await existeInstitucion(formData.nombre);
    if (validation.error) {
      return validation;
    }

    const contraseñaHasheada = bcrypt.hashSync(
      formData.contraseña,
      SALT_ROUNDS
    );

    const result = await client.query(
      `INSERT INTO institucion
      (nombre, contraseña, colorPrimario, colorSecundario, direccion, estadoVerificacion, logo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nombre, colorPrimario, colorSecundario, direccion, estadoVerificacion`,
      [
        formData.nombre,
        contraseñaHasheada,
        formData.colorPrimario,
        formData.colorSecundario,
        formData.direccion,
        false,
        formData.logo,
      ]
    );

    await client.query("COMMIT");
    return { success: true, institucion: result.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al crear institución", err);
    return {
      error: true,
      message: "Error al crear institución",
      details: err.detail || err.message,
    };
  } finally {
    client.release();
  }
};

// Actualizar institución
export const actualizarInstitucion = async (id, formData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verificar si el nombre ya existe en otra institución
    if (formData.nombre) {
      const nombreExiste = await client.query(
        "SELECT 1 FROM institucion WHERE nombre = $1 AND id != $2 LIMIT 1",
        [formData.nombre, id]
      );

      if (nombreExiste.rows.length > 0) {
        return {
          error: true,
          details: { nombre: "Este nombre de institución ya está en uso" },
        };
      }
    }

    let contraseñaHasheada = null;
    if (formData.contraseña) {
      contraseñaHasheada = bcrypt.hashSync(formData.contraseña, SALT_ROUNDS);
    }

    const query = `
      UPDATE institucion SET
        nombre = COALESCE($1, nombre),
        contraseña = COALESCE($2, contraseña),
        colorPrimario = COALESCE($3, colorPrimario),
        colorSecundario = COALESCE($4, colorSecundario),
        logo = COALESCE($5, logo),
        direccion = COALESCE($6, direccion),
        estadoVerificacion = COALESCE($7, estadoVerificacion)
      WHERE id = $8
      RETURNING id, nombre, colorPrimario, colorSecundario, direccion, estadoVerificacion
    `;

    const result = await client.query(query, [
      formData.nombre || null,
      contraseñaHasheada || null,
      formData.colorPrimario || null,
      formData.colorSecundario || null,
      formData.logo || null,
      formData.direccion || null,
      formData.estadoVerificacion || null,
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Institución no encontrada");
    }

    await client.query("COMMIT");
    return { success: true, institucion: result.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar institución", err);
    return {
      error: true,
      message: "Error al actualizar institución",
      details: err.detail || err.message,
    };
  } finally {
    client.release();
  }
};

// Eliminar institución (soft delete)
export const eliminarInstitucion = async (id) => {
  try {
    const result = await pool.query(
      "UPDATE institucion SET estadoVerificacion = FALSE WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Institución no encontrada");
    }

    return { success: true, id: result.rows[0].id };
  } catch (err) {
    console.error("Error al eliminar institución", err);
    return {
      error: true,
      message: "Error al eliminar institución",
      details: err.detail || err.message,
    };
  }
};

// Verificar login de institución
export const verificarLoginInstitucion = async (
  nombre,
  contraseñaIngresada
) => {
  try {
    const institucion = await obtenerDatosInstitucionCompletos(nombre);
    if (!institucion) {
      return { error: true, message: "Institución no encontrada" };
    }

    const coincide = await bcrypt.compare(
      contraseñaIngresada,
      institucion.contraseña
    );
    return coincide
      ? { success: true, institucion }
      : { error: true, message: "Contraseña incorrecta" };
  } catch (err) {
    console.error("Error en verificarLoginInstitucion:", err);
    throw err;
  }
};

// Obtener datos completos de institución (incluyendo contraseña para validaciones internas)
export const obtenerDatosInstitucionCompletos = async (nombre) => {
  try {
    const result = await pool.query(
      "SELECT * FROM institucion WHERE nombre = $1",
      [nombre]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error en obtenerDatosInstitucionCompletos:", err);
    throw err;
  }
};

// Actualizar logo de la institución
export const actualizarLogoInstitucion = async (institucionId, logo) => {
  try {
    const result = await pool.query(
      "UPDATE institucion SET logo = $1 WHERE id = $2 RETURNING id",
      [logo, institucionId]
    );

    if (result.rows.length === 0) {
      throw new Error("Institución no encontrada");
    }

    return { success: true, id: result.rows[0].id };
  } catch (err) {
    console.error("Error al actualizar logo de institución", err);
    return {
      error: true,
      message: "Error al actualizar logo",
      details: err.detail || err.message,
    };
  }
};

export const obtenerNombresInstituciones = async () => {
  try {
    const result = await pool.query(
      "SELECT nombre FROM institucion ORDER BY nombre"
    );
    return result.rows.map((row) => row.nombre);
  } catch (err) {
    console.error("Error obteniendo nombres de instituciones:", err);
    throw err;
  }
};

export const obtenerEstadisticasInstitucion = async (institucionId) => {
  try {
    const query = `
      WITH 
stats_basicas AS (
  SELECT 
    (SELECT COUNT(*) FROM usuario WHERE institucionId = $1) AS total_usuarios,
    (SELECT COUNT(*) FROM conductor WHERE institucionId = $1) AS total_conductores,
    (SELECT COUNT(*) FROM vehiculo v 
     JOIN conductor c ON v.conductorId = c.cId 
     WHERE c.institucionId = $1) AS total_vehiculos,
    (SELECT COUNT(*) FROM viaje vi
     LEFT JOIN reserva r ON vi.reservaId = r.id
     LEFT JOIN usuario u ON r.usuarioId = u.usId
     WHERE (r.id IS NULL OR u.institucionId = $1)
     AND (vi.vehiculoId IN (
       SELECT v.id FROM vehiculo v
       JOIN conductor c ON v.conductorId = c.cId
       WHERE c.institucionId = $1
     ))) AS total_viajes
),

viajes_por_estado AS (
  SELECT 
    vi.estado,
    COUNT(*) AS cantidad
  FROM viaje vi
  LEFT JOIN reserva r ON vi.reservaId = r.id
  LEFT JOIN usuario u ON r.usuarioId = u.usId
  WHERE (r.id IS NULL OR u.institucionId = $1)
  AND (vi.vehiculoId IN (
    SELECT v.id FROM vehiculo v
    JOIN conductor c ON v.conductorId = c.cId
    WHERE c.institucionId = $1
  ))
  GROUP BY vi.estado
),

stats_vehiculos AS (
  SELECT 
    v.categoria,
    COUNT(*) AS cantidad,
    AVG(v.cantidadPasajeros) AS promedio_pasajeros
  FROM vehiculo v 
  JOIN conductor c ON v.conductorId = c.cId 
  WHERE c.institucionId = $1
  GROUP BY v.categoria
),

calificaciones AS (
  SELECT 
    AVG(cl.puntuacion) AS promedio_calificaciones,
    COUNT(cl.id) AS total_calificaciones
  FROM calificacion cl
  JOIN viaje vi ON cl.viajeId = vi.id
  LEFT JOIN reserva r ON vi.reservaId = r.id
  LEFT JOIN usuario u ON r.usuarioId = u.usId
  WHERE (r.id IS NULL OR u.institucionId = $1)
  AND (vi.vehiculoId IN (
    SELECT v.id FROM vehiculo v
    JOIN conductor c ON v.conductorId = c.cId
    WHERE c.institucionId = $1
  ))
),

reportes AS (
  SELECT 
    rep.tipo,
    COUNT(*) AS cantidad
  FROM reporte rep
  JOIN viaje vi ON rep.viajeId = vi.id
  LEFT JOIN reserva r ON vi.reservaId = r.id
  LEFT JOIN usuario u ON r.usuarioId = u.usId
  WHERE (r.id IS NULL OR u.institucionId = $1)
  AND (vi.vehiculoId IN (
    SELECT v.id FROM vehiculo v
    JOIN conductor c ON v.conductorId = c.cId
    WHERE c.institucionId = $1
  ))
  GROUP BY rep.tipo
)

SELECT 
  sb.*,
  (SELECT json_agg(row_to_json(vpe)) FROM viajes_por_estado vpe) AS viajes_por_estado,
  (SELECT json_agg(row_to_json(sv)) FROM stats_vehiculos sv) AS vehiculos_por_categoria,
  COALESCE(c.promedio_calificaciones, 0) AS promedio_calificaciones,
  COALESCE(c.total_calificaciones, 0) AS total_calificaciones,
  (SELECT json_agg(row_to_json(r)) FROM reportes r) AS reportes_por_tipo
FROM stats_basicas sb
LEFT JOIN calificaciones c ON true
    `;

    const result = await pool.query(query, [institucionId]);
    const stats = result.rows[0];

    return {
      totalUsuarios: parseInt(stats.total_usuarios),
      totalConductores: parseInt(stats.total_conductores),
      totalVehiculos: parseInt(stats.total_vehiculos),
      totalViajes: parseInt(stats.total_viajes),
      viajesPorEstado: stats.viajes_por_estado || [],
      vehiculosPorCategoria: stats.vehiculos_por_categoria || [],
      promedioCalificaciones: parseFloat(stats.promedio_calificaciones) || 0,
      totalCalificaciones: parseInt(stats.total_calificaciones) || 0,
      reportesPorTipo: stats.reportes_por_tipo || [],
    };
  } catch (err) {
    console.error("Error en obtenerEstadisticasInstitucion:", err);
    throw err;
  }
};
