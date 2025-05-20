import React, { useEffect, useState, useMemo } from "react";
import { QueryVehicle } from "../../../components/queryVehiculo";
import { useNavigation as useCustomNavigation } from "../../../components/navigations"; 
import { useNavigate } from "react-router-dom"; 

/**
 * Vehicle Management Dashboard Component
 * 
 * @component
 * @name GestionVehiculos
 * @description Provides an administrative interface for managing vehicles,
 * including verification status updates and detailed vehicle information display.
 * 
 * @property {Object} vehiculoQuery - Instance of QueryVehicle for vehicle-related API calls
 * @property {string} colorPrimario - Primary color from institution's theme
 * @property {string} colorSecundario - Secondary color from institution's theme
 * @property {Array} vehiculos - List of vehicles with their associated drivers
 * 
 * @example
 * // Usage in router configuration
 * <Route path='/Colaborador/Gestion-vehiculos' element={<GestionVehiculos />} />
 * 
 * @returns {React.Element} Returns a management dashboard with:
 * - Navigation controls for different management sections
 * - Comprehensive table of vehicles and their details
 * - Interactive status toggles for vehicle verification
 * - Institution-branded color scheme
 */
export default function GestionVehiculos() {
  const vehiculoQuery = useMemo(() => new QueryVehicle(), []);
  const { goToHomePage, goToWaitForValid } = useCustomNavigation(); 
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate(); 

  /**
   * Handles navigation to user management section
   * @function handleGestionUsuarios
   */
  const handleGestionUsuarios = async () => {
    navigate('/Colaborador/Menu'); 
  }

  /**
   * Handles navigation to driver management section
   * @function handleGestionConductores
   */
  const handleGestionConductores = async () => {
    navigate('/Colaborador/Gestion-conductores'); 
  }

  /**
   * Effect hook for authentication verification and data loading
   * @effect
   * @name verifyAndFetch
   * @description Verifies JWT token, checks verification status,
   * loads institution colors and vehicle list on component mount
   */
  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          goToHomePage();
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));

        if (!decodedToken.estadoVerificacion) {
          goToWaitForValid();
          return;
        }

        setColorPrimario(decodedToken.colorPrimario || "#2c3e50");
        setColorSecundario(decodedToken.colorSecundario || "#ecf0f1");
      } catch (error) {
        console.error("Error al verificar o cargar datos:", error);
        localStorage.removeItem("jwt_token");
        goToHomePage();
      }
    };

    /**
     * Fetches vehicles associated with the institution
     * @async
     * @function fetchVehiculos
     */
    const fetchVehiculos = async () => {
      try {
        const data = await vehiculoQuery.obtenerVehiculos();

        setVehiculos(data || []);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
        setVehiculos([]);
      }
    };

    verifyAndFetch();
    fetchVehiculos();
  }, [goToHomePage, goToWaitForValid, vehiculoQuery]);

  /**
   * Handles vehicle verification status updates
   * @async
   * @function handleEstadoClick
   * @param {string} vehiculoId - Unique identifier for the vehicle
   * @param {boolean} estadoActual - Current verification status
   */
  const handleEstadoClick = async (vehiculoId, estadoActual) => {
    try {
      await vehiculoQuery.cambiarEstadoVerificacion(vehiculoId, !estadoActual);
      setVehiculos(vehiculos.map(vehiculo =>
        vehiculo.id === vehiculoId
          ? { ...vehiculo, estado_verificacion: !estadoActual }
          : vehiculo
      ));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  /**
   * Handles institution logout process
   * @async
   * @function handleLogout
   */
  const handleLogout = async () => {
    try {
      const logoutEndpoint = 'http://localhost:5000/api/institucion/logout';

      await fetch(logoutEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });
      goToHomePage();
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_type");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  /**
   * Renders a vehicle row with associated driver information
   * @function renderVehiculoRow
   * @param {Object} vehiculo - Vehicle data object
   * @param {number} index - Row index for alternating colors
   * @returns {React.Element} Table row for the vehicle
   */
  const renderVehiculoRow = (vehiculo, index) => {
    return (
      <tr key={vehiculo.id || `vehiculo-${index}`} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
        <td style={{ textAlign: "center", padding: "0.5rem" }}>
          {vehiculo.marca || "Sin marca"}
        </td>
        <td style={{ textAlign: "center", padding: "0.5rem" }}>
          {vehiculo.modelo || "Sin modelo"}
        </td>
        <td style={{ textAlign: "center", padding: "0.5rem" }}>
          {vehiculo.placa || "Sin placa"}
        </td>
        <td style={{ textAlign: "center", padding: "0.5rem" }}>
          {vehiculo.categoria || "Sin categoría"}
        </td>
        <td style={{ textAlign: "center", padding: "0.5rem" }}>
          {vehiculo.conductor_nombre ? vehiculo.conductor_nombre : "Sin conductor asignado"}
        </td>
        <td
          style={{ 
            textAlign: "center", 
            padding: "0.5rem",
            cursor: "pointer"
          }}
          onClick={() => handleEstadoClick(vehiculo.id, vehiculo.estado_verificacion)}
        >
          {vehiculo.estado_verificacion ? (
            <span style={{ color: "green" }}>Verificado</span>
          ) : (
            <span style={{ color: "orange" }}>Pendiente</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div style={{ backgroundColor: colorSecundario, minHeight: "100vh", padding: "2rem" }}>
      <h2 style={{ color: colorPrimario, marginBottom: "1rem" }}>
        Administración de Vehículos
      </h2>

      {/* Management Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleGestionUsuarios}>
          Gestión de Usuarios
        </button>
        <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleGestionConductores}>
          Gestión de Conductores
        </button>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Reportes
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Vehicles Table */}
      <div>
        <h3 style={{ color: colorPrimario }}>Vehículos Registrados</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              {["Marca", "Modelo", "Placa", "Categoría", "Conductor", "Estado"].map((header) => (
                <TableHeader key={header} colorPrimario={colorPrimario}>
                  {header}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehiculos.length > 0 ? (
              vehiculos.map(renderVehiculoRow)
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                  No hay vehículos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Style generator for buttons
 * @function buttonStyle
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 * @returns {Object} Button style object
 */
function buttonStyle(bgColor, textColor) {
  return {
    backgroundColor: bgColor,
    color: textColor,
    border: "none",
    padding: "0.8rem 1.5rem",
    marginRight: "1rem",
    marginBottom: "1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  };
}

/**
 * Table style configuration
 * @constant
 * @name tableStyle
 * @type {Object}
 */
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
};

/**
 * Table header component
 * @component
 * @name TableHeader
 * @param {Object} props - Component props
 * @param {string} props.colorPrimario - Header background color
 * @param {React.Node} props.children - Header content
 */
function TableHeader({ colorPrimario, children }) {
  return (
    <th style={{
      textAlign: "center",
      padding: "0.5rem",
      backgroundColor: colorPrimario,
      color: "#fff",
    }}>
      {children}
    </th>
  );
}