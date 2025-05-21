import React, { useEffect, useState } from "react";
import { useNavigation } from "../../components/navigations";
import { useNavigate } from "react-router-dom";
import { QueryViaje } from "../../components/queryViaje";

/**
 * Driver Menu Dashboard Component
 *
 * @component
 * @name MenuConductor
 * @description Provides a comprehensive dashboard interface for drivers with:
 * - Navigation options for driver-specific features
 * - Trip management table showing available trips
 * - Authentication verification system
 * - Logout functionality
 *
 * @param {Function} onLogout - Callback function triggered when logout is requested
 *
 * @property {string} colorPrimario - Primary color from user's theme
 * @property {string} colorSecundario - Secondary color from user's theme
 * @property {Array} viajes - List of available trips for the driver
 *
 * @example
 * // Usage with logout handler
 * <MenuConductor onLogout={handleLogout} />
 *
 * @returns {React.Element} Returns a driver dashboard with:
 * - Navigation buttons for driver features
 * - Trip management table with available trips
 * - Session management controls
 */
export default function MenuConductor({ onLogout }) {
  const { goToHomePage, goToWaitForValid } = useNavigation();
  const navigate = useNavigate();
  const viajeQuery = React.useMemo(() => new QueryViaje(), []);
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [viajes, setViajes] = useState([]);

  /**
   * Effect hook for authentication verification and data loading
   * @effect
   * @name verifyAuthAndLoadData
   * @description Verifies JWT token, checks verification status,
   * loads user colors and available trips on component mount
   */
  useEffect(() => {
    const verifyAuth = async () => {
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

        setColorPrimario(decodedToken.colorPrimario || "#7e46d2");
        setColorSecundario(decodedToken.colorSecundario || "#f7ebff");
      } catch (error) {
        localStorage.removeItem("jwt_token");
        goToHomePage();
      }
    };

    /**
     * Fetches available trips for the driver
     * @async
     * @function fetchViajes
     */
    const fetchViajes = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          goToHomePage();
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const data = await viajeQuery.ObtenerViajeConductor(
          decodedToken.id,
          decodedToken.tipo
        );
        setViajes(data.result || []);
      } catch (error) {
        console.error("Error al cargar viajes disponibles:", error);
      }
    };

    verifyAuth();
    fetchViajes();
  }, [goToHomePage, goToWaitForValid, viajeQuery]);

  const handleRegistrarVehiculo = () => {
    navigate("/Colaborador/Registrar-vehiculo");
  };

  const handleMisViajes = () => {
    console.log(viajes);
  };

  return (
    <div
      style={{
        backgroundColor: colorSecundario,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: colorPrimario, marginBottom: "1rem" }}>
        Panel del Conductor
      </h2>

      {/* Management Navigation Buttons */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleMisViajes}
        >
          Mis Viajes
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleRegistrarVehiculo}
        >
          Registrar Vehículo
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Available Trips Table */}
      <div>
        <h3 style={{ color: colorPrimario }}>Viajes Disponibles</h3>
        <table style={tableStyle(colorPrimario)}>
          <thead>
            <tr>
              <TableHeader colorPrimario={colorPrimario}>Origen</TableHeader>
              <TableHeader colorPrimario={colorPrimario}>Destino</TableHeader>
              <TableHeader colorPrimario={colorPrimario}>Tipo</TableHeader>
              <TableHeader colorPrimario={colorPrimario}>
                Nombre
              </TableHeader>
              <TableHeader colorPrimario={colorPrimario}>
                Número Contacto
              </TableHeader>
              <TableHeader colorPrimario={colorPrimario}>Acciones</TableHeader>
            </tr>
          </thead>
          <tbody>
            {viajes.length > 0 ? (
              viajes.map((viaje, index) => (
                <TripRow
                  key={index}
                  viaje={viaje}
                  index={index}
                  colorPrimario={colorPrimario}
                  colorSecundario={colorSecundario}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No hay viajes disponibles
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
 * Style generator for table
 * @function tableStyle
 * @param {string} colorPrimario - Primary color for borders
 * @returns {Object} Table style object
 */
function tableStyle(colorPrimario) {
  return {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    border: `2px solid ${colorPrimario}`,
  };
}

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
    <th
      style={{
        textAlign: "center",
        padding: "0.5rem",
        backgroundColor: colorPrimario,
        color: "#fff",
      }}
    >
      {children}
    </th>
  );
}

/**
 * Trip table row component
 * @component
 * @name TripRow
 * @param {Object} props - Component props
 * @param {Object} props.viaje - Trip data object
 * @param {number} props.index - Row index
 * @param {string} props.colorPrimario - Primary color
 * @param {string} props.colorSecundario - Secondary color
 */
function TripRow({ viaje, index, colorPrimario, colorSecundario }) {
  /**
   * Handles accepting a trip
   * @function handleAcceptTrip
   */
  const handleAcceptTrip = () => {
    console.log("Trip accepted:", viaje._id);
    //funcion de aceptar viaje
  };

  return (

    <tr style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {viaje.punto_partida || "Ubicación no especificada"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {viaje.punto_destino || "Ubicación no especificada"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {viaje.tipo_viaje || "Sin tipo"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {viaje.nombre_usuario ? `${viaje.nombre_usuario}` : "N/A"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {viaje.contacto_usuario || "N/A"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        <button
          style={{
            backgroundColor: colorPrimario,
            color: colorSecundario,
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleAcceptTrip}
        >
          Aceptar Viaje
        </button>
      </td>
    </tr>
  );
}
