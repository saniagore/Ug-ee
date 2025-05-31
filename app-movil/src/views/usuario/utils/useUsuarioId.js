import { useState, useEffect } from "react";
import { QueryUsuario } from "../../../components/query/queryUsuario";

export function useUsuarioId(celular) {
  const [usuarioId, setUsuarioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarioId = async () => {
      if (celular) {
        try {
          setLoading(true);
          const queryUsuario = new QueryUsuario();
          const id = await queryUsuario.obtenerIdPorCelular(celular);
          setUsuarioId(id);
        } catch (err) {
          console.error("Error al obtener ID de usuario:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUsuarioId();
  }, [celular]);

  return { usuarioId, loading, error };
}