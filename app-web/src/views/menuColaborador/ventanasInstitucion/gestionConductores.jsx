import React, { useEffect, useState, useMemo } from "react";
import { QueryConductor } from "../../../components/queryConductor";
import { useNavigation } from "../../../components/navigations";

export default function AdministrarConductores() {
  const conductorQuery = useMemo(() => new QueryConductor(), []);
  const { goToHomePage, goToWaitForValid } = useNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [conductores, setConductores] = useState([]);

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
        const data = await conductorQuery.obtenerTodosConductores(decodedToken.id);
        setConductores(data || []);
      } catch (error) {
        console.error("Error al obtener conductores:", error);
        setConductores([]);
      }
    };

    verifyAndFetch();
    fetchConductores();
  }, [goToHomePage, goToWaitForValid, conductorQuery]);

  const handleEstadoClick = async (conductorId, estadoActual) => {
    try {
      await conductorQuery.actualizarEstadoConductor(conductorId, !estadoActual);
      setConductores(conductores.map(conductor =>
        conductor.id === conductorId
          ? { ...conductor, estado_verificacion: !estadoActual }
          : conductor
      ));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

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

  const renderConductorRow = (conductor, index) => {
    const hasVehicles = conductor.vehiculos?.length > 0;
    const rowKey = conductor.id || `conductor-${index}`;

    return (
      <React.Fragment key={rowKey}>
        <tr style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
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
              cursor: "pointer"
            }}
            onClick={() => handleEstadoClick(conductor.id, conductor.estado_verificacion)}
          >
            {conductor.estado_verificacion ? (
              <span style={{ color: "green" }}>Verificado</span>
            ) : (
              <span style={{ color: "orange" }}>Pendiente</span>
            )}
          </td>
          <td style={{ textAlign: "center", padding: "0.5rem" }}>
            {conductor.vehiculos?.length || 0}
          </td>
        </tr>
        {hasVehicles && conductor.vehiculos.map((vehiculo, vIndex) => (
          <tr 
            key={`${rowKey}-vehiculo-${vehiculo.id || vIndex}`}
            style={{ 
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9e9e9",
              borderTop: "1px solid #ddd"
            }}
          >
            <td colSpan="4" style={{ textAlign: "right", padding: "0.5rem" }}>
              Vehículo {vIndex + 1}: {vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})
            </td>
            <td style={{ textAlign: "center", padding: "0.5rem" }}>
              Categoría: {vehiculo.categoria}
            </td>
            <td style={{ textAlign: "center", padding: "0.5rem" }}>
              {vehiculo.estado_verificacion ? (
                <span style={{ color: "green" }}>Vehículo Verificado</span>
              ) : (
                <span style={{ color: "orange" }}>Vehículo Pendiente</span>
              )}
            </td>
          </tr>
        ))}
      </React.Fragment>
    );
  };

  return (
    <div style={{ backgroundColor: colorSecundario, minHeight: "100vh", padding: "2rem" }}>
      <h2 style={{ color: colorPrimario, marginBottom: "1rem" }}>
        Administración de Conductores
      </h2>

      <div style={{ marginBottom: "2rem" }}>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Gestionar Usuarios
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

      <div>
        <h3 style={{ color: colorPrimario }}>Conductores Registrados</h3>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}>
          <thead>
            <tr>
              {["Nombre", "Correo", "Celular", "Dirección", "Estado Conductor", "Vehículos"].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    backgroundColor: colorPrimario,
                    color: "#fff",
                  }}
                >
                  {header}
                </th>
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