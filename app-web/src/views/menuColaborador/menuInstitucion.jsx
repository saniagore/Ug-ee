import React, { useEffect, useState } from "react";
import { QueryUser } from "../../components/queryUser";
import { useNavigation } from "../../components/navigations";
import { useNavigate } from "react-router-dom";

/**
 * Institution Menu Dashboard Component
 *
 * @component
 * @name MenuInstitucion
 * @description Provides an administrative dashboard for institutions to manage their users,
 * with functionality for user verification status updates and navigation to management sections.
 *
 * @param {Function} onLogout - Callback function for handling logout action
 *
 * @property {string} colorPrimario - Primary color from institution's theme
 * @property {string} colorSecundario - Secondary color from institution's theme
 * @property {Array} usuarios - List of users associated with the institution
 *
 * @example
 * // Usage with logout handler
 * <MenuInstitucion onLogout={handleLogout} />
 *
 * @returns {React.Element} Returns an institution dashboard with:
 * - Navigation buttons for different management sections
 * - User verification table with interactive controls
 * - Institution-branded color scheme
 */
export default function MenuInstitucion({ onLogout }) {
  const navigate = useNavigate();
  const userQuery = React.useMemo(() => new QueryUser(), []);
  const { goToHomePage, goToWaitForValid } = useNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [usuarios, setUsuarios] = useState([]);

  /**
   * Effect hook for authentication verification and data loading
   * @effect
   * @name verifyAuthAndLoadData
   * @description Verifies JWT token, checks verification status,
   * loads institution colors and user list on component mount
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

        setColorPrimario(decodedToken.colorPrimario || "#2c3e50");
        setColorSecundario(decodedToken.colorSecundario || "#ecf0f1");
      } catch (error) {
        localStorage.removeItem("jwt_token");
        goToHomePage();
      }
    };

    /**
     * Fetches users associated with the institution
     * @async
     * @function fetchUsuarios
     */
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          goToHomePage();
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const data = await userQuery.obtenerUsuarios(decodedToken.id);
        setUsuarios(data || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    verifyAuth();
    fetchUsuarios();
  }, [goToHomePage, goToWaitForValid, userQuery]);

  /**
   * Handles user verification status updates
   * @async
   * @function handleEstadoClick
   * @param {string} celular - User's phone number (unique identifier)
   * @param {boolean} estadoActual - Current verification status
   */
  const handleEstadoClick = async (celular, estadoActual) => {
    try {
      await userQuery.actualizarEstado(celular, !estadoActual);
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.celular === celular
            ? { ...usuario, estado_verificacion: !estadoActual }
            : usuario
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  /**
   * Navigates to driver management section
   * @function handleGestionConductores
   */
  const handleGestionConductores = async () => {
    navigate("/Colaborador/Gestion-conductores");
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
        Panel de la Institución
      </h2>

      {/* Management Navigation Buttons */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleGestionConductores}
        >
          Gestión de Conductores
        </button>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Gestión de Vehiculos
        </button>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Reportes
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* User Verification Table */}
      <div>
        <h3 style={{ color: colorPrimario }}>Usuarios Registrados</h3>
        <table style={tableStyle(colorPrimario)}>
          <thead>
            <tr>
              <TableHeader colorPrimario={colorPrimario}>Nombre</TableHeader>
              <TableHeader colorPrimario={colorPrimario}>Correo</TableHeader>
              <TableHeader colorPrimario={colorPrimario}>Celular</TableHeader>
              <TableHeader colorPrimario={colorPrimario}>
                N° Identificación
              </TableHeader>
              <TableHeader colorPrimario={colorPrimario}>
                Estado Verificación
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario, index) => (
                <UserRow
                  key={index}
                  usuario={usuario}
                  index={index}
                  colorPrimario={colorPrimario}
                  colorSecundario={colorSecundario}
                  handleEstadoClick={handleEstadoClick}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No hay usuarios registrados
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
 * User table row component
 * @component
 * @name UserRow
 * @param {Object} props - Component props
 * @param {Object} props.usuario - User data object
 * @param {number} props.index - Row index
 * @param {string} props.colorPrimario - Primary color
 * @param {string} props.colorSecundario - Secondary color
 * @param {Function} props.handleEstadoClick - Verification handler
 */
function UserRow({
  usuario,
  index,
  colorPrimario,
  colorSecundario,
  handleEstadoClick,
}) {
  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {usuario.nombre || "Sin nombre"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {usuario.correo || "Sin correo"}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {usuario.celular}
      </td>
      <td style={{ textAlign: "center", padding: "0.5rem" }}>
        {usuario.numero_identificacion || "Sin número"}
      </td>
      <VerificationCell
        usuario={usuario}
        colorPrimario={colorPrimario}
        colorSecundario={colorSecundario}
        handleEstadoClick={handleEstadoClick}
      />
    </tr>
  );
}

/**
 * Verification status cell component
 * @component
 * @name VerificationCell
 * @param {Object} props - Component props
 * @param {Object} props.usuario - User data object
 * @param {string} props.colorPrimario - Primary color
 * @param {string} props.colorSecundario - Secondary color
 * @param {Function} props.handleEstadoClick - Verification handler
 */
function VerificationCell({ usuario, colorPrimario, colorSecundario, handleEstadoClick }) {
  return (
    <td 
      style={{ 
        textAlign: "center", 
        padding: "0.5rem",
        cursor: "pointer"
      }}
      onClick={() => handleEstadoClick(usuario.celular, usuario.estado_verificacion)}
    >
      {usuario.estado_verificacion ? (
        <span style={{ color: "green" }}>Verificado</span>
      ) : (
        <span style={{ color: "orange" }}>Pendiente</span>
      )}
    </td>
  );
}
