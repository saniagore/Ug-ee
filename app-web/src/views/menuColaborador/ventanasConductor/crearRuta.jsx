import { useState, useEffect } from 'react';
import { QueryViaje } from "../../../components/queryViaje";
import { QueryVehicle } from "../../../components/queryVehiculo";
import { styles } from "../css/crearRuta";


const CrearRutaViaje = ({ conductorId, onRutaCreada, onCancelar }) => {
  const [nuevaRuta, setNuevaRuta] = useState({
    puntoPartida: "",
    puntoDestino: "",
    tipoViaje: "campus",
    cantidadPasajeros: 1,
    fechaSalida: "",
    horaSalida: "",
    vehiculoId: ""
  });

  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);

  // Cargar vehículos del conductor
  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        const vehiculoQuery = new QueryVehicle();
        const token = localStorage.getItem("jwt_token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));

        const vehiculosData = await vehiculoQuery.obtenerVehiculosPorConductor(decodedToken.id);
        setVehiculos(vehiculosData);
        

        if (vehiculosData.length === 1) {
          setNuevaRuta(prev => ({
            ...prev,
            vehiculoId: vehiculosData[0].id,
            cantidadPasajeros: 1
          }));
        }
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
        setError("Error al cargar los vehículos disponibles");
      } finally {
        setLoadingVehiculos(false);
      }
    };

    cargarVehiculos();
  }, [conductorId]);

  const handleNuevaRutaChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el vehículo, actualizar también la cantidad máxima de pasajeros
    if (name === "vehiculoId") {
      const vehiculoSeleccionado = vehiculos.find(v => v.id === value);
      setNuevaRuta(prev => ({
        ...prev,
        [name]: value,
        cantidadPasajeros: Math.min(prev.cantidadPasajeros, vehiculoSeleccionado?.cantidadpasajeros || 1)
      }));
    } else {
      setNuevaRuta(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitNuevaRuta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nuevaRuta.vehiculoId) {
      setError("Debes seleccionar un vehículo");
      setLoading(false);
      return;
    }

    const vehiculoSeleccionado = vehiculos.find(v => v.id === nuevaRuta.vehiculoId);

    if (parseInt(nuevaRuta.cantidadPasajeros) > vehiculoSeleccionado.cantidadpasajeros) {
      setError(`La cantidad de pasajeros no puede exceder ${vehiculoSeleccionado.cantidadpasajeros}`);
      setLoading(false);
      return;
    }

    try {
      const viajeQuery = new QueryViaje();
      await viajeQuery.crearViaje(nuevaRuta);

      if (onRutaCreada) {
        onRutaCreada();
      }
      
      setNuevaRuta({
        puntoPartida: "",
        puntoDestino: "",
        tipoViaje: "campus",
        cantidadPasajeros: 1,
        fechaSalida: "",
        horaSalida: "",
        vehiculoId: vehiculos.length === 1 ? vehiculos[0].id : ""
      });
      
    } catch (error) {
      console.error("Error al crear ruta:", error);
      setError(error.message || "Error al crear la ruta");
    } finally {
      setLoading(false);
    }
  };

  const vehiculoSeleccionado = vehiculos.find(v => v.id === nuevaRuta.vehiculoId);

  return (
    <div style={{ 
      ...styles.card,
      maxHeight: '60vh', // Altura máxima del 90% del viewport
      overflowY: 'auto', // Scroll vertical cuando sea necesario
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '0 4px' }}> {/* Padding para evitar que el contenido toque los bordes del scroll */}
        <h2 style={styles.title}>Crear Nueva Ruta</h2>
        
        {error && (
          <div style={styles.errorMessage}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              style={{ flexShrink: 0 }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmitNuevaRuta} style={styles.form}>
          {/* Campo para seleccionar vehículo */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Vehículo:</label>
            {loadingVehiculos ? (
              <div style={{ 
                padding: "12px", 
                backgroundColor: "#f8fafc", 
                borderRadius: "8px",
                color: "#718096"
              }}>
                Cargando vehículos...
              </div>
            ) : vehiculos.length === 0 ? (
              <div style={{ 
                padding: "12px", 
                backgroundColor: "#fff5f5", 
                borderRadius: "8px",
                color: "#e53e3e",
                border: "1px solid #fed7d7"
              }}>
                No tienes vehículos registrados
              </div>
            ) : (
              <select
                name="vehiculoId"
                value={nuevaRuta.vehiculoId}
                onChange={handleNuevaRutaChange}
                style={styles.select}
                required
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map(vehiculo => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa} ({vehiculo.cantidadpasajeros} pasajeros)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Resto de los campos del formulario (mantén todo igual) */}
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
            value={JSON.parse(atob(localStorage.getItem("jwt_token").split(".")[1])).tipo}
            onChange={handleNuevaRutaChange}
            style={styles.select}
            required
          >
            <option value={JSON.parse(atob(localStorage.getItem("jwt_token").split(".")[1])).tipo}>{JSON.parse(atob(localStorage.getItem("jwt_token").split(".")[1])).tipo.charAt(0).toUpperCase() + JSON.parse(atob(localStorage.getItem("jwt_token").split(".")[1])).tipo.slice(1).toLowerCase()}</option>
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
            max={vehiculoSeleccionado?.cantidadpasajeros || 4}
            style={styles.input}
            required
          />
          {vehiculoSeleccionado && (
            <small style={styles.smallText}>
              Máximo según vehículo: {vehiculoSeleccionado.cantidadpasajeros} pasajeros
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
              disabled={loading || loadingVehiculos || vehiculos.length === 0}
            >
              {loading ? "Creando..." : "Crear Ruta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearRutaViaje;