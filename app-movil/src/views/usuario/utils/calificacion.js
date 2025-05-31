import { QueryCalificacion } from "../../../components/query/queryCalificacion";

export async function calificarViaje(viajeId,calificacion,comentario){
    try{
        await new QueryCalificacion().calificarViaje(viajeId,calificacion,comentario);
    }catch (error) {
        console.error("Error al calificar el viaje:", error);
    }
}