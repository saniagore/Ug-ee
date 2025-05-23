import { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaHome, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { styles } from './css/reserva';
import { QueryReserva } from '../../components/queryReserva';

const ReservaForm = ({ onBack }) => {
  const reservaQuery = new QueryReserva();
  const [formData, setFormData] = useState({
    fechaHora: '',
    destino: '',
    direccion: '',
    usuarioId: '',
  });
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const newErrors = {};
    if (!formData.fechaHora) newErrors.fechaHora = 'Campo obligatorio';
    if (!formData.destino) newErrors.destino = 'Campo obligatorio';
    if (!formData.direccion) newErrors.direccion = 'Campo obligatorio';
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
    formData.usuarioId = decoded.id;

    try{
      await reservaQuery.registrarReserva(formData);
    }catch(error){
      alert('Error al agendar la reserva. Por favor, inténtalo de nuevo.');
    }

    alert('¡Reserva agendada con éxito!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Volver
        </button>
        <h2 style={styles.title}>Agendar Reserva</h2>
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
            placeholder="Ej: Aeropuerto Internacional"
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
            placeholder="Ej: Calle Principal #123, Ciudad"
            style={{ ...styles.input, minHeight: '80px' }}
          />
          {errors.direccion && <span style={styles.error}>{errors.direccion}</span>}
        </div>

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