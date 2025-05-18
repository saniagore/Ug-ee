import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { QueryViaje } from "../../components/queryViaje";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "../../css/Menu.css";

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

const Servicio = ({ onBack, originAddress, serviceType }) => {
  const viajeQuery = new QueryViaje();
  const caliPosition = [3.375658, -76.529885];
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getMapCenter = () => {
    return originAddress?.markerPosition || caliPosition;
  };

  const getMapZoom = () => {
    return 16;
  };

  const handleDestAddressChange = (e) => {
    setDestinationAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!destinationAddress.trim()) {
      setSubmitError("Por favor ingresa una dirección de destino");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
          "http://localhost:5000/api/usuario/auth/verify",
          {
            credentials: "include",
          }
        );
      const data = await response.json();
      viajeQuery.registrarViaje(originAddress.address,destinationAddress,serviceType,data.user.id);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error al solicitar servicio:", error);
      setSubmitError(
        "Error al solicitar el servicio. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="service-confirmation">
        <h2>¡Servicio solicitado con éxito!</h2>
        <p>Tu conductor está en camino.</p>
        <p>
          <strong>Origen:</strong> {originAddress?.address}
        </p>
        <p>
          <strong>Destino:</strong> {destinationAddress}
        </p>
        <p>
            <strong>Servicio:</strong> su conductor se comunicara con usted mediante llamada telefonica
        </p>
        <button onClick={onBack} className="search-button">
          Volver al Menú
        </button>
      </div>
    );
  }

  return (
    <div className="service-container">
      <button
        onClick={onBack}
        className="back-button"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          marginBottom: "20px",
          color: "#7e46d2",
        }}
      >
        <FaArrowLeft />
      </button>

      <h2>Solicitar Servicio</h2>

      <div className="service-form">
        <div className="form-group">
          <label>Dirección de origen:</label>
          <input
            style={{ width: "94%" }}
            type="text"
            value={originAddress?.address || ""}
            readOnly
            className="read-only-input"
          />
        </div>

        <div className="form-group">
          <label>Dirección de destino:</label>
          <input
            style={{ width: "94%" }}
            type="text"
            value={destinationAddress}
            onChange={handleDestAddressChange}
            placeholder="Ej: Carrera 100 #15-20"
            className="search-input"
          />
        </div>

        {submitError && <div className="submit-error">{submitError}</div>}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !destinationAddress.trim()}
          className="search-button"
        >
          {isSubmitting ? "Solicitando..." : "Solicitar Servicio"}
        </button>
      </div>

      <div className="service-map">
        <MapContainer
          center={getMapCenter()}
          zoom={getMapZoom()}
          className="leaflet-map"
        >
          <MapViewUpdater center={getMapCenter()} zoom={getMapZoom()} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {originAddress?.markerPosition && (
            <Marker position={originAddress.markerPosition} icon={customIcon}>
              <Popup>Origen: {originAddress.address}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Servicio;
