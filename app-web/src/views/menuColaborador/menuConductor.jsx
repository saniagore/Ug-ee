import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QueryVehicle } from "../../components/queryVehiculo";
import { styles } from "../../css/menuConductor";

import CrearRutaViaje from "./ventanasConductor/crearRuta";

export default function MenuConductor({ onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoActivo, setVehiculoActivo] = useState(null);
  const [activeTab, setActiveTab] = useState("viajes");
  const [showNuevaRutaForm, setShowNuevaRutaForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (!decoded.estadoVerificacion) {
        navigate("/Validando");
        return;
      }
      setUserData(decoded);
    } catch (error) {
      localStorage.removeItem("jwt_token");
      navigate("/");
    }
  }, [navigate]);

  const cargarDatos = useCallback(async () => {
    if (!userData) return;

    setLoading(true);
    try {
      const vehiculoQuery = new QueryVehicle();

      const [vehiculosRes] = await Promise.all([
        vehiculoQuery.obtenerVehiculosPorConductor(userData.id),
      ]);

      setVehiculos(vehiculosRes || []);
      setVehiculoActivo("");
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleVehiculoChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setVehiculoActivo(null);
      localStorage.removeItem("vehiculoActivo");
      return;
    }

    const selected = vehiculos.find(
      (v) => v.id.toString() === selectedId.toString()
    );

    if (selected) {
      setVehiculoActivo(selected);
      localStorage.setItem("vehiculoActivo", JSON.stringify(selected));
    } else {
      console.warn(
        "Vehículo no encontrado con ID:",
        selectedId,
        "en:",
        vehiculos
      );
    }
  };

  const handleRegistrarVehiculo = async () => {
    navigate("/Colaborador/Registrar-vehiculo");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Panel del Conductor</h1>
        <button
          style={{ ...styles.button, ...styles.dangerButton }}
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={styles.tabContainer}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "viajes" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("viajes")}
        >
          Crear Ruta de Viaje
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "viajes Activos" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("viajes Activos")}
        >
          Mis Viajes
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "vehiculos" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("vehiculos")}
        >
          Mis Vehículos
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "Registrar" ? styles.activeTab : {}),
          }}
          onClick={() => {
            handleRegistrarVehiculo();
            setActiveTab("Registrar");
          }}
        >
          Registrar Vehiculo
        </div>
      </div>

      {activeTab === "vehiculos" && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: "#2c3e50" }}>
            Gestión de Vehículos
          </h2>

          {loading ? (
            <div style={styles.loading}>Cargando vehículos...</div>
          ) : vehiculos.length > 0 ? (
            <div>
              <select
                style={styles.select}
                value={vehiculoActivo?.id || ""}
                onChange={handleVehiculoChange}
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marca} {v.modelo} - {v.placa}
                  </option>
                ))}
              </select>

              {vehiculoActivo && (
                <div style={styles.gridContainer}>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Marca</div>
                    <div style={styles.detailValue}>{vehiculoActivo.marca}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Modelo</div>
                    <div style={styles.detailValue}>
                      {vehiculoActivo.modelo}
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Placa</div>
                    <div style={styles.detailValue}>{vehiculoActivo.placa}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Color</div>
                    <div style={styles.detailValue}>{vehiculoActivo.color}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No tienes vehículos registrados</p>
              <button
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  marginTop: "16px",
                }}
                onClick={handleRegistrarVehiculo}
              >
                Registrar un vehículo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "viajes" && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: "#2c3e50" }}>
            Crear Nueva Ruta de Viaje
          </h2>

          {!showNuevaRutaForm ? (
            <>
              <button
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  marginBottom: "20px",
                }}
                onClick={() => setShowNuevaRutaForm(true)}
              >
                Crear Nueva Ruta
              </button>
            </>
          ) : (
            <div
              style={{
                maxHeight: "80vh",
                overflowY: "auto",
                padding: "0 15px",
                border: "1px solid #eee",
                borderRadius: "8px",
              }}
            >
              <CrearRutaViaje
                vehiculoActivo={vehiculoActivo}
                onRutaCreada={() => {
                  setShowNuevaRutaForm(false);
                  cargarDatos();
                }}
                onCancelar={() => setShowNuevaRutaForm(false)}
              />
            </div>
          )}
        </div>
      )}
      {activeTab === "viajes Activos" && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: "#2c3e50" }}>Mis Viajes Activos</h2>
        </div>
      )}
    </div>
  );
}
