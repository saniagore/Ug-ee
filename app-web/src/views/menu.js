import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "./user/css/Menu.css";
import { useAuthVerification } from "../components/useAuth";
import Servicio from "./user/pedirVehiculo";
import HistorialViajes from "./user/historialViajes";
import AgendarReserva from "./user/agendarReserva";

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
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("campus");
  const [currentView, setCurrentView] = useState("menu");

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="control-panel">
        {currentView === "menu" && (
          <>
            <h2 className="panel-title">Servicio UW</h2>
            <div className="search-container">
              <label className="search-label">Ingresa tu dirección:</label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Ej: Carrera 100 #15-20"
                className="search-input"
              />
              
              {/* Selector de tipo de servicio */}
              <label className="search-label">Tipo de servicio:</label>
              <select 
                value={serviceType}
                onChange={handleServiceTypeChange}
                className="service-select"
              >
                <option value="campus">Campus</option>
                <option value="metropolitano">Metropolitano</option>
                <option value="intermunicipal">Intermunicipal</option>
              </select>

              <button
                onClick={() => setCurrentView("servicio")}
                className="reserve-button"
              >
                Pedir Servicio
              </button>

              <button
                onClick={() => setCurrentView("reserva")}
                className="reserve-button"
              >
                Reservar Servicio
              </button>

              <button
                onClick={() => setCurrentView("historial")}
                className="reserve-button"
              >
                Ver Historial de Viajes
              </button>

              <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </div>
          </>
        )}

        {currentView === "servicio" && (
          <Servicio
            onBack={() => setCurrentView("menu")}
            originAddress={{
              address: address,
              markerPosition: null,
              selectedAddress: null,
            }}
            serviceType={serviceType} 
          />
        )}

        {currentView === "historial" && (
          <HistorialViajes onBack={() => setCurrentView("menu")} />
        )}

        {currentView === "reserva" && (
          <AgendarReserva onBack={()=> setCurrentView("menu")}/>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={caliPosition}
          zoom={13}
          className="leaflet-map"
        >
          <MapViewUpdater
            center={caliPosition}
            zoom={13}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
}