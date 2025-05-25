import pg from "pg";
import { DB_CONFIG } from "../config.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

export const viajesDisponibles = async (conductorId, categoria) => {
  try {
    const query = `
      SELECT 
        v.id AS viajeId,
        v.puntoPartida,
        v.puntoDestino,
        v.tipoViaje,
        u.nombre AS nombreUsuario,
        u.celular AS contactoUsuario
      FROM 
        viaje v
      JOIN 
        usuario u ON v.usuarioId = u.UsId
      JOIN 
        conductor c ON c.institucionId = u.institucionId
      WHERE 
        c.CId = $1
        AND v.tipoViaje = $2
        AND v.estado = 'pendiente'
        AND v.vehiculoId IS NULL
    `;

    const values = [conductorId, categoria];

    const result = await pool.query(query, values);
    return result.rows;
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
      `SELECT v.id  AS viajeId, v.puntoPartida, v.puntoDestino, v.usuarioId, v.tipoViaje, v.estado, u.nombre, u.celular
        FROM viaje v
        JOIN usuario u ON v.usuarioId = u.UsId
        JOIN vehiculo b ON v.vehiculoId = b.id
        JOIN conductor c ON b.conductorId = c.CId
        WHERE c.id = $1  
        AND v.estado = 'en curso'
        OR v.estado = 'finalizado'`,
      [conductorId]
    );

    return viajesEnCurso.rows;
  } catch (error) {
    throw error;
  }
};

export const terminarViaje = async(viajeId) =>{
  try{
    const result = await pool.query(`
      UPDATE viaje
      SET estado = 'finalizado'
      WHERE id = $1`,
    [viajeId])

    return result.rows;
  }catch(error){
    throw error;
  }
};


export const cancelarViaje = async(viajeId) => {
  try{
    const result = await pool.query(`
      UPDATE viaje
      SET vehiculoId = NULL, estado = 'pendiente'
      WHERE id = $1`,
    [viajeId]);

    return result;
  }catch(error){
    throw error;
  }
};

async function obtenerDireccion(latitud, longitud) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.address) return "Dirección no encontrada";
        
        // Construye la dirección con los campos disponibles
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.house_number) parts.push(data.address.house_number);
        if (parts.length === 0 && data.address.neighbourhood) parts.push(data.address.neighbourhood);
        if (data.address.city || data.address.town || data.address.village) {
            parts.push(data.address.city || data.address.town || data.address.village);
        }
        
        return parts.length > 0 ? parts.join(', ') : "Dirección no disponible";
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Error al obtener la dirección";
    }
}

export const crearRutaViaje = async(viajeData) => {
  try {
    
    const Origenlatitud = viajeData.rutaPlanificada[0].latitud;
    const Origenlongitud = viajeData.rutaPlanificada[0].longitud;
    const destinoLatitud = viajeData.rutaPlanificada[1].latitud;
    const destinoLongitud = viajeData.rutaPlanificada[1].longitud;

    const direccionOrigen = await obtenerDireccion(Origenlatitud, Origenlongitud);
    const direccionDestino = await obtenerDireccion(destinoLatitud, destinoLongitud);

    const coordenadasWKT = viajeData.rutaPlanificada
      .map(punto => `${punto.longitud} ${punto.latitud}`)
      .join(', ');
    const rutaPlanificadaWKT = `LINESTRING(${coordenadasWKT})`;

    const result = await pool.query(`
      INSERT INTO viaje (
        puntoPartida, 
        puntoDestino, 
        fechaSalida,
        tipoViaje,
        cantidadPasajeros,
        rutaPlanificada,
        vehiculoId
      )
      VALUES ($1, $2, $3, $4, $5, ST_GeomFromText($6, 4326), $7)
      RETURNING *`, 
      [
        direccionOrigen, 
        direccionDestino, 
        viajeData.fechaSalida, 
        viajeData.tipoViaje, 
        viajeData.cantidadPasajeros, 
        rutaPlanificadaWKT, 
        viajeData.vehiculoId
      ]);

    return result.rows[0];
  } catch(error) {
    console.error(error);
    throw error;
  }
};