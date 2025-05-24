import { useState } from 'react';
import { QueryViaje } from "../../../components/queryViaje";
import { styles } from "../../../css/menuConductor";

const CrearRutaViaje = ({ conductorId, vehiculoActivo, onRutaCreada, onCancelar }) => {
  const [nuevaRuta, setNuevaRuta] = useState({
    puntoPartida: "",
    puntoDestino: "",
    tipoViaje: "campus",
    cantidadPasajeros: 1,
    fechaSalida: "",
    horaSalida: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNuevaRutaChange = (e) => {
    const { name, value } = e.target;
    setNuevaRuta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNuevaRuta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!vehiculoActivo) {
      setError("Debes seleccionar un vehículo primero");
      setLoading(false);
      return;
    }

    if (parseInt(nuevaRuta.cantidadPasajeros) > vehiculoActivo.cantidadPasajeros) {
      setError(`La cantidad de pasajeros no puede exceder ${vehiculoActivo.cantidadPasajeros}`);
      setLoading(false);
      return;
    }

    try {
      const viajeQuery = new QueryViaje();
      
      // Combinar fecha y hora para crear el timestamp
      const fechaHoraSalida = new Date(`${nuevaRuta.fechaSalida}T${nuevaRuta.horaSalida}`);
      
      await viajeQuery.crearViaje({
        puntoPartida: nuevaRuta.puntoPartida,
        puntoDestino: nuevaRuta.puntoDestino,
        tipoViaje: nuevaRuta.tipoViaje,
        cantidadPasajeros: parseInt(nuevaRuta.cantidadPasajeros),
        fechaSalida: fechaHoraSalida.toISOString(),
        vehiculoId: vehiculoActivo.id,
        conductorId: conductorId
      });

      if (onRutaCreada) {
        onRutaCreada();
      }
      
      // Resetear formulario
      setNuevaRuta({
        puntoPartida: "",
        puntoDestino: "",
        tipoViaje: "campus",
        cantidadPasajeros: 1,
        fechaSalida: "",
        horaSalida: ""
      });
      
    } catch (error) {
      console.error("Error al crear ruta:", error);
      setError(error.message || "Error al crear la ruta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={{ marginTop: 0, color: "#2c3e50" }}>Crear Nueva Ruta</h2>
      
      {error && (
        <div style={{ 
          color: "#e74c3c", 
          backgroundColor: "#fadbd8", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "15px"
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmitNuevaRuta} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Punto de Partida:</label>
          <input
            type="text"
            name="puntoPartida"
            value={nuevaRuta.puntoPartida}
            onChange={handleNuevaRutaChange}
            style={styles.input}
            required
            placeholder="Ej: Universidad Nacional, Bogotá"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Punto de Destino:</label>
          <input
            type="text"
            name="puntoDestino"
            value={nuevaRuta.puntoDestino}
            onChange={handleNuevaRutaChange}
            style={styles.input}
            required
            placeholder="Ej: Centro Comercial Andino"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo de Viaje:</label>
          <select
            name="tipoViaje"
            value={nuevaRuta.tipoViaje}
            onChange={handleNuevaRutaChange}
            style={styles.select}
            required
          >
            <option value="campus">Campus</option>
            <option value="metropolitano">Metropolitano</option>
            <option value="intermunicipal">Intermunicipal</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cantidad de Pasajeros:</label>
          <input
            type="number"
            name="cantidadPasajeros"
            value={nuevaRuta.cantidadPasajeros}
            onChange={handleNuevaRutaChange}
            min="1"
            max={vehiculoActivo?.cantidadPasajeros || 4}
            style={styles.input}
            required
          />
          {vehiculoActivo && (
            <small style={{ color: "#7f8c8d" }}>
              Máximo según vehículo: {vehiculoActivo.cantidadPasajeros}
            </small>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha de Salida:</label>
          <input
            type="date"
            name="fechaSalida"
            value={nuevaRuta.fechaSalida}
            onChange={handleNuevaRutaChange}
            style={styles.input}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Hora de Salida:</label>
          <input
            type="time"
            name="horaSalida"
            value={nuevaRuta.horaSalida}
            onChange={handleNuevaRutaChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={onCancelar}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.primaryButton }}
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Ruta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRutaViaje;