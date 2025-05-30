import React, { useEffect, useState, useMemo } from "react";
import { QueryVehicle } from "../../../components/queryVehiculo";
import { QueryConductor } from "../../../components/queryConductor";
import { useNavigation as useCustomNavigation } from "../../../components/navigations";
import { useNavigate } from "react-router-dom";

export default function GestionVehiculos() {
  const vehiculoQuery = useMemo(() => new QueryVehicle(), []);
  const conductorQuery = useMemo(() => new QueryConductor(), []);
  const { goToHomePage } = useCustomNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoExpandido, setVehiculoExpandido] = useState(null);
  const [documentosVehiculos, setDocumentosVehiculos] = useState({});
  const [conductores, setConductores] = useState({});
  const navigate = useNavigate();

  // Funciones de navegación
  const handleGestionUsuarios = async () => {
    navigate("/Colaborador/Menu");
  };

  const handleGestionConductores = async () => {
    navigate("/Colaborador/Gestion-conductores");
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          goToHomePage();
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setColorPrimario(decodedToken.colorPrimario || "#2c3e50");
        setColorSecundario(decodedToken.colorSecundario || "#ecf0f1");

        const vehiculosData = await vehiculoQuery.obtenerVehiculos(decodedToken.id);
        const docsVehiculos = {};
        const conductoresMap = {};

        for (const vehiculo of vehiculosData) {
          try {
            const docsVehiculo = vehiculo.documentosVehiculo;
            docsVehiculos[vehiculo.id] = docsVehiculo;
            const conductor = {
              nombre: vehiculo.conductornombre,
              correo: vehiculo.conductorcorreo,
              celular: vehiculo.conductorcelular,
            };
            conductoresMap[vehiculo.id] = conductor;
          } catch (error) {
            console.error(
              `Error obteniendo datos para vehículo ${vehiculo.id}:`,
              error
            );
          }
        }

        setVehiculos(vehiculosData || []);
        setDocumentosVehiculos(docsVehiculos);
        setConductores(conductoresMap);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setVehiculos([]);
        setDocumentosVehiculos({});
        setConductores({});
      }
    };

    fetchData();
  }, [goToHomePage, vehiculoQuery, conductorQuery]);

  // Función para cambiar estado de verificación
  const handleEstadoClick = async (vehiculoId, estadoActual, e) => {
    e.stopPropagation();
    try {
      await vehiculoQuery.cambiarEstadoVerificacion(vehiculoId, !estadoActual);
      setVehiculos(
        vehiculos.map((vehiculo) =>
          vehiculo.id === vehiculoId
            ? { ...vehiculo, estadoverificacion: !estadoActual }
            : vehiculo
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  // Función para descargar documentos
  const descargarDocumento = async (documento, nombreArchivo) => {
    try {
      // Verificar si el documento es un buffer de Node.js (en caso de SSR)
      const docData = documento.data
        ? new Uint8Array(documento.data)
        : documento;

      // Crear el Blob con el tipo MIME correcto
      const blob = new Blob([docData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Crear enlace para descarga
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo || `documento_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Limpiar
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error al descargar documento:", error);
      alert("Error al descargar el documento. Por favor intente nuevamente.");
    }
  };

  // Función para renderizar filas expandibles
  const renderVehiculoRow = (vehiculo, index) => {
    const isExpanded = vehiculoExpandido === vehiculo.id;
    const documentos = documentosVehiculos[vehiculo.id] || [];
    const conductor = conductores[vehiculo.id] || null;

    return (
      <React.Fragment key={vehiculo.id || `vehiculo-${index}`}>
        {/* Fila principal - clickable */}
        <tr
          style={{
            backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2",
            cursor: "pointer",
          }}
          onClick={() => setVehiculoExpandido(isExpanded ? null : vehiculo.id)}
        >
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
            {conductor?.nombre || "Sin conductor"}
          </td>
          <td
            style={{
              textAlign: "center",
              padding: "0.5rem",
              cursor: "pointer",
            }}
            onClick={(e) =>
              handleEstadoClick(vehiculo.id, vehiculo.estadoverificacion, e)
            }
          >
            {vehiculo.estadoverificacion ? (
              <span style={{ color: "green" }}>Verificado</span>
            ) : (
              <span style={{ color: "orange" }}>Pendiente</span>
            )}
          </td>
        </tr>

        {/* Fila expandida con detalles */}
        {isExpanded && (
          <tr>
            <td
              colSpan="6"
              style={{ padding: "1rem", backgroundColor: "#f8f9fa" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Sección de información del vehículo */}
                <div>
                  <h4 style={{ color: colorPrimario, marginBottom: "0.5rem" }}>
                    Detalles del Vehículo
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong>Color:</strong> {vehiculo.color}
                    </div>
                    <div>
                      <strong>Vencimiento SOAT:</strong>{" "}
                      {new Date(vehiculo.vencimientosoat).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Vencimiento Tecnomecánica:</strong>{" "}
                      {new Date(
                        vehiculo.vencimientotecnomecanica
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Sección de documentos */}
                <div>
                  <h4 style={{ color: colorPrimario, marginBottom: "0.5rem" }}>
                    Documentos del Vehículo
                  </h4>
                  <div
                    style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                  >
                    {documentos.length > 0 ? (
                      documentos.map((doc, docIndex) => (
                        <div
                          key={`doc-${docIndex}`}
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <span>{doc.tipo_documento}</span>
                          <button
                            style={{
                              marginTop: "0.5rem",
                              padding: "0.3rem 0.6rem",
                              backgroundColor: colorPrimario,
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              descargarDocumento(
                                doc.documento,
                                `${doc.tipo_documento}_${vehiculo.id}.pdf`
                              );
                            }}
                          >
                            Descargar
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No hay documentos disponibles</p>
                    )}
                  </div>
                </div>

                {/* Sección del conductor */}
                {conductor && (
                  <div>
                    <h4
                      style={{ color: colorPrimario, marginBottom: "0.5rem" }}
                    >
                      Información del Conductor
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <strong>Nombre:</strong> {conductor.nombre}
                      </div>
                      <div>
                        <strong>Correo:</strong> {conductor.correo}
                      </div>
                      <div>
                        <strong>Celular:</strong> {conductor.celular}
                      </div>
                      <div>
                        <strong>Estado:</strong>
                        <span style={{ color: "green", marginLeft: "0.5rem" }}>
                          Verificado
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  // ... (mantener las funciones buttonStyle, tableStyle, TableHeader y handleLogout iguales)

  return (
    <div
      style={{
        backgroundColor: colorSecundario,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: colorPrimario, marginBottom: "1rem" }}>
        Administración de Vehículos
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
          onClick={() => navigate("/Colaborador/Gestion-reportes")}
        >
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
              {[
                "Marca",
                "Modelo",
                "Placa",
                "Categoría",
                "Conductor",
                "Estado",
              ].map((header) => (
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
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
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
