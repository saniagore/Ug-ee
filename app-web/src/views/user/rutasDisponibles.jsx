import { useEffect, useState } from "react";
import { QueryViaje } from "../../components/queryViaje";
import "./css/RutasDisponibles.css";

const RutasDisponibles = ({ userId, onViewRoute }) => {
  const [loading, setLoading] = useState(true);
  const [viajes, setViajes] = useState([]);
  const [error, setError] = useState(null);
  const viajeQuery = new QueryViaje();

  const handleViewRoute = (viaje) => {
    if (onViewRoute) {
      onViewRoute(viaje.rutaplanificada);
    }
  };

  const handleUnirseRuta = async (viajeId) => {
    try {
      await viajeQuery.unirseViaje(viajeId, userId);
      const viajesActualizados = await viajeQuery.verViajesDisponibles(userId);
      setViajes(viajesActualizados || []);
      alert("Te has unido al viaje exitosamente");

    } catch (error) {
      alert("Error al unirse al viaje");
    }
  };

  useEffect(() => {
    const cargarViajesDisponibles = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const viajeQuery = new QueryViaje();
        const result = await viajeQuery.verViajesDisponibles(userId);

        setViajes(result || []);
      } catch (err) {
        console.error("Error al cargar viajes disponibles:", err);
        setError("Error al cargar viajes disponibles");
      } finally {
        setLoading(false);
      }
    };

    cargarViajesDisponibles();
  }, [userId]);

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "status-badge status-pendiente";
      case "confirmado":
        return "status-badge status-confirmado";
      case "cancelado":
        return "status-badge status-cancelado";
      case "completado":
        return "status-badge status-completado";
      default:
        return "status-badge";
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Cargando viajes disponibles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (viajes.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <p>No hay viajes disponibles en este momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rutas-container">
      <div className="card">
        <h2 className="card-title">Rutas Disponibles</h2>

        <div className="viajes-grid">
          {viajes.map((viaje) => (
            <div key={viaje.id} className="viaje-card">
              <div className="viaje-header">
                <h3 className="viaje-title">
                  {viaje.puntopartida} → {viaje.puntodestino}
                </h3>
                <div className={getEstadoClass(viaje.estado)}>
                  {viaje.estado.toUpperCase()}
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">Fecha y Hora</div>
                  <div className="detail-value">
                    {formatFecha(viaje.fechasalida)}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Tipo de Viaje</div>
                  <div className="detail-value">
                    {viaje.tipoviaje.charAt(0).toUpperCase() +
                      viaje.tipoviaje.slice(1)}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Pasajeros</div>
                  <div className="detail-value">{viaje.pasajerosdisponibles}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Vehículo</div>
                  <div className="detail-value">
                    {viaje.marca} {viaje.modelo} ({viaje.placa})
                  </div>
                </div>
              </div>

              <div className="conductor-info">
                <div className="detail-label">Conductor</div>
                <div className="detail-value">{viaje.conductornombre}</div>
                <div className="detail-value">{viaje.conductorcelular}</div>
                <div className="detail-value">{viaje.conductorcorreo}</div>
                <div className="detail-value">
                  Puntuación: {viaje.conductorpuntuacion || "Sin calificar"}
                </div>
              </div>

              <div className="viaje-actions">
                <button
                  className="view-route-button"
                  onClick={() => handleViewRoute(viaje)}
                >
                  Visualizar ruta planificada
                </button>
                <button
                  className="join-button"
                  onClick={() => handleUnirseRuta(viaje.id)}
                >
                  Unirse a este viaje
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RutasDisponibles;
