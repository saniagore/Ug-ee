import { useState, useEffect } from "react";
import { QueryConductor } from "../../../components/query/queryConductor";

export function useConductorId(celular) {
    const [conductorId, setConductorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConductorId = async () => {
            if (celular) {
                try {
                    setLoading(true);
                    const queryConductor = new QueryConductor();
                    const id = await queryConductor.obtenerIdPorCelular(celular);
                    setConductorId(id);
                } catch (err) {
                    console.error("Error al obtener ID de conductor:", err);
                    setError(err);
                }
                finally {
                    setLoading(false);
                }
            }
        };
        fetchConductorId();
    }, [celular]);

    return { conductorId, loading, error };
}