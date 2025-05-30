import { useEffect, useState } from "react";
import { useNavigation as useCustomNavigation } from "../../../components/navigations";
import { useNavigate } from "react-router-dom";
import { QueryInstitucion } from "../../../components/queryInstitucion";
import { 
  Chart as ChartJS, 
  ArcElement, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function EstadisticasViajes() {
  const { goToHomePage } = useCustomNavigation();
  const [colorPrimario, setColorPrimario] = useState("#2c3e50");
  const [colorSecundario, setColorSecundario] = useState("#ecf0f1");
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // Funciones de navegación
  const handleGestionUsuarios = () => navigate("/Colaborador/Menu");
  const handleGestionConductores = () => navigate("/Colaborador/Gestion-conductores");
  const handleGestionVehiculos = () => navigate("/Colaborador/Gestion-vehiculos");
  const handleGestionReportes = () => navigate("/Colaborador/Gestion-reportes");

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
    const cargarEstadisticas = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          goToHomePage();
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setColorPrimario(decodedToken.colorPrimario || "#2c3e50");
        setColorSecundario(decodedToken.colorSecundario || "#ecf0f1");

        const institucionQuery = new QueryInstitucion();
        const data = await institucionQuery.obtenerEstadisticas(decodedToken.id);
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarEstadisticas();
  }, [goToHomePage]);

  // Preparar datos para gráficos
  const datosGraficoViajesPorEstado = {
    labels: estadisticas?.viajesPorEstado?.map(item => item.estado) || [],
    datasets: [
      {
        label: 'Viajes por Estado',
        data: estadisticas?.viajesPorEstado?.map(item => item.cantidad) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const datosGraficoVehiculosPorCategoria = {
    labels: estadisticas?.vehiculosPorCategoria?.map(item => item.categoria) || [],
    datasets: [
      {
        label: 'Vehículos por Categoría',
        data: estadisticas?.vehiculosPorCategoria?.map(item => item.cantidad) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Promedio Pasajeros',
        data: estadisticas?.vehiculosPorCategoria?.map(item => item.promedio_pasajeros || 0) || [],
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }
    ],
  };

  const datosGraficoReportesPorTipo = {
    labels: estadisticas?.reportesPorTipo?.map(item => item.tipo) || [],
    datasets: [
      {
        label: 'Reportes por Tipo',
        data: estadisticas?.reportesPorTipo?.map(item => item.cantidad) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (cargando) {
    return (
      <div style={{ 
        backgroundColor: colorSecundario, 
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div style={{ 
        backgroundColor: colorSecundario, 
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <p>No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

return (
    <div
        style={{
            backgroundColor: colorSecundario,
            minHeight: "100vh",
            padding: "1rem",
            overflowX: "hidden",
            overflowY: "auto",
            maxHeight: "100vh",
        }}
    >
        <div style={{ 
            maxWidth: "1200px", 
            margin: "0 auto",
            padding: "0 1rem"
        }}>
            <h2 style={{ 
                color: colorPrimario, 
                marginBottom: "1rem",
                fontSize: "1.5rem",
                textAlign: "center"
            }}>
                Estadísticas de Viajes
            </h2>

            {/* Navigation */}
            <div style={{ 
                marginBottom: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "center"
            }}>
                <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleGestionUsuarios}>
                    Gestión de Usuarios
                </button>
                <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleGestionConductores}>
                    Gestión de Conductores
                </button>
                <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleGestionVehiculos}>
                    Gestión de Vehículos
                </button>
                <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleGestionReportes}>
                    Gestión de Reportes
                </button>
                <button style={buttonStyle(colorPrimario, colorSecundario)} onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>

            {/* Resumen general */}
            <div style={{
                ...cardStyle(colorPrimario), 
                padding: "1rem",
                marginBottom: "1.5rem"
            }}>
                <h3 style={{ 
                    color: colorPrimario, 
                    marginBottom: "1rem", 
                    borderBottom: `2px solid ${colorPrimario}`, 
                    paddingBottom: "0.5rem",
                    fontSize: "1.2rem"
                }}>
                    Resumen General
                </h3>
                <div style={{
                    ...statsGridStyle,
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "0.75rem"
                }}>
                    <StatCard
                        title="Total Usuarios"
                        value={estadisticas.totalUsuarios}
                        color={colorPrimario}
                    />
                    <StatCard
                        title="Total Conductores"
                        value={estadisticas.totalConductores}
                        color={colorPrimario}
                    />
                    <StatCard
                        title="Total Vehículos"
                        value={estadisticas.totalVehiculos}
                        color={colorPrimario}
                    />
                    <StatCard
                        title="Total Viajes"
                        value={estadisticas.totalViajes}
                        color={colorPrimario}
                    />
                    <StatCard
                        title="Calificación Promedio"
                        value={estadisticas.promedioCalificaciones}
                        color={colorPrimario}
                    />
                    <StatCard
                        title="Total Calificaciones"
                        value={estadisticas.totalCalificaciones}
                        color={colorPrimario}
                    />
                </div>
            </div>

            {/* Gráficos y tablas - Diseño responsive */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
                gap: "1rem",
                marginBottom: "2rem"
            }}>
                {/* Viajes por estado - Gráfico de torta */}
                <div style={cardStyle(colorPrimario)}>
                    <h3 style={{ 
                        color: colorPrimario, 
                        marginBottom: "1rem", 
                        borderBottom: `2px solid ${colorPrimario}`, 
                        paddingBottom: "0.5rem",
                        fontSize: "1.2rem"
                    }}>
                        Viajes por Estado
                    </h3>
                    <div style={{ height: "250px", marginBottom: "1rem" }}>
                        <Pie 
                            data={datosGraficoViajesPorEstado} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <TableHeader colorPrimario={colorPrimario}>Estado</TableHeader>
                                    <TableHeader colorPrimario={colorPrimario}>Cantidad</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {estadisticas.viajesPorEstado?.map((item, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.estado}</td>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Vehículos por categoría - Gráfico de barras */}
                <div style={cardStyle(colorPrimario)}>
                    <h3 style={{ 
                        color: colorPrimario, 
                        marginBottom: "1rem", 
                        borderBottom: `2px solid ${colorPrimario}`, 
                        paddingBottom: "0.5rem",
                        fontSize: "1.2rem"
                    }}>
                        Vehículos por Categoría
                    </h3>
                    <div style={{ height: "250px", marginBottom: "1rem" }}>
                        <Bar 
                            data={datosGraficoVehiculosPorCategoria} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <TableHeader colorPrimario={colorPrimario}>Categoría</TableHeader>
                                    <TableHeader colorPrimario={colorPrimario}>Cantidad</TableHeader>
                                    <TableHeader colorPrimario={colorPrimario}>Prom. Pasajeros</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {estadisticas.vehiculosPorCategoria?.map((item, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.categoria}</td>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.cantidad}</td>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.promedio_pasajeros?.toFixed(1) || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reportes por tipo - Gráfico de torta */}
                <div style={cardStyle(colorPrimario)}>
                    <h3 style={{ 
                        color: colorPrimario, 
                        marginBottom: "1rem", 
                        borderBottom: `2px solid ${colorPrimario}`, 
                        paddingBottom: "0.5rem",
                        fontSize: "1.2rem"
                    }}>
                        Reportes por Tipo
                    </h3>
                    <div style={{ height: "250px", marginBottom: "1rem" }}>
                        <Pie 
                            data={datosGraficoReportesPorTipo} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <TableHeader colorPrimario={colorPrimario}>Tipo</TableHeader>
                                    <TableHeader colorPrimario={colorPrimario}>Cantidad</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {estadisticas.reportesPorTipo?.map((item, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.tipo}</td>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Eficiencia de vehículos */}
                <div style={cardStyle(colorPrimario)}>
                    <h3 style={{ 
                        color: colorPrimario, 
                        marginBottom: "1rem", 
                        borderBottom: `2px solid ${colorPrimario}`, 
                        paddingBottom: "0.5rem",
                        fontSize: "1.2rem"
                    }}>
                        Eficiencia de Vehículos
                    </h3>
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <TableHeader colorPrimario={colorPrimario}>Vehículo</TableHeader>
                                    <TableHeader colorPrimario={colorPrimario}>Viajes</TableHeader>
                                    <TableHeader colorPrimario={colorPrimario}>Pasajeros</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {estadisticas.vehiculosPorCategoria?.map((item, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.categoria}</td>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.cantidad}</td>
                                        <td style={{ textAlign: "center", padding: "0.5rem" }}>
                                            {Math.round(item.promedio_pasajeros * item.cantidad) || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

// Componentes auxiliares actualizados para mejor responsividad
function StatCard({ title, value, color }) {
  return (
    <div style={{
      backgroundColor: "#fff",
      padding: "0.75rem",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      textAlign: "center",
      borderTop: `3px solid ${color}`,
      minHeight: "80px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <h4 style={{ 
        margin: "0 0 0.25rem 0", 
        color: "#666", 
        fontSize: "0.9rem",
        fontWeight: "normal"
      }}>
        {title}
      </h4>
      <p style={{ 
        margin: "0", 
        fontSize: "1.25rem", 
        fontWeight: "bold", 
        color 
      }}>
        {value}
      </p>
    </div>
  );
}

function TableHeader({ colorPrimario, children }) {
  return (
    <th style={{
      textAlign: "center",
      padding: "0.5rem",
      backgroundColor: colorPrimario,
      color: "#fff",
      fontSize: "0.9rem",
      whiteSpace: "nowrap"
    }}>
      {children}
    </th>
  );
}

function buttonStyle(bgColor, textColor) {
  return {
    backgroundColor: bgColor,
    color: textColor,
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    flex: "1 1 auto",
    minWidth: "120px",
    maxWidth: "200px"
  };
}

function cardStyle(color) {
  return {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderTop: `3px solid ${color}`,
    height: "100%",
    display: "flex",
    flexDirection: "column"
  };
}

const statsGridStyle = {
  display: "grid",
  gap: "0.75rem"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.5rem",
  fontSize: "0.9rem"
};