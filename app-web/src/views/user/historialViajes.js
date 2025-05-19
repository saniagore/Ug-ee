import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaHistory, FaMapMarkerAlt, FaCalendarAlt, FaCar } from "react-icons/fa";
import { QueryViaje } from "../../components/queryViaje";
import "../../css/Menu.css";

const HistorialViajes = ({ onBack }) => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/usuario/auth/verify",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        
        const viajeQuery = new QueryViaje();
        const result = await viajeQuery.obtenerHistorialViajes(data.user.id);

        //AGREGAR LAS PLACAS Y MARCA DEL CARRO COMO TIPO
        console.log(result);
        
        if (result.error) {
          setError(result.message);
        } else {
          const viajesArray = Array.isArray(result) ? result : 
                             result.data ? result.data : 
                             result.viajes ? result.viajes : [];
          setViajes(viajesArray);
        }
      } catch (err) {
        setError("Error al cargar el historial de viajes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const formatFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(fechaString).toLocaleDateString('es-ES', options);
    } catch {
      return fechaString; 
    }
  };

  const getEstadoStyle = (estado) => {
    if (!estado) return { backgroundColor: '#9E9E9E', color: 'white' };
    
    switch(estado.toLowerCase()) {
      case 'completado':
        return { backgroundColor: '#4CAF50', color: 'white' };
      case 'cancelado':
        return { backgroundColor: '#F44336', color: 'white' };
      case 'en curso':
        return { backgroundColor: '#2196F3', color: 'white' };
      default:
        return { backgroundColor: '#9E9E9E', color: 'white' };
    }
  };

  return (
    <div className="historial-container">
      <button
        onClick={onBack}
        className="back-button"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          marginBottom: "20px",
          color: "#7e46d2",
        }}
      >
        <FaArrowLeft />
      </button>

      <h2 className="historial-title">
        <FaHistory style={{ marginRight: '10px' }} />
        Historial de Viajes
      </h2>

      {loading ? (
        <div className="loading-message">Cargando historial...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : viajes.length === 0 ? (
        <div className="empty-message">No hay viajes registrados en tu historial</div>
      ) : (
        <div className="viajes-list">
          {viajes.map((viaje) => (
            <div key={viaje._id || Math.random()} className="viaje-card">
              <div className="viaje-header">
                <span className="viaje-fecha">
                  <FaCalendarAlt style={{ marginRight: '5px' }} />
                  {formatFecha(viaje.fecha_creacion)}
                </span>
                <span 
                  className="viaje-estado" 
                  style={getEstadoStyle(viaje.estado)}
                >
                  {viaje.estado || 'Estado desconocido'}
                </span>
              </div>
              
              <div className="viaje-info">
                <div className="viaje-ruta">
                  <div className="ruta-item">
                    <FaMapMarkerAlt className="origen-icon" />
                    <span className="ruta-text">{viaje.punto_partida || 'Origen no disponible'}</span>
                  </div>
                  <div className="ruta-item">
                    <FaCar className="destino-icon" />
                    <span className="ruta-text">{viaje.punto_destino || 'Destino no disponible'}</span>
                  </div>
                </div>
                
                <div className="viaje-detalles">
                  <span className="detalle-item">
                    <strong>Tipo:</strong> {viaje.tipo_viaje || 'No especificado'}
                  </span>
                  <span className="detalle-item">
                    <strong>Vehiculo:</strong> {viaje.vehiculo || 'No asignado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialViajes;