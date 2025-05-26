import pg from "pg";
import { DB_CONFIG } from "../config.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);
import QRCode from "qrcode";

export const viajesDisponibles = async (usuarioId) => {
  try {
    const viajes = await pool.query(
      `
      SELECT 
    v.id, 
    v.estado, 
    v.fechaSalida, 
    v.puntoPartida, 
    v.puntoDestino, 
    v.tipoViaje, 
    v.cantidadPasajeros, 
    v.rutaPlanificada, 
    v.codigoQr,
    ve.id AS vehiculoId, 
    ve.categoria, 
    ve.color, 
    ve.placa, 
    ve.marca, 
    ve.modelo, 
    ve.conductorId,
    c.nombre AS conductorNombre,
    c.celular AS conductorCelular,
    c.correo AS conductorCorreo,
    c.puntuacionPromedio AS conductorPuntuacion
FROM viaje v
JOIN vehiculo ve ON v.vehiculoId = ve.id
JOIN conductor c ON ve.conductorId = c.cId
WHERE v.estado = 'pendiente' 
AND c.institucionId = (SELECT institucionId FROM usuario WHERE usId = $1)
    `,
      [usuarioId]
    );

    return viajes.rows;
  } catch (error) {
    console.error("Error en viajesDisponibles:", error);
    throw error;
  }
};

export const aceptarViaje = async (vehiculoId, viajeId) => {
  try {
    const result = await pool.query(
      `UPDATE viaje SET vehiculoId = $1, estado = 'en curso' WHERE id = $2`,
      [vehiculoId, viajeId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const viajesActivos = async (conductorId) => {
  try {
    const viajesEnCurso = await pool.query(
      `
      SELECT v.id, v.estado, v.fechaSalida, v.puntoPartida, v.puntoDestino, v.tipoViaje, v.cantidadPasajeros, v.rutaPlanificada
      FROM viaje v
      JOIN vehiculo ve ON v.vehiculoId = ve.id
      JOIN conductor c ON ve.conductorId = c.cId
      WHERE c.id = $1
    `,
      [conductorId]
    );

    return viajesEnCurso.rows;
  } catch (error) {
    throw error;
  }
};

export const terminarViaje = async (viajeId) => {
  try {
    const result = await pool.query(
      `
      UPDATE viaje
      SET estado = 'finalizado'
      WHERE id = $1`,
      [viajeId]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const cancelarViaje = async (viajeId) => {
  try {
    await pool.query(`DELETE FROM viaje WHERE id = $1`, [viajeId]);
  } catch (error) {
    throw error;
  }
};

async function obtenerDireccion(latitud, longitud) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.address) return "Dirección no encontrada";

    const parts = [];
    if (data.address.road) parts.push(data.address.road);
    if (data.address.house_number) parts.push(data.address.house_number);
    if (parts.length === 0 && data.address.neighbourhood)
      parts.push(data.address.neighbourhood);
    if (data.address.city || data.address.town || data.address.village) {
      parts.push(
        data.address.city || data.address.town || data.address.village
      );
    }

    return parts.length > 0 ? parts.join(", ") : "Dirección no disponible";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error al obtener la dirección";
  }
}

export const crearRutaViaje = async (viajeData) => {
  try {
    const Origenlatitud = viajeData.rutaPlanificada[0].latitud;
    const Origenlongitud = viajeData.rutaPlanificada[0].longitud;
    const destinoLatitud = viajeData.rutaPlanificada[1].latitud;
    const destinoLongitud = viajeData.rutaPlanificada[1].longitud;

    const [direccionOrigen, direccionDestino] = await Promise.all([
      obtenerDireccion(Origenlatitud, Origenlongitud),
      obtenerDireccion(destinoLatitud, destinoLongitud),
    ]);

    const coordenadasWKT = viajeData.rutaPlanificada
      .map((punto) => `${punto.longitud} ${punto.latitud}`)
      .join(", ");
    const rutaPlanificadaWKT = `LINESTRING(${coordenadasWKT})`;

    const fechaHoraSalida = `${viajeData.fechaSalida} ${viajeData.horaSalida}`;

    const qrData = JSON.stringify({
      tipo: "viaje",
      origen: direccionOrigen,
      destino: direccionDestino,
      fechaSalida: fechaHoraSalida,
      tipoViaje: viajeData.tipoViaje,
      pasajeros: viajeData.cantidadPasajeros,
      vehiculoId: viajeData.vehiculoId,
    });

    const qrBuffer = await new Promise((resolve, reject) => {
      QRCode.toBuffer(
        qrData,
        {
          errorCorrectionLevel: "H",
          type: "png",
          quality: 0.9,
          margin: 1,
          scale: 4,
        },
        (err, buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        }
      );
    });

    const result = await pool.query(
      `
      INSERT INTO viaje (
        puntoPartida, 
        puntoDestino, 
        fechaSalida,
        tipoViaje,
        cantidadPasajeros,
        rutaPlanificada,
        vehiculoId,
        codigoQr,
        estado,
        ubicacionActual
      )
      VALUES (
        $1, $2, $3, $4, $5, 
        ST_GeomFromText($6, 4326), 
        $7, $8, 'pendiente',
        ST_GeomFromText('POINT(${Origenlongitud} ${Origenlatitud})', 4326)
    ) 
      RETURNING *`,
      [
        direccionOrigen,
        direccionDestino,
        fechaHoraSalida,
        viajeData.tipoViaje,
        viajeData.cantidadPasajeros,
        rutaPlanificadaWKT,
        viajeData.vehiculoId,
        qrBuffer,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear ruta de viaje:", error);
    throw error;
  }
};
