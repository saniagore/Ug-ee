import { useState, useEffect, useRef } from "react";
import { QueryViaje } from "../../../components/queryViaje";
import { QueryVehicle } from "../../../components/queryVehiculo";
import { styles } from "../css/crearRuta";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapClickHandler({ mapMode, handleMapClick }) {
  useMapEvent("click", (e) => {
    if (mapMode === "draw") {
      handleMapClick(e);
    }
  });
  return null;
}

const CrearRutaViaje = ({ onRutaCreada, onCancelar }) => {
  const token = localStorage.getItem("jwt_token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));

  const [nuevaRuta, setNuevaRuta] = useState({
    puntoPartida: "",
    puntoDestino: "",
    tipoViaje: decodedToken.tipo,
    cantidadPasajeros: 1,
    fechaSalida: "",
    horaSalida: "",
    vehiculoId: "",
    rutaPlanificada: [],
    ubicacionPartida: null,
    ubicacionDestino: null,
  });

  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [mapMode, setMapMode] = useState("search");
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      const map = mapRef.current;

      if (mapMode === "draw") {
        map.dragging.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        map.tap?.disable();
      } else {
        map.dragging.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        map.tap?.enable();
      }
    }
  }, [mapMode, mapReady]);

  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        const vehiculoQuery = new QueryVehicle();
        const vehiculosData = await vehiculoQuery.obtenerVehiculosPorConductor(
          decodedToken.id
        );
        setVehiculos(vehiculosData);

        if (vehiculosData.length === 1) {
          setNuevaRuta((prev) => ({
            ...prev,
            vehiculoId: vehiculosData[0].id,
            cantidadPasajeros: 1,
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
  }, [decodedToken.id]);

  const handleMapClick = (e) => {
    if (mapMode === "draw") {
      const { lat, lng } = e.latlng;

      if (!nuevaRuta.ubicacionPartida) {
        setNuevaRuta((prev) => ({
          ...prev,
          ubicacionPartida: { lat, lng },
          puntoPartida: `Ubicación seleccionada (${lat.toFixed(
            4
          )}, ${lng.toFixed(4)})`,
          rutaPlanificada: [{ lat, lng }],
        }));
      } else if (!nuevaRuta.ubicacionDestino) {
        // Segundo click: establecer punto de destino
        setNuevaRuta((prev) => ({
          ...prev,
          ubicacionDestino: { lat, lng },
          puntoDestino: `Ubicación seleccionada (${lat.toFixed(
            4
          )}, ${lng.toFixed(4)})`,
          rutaPlanificada: [prev.ubicacionPartida, { lat, lng }],
        }));

        // Ajustar vista para mostrar toda la ruta
        if (mapRef.current) {
          const bounds = L.latLngBounds([
            [nuevaRuta.ubicacionPartida.lat, nuevaRuta.ubicacionPartida.lng],
            [lat, lng],
          ]);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  };

  const handleNuevaRutaChange = (e) => {
    const { name, value } = e.target;

    if (name === "vehiculoId") {
      const vehiculoSeleccionado = vehiculos.find((v) => v.id === value);
      setNuevaRuta((prev) => ({
        ...prev,
        [name]: value,
        cantidadPasajeros: Math.min(
          prev.cantidadPasajeros,
          vehiculoSeleccionado?.cantidadpasajeros || 1
        ),
      }));
    } else {
      setNuevaRuta((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetRouteDrawing = () => {
    setNuevaRuta((prev) => ({
      ...prev,
      puntoPartida: "",
      puntoDestino: "",
      rutaPlanificada: [],
      ubicacionPartida: null,
      ubicacionDestino: null,
    }));
  };

  const calcularDistancia = (point1, point2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmitNuevaRuta = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nuevaRuta.vehiculoId) {
      setError("Debes seleccionar un vehículo");
      return;
    }

    if (nuevaRuta.rutaPlanificada.length < 2) {
      setError(
        "Debes trazar la ruta en el mapa seleccionando punto de partida y destino"
      );
      return;
    }

    const vehiculoSeleccionado = vehiculos.find(
      (v) => v.id === nuevaRuta.vehiculoId
    );

    if (
      parseInt(nuevaRuta.cantidadPasajeros) >
      vehiculoSeleccionado.cantidadpasajeros
    ) {
      setError(
        `La cantidad de pasajeros no puede exceder ${vehiculoSeleccionado.cantidadpasajeros}`
      );
      return;
    }

    try {
      setLoading(true);
      const viajeQuery = new QueryViaje();
      const viajeData = {
        puntoPartida: nuevaRuta.puntoPartida,
        puntoDestino: nuevaRuta.puntoDestino,
        tipoViaje: nuevaRuta.tipoViaje,
        cantidadPasajeros: nuevaRuta.cantidadPasajeros,
        fechaSalida: nuevaRuta.fechaSalida,
        horaSalida: nuevaRuta.horaSalida,
        vehiculoId: nuevaRuta.vehiculoId,
        rutaPlanificada: nuevaRuta.rutaPlanificada,
        ubicacionPartida: nuevaRuta.ubicacionPartida,
      };

      const result = await viajeQuery.crearViaje(viajeData);

      if (result.error) {
        throw new Error(result.message);
      }

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
        vehiculoId: vehiculos.length === 1 ? vehiculos[0].id : "",
        rutaPlanificada: [],
        ubicacionPartida: null,
        ubicacionDestino: null,
      });
    } catch (error) {
      console.error("Error al crear ruta:", error);
      setError(error.message || "Error al crear la ruta");
    } finally {
      setLoading(false);
    }
  };

  const vehiculoSeleccionado = vehiculos.find(
    (v) => v.id === nuevaRuta.vehiculoId
  );

  return (
    <div
      style={{
        ...styles.card,
      }}
    >
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

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => setMapMode("search")}
          style={{
            ...styles.button,
            ...(mapMode === "search"
              ? styles.primaryButton
              : styles.secondaryButton),
            flex: 1,
          }}
        >
          Modo Búsqueda
        </button>
        <button
          onClick={() => setMapMode("draw")}
          style={{
            ...styles.button,
            ...(mapMode === "draw"
              ? styles.primaryButton
              : styles.secondaryButton),
            flex: 1,
          }}
        >
          Modo Dibujar Ruta
        </button>
      </div>

      {mapMode === "draw" && (
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #e2e8f0",
          }}
        >
          <p style={{ margin: "0 0 8px 0", color: "#4a5568" }}>
            {!nuevaRuta.ubicacionPartida
              ? "Haz clic en el mapa para seleccionar el punto de partida"
              : !nuevaRuta.ubicacionDestino
              ? "Ahora haz clic para seleccionar el punto de destino"
              : "Ruta trazada. Puedes reiniciar si es necesario"}
          </p>
          {(nuevaRuta.ubicacionPartida || nuevaRuta.ubicacionDestino) && (
            <button
              onClick={resetRouteDrawing}
              style={{
                ...styles.button,
                background: "none",
                color: "#e53e3e",
                border: "1px solid #fed7d7",
                padding: "8px 12px",
                fontSize: "13px",
              }}
            >
              Reiniciar Ruta
            </button>
          )}
        </div>
      )}

      <MapContainer
        center={[3.374733, -76.535007]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
        whenCreated={(map) => {
          mapRef.current = map;
          setMapReady(true);
        }}
        doubleClickZoom={false}
        closePopupOnClick={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Componente para manejar clics en el mapa */}
        <MapClickHandler mapMode={mapMode} handleMapClick={handleMapClick} />

        {nuevaRuta.ubicacionPartida && (
          <Marker
            position={[
              nuevaRuta.ubicacionPartida.lat,
              nuevaRuta.ubicacionPartida.lng,
            ]}
          >
            <Popup>Punto de partida</Popup>
          </Marker>
        )}

        {nuevaRuta.ubicacionDestino && (
          <Marker
            position={[
              nuevaRuta.ubicacionDestino.lat,
              nuevaRuta.ubicacionDestino.lng,
            ]}
          >
            <Popup>Punto de destino</Popup>
          </Marker>
        )}

        {nuevaRuta.rutaPlanificada.length === 2 && (
          <Polyline
            positions={nuevaRuta.rutaPlanificada.map((p) => [p.lat, p.lng])}
            color="#7e46d2"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>

      <form onSubmit={handleSubmitNuevaRuta} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"></path>
              <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"></path>
            </svg>
            Vehículo
          </label>
          {loadingVehiculos ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                color: "#718096",
                border: "1px solid #e2e8f0",
              }}
            >
              Cargando vehículos...
            </div>
          ) : vehiculos.length === 0 ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fff5f5",
                borderRadius: "8px",
                color: "#e53e3e",
                border: "1px solid #fed7d7",
              }}
            >
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
              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa} (
                  {vehiculo.cantidadpasajeros} pasajeros)
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
            </svg>
            Punto de Partida
          </label>
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
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Punto de Destino
          </label>
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
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Tipo de Viaje
          </label>
          <select
            name="tipoViaje"
            value={decodedToken.tipo}
            onChange={handleNuevaRutaChange}
            style={styles.select}
            required
          >
            <option value={decodedToken.tipo}>
              {decodedToken.tipo.charAt(0).toUpperCase() +
                decodedToken.tipo.slice(1).toLowerCase()}
            </option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Cantidad de Pasajeros
          </label>
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
              Máximo según vehículo: {vehiculoSeleccionado.cantidadpasajeros}{" "}
              pasajeros
            </small>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Fecha de Salida
          </label>
          <input
            type="date"
            name="fechaSalida"
            value={nuevaRuta.fechaSalida}
            onChange={handleNuevaRutaChange}
            style={styles.input}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7e46d2"
              style={{ marginRight: "6px" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Hora de Salida
          </label>
          <input
            type="time"
            name="horaSalida"
            value={nuevaRuta.horaSalida}
            onChange={handleNuevaRutaChange}
            style={styles.input}
            required
          />
        </div>

        {nuevaRuta.rutaPlanificada.length > 0 && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h4
              style={{
                margin: "0 0 12px 0",
                color: "#2c3e50",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7e46d2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Resumen de Ruta
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    color: "#718096",
                  }}
                >
                  Partida:
                </p>
                <p style={{ margin: 0, fontWeight: "500" }}>
                  {nuevaRuta.puntoPartida}
                </p>
              </div>
              <div>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    color: "#718096",
                  }}
                >
                  Destino:
                </p>
                <p style={{ margin: 0, fontWeight: "500" }}>
                  {nuevaRuta.puntoDestino}
                </p>
              </div>
            </div>
            {nuevaRuta.ubicacionPartida && nuevaRuta.ubicacionDestino && (
              <p style={{ margin: "12px 0 0 0", color: "#4a5568" }}>
                <strong>Distancia aproximada:</strong>{" "}
                {calcularDistancia(
                  nuevaRuta.ubicacionPartida,
                  nuevaRuta.ubicacionDestino
                ).toFixed(2)}{" "}
                km
              </p>
            )}
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={onCancelar}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={styles.primaryButton}
            disabled={
              loading ||
              loadingVehiculos ||
              vehiculos.length === 0 ||
              nuevaRuta.rutaPlanificada.length < 2
            }
          >
            {loading ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Creando...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                Crear Ruta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRutaViaje;
