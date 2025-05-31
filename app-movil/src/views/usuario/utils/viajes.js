import {useState, useEffect } from "react";
import { QueryViaje } from "../../../components/query/queryViaje";

export function useViajes(usuarioId) {
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchViajes = async () => {
            if (usuarioId) {
                try {
                    setLoading(true);
                    const viajesQuery = new QueryViaje();
                    const data = await viajesQuery.verViajesDisponibles(usuarioId);
                    setViajes(data);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchViajes();
    }, [usuarioId]);

    return { viajes, loading, error };  
}

export async function unirseViaje(viajeId, usuarioId) {
    try{
        await new QueryViaje().unirseViaje(viajeId, usuarioId);
    }catch (error) {
        console.error("Error al unirse al viaje:", error);
    }
}

export function obtenerHistorial(usuarioId){
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (usuarioId) {
                try {
                    setLoading(true);
                    const viajesQuery = new QueryViaje();
                    const data = await viajesQuery.obtenerHistorial(usuarioId);
                    setViajes(data);
                }
                catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchHistorial();
    }, [usuarioId]);

    return { viajes, loading, error };
}

export async function cancelarViaje(viajeId, usuarioId){
    try{
        await new QueryViaje().cancelarViajeUsuario(viajeId,)
    }catch(error){
        console.error("Error al cancelar el viaje:", error);
    }
}