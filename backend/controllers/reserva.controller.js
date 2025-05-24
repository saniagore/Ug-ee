import pg from "pg";
import QRCode from 'qrcode';
import { DB_CONFIG } from "../config.js";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);


export const crearReserva = async (formData) => {
    try {
        const qrContent = JSON.stringify(formData);
        const qrCode = await QRCode.toDataURL(qrContent);
        const fechaHora = new Date(formData.fechaHora);
        
        const result = await pool.query(`
            INSERT INTO reserva
            (codigo_qr, fecha, hora_salida, punto_partida, punto_destino, usuario_id)
            SELECT $1,$2,$3,$4,$5, u.UsId
            FROM usuario u
            WHERE u.id = $6
            RETURNING *`,
            [
                qrCode, 
                fechaHora.toISOString().split('T')[0],  
                fechaHora.toISOString(),                
                formData.direccion, 
                formData.destino, 
                formData.usuarioId
            ]);

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const obtenerHistorialReservas = async (usuarioId) => {
    try{
        const result = await pool.query(`
            SELECT r.id, r.estado, r.codigo_qr, r.fecha, r.hora_salida, r.punto_partida, r.punto_destino
            FROM reserva r
            INNER JOIN usuario u ON r.usuario_id = u.UsId
            WHERE u.UsId = $1
            ORDER BY r.hora_salida DESC
            `, [usuarioId]);

        return result.rows;
    }catch(error){
        throw error;
    }
};