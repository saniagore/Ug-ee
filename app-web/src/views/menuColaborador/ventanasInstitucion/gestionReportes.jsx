import React, { useEffect, useState, useMemo } from "react";
import { QueryReporte } from "../../../components/queryReporte";
import { useNavigation as useCustomNavigation } from "../../../components/navigations";
import { useNavigate } from "react-router-dom";

export default function GestionReportes() {
  const reporteQuery = useMemo(() => new QueryReporte(), []);
  const { goToHomePage } = useCustomNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [reportes, setReportes] = useState([]);
  const [reporteExpandido, setReporteExpandido] = useState(null);
  const [filtro, setFiltro] = useState("todos"); // 'todos', 'tecnicos', 'seguridad', 'comportamiento'
  const navigate = useNavigate();

  // Funciones de navegación
  const handleGestionUsuarios = async () => {
    navigate("/Colaborador/Menu");
  };

  const handleGestionConductores = async () => {
    navigate("/Colaborador/Gestion-conductores");
  };

  const handleGestionVehiculos = async () => {
    navigate("/Colaborador/Gestion-vehiculos");
  };

  const handleLogout = async () => {
    try {
      const logoutEndpoint = "http://localhost:5000/api/institucion/logout";

      await fetch(logoutEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      goToHomePage();
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_type");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Efecto para cargar datos
  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          goToHomePage();
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setColorPrimario(decodedToken.colorPrimario || "#2c3e50");
        setColorSecundario(decodedToken.colorSecundario || "#ecf0f1");

        // Obtener reportes de la institución
        const reportesData = await reporteQuery.obtenerReportes(decodedToken.id);
        console.log(reportesData);
        setReportes(reportesData || []);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
        setReportes([]);
      }
    };

    verifyAndFetch();
  }, [goToHomePage, reporteQuery]);

  // Filtrar reportes según el tipo seleccionado
  const reportesFiltrados = reportes.filter((reporte) => {
    if (filtro === "todos") return true;
    return reporte.tipo === filtro;
  });

  // Función para renderizar filas expandibles
  const renderReporteRow = (reporte, index) => {
    const isExpanded = reporteExpandido === reporte.id;
    const fechaReporte = new Date(reporte.fechasalida).toLocaleString();

    return (
      <React.Fragment key={reporte.id || `reporte-${index}`}>
        {/* Fila principal - clickable */}
        <tr
          style={{
            backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2",
            cursor: "pointer",
          }}
          onClick={() => setReporteExpandido(isExpanded ? null : reporte.id)}
        >
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {fechaReporte}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {reporte.conductornombre || "Sin nombre"}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {reporte.celular}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            <TipoBadge tipo={reporte.tipo} colorPrimario={colorPrimario} />
          </td>
        </tr>

        {/* Fila expandida con detalles */}
        {isExpanded && (
          <tr>
            <td
              colSpan="4"
              style={{ padding: "1rem", backgroundColor: "#f8f9fa" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Sección de información del reporte */}
                <div>
                  <h4 style={{ color: colorPrimario, marginBottom: "0.5rem" }}>
                    Detalles del Reporte
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong>Conductor:</strong> {reporte.conductorNombre}
                    </div>
                    <div>
                      <strong>Contacto:</strong> {reporte.celular} - {reporte.correo}
                    </div>
                    <div>
                      <strong>Tipo:</strong> <TipoBadge tipo={reporte.tipo} colorPrimario={colorPrimario} />
                    </div>
                    <div>
                      <strong>Fecha:</strong> {new Date(reporte.fechasalida).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Sección de descripción */}
                <div>
                  <h4 style={{ color: colorPrimario, marginBottom: "0.5rem" }}>
                    Descripción
                  </h4>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: "1rem",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                    }}
                  >
                    {reporte.descripcion || "No hay descripción disponible"}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
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
        Gestión de Reportes
      </h2>

      {/* Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleGestionUsuarios}
        >
          Gestión de Usuarios
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleGestionConductores}
        >
          Gestión de Conductores
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleGestionVehiculos}
        >
          Gestión de Vehículos
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", color: colorPrimario }}>Filtrar por tipo:</span>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: `1px solid ${colorPrimario}`,
          }}
        >
          <option value="todos">Todos los reportes</option>
          <option value="tecnicos">Problemas técnicos</option>
          <option value="seguridad">Incidentes de seguridad</option>
          <option value="comportamiento">Comportamiento inadecuado</option>
        </select>
      </div>

      {/* Reportes Table */}
      <div>
        <h3 style={{ color: colorPrimario }}>Reportes Registrados</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "Fecha",
                "Conductor",
                "Celular",
                "Tipo",
              ].map((header) => (
                <TableHeader key={header} colorPrimario={colorPrimario}>
                  {header}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportesFiltrados.length > 0 ? (
              reportesFiltrados.map(renderReporteRow)
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No hay reportes registrados
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
 * Componente para mostrar el tipo de reporte con un badge de color
 */
function TipoBadge({ tipo, colorPrimario }) {
  const tipoTexto = {
    tecnicos: "Problema técnico",
    seguridad: "Incidente de seguridad",
    comportamiento: "Comportamiento inadecuado"
  }[tipo] || tipo;

  return (
    <span
      style={{
        backgroundColor: colorPrimario,
        color: "#fff",
        padding: "0.3rem 0.6rem",
        borderRadius: "20px",
        fontSize: "0.8rem",
      }}
    >
      {tipoTexto}
    </span>
  );
}

/**
 * Style generator for buttons
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
 */
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
};

/**
 * Table header component
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