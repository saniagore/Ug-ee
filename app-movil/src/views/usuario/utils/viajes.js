import { useState, useEffect, useCallback } from "react";
import { QueryViaje } from "../../../components/query/queryViaje";

export function useViajes(usuarioId) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchViajes = useCallback(async () => {
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
  }, [usuarioId]);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  return { viajes, loading, error, refetch: fetchViajes };
}

export async function unirseViaje(viajeId, usuarioId) {
  try {
    await new QueryViaje().unirseViaje(viajeId, usuarioId);
  } catch (error) {
    console.error("Error al unirse al viaje:", error);
  }
}

export function useObtenerHistorial(usuarioId) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistorial = useCallback(async () => {
    if (usuarioId) {
      try {
        setLoading(true);
        const viajesQuery = new QueryViaje();
        const data = await viajesQuery.obtenerHistorial(usuarioId);
        setViajes(data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [usuarioId]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  return {
    viajes,
    loading,
    error,
    refetch: fetchHistorial,
  };
}

export async function cancelarViaje(viajeId, usuarioId) {
  try {
    await new QueryViaje().cancelarViajeUsuario(viajeId, usuarioId);
  } catch (error) {
    console.error("Error al cancelar el viaje:", error);
  }
}
