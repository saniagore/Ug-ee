import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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

import { useAuthVerification } from "../../components/useAuth";

import Rutas from "./rutasDisponibles";
import HistorialViajes from "./historialViajes";
import AgendarReserva from "./agendarReserva";
import HistorialReservas from "./historialReservas";

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
  const token = localStorage.getItem("jwt_token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const userId = decoded.id;

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
          <Rutas onBack={() => setCurrentView("menu")} userId={userId} />
        ) : currentView === "historial" ? (
          <HistorialViajes onBack={() => setCurrentView("menu")} />
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
          <MapViewUpdater center={caliPosition} zoom={13} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
}
