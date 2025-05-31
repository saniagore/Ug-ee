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