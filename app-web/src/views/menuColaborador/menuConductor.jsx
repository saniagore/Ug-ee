import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QueryViaje } from "../../components/queryViaje";
import { QueryVehicle } from "../../components/queryVehiculo";
import { styles } from "../../css/menuConductor";

export default function MenuConductor({ onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoActivo, setVehiculoActivo] = useState(null);
  const [activeTab, setActiveTab] = useState("viajes");

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (!decoded.estadoVerificacion) {
        navigate("/WaitForValid");
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
      const viajeQuery = new QueryViaje();
      const vehiculoQuery = new QueryVehicle();

      const [viajesRes, vehiculosRes] = await Promise.all([
        viajeQuery.ObtenerViajeConductor(userData.id, userData.tipo),
        vehiculoQuery.obtenerVehiculosPorConductor(userData.id),
      ]);
      setViajes(viajesRes?.result || []);
      setVehiculos(vehiculosRes || []);

      setVehiculoActivo('');

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

  const handleAceptarViaje = async (viajeId) => {
    if (!vehiculoActivo) {
      alert("Selecciona un vehículo primero");
      return;
    }
    const  viajeQuery = new QueryViaje();

    viajeQuery.aceptarViaje(viajeId,vehiculoActivo.id);
  };

  const handleRegistrarVehiculo = () => {
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
          Viajes Disponibles
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
            navigate('/Colaborador/Registrar-vehiculo');
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
          <h2 style={{ marginTop: 0, color: "#2c3e50" }}>Viajes Disponibles</h2>

          {loading ? (
            <div style={styles.loading}>Cargando viajes...</div>
          ) : !vehiculoActivo ? (
            <div style={styles.emptyState}>
              <p>
                Selecciona un vehículo en la pestaña "Mis Vehículos" para ver
                los viajes disponibles
              </p>
            </div>
          ) : viajes.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No hay viajes disponibles en este momento</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Origen</th>
                  <th style={styles.tableHeader}>Destino</th>
                  <th style={styles.tableHeader}>Tipo</th>
                  <th style={styles.tableHeader}>Pasajero</th>
                  <th style={styles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {viajes.map((viaje) => (
                  <tr
                    key={viaje.viaje_id}
                    style={{
                      backgroundColor:
                        viajes.indexOf(viaje) % 2 === 0 ? "#fff" : "#f8f9fa",
                    }}
                  >
                    <td style={styles.tableCell}>
                      {viaje.punto_partida || "No especificado"}
                    </td>
                    <td style={styles.tableCell}>
                      {viaje.punto_destino || "No especificado"}
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background:
                            viaje.tipo_viaje === "Urgente"
                              ? "#e74c3c"
                              : "#7e46d2",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {viaje.tipo_viaje || "Regular"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {viaje.nombre_usuario || "N/A"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                          {viaje.contacto_usuario || "Sin contacto"}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        style={{ ...styles.button, ...styles.primaryButton }}
                        onClick={() => handleAceptarViaje(viaje.viaje_id)}
                      >
                        Aceptar Viaje
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
