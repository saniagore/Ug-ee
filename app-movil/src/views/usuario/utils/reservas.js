import { useState, useEffect, useCallback } from "react";
import { QueryReserva } from "../../../components/query/queryReservas";

export function useReservas(usuarioId){
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReservas = useCallback(async () => {
        if (usuarioId) {
            try {
                setLoading(true);
                const reservasQuery = new QueryReserva();
                const data = await reservasQuery.historialReservas(usuarioId);
                setReservas(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [usuarioId]);

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    return { reservas, loading, error, refetch: fetchReservas };
}