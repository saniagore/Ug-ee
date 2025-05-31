import { useState, useEffect, useCallback } from "react";
import { QueryViaje } from "../../../components/query/queryViaje";

export function useViajesConductor(usuarioId) {
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchViajes = useCallback(async () => {
        if (usuarioId) {
            try {
                setLoading(true);
                const viajesQuery = new QueryViaje();
                const data = await viajesQuery.viajesActivos(usuarioId);
                setViajes(data);
            } catch (error) {
                setError(error);
            }
            finally {
                setLoading(false);
            }
        }
    }, [usuarioId]);

    useEffect(() => {
        fetchViajes();
    }, [fetchViajes]);

    return { viajes, loading, error, refetch: fetchViajes };
}

export async function cancelarViaje(viajeId) {
    try{
        await new QueryViaje().cancelarViaje(viajeId);
    }catch (error) {
        console.error("Error al cancelar viaje:", error);
    }
}

export async function finalizarViaje(viajeId) {
    try {
        await new QueryViaje().terminarViaje(viajeId);
    } catch (error) {
        console.error("Error al finalizar viaje:", error);
    }
}

export async function iniciarViaje(viajeId) {
    try {
        await new QueryViaje().iniciarViaje(viajeId);
    } catch (error) {
        console.error("Error al iniciar viaje:", error);
    }
}