import { useState, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaHome, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { styles } from './css/reserva';
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

// Configuración de iconos de Leaflet
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
      // Primer click: establecer punto de partida
      setFormData(prev => ({
        ...prev,
        ubicacionPartida: { lat, lng },
        direccion: `Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        rutaPlanificada: [{ lat, lng }]
      }));
    } else if (!formData.ubicacionDestino) {
      // Segundo click: establecer punto de destino
      setFormData(prev => ({
        ...prev,
        ubicacionDestino: { lat, lng },
        destino: `Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        rutaPlanificada: [prev.ubicacionPartida, { lat, lng }]
      }));

      // Ajustar vista para mostrar toda la ruta
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
      newErrors.ruta = 'Debes seleccionar una ruta en el mapa';
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

    try{
      console.log(reservaData);
      await reservaQuery.registrarReserva(reservaData);
      
      alert('¡Reserva agendada con éxito!');
      onBack();
    }catch(error){
      alert('Error al agendar la reserva. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Volver
        </button>
        <h2 style={styles.title}>Agendar Reserva</h2>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <MapContainer
          center={[3.374733, -76.535007]}
          zoom={13}
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
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
        
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '12px', 
          borderRadius: '8px',
          marginTop: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ margin: '0 0 8px 0', color: '#4a5568' }}>
            {!formData.ubicacionPartida
              ? "Haz clic en el mapa para seleccionar el punto de partida"
              : !formData.ubicacionDestino
              ? "Ahora haz clic para seleccionar el punto de destino"
              : "Ruta seleccionada. Puedes reiniciar si es necesario"}
          </p>
          {(formData.ubicacionPartida || formData.ubicacionDestino) && (
            <button
              onClick={resetRouteSelection}
              style={{
                padding: '6px 12px',
                backgroundColor: '#fff5f5',
                border: '1px solid #fed7d7',
                color: '#e53e3e',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reiniciar selección
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FaCalendarAlt style={styles.icon} /> Fecha y Hora de Salida
          </label>
          <input
            type="datetime-local"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.fechaHora && <span style={styles.error}>{errors.fechaHora}</span>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FaMapMarkerAlt style={styles.icon} /> Punto de Destino
          </label>
          <input
            type="text"
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            placeholder="Selecciona en el mapa o escribe manualmente"
            style={styles.input}
          />
          {errors.destino && <span style={styles.error}>{errors.destino}</span>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FaHome style={styles.icon} /> Dirección Completa
          </label>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Selecciona en el mapa o escribe manualmente"
            style={{ ...styles.input, minHeight: '80px' }}
          />
          {errors.direccion && <span style={styles.error}>{errors.direccion}</span>}
        </div>

        {errors.ruta && (
          <div style={{ 
            color: '#e53e3e', 
            backgroundColor: '#fff5f5',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid #fed7d7'
          }}>
            {errors.ruta}
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            <FaPaperPlane style={{ marginRight: '8px' }} /> Confirmar Reserva
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservaForm;