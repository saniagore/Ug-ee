import { useState, useEffect, useCallback } from "react";
import { QueryReserva } from "../../../components/query/queryReservas";

export function useReservasConductor(conductorId) {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReservas = useCallback(async () => {
        if (conductorId) {
            try {
                setLoading(true);
                const reservasQuery = new QueryReserva();
                const data = await reservasQuery.reservasDisponibles(conductorId);
                setReservas(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [conductorId]);

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    return { reservas, loading, error, fetchReservas };
}

export async function aceptarReserva(reservaId, conductorId) {
    try {
        await new QueryReserva().aceptarReserva(reservaId, conductorId);
    } catch (error) {
        console.error("Error al aceptar reserva:", error);
    }
}