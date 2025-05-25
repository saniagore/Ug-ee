import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../../../components/navigations";
import { QueryVehicle } from "../../../components/queryVehiculo";

/**
 * Vehicle Registration Component
 * 
 * @component
 * @name RegistroVehiculo
 * @description Provides a form for drivers to register their vehicles with all required information
 * including vehicle details, documents, and verification status.
 * 
 * @example
 * // Usage in driver dashboard
 * <RegistroVehiculo />
 * 
 * @returns {React.Element} Returns a vehicle registration form with:
 * - Vehicle information fields (category, color, plate, brand, model)
 * - Document upload for SOAT and technomechanical inspection
 * - Form validation and submission handling
 * - Purple-themed styling
 */
export default function RegistroVehiculo() {
  const navigate = useNavigate();
  const { goToHomePage, goToValidando } = useNavigation();
  const vehicleQuery = React.useMemo(() => new QueryVehicle(), []);
  
  // Purple color scheme
  const [colorPrimario] = useState("#7e46d2");
  const [colorSecundario] = useState("#f9f5ff");
  const handleRegresar= ()=>{
    navigate("/Colaborador/Menu");
  };
  // Form state
  const [formData, setFormData] = useState({
    categoria: "",
    color: "",
    placa: "",
    marca: "",
    modelo: "",
    cantidadPasajeros: "",
    vencimientoSoat: "",
    vencimientoTecnomecanica: "",
    soatFile: null,
    tecnomecanicaFile: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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
          goToValidando();
          return;
        }
      } catch (error) {
        localStorage.removeItem("jwtToken");
        goToHomePage();
      }
    };

    verifyAuth();
  }, [goToHomePage, goToValidando]);

  /**
   * Handles form input changes
   * @function handleChange
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  /**
   * Handles file input changes
   * @function handleFileChange
   * @param {Object} e - Event object
   */
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0]
    });
  };

  /**
   * Validates form fields
   * @function validateForm
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.categoria) newErrors.categoria = "Selecciona una categoría";
    if (!formData.color) newErrors.color = "Ingresa el color del vehículo";
    if (!formData.placa) newErrors.placa = "Ingresa la placa del vehículo";
    if (!formData.marca) newErrors.marca = "Ingresa la marca del vehículo";
    if (!formData.modelo) newErrors.modelo = "Ingresa el modelo del vehículo";
    if (!formData.vencimientoSoat) newErrors.vencimientoSoat = "Ingresa la fecha de vencimiento del SOAT";
    if (!formData.vencimientoTecnomecanica) newErrors.vencimientoTecnomecanica = "Ingresa la fecha de vencimiento de la técnomecánica";
    if (!formData.soatFile) newErrors.soatFile = "Sube el archivo del SOAT";
    if (!formData.tecnomecanicaFile) newErrors.tecnomecanicaFile = "Sube el archivo de la técnomecánica";
    if (!formData.cantidadPasajeros || formData.cantidadPasajeros <= 0) {
      newErrors.cantidadPasajeros = "Ingresa una cantidad válida de pasajeros";
    }
    
    // Plate format validation (basic check)
    if (formData.placa && !/^[A-Za-z0-9]{5,7}$/.test(formData.placa)) {
      newErrors.placa = "Placa no válida";
    }
    
    // Date validation (future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.vencimientoSoat) {
      const soatDate = new Date(formData.vencimientoSoat);
      if (soatDate <= today) {
        newErrors.vencimientoSoat = "El SOAT debe estar vigente (fecha futura)";
      }
    }
    
    if (formData.vencimientoTecnomecanica) {
      const tecnoDate = new Date(formData.vencimientoTecnomecanica);
      if (tecnoDate <= today) {
        newErrors.vencimientoTecnomecanica = "La técnomecánica debe estar vigente (fecha futura)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * @async
   * @function handleSubmit
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("jwt_token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      
      const formDataToSend = new FormData();
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('placa', formData.placa);
      formDataToSend.append('marca', formData.marca);
      formDataToSend.append('modelo', formData.modelo);
      formDataToSend.append('vencimientoSoat', formData.vencimientoSoat);
      formDataToSend.append('vencimientoTecnomecanica', formData.vencimientoTecnomecanica);
      formDataToSend.append('soatFile', formData.soatFile);
      formDataToSend.append('tecnomecanicaFile', formData.tecnomecanicaFile);
      formDataToSend.append('conductorId', decodedToken.id);
      formDataToSend.append('cantidadPasajeros', formData.cantidadPasajeros);
      
      await vehicleQuery.registrarVehiculo(formDataToSend);
      
      setSubmissionSuccess(true);
      setTimeout(() => {
        navigate("/Colaborador/Menu");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar vehículo:", error);
      setErrors({
        ...errors,
        submit: "Error al registrar el vehículo. Por favor intenta nuevamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: colorSecundario,
      minHeight: "100vh",
      padding: "2rem",
      color: "#333"
    }}>
      <h2 style={{ 
        marginBottom: "2rem", 
        borderBottom: `2px solid ${colorPrimario}`, 
        paddingBottom: "0.5rem",
        color: colorPrimario
      }}>
        Registro de Vehículo
      </h2>
      
      {submissionSuccess ? (
        <div style={{
          backgroundColor: "#e6d6ff",
          color: colorPrimario,
          padding: "1rem",
          borderRadius: "4px",
          marginBottom: "1rem",
          border: `1px solid ${colorPrimario}`
        }}>
          ¡Vehículo registrado exitosamente! Redirigiendo...
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Vehicle Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Categoría del Vehículo *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.categoria ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            >
              <option value="">Selecciona una categoría</option>
              <option value="camioneta">Camioneta</option>
              <option value="bus">Bus</option>
              <option value="moto">Moto</option>
              <option value="carro">Carro</option>
            </select>
            {errors.categoria && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.categoria}</span>
            )}
          </div>
          
          {/* Vehicle Color */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Color del Vehículo *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.color ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.color && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.color}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
                Placa del Vehículo *
              </label>
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="Ej: ABC123"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: `1px solid ${errors.placa ? "red" : "#ddd"}`,
                  backgroundColor: "#fff"
                }}
              />
              {errors.placa && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.placa}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
                Cantidad de Pasajeros *
              </label>
              <input
                type="number"
                name="cantidadPasajeros"
                value={formData.cantidadPasajeros || ""}
                onChange={handleChange}
                min={1}
                placeholder="Ej: 4"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: `1px solid ${errors.cantidadPasajeros ? "red" : "#ddd"}`,
                  backgroundColor: "#fff"
                }}
              />
              {errors.cantidadPasajeros && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.cantidadPasajeros}</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: `1px solid ${errors.marca ? "red" : "#ddd"}`,
                  backgroundColor: "#fff"
                }}
              />
              {errors.marca && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.marca}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: `1px solid ${errors.modelo ? "red" : "#ddd"}`,
                  backgroundColor: "#fff"
                }}
              />
              {errors.modelo && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.modelo}</span>
              )}
            </div>
          </div>
          
          {/* SOAT Expiration */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Fecha de Vencimiento del SOAT *
            </label>
            <input
              type="date"
              name="vencimientoSoat"
              value={formData.vencimientoSoat}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.vencimientoSoat ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.vencimientoSoat && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.vencimientoSoat}</span>
            )}
          </div>
          
          {/* Technomechanical Expiration */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Fecha de Vencimiento de la Técnomecánica *
            </label>
            <input
              type="date"
              name="vencimientoTecnomecanica"
              value={formData.vencimientoTecnomecanica}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.vencimientoTecnomecanica ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.vencimientoTecnomecanica && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.vencimientoTecnomecanica}</span>
            )}
          </div>
          
          {/* SOAT Document Upload */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Documento del SOAT (PDF o imagen) *
            </label>
            <input
              type="file"
              name="soatFile"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.soatFile ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.soatFile && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.soatFile}</span>
            )}
          </div>
          
          {/* Technomechanical Document Upload */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Documento de la Técnomecánica (PDF o imagen) *
            </label>
            <input
              type="file"
              name="tecnomecanicaFile"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.tecnomecanicaFile ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.tecnomecanicaFile && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.tecnomecanicaFile}</span>
            )}
          </div>
          
          {/* Submit Button */}
          <div style={{ textAlign: "center" }}>
            <button
                onClick={handleRegresar}
              style={{
                backgroundColor: colorPrimario,
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(126, 70, 210, 0.2)",
                marginRight: "10px"
            }}
            >
              Regresar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: colorPrimario,
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(126, 70, 210, 0.2)"
              }}
            >
              {isSubmitting ? "Registrando..." : "Registrar Vehículo"}
            </button>
          </div>
          
          {errors.submit && (
            <div style={{
              color: "red",
              textAlign: "center",
              marginTop: "1rem"
            }}>
              {errors.submit}
            </div>
          )}
        </form>
      )}
    </div>
  );
}