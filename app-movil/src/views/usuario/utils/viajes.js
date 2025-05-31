import {useState, useEffect} from "react";
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

export function unirseViaje(viajeId, usuarioId) {
    console.log("Unirse al viaje:", viajeId, "Usuario:", usuarioId);
}