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
        
        /*
        const result = await pool.query(`
            INSERT INTO reserva
            (codigo_qr, fecha, hora_salida, punto_partida, punto_destino, usuario_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`, [
                qrCode, 
                fechaHora.toISOString().split('T')[0],  
                fechaHora.toISOString(),                
                formData.direccion, 
                formData.destino, 
                formData.usuarioId
            ]);

        return result.rows[0];
        */
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const obtenerHistorialReservas = async (usuarioId) => {
    try{
    }catch(error){
        throw error;
    }
};