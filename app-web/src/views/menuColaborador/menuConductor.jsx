import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QueryViaje } from "../../components/queryViaje";
import { QueryVehicle } from "../../components/queryVehiculo";

export default function MenuConductor({ onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoActivo, setVehiculoActivo] = useState(null);
  const [activeTab, setActiveTab] = useState("viajes");

  // Obtener datos del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (!decoded.estadoVerificacion) {
        navigate("/espera-verificacion");
        return;
      }
      setUserData(decoded);
    } catch (error) {
      localStorage.removeItem("jwt_token");
      navigate("/");
    }
  }, [navigate]);

  // Cargar datos del conductor
  const cargarDatos = useCallback(async () => {
    if (!userData) return;

    setLoading(true);
    try {
      const viajeQuery = new QueryViaje();
      const vehiculoQuery = new QueryVehicle();

      const [viajesRes, vehiculosRes] = await Promise.all([
        viajeQuery.ObtenerViajeConductor(userData.id, userData.tipo),
        vehiculoQuery.obtenerVehiculosPorConductor(userData.id)
      ]);
      setViajes(viajesRes?.result || []);
      setVehiculos(vehiculosRes || []);

      const savedVehicle = localStorage.getItem('vehiculoActivo');
      const initialVehicle = savedVehicle 
        ? JSON.parse(savedVehicle)
        : vehiculosRes?.[0] || null;
      
      setVehiculoActivo(initialVehicle);
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
    const selected = vehiculos.find(v => v.id === e.target.value);
    if (selected) {
      setVehiculoActivo(selected);
      localStorage.setItem('vehiculoActivo', JSON.stringify(selected));
    }
  };

  const handleAceptarViaje = async (viajeId) => {
    if (!vehiculoActivo) {
      alert("Selecciona un vehículo primero");
      return;
    }

    try {
      const viajeQuery = new QueryViaje();
      await viajeQuery.aceptarViaje(viajeId, vehiculoActivo.id);
      alert("Viaje aceptado correctamente");
      cargarDatos();
    } catch (error) {
      alert("Error al aceptar el viaje");
      console.error(error);
    }
  };

  const handleRegistrarVehiculo = () => {
    navigate("/Colaborador/Registrar-vehiculo");
  };

  // Estilos CSS en objeto
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      borderBottom: "1px solid #eaeaea",
      paddingBottom: "16px"
    },
    title: {
      color: "#2c3e50",
      margin: "0",
      fontSize: "28px"
    },
    card: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      padding: "20px",
      marginBottom: "20px"
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.3s ease"
    },
    primaryButton: {
      background: "#3498db",
      color: "white",
      "&:hover": {
        background: "#2980b9"
      }
    },
    dangerButton: {
      background: "#e74c3c",
      color: "white",
      "&:hover": {
        background: "#c0392b"
      }
    },
    secondaryButton: {
      background: "#ecf0f1",
      color: "#2c3e50",
      "&:hover": {
        background: "#bdc3c7"
      }
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "16px"
    },
    tableHeader: {
      background: "#3498db",
      color: "white",
      padding: "12px",
      textAlign: "left",
      fontWeight: "500"
    },
    tableCell: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "1px solid #ecf0f1"
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #bdc3c7",
      marginBottom: "16px",
      fontSize: "14px"
    },
    tabContainer: {
      display: "flex",
      marginBottom: "20px",
      borderBottom: "1px solid #bdc3c7"
    },
    tab: {
      padding: "10px 20px",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      fontWeight: "500",
      color: "#7f8c8d",
      transition: "all 0.3s ease"
    },
    activeTab: {
      color: "#3498db",
      borderBottom: "3px solid #3498db"
    },
    loading: {
      textAlign: "center",
      padding: "20px",
      color: "#7f8c8d"
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#7f8c8d",
      fontSize: "16px"
    },
    detailItem: {
      background: "#f8f9fa",
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "8px"
    },
    detailLabel: {
      fontSize: "12px",
      color: "#7f8c8d",
      marginBottom: "4px"
    },
    detailValue: {
      fontWeight: "500",
      color: "#2c3e50"
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "16px",
      marginTop: "16px"
    }
  };

  // Aplicar estilos dinámicos para hover
  const buttonHover = {
    ...styles.button,
    ...styles.primaryButton,
    "&:hover": {
      backgroundColor: "#2980b9"
    }
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
          style={{ ...styles.tab, ...(activeTab === 'viajes' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('viajes')}
        >
          Viajes Disponibles
        </div>
        <div 
          style={{ ...styles.tab, ...(activeTab === 'vehiculos' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('vehiculos')}
        >
          Mis Vehículos
        </div>
      </div>

      {activeTab === 'vehiculos' && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: "#2c3e50" }}>Gestión de Vehículos</h2>
          
          {loading ? (
            <div style={styles.loading}>Cargando vehículos...</div>
          ) : vehiculos.length > 0 ? (
            <div>
              <select
                style={styles.select}
                value={vehiculoActivo?.id || ''}
                onChange={handleVehiculoChange}
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map(v => (
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
                    <div style={styles.detailValue}>{vehiculoActivo.modelo}</div>
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
                style={{ ...styles.button, ...styles.primaryButton, marginTop: "16px" }}
                onClick={handleRegistrarVehiculo}
              >
                Registrar un vehículo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'viajes' && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: "#2c3e50" }}>Viajes Disponibles</h2>
          
          {loading ? (
            <div style={styles.loading}>Cargando viajes...</div>
          ) : !vehiculoActivo ? (
            <div style={styles.emptyState}>
              <p>Selecciona un vehículo en la pestaña "Mis Vehículos" para ver los viajes disponibles</p>
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
                {viajes.map(viaje => (
                  <tr key={viaje.viaje_id} style={{ backgroundColor: viajes.indexOf(viaje) % 2 === 0 ? "#fff" : "#f8f9fa" }}>
                    <td style={styles.tableCell}>{viaje.punto_partida || 'No especificado'}</td>
                    <td style={styles.tableCell}>{viaje.punto_destino || 'No especificado'}</td>
                    <td style={styles.tableCell}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: viaje.tipo_viaje === 'Urgente' ? '#e74c3c' : '#3498db',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {viaje.tipo_viaje || 'Regular'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{viaje.nombre_usuario || 'N/A'}</div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {viaje.contacto_usuario || 'Sin contacto'}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        style={{ ...styles.button, ...styles.primaryButton }}
                        onClick={() => handleAceptarViaje(viaje.id)}
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