import React, { useEffect, useState, useMemo } from "react";
import { QueryConductor } from "../../../components/queryConductor";
import { useNavigation as useCustomNavigation } from "../../../components/navigations";
import { useNavigate } from "react-router-dom";

export default function AdministrarConductores() {
  const conductorQuery = useMemo(() => new QueryConductor(), []);
  const { goToHomePage, goToWaitForValid } = useCustomNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [conductores, setConductores] = useState([]);
  const [conductorExpandido, setConductorExpandido] = useState(null);
  const [documentosConductores, setDocumentosConductores] = useState({});
  const navigate = useNavigate();

  const handleGestionVehiculos = async () => {
    navigate("/Colaborador/Gestion-vehiculos");
  };
  const handleGestionUsuarios = async () => {
    navigate("/Colaborador/Menu");
  };

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

    const fetchConductores = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const data = await conductorQuery.obtenerTodosConductores(
          decodedToken.id
        );
        
        const docsConductores = {};
        for (const conductor of data) {
          if (conductor.documentos) {
            docsConductores[conductor.id] = conductor.documentos;
          }
        }
        
        setConductores(data || []);
        console.log(data);
        setDocumentosConductores(docsConductores);
      } catch (error) {
        console.error("Error al obtener conductores:", error);
        setConductores([]);
        setDocumentosConductores({});
      }
    };

    verifyAndFetch();
    fetchConductores();
  }, [goToHomePage, goToWaitForValid, conductorQuery]);

  const handleEstadoClick = async (conductorId, estadoActual, e) => {
    e.stopPropagation();
    try {
      await conductorQuery.actualizarEstadoConductor(
        conductorId,
        !estadoActual
      );
      setConductores(
        conductores.map((conductor) =>
          conductor.id === conductorId
            ? { ...conductor, estadoverificacion: !estadoActual }
            : conductor
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
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

  const descargarDocumento = async (documento, nombreArchivo) => {
    try {
      const docData = documento.data 
        ? new Uint8Array(documento.data) 
        : documento;

      const blob = new Blob([docData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo || `documento_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error al descargar documento:", error);
      alert("Error al descargar el documento. Por favor intente nuevamente.");
    }
  };

  const renderConductorRow = (conductor, index) => {
    const isExpanded = conductorExpandido === conductor.id;
    const documentos = documentosConductores[conductor.id] || [];
    const hasVehicles = conductor.vehiculos?.length > 0;

    return (
      <React.Fragment key={conductor.id || `conductor-${index}`}>
        {/* Main driver row - clickable */}
        <tr
          style={{
            backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2",
            cursor: "pointer",
          }}
          onClick={() => setConductorExpandido(isExpanded ? null : conductor.id)}
        >
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {conductor.nombre || "Sin nombre"}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {conductor.correo || "Sin correo"}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {conductor.celular}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {conductor.direccion || "Sin dirección"}
          </td>
          <td
            style={{
              textAlign: "center",
              padding: "0.5rem",
              cursor: "pointer",
            }}
            onClick={(e) => handleEstadoClick(conductor.id, conductor.estadoverificacion, e)}
          >
            {conductor.estadoverificacion ? (
              <span style={{ color: "green" }}>Verificado</span>
            ) : (
              <span style={{ color: "orange" }}>Pendiente</span>
            )}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {conductor.vehiculos?.length || 0}
          </td>
        </tr>

        {/* Expanded row with details */}
        {isExpanded && (
          <tr>
            <td colSpan="6" style={{ padding: "1rem", backgroundColor: "#f8f9fa" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Documentos section */}
                <div>
                  <h4 style={{ color: colorPrimario, marginBottom: "0.5rem" }}>
                    Documentos del Conductor
                  </h4>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
                                `${doc.tipo_documento}_${conductor.id}.pdf`
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

                {/* Vehicles section */}
                {hasVehicles && (
                  <div>
                    <h4 style={{ color: colorPrimario, marginBottom: "0.5rem" }}>
                      Vehículos del Conductor
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {conductor.vehiculos.map((vehiculo, vIndex) => (
                        <div 
                          key={`vehiculo-${vIndex}`}
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          <div>
                            <strong>Vehículo {vIndex + 1}:</strong> {vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})
                          </div>
                          <div>
                            <strong>Categoría:</strong> {vehiculo.categoria}
                          </div>
                          <div>
                            <strong>Estado:</strong>{" "}
                            {vehiculo.estadoverificacion ? (
                              <span style={{ color: "green" }}>Verificado</span>
                            ) : (
                              <span style={{ color: "orange" }}>Pendiente</span>
                            )}
                          </div>
                        </div>
                      ))}
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

  return (
    <div
      style={{
        backgroundColor: colorSecundario,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: colorPrimario, marginBottom: "1rem" }}>
        Administración de Conductores
      </h2>

      {/* Management Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleGestionUsuarios}
        >
          Gestión de Usuarios
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={handleGestionVehiculos}
        >
          Gestión de Vehículos
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

      {/* Drivers Table */}
      <div>
        <h3 style={{ color: colorPrimario }}>Conductores Registrados</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "Nombre",
                "Correo",
                "Celular",
                "Dirección",
                "Estado Conductor",
                "Vehículos",
              ].map((header) => (
                <TableHeader key={header} colorPrimario={colorPrimario}>
                  {header}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {conductores.length > 0 ? (
              conductores.map(renderConductorRow)
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                  No hay conductores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
};

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