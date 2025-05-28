import { useEffect, useState, useCallback } from "react";
import { QueryViaje } from "../../../components/queryViaje";
import { styles } from "../css/menuConductor";

export default function ViajesActivos({ conductorId }) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onViajeTerminado = () => {
    console.log("Viaje terminado exitosamente");
  };
  const onViajeCancelado = () => {
    console.log("Viaje cancelado exitosamente");
  };

  const cargarViajesActivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new QueryViaje();
      const resultado = await query.viajesActivos(conductorId);

      if (resultado && !resultado.error) {
        const viajesData = Array.isArray(resultado)
          ? resultado
          : resultado.viajes
          ? resultado.viajes
          : resultado.data
          ? resultado.data
          : [];
        setViajes(viajesData);
      } else {
        setError(resultado?.message || "Error al cargar viajes activos");
        setViajes([]);
      }
    } catch (err) {
      setError("Error de conexión al servidor");
      console.error(err);
      setViajes([]);
    } finally {
      setLoading(false);
    }
  }, [conductorId]);

  useEffect(() => {
    if (conductorId) {
      cargarViajesActivos();
    }
  }, [conductorId, cargarViajesActivos]);

  const handleTerminarViaje = async (viajeId) => {
    try {
      const query = new QueryViaje();
      const resultado = await query.terminarViaje(viajeId);

      if (resultado.error) {
        alert(resultado.message);
      } else {
        alert("Viaje terminado exitosamente");
        onViajeTerminado();
        cargarViajesActivos();
      }
    } catch (err) {
      alert("Error al terminar el viaje");
      console.error(err);
    }
  };

  const handleCancelarViaje = async (viajeId) => {
    try {
      const query = new QueryViaje();
      const resultado = await query.cancelarViaje(viajeId);

      if (resultado.error) {
        alert(resultado.message);
      } else {
        alert("Viaje cancelado exitosamente");
        onViajeCancelado();
        cargarViajesActivos();
      }
    } catch (err) {
      alert("Error al cancelar el viaje");
      console.error(err);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando viajes activos...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (viajes.length === 0) {
    return (
      <div style={styles.emptyState}>No tienes viajes activos actualmente</div>
    );
  }

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      {viajes.map((viaje) => (
        <div key={viaje.id} style={{ ...styles.card, marginBottom: "16px" }}>
          <h3 style={{ marginTop: 0, color: "#2c3e50" }}>
            Viaje a: {viaje.destino}
          </h3>

          <div style={styles.gridContainer}>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Origen</div>
              <div style={styles.detailValue}>{viaje.puntopartida}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Destino</div>
              <div style={styles.detailValue}>{viaje.puntodestino}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Fecha</div>
              <div style={styles.detailValue}>
                {new Date(viaje.fechasalida).toLocaleString()}
              </div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Estado</div>
              <div style={styles.detailValue}>{viaje.estado}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Cantidad de Pasajeros Disponible</div>
              <div style={styles.detailValue}>{viaje.cantidadpasajeros}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Cantidad de Pasajeros Aceptados</div>
              <div style={styles.detailValue}>{viaje.pasajerosdisponibles}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => handleTerminarViaje(viaje.id)}
            >
              Terminar Viaje
            </button>
            <button
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={() => handleCancelarViaje(viaje.id)}
            >
              Cancelar Viaje
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
