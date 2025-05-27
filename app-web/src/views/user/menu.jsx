import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import {
  FaCar,
  FaCalendarAlt,
  FaHistory,
  FaSignOutAlt,
  FaChevronLeft,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "./css/Menu.css";

import { Polyline } from "react-leaflet";
import L from "leaflet";

import { useAuthVerification } from "../../components/useAuth";

import Rutas from "./rutasDisponibles";
import HistorialViajes from "./historialViajes";
import AgendarReserva from "./agendarReserva";
import HistorialReservas from "./historialReservas";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const DefaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Menu() {
  const caliPosition = [3.375658, -76.529885];
  const { handleLogout } = useAuthVerification();
  const [currentView, setCurrentView] = useState("menu");
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const userId = JSON.parse(
    atob(localStorage.getItem("jwt_token").split(".")[1])
  ).id;

  const handleViewRoute = (rutaPlanificada) => {
    try {
      const startPoint = [
        rutaPlanificada[0].latitud,
        rutaPlanificada[0].longitud,
      ];
      const endPoint = [
        rutaPlanificada[1].latitud,
        rutaPlanificada[1].longitud,
      ];

      if (startPoint.some(isNaN) || endPoint.some(isNaN)) {
        throw new Error("Invalid coordinates");
      }

      setRouteCoordinates([startPoint, endPoint]);
    } catch (error) {
      console.error("Error setting route:", error);
      setRouteCoordinates(null);
    }
  };

  return (
    <div className="app-container">
      <div className="control-panel">
        {currentView !== "menu" && (
          <button
            onClick={() => setCurrentView("menu")}
            className="back-button"
          >
            <FaChevronLeft /> Volver al menú
          </button>
        )}

        {currentView === "menu" ? (
          <div className="menu-content">
            <div className="brand-header">
              <h2 className="panel-title">
                <FaCar className="title-icon" /> Servicio UW
              </h2>
              <p className="brand-subtitle">Transporte universitario seguro</p>
            </div>

            <div className="button-grid">
              <button
                onClick={() => setCurrentView("Rutas")}
                className="menu-button service-button"
              >
                <div className="button-icon">
                  <FaCar />
                </div>
                <span>Ver Rutas Disponibles</span>
              </button>

              <button
                onClick={() => setCurrentView("reserva")}
                className="menu-button reserve-button"
              >
                <div className="button-icon">
                  <FaCalendarAlt />
                </div>
                <span>Reservar Rutas</span>
              </button>

              <button
                onClick={() => setCurrentView("historial")}
                className="menu-button history-button"
              >
                <div className="button-icon">
                  <FaHistory />
                </div>
                <span>Historial de Viajes</span>
              </button>

              <button
                onClick={() => setCurrentView("reservasH")}
                className="menu-button reservations-button"
              >
                <div className="button-icon">
                  <FaHistory />
                </div>
                <span>Historial de Reservas</span>
              </button>
            </div>

            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt className="logout-icon" /> Cerrar Sesión
            </button>
          </div>
        ) : currentView === "Rutas" ? (
          <Rutas
            onBack={() => setCurrentView("menu")}
            userId={userId}
            onViewRoute={handleViewRoute}
          />
        ) : currentView === "historial" ? (
          <HistorialViajes
            onBack={() => setCurrentView("menu")}
            userId={userId}
            onViewRoute={handleViewRoute}
          />
        ) : currentView === "reserva" ? (
          <AgendarReserva onBack={() => setCurrentView("menu")} />
        ) : (
          <HistorialReservas onBack={() => setCurrentView("menu")} />
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={caliPosition}
          zoom={13}
          className="leaflet-map"
          zoomControl={false}
        >
          <MapViewUpdater
            center={
              routeCoordinates
                ? routeCoordinates[Math.floor(routeCoordinates.length / 2)]
                : caliPosition
            }
            zoom={13}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routeCoordinates && routeCoordinates.length === 2 && (
            <>
              <Polyline
                positions={routeCoordinates}
                color="blue"
                weight={5}
                opacity={0.7}
              />
              <Marker
                position={routeCoordinates[0]}
                key={`start-${routeCoordinates[0][0]}-${routeCoordinates[0][1]}`}
              >
                <Popup>Punto de inicio</Popup>
              </Marker>
              <Marker
                position={routeCoordinates[1]}
                key={`end-${routeCoordinates[1][0]}-${routeCoordinates[1][1]}`}
              >
                <Popup>Punto de destino</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
