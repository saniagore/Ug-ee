import { useEffect, useState, useCallback } from "react";
import { QueryReserva } from "../../../components/queryReserva";
import { styles } from "../css/menuConductor";

export default function ReservasDisponibles({ conductorId }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarReservasDisponibles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new QueryReserva();
      const resultado = await query.reservasDisponibles(conductorId);
      console.log(resultado);

      if (resultado && !resultado.error) {
        const reservasData = Array.isArray(resultado)
          ? resultado
          : resultado.reservas
          ? resultado.reservas
          : resultado.data
          ? resultado.data
          : [];
        setReservas(reservasData);
      } else {
        setError(resultado?.message || "Error al cargar reservas disponibles");
        setReservas([]);
      }
    } catch (err) {
      setError("Error de conexión al servidor");
      console.error(err);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, [conductorId]);

  useEffect(() => {
    if (conductorId) {
      cargarReservasDisponibles();
    }
  }, [conductorId, cargarReservasDisponibles]);

  const handleAceptarReserva = async (reservaId) => {
    try {
      // Aquí deberías implementar la lógica para aceptar la reserva
      // Por ejemplo:
      // const query = new QueryReserva();
      // const resultado = await query.aceptarReserva(reservaId, conductorId);
      
      // if (resultado.error) {
      //   alert(resultado.message);
      // } else {
      //   alert("Reserva aceptada exitosamente");
      //   cargarReservasDisponibles();
      // }
      alert(`Reserva ${reservaId} aceptada (implementar lógica)`);
    } catch (err) {
      alert("Error al aceptar la reserva");
      console.error(err);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando reservas disponibles...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (reservas.length === 0) {
    return (
      <div style={styles.emptyState}>No hay reservas disponibles actualmente</div>
    );
  }

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      {reservas.map((reserva) => (
        <div key={reserva.id} style={{ ...styles.card, marginBottom: "16px" }}>
          <h3 style={{ marginTop: 0, color: "#2c3e50" }}>
            Reserva a: {reserva.puntoDestino}
          </h3>

          <div style={styles.gridContainer}>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Origen</div>
              <div style={styles.detailValue}>{reserva.puntopartida}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Destino</div>
              <div style={styles.detailValue}>{reserva.puntodestino}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Fecha y Hora de Salida</div>
              <div style={styles.detailValue}>{reserva.horasalida.split('T')[0] + "  " + reserva.horasalida.split('T')[1].split(':').slice(0, 2).join(':') + " " }</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Estado</div>
              <div style={styles.detailValue}>{reserva.estado}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Fecha</div>
              <div style={styles.detailValue}>{reserva.fecha.split('T')[0]}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => handleAceptarReserva(reserva.id)}
            >
              Aceptar Reserva
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}