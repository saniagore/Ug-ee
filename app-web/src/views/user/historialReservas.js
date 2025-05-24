import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaHistory, FaMapMarkerAlt, FaCalendarAlt, FaQrcode } from "react-icons/fa";
import { QueryReserva } from "../../components/queryReserva";
import "./css/HistorialReservas.css";

const HistorialReservas = ({ onBack }) => {
  const [reservas, setReservas] = useState([]);
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
        
        const reservaQuery = new QueryReserva();
        const result = await reservaQuery.historialReservas(data.user.id);
        
        if (result.error) {
          setError(result.message);
        } else {
          const reservasArray = Array.isArray(result) ? result : 
                             result.data ? result.data : 
                             result.reservas ? result.reservas : [];
          setReservas(reservasArray);
        }
      } catch (err) {
        setError("Error al cargar el historial de reservas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const formatFechaHora = (fechaHoraString) => {
    if (!fechaHoraString) return 'Fecha no disponible';
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(fechaHoraString).toLocaleDateString('es-ES', options);
    } catch {
      return fechaHoraString; 
    }
  };

  const formatFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(fechaString).toLocaleDateString('es-ES', options);
    } catch {
      return fechaString;
    }
  };

  const getEstadoStyle = (estado) => {
    if (!estado) return { backgroundColor: '#9E9E9E', color: 'white' };
    switch(estado.toLowerCase()) {
      case 'confirmada':
        return { backgroundColor: '#4CAF50', color: 'white' };
      case 'pendiente':
        return { backgroundColor: '#FFC107', color: 'black' };
      case 'cancelada':
        return { backgroundColor: '#F44336', color: 'white' };
      case 'completada':
        return { backgroundColor: '#2196F3', color: 'white' };
      default:
        return { backgroundColor: '#9E9E9E', color: 'white' };
    }
  };

  const handleShowQR = (qrCode) => {
    // Implementar lógica para mostrar el QR en un modal o nueva ventana
    window.open(qrCode, '_blank');
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
        Historial de Reservas
      </h2>

      {loading ? (
        <div className="loading-message">Cargando historial...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : reservas.length === 0 ? (
        <div className="empty-message">No hay reservas registradas en tu historial</div>
      ) : (
        <div className="reservas-list">
          {reservas.map((reserva) => (
            <div key={reserva.id || Math.random()} className="reserva-card">
              <div className="reserva-header">
                <span className="reserva-fecha">
                  <FaCalendarAlt style={{ marginRight: '5px' }} />
                  {formatFecha(reserva.fecha)} - {formatFechaHora(reserva.hora_salida)}
                </span>
                <span 
                  className="reserva-estado" 
                  style={getEstadoStyle(reserva.estado)}
                >
                  {reserva.estado || 'Estado desconocido'}
                </span>
              </div>
              
              <div className="reserva-info">
                <div className="reserva-ruta">
                  <div className="ruta-item">
                    <FaMapMarkerAlt className="origen-icon" />
                    <span className="ruta-text">{reserva.punto_partida || 'Origen no disponible'}</span>
                  </div>
                  <div className="ruta-item">
                    <FaMapMarkerAlt className="destino-icon" />
                    <span className="ruta-text">{reserva.punto_destino || 'Destino no disponible'}</span>
                  </div>
                </div>
                
                <div className="reserva-detalles">
                  <button 
                    className="qr-button"
                    onClick={() => handleShowQR(reserva.codigo_qr)}
                  >
                    <FaQrcode style={{ marginRight: '5px' }} />
                    Ver QR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialReservas;