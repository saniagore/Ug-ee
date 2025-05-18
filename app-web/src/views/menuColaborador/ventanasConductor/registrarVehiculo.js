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
  const { goToHomePage, goToWaitForValid } = useNavigation();
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
    vencimiento_soat: "",
    vencimiento_tecnomecanica: "",
    soat_file: null,
    tecnomecanica_file: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  /**
   * Effect hook for authentication verification
   * @effect
   * @name verifyAuth
   * @description Verifies JWT token on component mount
   */
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
      } catch (error) {
        localStorage.removeItem("jwt_token");
        goToHomePage();
      }
    };

    verifyAuth();
  }, [goToHomePage, goToWaitForValid]);

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
    if (!formData.vencimiento_soat) newErrors.vencimiento_soat = "Ingresa la fecha de vencimiento del SOAT";
    if (!formData.vencimiento_tecnomecanica) newErrors.vencimiento_tecnomecanica = "Ingresa la fecha de vencimiento de la técnomecánica";
    if (!formData.soat_file) newErrors.soat_file = "Sube el archivo del SOAT";
    if (!formData.tecnomecanica_file) newErrors.tecnomecanica_file = "Sube el archivo de la técnomecánica";
    
    // Plate format validation (basic check)
    if (formData.placa && !/^[A-Za-z0-9]{5,7}$/.test(formData.placa)) {
      newErrors.placa = "Placa no válida";
    }
    
    // Date validation (future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.vencimiento_soat) {
      const soatDate = new Date(formData.vencimiento_soat);
      if (soatDate <= today) {
        newErrors.vencimiento_soat = "El SOAT debe estar vigente (fecha futura)";
      }
    }
    
    if (formData.vencimiento_tecnomecanica) {
      const tecnoDate = new Date(formData.vencimiento_tecnomecanica);
      if (tecnoDate <= today) {
        newErrors.vencimiento_tecnomecanica = "La técnomecánica debe estar vigente (fecha futura)";
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
      
      // Prepare form data for submission
      const formDataToSend = new FormData();
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('placa', formData.placa);
      formDataToSend.append('marca', formData.marca);
      formDataToSend.append('modelo', formData.modelo);
      formDataToSend.append('vencimiento_soat', formData.vencimiento_soat);
      formDataToSend.append('vencimiento_tecnomecanica', formData.vencimiento_tecnomecanica);
      formDataToSend.append('soat_file', formData.soat_file);
      formDataToSend.append('tecnomecanica_file', formData.tecnomecanica_file);
      formDataToSend.append('conductor_id', decodedToken.id);
      
      // Call API to register vehicle
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
          
          {/* Plate Number */}
          <div style={{ marginBottom: "1.5rem" }}>
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
          
          {/* Brand and Model */}
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
              name="vencimiento_soat"
              value={formData.vencimiento_soat}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.vencimiento_soat ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.vencimiento_soat && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.vencimiento_soat}</span>
            )}
          </div>
          
          {/* Technomechanical Expiration */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Fecha de Vencimiento de la Técnomecánica *
            </label>
            <input
              type="date"
              name="vencimiento_tecnomecanica"
              value={formData.vencimiento_tecnomecanica}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.vencimiento_tecnomecanica ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.vencimiento_tecnomecanica && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.vencimiento_tecnomecanica}</span>
            )}
          </div>
          
          {/* SOAT Document Upload */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Documento del SOAT (PDF o imagen) *
            </label>
            <input
              type="file"
              name="soat_file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.soat_file ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.soat_file && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.soat_file}</span>
            )}
          </div>
          
          {/* Technomechanical Document Upload */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: colorPrimario }}>
              Documento de la Técnomecánica (PDF o imagen) *
            </label>
            <input
              type="file"
              name="tecnomecanica_file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${errors.tecnomecanica_file ? "red" : "#ddd"}`,
                backgroundColor: "#fff"
              }}
            />
            {errors.tecnomecanica_file && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.tecnomecanica_file}</span>
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