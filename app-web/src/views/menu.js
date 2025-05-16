import React, { useEffect, useState } from "react";
import { useNavigation } from "../components/navigations";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "../css/WaitForValid.css";
import "../css/Menu.css";
import Servicio from "./user/pedirVehiculo";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Menu() {
  const { goToHomePage, goToWaitForValid } = useNavigation();
  const caliPosition = [3.375658, -76.529885];

  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [currentView, setCurrentView] = useState("menu");

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/usuario/auth/verify",
          {
            credentials: "include",
          }
        );
        if (!response.ok) goToHomePage();
        const data = await response.json();
        if (!data.user.estado) goToWaitForValid();
      } catch (error) {
        goToHomePage();
      }
    };
    verifyAuth();
  }, [goToHomePage, goToWaitForValid]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/usuario/logout", {
        method: "POST",
        credentials: "include",
      });
      goToHomePage();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const fetchAddressResults = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Cali, Colombia"
        )}&addressdetails=1&limit=5&countrycodes=co`
      );

      const data = await response.json();

      if (data.length === 0) {
        setSuggestions([]);
        setSearchError("No se encontraron coincidencias.");
        return;
      }

      const parsedResults = data.map((item) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        display: formatDisplayAddress(item),
      }));

      setSuggestions(parsedResults);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setSearchError("Error al conectar con el servicio de mapas.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatDisplayAddress = (item) => {
    const addr = item.address;
    return [
      addr.road,
      addr.house_number,
      addr.neighbourhood,
      addr.suburb,
      addr.city || addr.town,
      addr.state,
      addr.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    setSelectedAddress(null);
    if (value.length >= 3) fetchAddressResults(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display);
    setMarkerPosition([suggestion.lat, suggestion.lng]);
    setSelectedAddress(suggestion);
    setSuggestions([]);
    setSearchError(null);
  };

  const handleSearch = async () => {
    if (!address.trim()) return;
    await fetchAddressResults(address);
  };

  return (
    <div className="app-container">
      <div className="control-panel">
        {currentView === "menu" && (
          <>
            <h2 className="panel-title">Servicio DiDi</h2>
            <div className="search-container">
              <label className="search-label">Ingresa tu dirección:</label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Ej: Carrera 100 #15-20"
                className="search-input"
              />
              {isSearching && (
                <div className="search-spinner">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              )}

              {searchError && <div className="search-error">{searchError}</div>}

              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.display}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className={`search-button ${isSearching ? "searching" : ""}`}
              >
                {isSearching ? "Buscando..." : "Buscar Dirección"}
              </button>
            </div>

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

            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        )}

        {currentView === "servicio" && (
          <Servicio onBack={() => setCurrentView('menu')} />
        )}

        {currentView === "reserva" && (
          <>
            <h2 className="panel-title">Reserva Confirmada</h2>
            <p>Tu servicio ha sido reservado exitosamente.</p>
            <button
              onClick={() => setCurrentView("menu")}
              className="back-button"
            >
              Volver al Menú
            </button>
          </>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={markerPosition || caliPosition}
          zoom={markerPosition ? 16 : 13}
          className="leaflet-map"
        >
          <MapViewUpdater
            center={markerPosition || caliPosition}
            zoom={markerPosition ? 16 : 13}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markerPosition && (
            <Marker position={markerPosition} icon={customIcon}>
              <Popup>
                {selectedAddress?.display || "Ubicación seleccionada"}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
