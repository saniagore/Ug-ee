import React, { useEffect, useState } from "react";
import { QueryUser } from "../../components/queryUser";
import { useNavigation } from "../../components/navigations";

export default function MenuInstitucion({ onLogout }) {
  const userQuery = React.useMemo(() => new QueryUser(), []);
  const { goToHomePage, goToWaitForValid } = useNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [usuarios, setUsuarios] = useState([]);

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

  const handleEstadoClick = async (celular, estadoActual) => {
    if (estadoActual) return; // Si ya está verificado, no hacer nada

    try {
      // Actualizar el estado en el backend
      await userQuery.actualizarEstado(celular);
      
      // Actualizar el estado en el frontend
      setUsuarios(usuarios.map(usuario => 
        usuario.celular === celular 
          ? { ...usuario, estado_verificacion: true } 
          : usuario
      ));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
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

      <div style={{ marginBottom: "2rem" }}>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Gestión de Conductores
        </button>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Reportes
        </button>
        <button style={buttonStyle(colorPrimario, colorSecundario)}>
          Configuración
        </button>
        <button
          style={buttonStyle(colorPrimario, colorSecundario)}
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <div>
        <h3 style={{ color: colorPrimario }}>Usuarios Registrados</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  backgroundColor: colorPrimario,
                  color: "#fff",
                }}
              >
                Nombre
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  backgroundColor: colorPrimario,
                  color: "#fff",
                }}
              >
                Correo
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  backgroundColor: colorPrimario,
                  color: "#fff",
                }}
              >
                Celular
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  backgroundColor: colorPrimario,
                  color: "#fff",
                }}
              >
                N° Identificación
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  backgroundColor: colorPrimario,
                  color: "#fff",
                }}
              >
                Estado Verificación
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2",
                  }}
                >
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
                  <td 
                    style={{ 
                      textAlign: "center", 
                      padding: "0.5rem",
                      cursor: usuario.estado_verificacion ? "default" : "pointer"
                    }}
                    onClick={() => handleEstadoClick(usuario.celular, usuario.estado_verificacion)}
                  >
                    {usuario.estado_verificacion ? (
                      "Verificado"
                    ) : (
                      <select
                        style={{
                          padding: "0.2rem",
                          borderRadius: "4px",
                          border: `1px solid ${colorPrimario}`,
                          backgroundColor: colorSecundario,
                          color: colorPrimario,
                          cursor: "pointer"
                        }}
                        onChange={(e) => {
                          if (e.target.value === "aceptado") {
                            handleEstadoClick(usuario.celular, usuario.estado_verificacion);
                          }
                        }}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aceptado">Aceptado</option>
                      </select>
                    )}
                  </td>
                </tr>
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