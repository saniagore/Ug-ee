import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { QueryViaje } from "../../components/queryViaje";
import { QueryCalificacion } from "../../components/queryCalificacion";
import "./css/Historial.css";
import { QueryReporte } from "../../components/queryReporte";

const HistorialViajes = ({ userId, onViewRoute }) => {
  const [loading, setLoading] = useState(true);
  const [viajes, setViajes] = useState([]);
  const [error, setError] = useState(null);

  // Estados para calificación
  const [ratingViajeId, setRatingViajeId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");

  // Estados para reporte
  const [reporteViajeId, setReporteViajeId] = useState(null);
  const [descripcionReporte, setDescripcionReporte] = useState("");
  const [categoriaReporte, setCategoriaReporte] = useState("");

  const handleReportarViaje = (viajeId) => {
    setReporteViajeId(viajeId);
    setDescripcionReporte("");
    setCategoriaReporte("");
  };

  const handleCancelarReporte = () => {
    setReporteViajeId(null);
  };

  const handleEnviarReporte = async () => {
    if (!descripcionReporte || !categoriaReporte) {
      alert("Por favor completa todos los campos del reporte");
      return;
    }
    
    try {
      setLoading(true);

      const queryReporte = new QueryReporte();
      await queryReporte.registrarReporte(reporteViajeId, descripcionReporte, categoriaReporte);  
      
      alert("Reporte enviado exitosamente. Gracias por tu feedback.");
      setReporteViajeId(null);
      const viajeQuery = new QueryViaje();
      const result = await viajeQuery.obtenerHistorial(userId);
      setViajes(result || []);
    } catch (error) {
      alert("Error al enviar el reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCalificarViaje = async (viajeId) => {
    setRatingViajeId(viajeId);
    setRating(0);
    setComentario("");
  };

  const handleCancelarCalificacion = () => {
    setRatingViajeId(null);
  };

  const handleEnviarCalificacion = async () => {
    if (!ratingViajeId || rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }
    try {
      setLoading(true);
      const queryCalificacion = new QueryCalificacion();
      await queryCalificacion.calificarViaje(ratingViajeId,rating,comentario);

      const viajeQuery = new QueryViaje();
      const result = await viajeQuery.obtenerHistorial(userId);
      setViajes(result || []);

      alert("¡Gracias por tu calificación!");
      setRatingViajeId(null);
    } catch (error) {
      alert("Error al enviar la calificación: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="star-button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            {star <= (hover || rating) ? (
              <FaStar className="star-icon filled" />
            ) : (
              <FaStar className="star-icon" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderReporteForm = () => {
    return (
      <div className="reporte-mode">
        <h3>Reportar este viaje</h3>
        <p>
          {viajes.find(v => v.id === reporteViajeId)?.puntopartida} → 
          {viajes.find(v => v.id === reporteViajeId)?.puntodestino}
        </p>
        
        <div className="reporte-form-group">
          <label htmlFor="categoria-reporte">Categoría del reporte:</label>
          <select
            id="categoria-reporte"
            value={categoriaReporte}
            onChange={(e) => setCategoriaReporte(e.target.value)}
            className="reporte-select"
          >
            <option value="">Selecciona una categoría</option>
            <option value="reportes de movilidad y uso del servicio">
              Reportes de movilidad y uso del servicio
            </option>
            <option value="reporte de desempeño de conductores y vehiculos">
              Reporte de desempeño de conductores y vehículos
            </option>
            <option value="reporte de seguridad y geolocalizacion">
              Reporte de seguridad y geolocalización
            </option>
          </select>
        </div>
        
        <div className="reporte-form-group">
          <label htmlFor="descripcion-reporte">Descripción del problema:</label>
          <textarea
            id="descripcion-reporte"
            value={descripcionReporte}
            onChange={(e) => setDescripcionReporte(e.target.value)}
            placeholder="Describe detalladamente el problema que encontraste..."
            className="reporte-textarea"
            style={{width: "90%"}}
          />
        </div>
        
        <div className="reporte-actions">
          <button
            className="cancel-button"
            onClick={handleCancelarReporte}
          >
            Cancelar
          </button>
          <button
            className="submit-button"
            onClick={handleEnviarReporte}
          >
            Enviar Reporte
          </button>
        </div>
      </div>
    );
  };

  const handleCancelarViaje = async (viajeId) => {
    try {
      const viajeQuery = new QueryViaje();
      await viajeQuery.cancelarViajeUsuario(viajeId, userId);

      const result = await viajeQuery.obtenerHistorial(userId);
      setViajes(result || []);

      alert("Viaje cancelado exitosamente");
    } catch (error) {
      alert("Error al cancelar el viaje: " + error.message);
    }
  };

  const handleViewRoute = (viaje) => {
    if (onViewRoute) {
      onViewRoute(viaje.rutaplanificada);
    }
  };

  useEffect(() => {
    const cargarHistorialViajes = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const viajeQuery = new QueryViaje();
        const result = await viajeQuery.obtenerHistorial(userId);

        setViajes(result || []);
      } catch (err) {
        console.error("Error al cargar historial de viajes:", err);
        setError("Error al cargar historial de viajes");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorialViajes();
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
        <div className="loading">Cargando historial de viajes...</div>
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
          <p>No hay viajes en tu historial</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <div className="card">
        <h2 className="card-title">Historial de Viajes</h2>

        <div className="viajes-grid">
          {viajes.map((viaje) => (
            <div key={viaje.id} className="viaje-card">
              {ratingViajeId === viaje.id ? (
                <div className="rating-mode">
                  <h3>Calificar este viaje</h3>
                  <p>
                    {viaje.puntopartida} → {viaje.puntodestino}
                  </p>
                  
                  {renderStars()}
                  
                  <div className="rating-comment">
                    <label htmlFor={`comentario-${viaje.id}`}>Comentario (opcional):</label>
                    <textarea
                      id={`comentario-${viaje.id}`}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="¿Cómo fue tu experiencia en este viaje?"
                    />
                  </div>
                  
                  <div className="rating-actions">
                    <button
                      className="cancel-button"
                      onClick={handleCancelarCalificacion}
                    >
                      Cancelar
                    </button>
                    <button
                      className="submit-button"
                      onClick={handleEnviarCalificacion}
                    >
                      Enviar Calificación
                    </button>
                  </div>
                </div>
              ) : reporteViajeId === viaje.id ? (
                renderReporteForm()
              ) : (
                <>
                  {/* Contenido original de la tarjeta del viaje */}
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
                      <div className="detail-value">{viaje.cantidadpasajeros}</div>
                    </div>
                    {viaje.marca && (
                      <div className="detail-item">
                        <div className="detail-label">Vehículo</div>
                        <div className="detail-value">
                          {viaje.marca} {viaje.modelo} ({viaje.placa})
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="conductor-info">
                    <div className="detail-label">
                      {viaje.rol === "conductor" ? "Tú fuiste el" : "Conductor"}
                    </div>
                    <div className="detail-value">{viaje.conductornombre}</div>
                    {viaje.rol !== "conductor" && (
                      <>
                        <div className="detail-value">{viaje.conductorcelular}</div>
                        <div className="detail-value">{viaje.conductorcorreo}</div>
                      </>
                    )}
                    <div className="detail-value">
                      Puntuación: {viaje.conductorpuntuacion || "Sin calificar"}
                    </div>
                  </div>

                  <div className="viaje-actions">
                    {viaje.estado === "pendiente" && (
                      <>
                        <button
                          className="view-route-button"
                          onClick={() => handleViewRoute(viaje)}
                        >
                          Visualizar ruta realizada
                        </button>
                        <button
                          className="join-button"
                          onClick={() => handleCancelarViaje(viaje.id)}
                        >
                          Cancelar Viaje
                        </button>
                      </>
                    )}
                    {viaje.estado === "finalizado" && (
                      <>
                        <button
                          className="view-route-button"
                          onClick={() => handleReportarViaje(viaje.id)}
                        >
                          Reportar Viaje
                        </button>
                        <button
                          className="join-button"
                          onClick={() => handleCalificarViaje(viaje.id)}
                        >
                          Calificar Viaje
                        </button>
                      </>
                    )}
                    {viaje.estado === "en curso" && (
                      <button
                        className="view-route-button"
                        onClick={() => handleViewRoute(viaje)}
                      >
                        Visualizar ruta realizada
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistorialViajes;