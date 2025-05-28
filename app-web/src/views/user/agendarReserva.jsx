import { useState, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaHome, FaPaperPlane } from 'react-icons/fa';
import { QueryReserva } from '../../components/queryReserva';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/Reserva.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapClickHandler({ onMapClick }) {
  useMapEvent('click', (e) => {
    onMapClick(e);
  });
  return null;
}

const ReservaForm = ({ onBack }) => {
  const reservaQuery = new QueryReserva();
  const [formData, setFormData] = useState({
    fechaHora: '',
    destino: '',
    direccion: '',
    usuarioId: '',
    ubicacionPartida: null,
    ubicacionDestino: null,
    rutaPlanificada: [],
  });
  const [errors, setErrors] = useState({});
  const mapRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    
    if (!formData.ubicacionPartida) {
      setFormData(prev => ({
        ...prev,
        ubicacionPartida: { lat, lng },
        direccion: `Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        rutaPlanificada: [{ lat, lng }]
      }));
    } else if (!formData.ubicacionDestino) {
      setFormData(prev => ({
        ...prev,
        ubicacionDestino: { lat, lng },
        destino: `Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        rutaPlanificada: [prev.ubicacionPartida, { lat, lng }]
      }));

      if (mapRef.current) {
        const bounds = L.latLngBounds([
          [formData.ubicacionPartida.lat, formData.ubicacionPartida.lng],
          [lat, lng]
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  const resetRouteSelection = () => {
    setFormData(prev => ({
      ...prev,
      ubicacionPartida: null,
      ubicacionDestino: null,
      rutaPlanificada: [],
      direccion: '',
      destino: ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fechaHora) newErrors.fechaHora = 'Campo obligatorio';
    if (!formData.destino) newErrors.destino = 'Campo obligatorio';
    if (!formData.direccion) newErrors.direccion = 'Campo obligatorio';
    if (!formData.ubicacionPartida || !formData.ubicacionDestino) {
      newErrors.ruta = 'Debes seleccionar ambos puntos (partida y destino) en el mapa';
    }
    return newErrors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const token = localStorage.getItem("jwt_token");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const reservaData = {
      ...formData,
      usuarioId: decoded.id,
      rutaPlanificada: formData.rutaPlanificada,
      ubicacionPartida: formData.ubicacionPartida
    };

    try {
      await reservaQuery.registrarReserva(reservaData);
      alert('¡Reserva agendada con éxito!');
      onBack();
    } catch(error) {
      alert('Error al agendar la reserva. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="reserva-form-container">
      <div className="reserva-form-header">
        <h2 className="reserva-form-title">Agendar Reserva</h2>
      </div>
      
      <div className="reserva-form-map-container">
        <MapContainer
          center={[3.374733, -76.535007]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapClickHandler onMapClick={handleMapClick} />
          
          {formData.ubicacionPartida && (
            <Marker
              position={[formData.ubicacionPartida.lat, formData.ubicacionPartida.lng]}
            >
              <Popup>Punto de partida</Popup>
            </Marker>
          )}

          {formData.ubicacionDestino && (
            <Marker
              position={[formData.ubicacionDestino.lat, formData.ubicacionDestino.lng]}
            >
              <Popup>Punto de destino</Popup>
            </Marker>
          )}

          {formData.rutaPlanificada.length === 2 && (
            <Polyline
              positions={formData.rutaPlanificada.map(p => [p.lat, p.lng])}
              color="#7e46d2"
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
      
      <div className="reserva-map-instructions">
        <p>
          {!formData.ubicacionPartida
            ? "Haz clic en el mapa para seleccionar el punto de partida"
            : !formData.ubicacionDestino
            ? "Ahora haz clic para seleccionar el punto de destino"
            : "Ruta seleccionada. Puedes reiniciar si es necesario"}
        </p>
        {(formData.ubicacionPartida || formData.ubicacionDestino) && (
          <button
            onClick={resetRouteSelection}
            className="reserva-reset-button"
          >
            Reiniciar selección
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="reserva-form">
        <div className="reserva-form-group">
          <label className="reserva-form-label">
            <FaCalendarAlt className="reserva-form-icon" /> Fecha y Hora de Salida
          </label>
          <input
            type="datetime-local"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            className="reserva-form-input"
          />
          {errors.fechaHora && <span className="reserva-form-error">{errors.fechaHora}</span>}
        </div>

        <div className="reserva-form-group">
          <label className="reserva-form-label">
            <FaMapMarkerAlt className="reserva-form-icon" /> Punto de Destino
          </label>
          <input
            type="text"
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            placeholder="Selecciona en el mapa o escribe manualmente"
            className="reserva-form-input"
          />
          {errors.destino && <span className="reserva-form-error">{errors.destino}</span>}
        </div>

        <div className="reserva-form-group">
          <label className="reserva-form-label">
            <FaHome className="reserva-form-icon" /> Dirección Completa
          </label>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Selecciona en el mapa o escribe manualmente"
            className="reserva-form-input reserva-form-textarea"
          />
          {errors.direccion && <span className="reserva-form-error">{errors.direccion}</span>}
        </div>

        {errors.ruta && (
          <div className="reserva-route-error">
            {errors.ruta}
          </div>
        )}

        <div className="reserva-form-button-group"
          style={{alignSelf: 'center'}}>
          <button type="submit" className="reserva-submit-button">
            <FaPaperPlane style={{ marginRight: '10px' }} /> Confirmar Reserva
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservaForm;