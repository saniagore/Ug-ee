import pg from "pg";
import QRCode from 'qrcode';
import { DB_CONFIG } from "../config.js";

const { Pool } = pg;
const pool = new Pool(DB_CONFIG);



export const crearReserva = async(formData) => {
    try{
        const qrContent = JSON.stringify(formData);
        const qrCode = await QRCode.toDataURL(qrContent);
        
        if (!formData.fechaHora) {
            throw new Error("fechHora is required in formData");
        }
        const [fecha, hora] = formData.fechaHora.split('T');
        console.log('Fecha:', fecha);
        console.log('Hora:', hora);

        /*
        const result = await pool.query(`
            INSERT INTO reserva
            (codigo_qr,fecha,hora_salida,punto_partida,usuario_id)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`, ); */
        
        
    }catch(error){
        console.error(error);
        throw error;
    }
};