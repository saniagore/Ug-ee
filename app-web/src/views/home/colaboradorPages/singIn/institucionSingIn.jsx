import React, { useState } from "react";
import { QueryInstitucion } from "../../../../components/queryInstitucion";
import { useNavigate } from 'react-router-dom';

/**
 * Institution Login Component
 * 
 * @component
 * @name InstitucionLogin
 * @description Provides a login form for institution collaborators with:
 * - Credential validation
 * - Authentication flow
 * - Error handling and user feedback
 * - Navigation to institution menu upon success
 * 
 * @param {Function} onBack - Callback for returning to previous screen
 * 
 * @property {boolean} showAlert - Controls alert visibility
 * @property {string} alertMessage - Message to display in alert
 * @property {string} alertType - Alert type ('success' or 'error')
 * @property {Object} formData - Stores login form values
 * 
 * @example
 * // Usage in parent component
 * <InstitucionLogin onBack={() => setCurrentView('welcome')} />
 * 
 * @returns {React.Element} Returns a login form with:
 * - Name and password fields
 * - Form submission handling
 * - Alert notifications
 * - Navigation controls
 */
export default function InstitucionLogin({ onBack }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();

  const institucionQuery = new QueryInstitucion();
  const [formData, setFormData] = useState({
    nombre: "",
    contraseña: "",
  });

  /**
   * Handles form submission and authentication
   * @async
   * @function handleSubmit
   * @param {Event} e - Form submission event
   * @description Validates credentials, handles authentication, and manages navigation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verify credentials
      const loginResponse = await institucionQuery.verificarColaborador(
        formData.nombre,
        formData.contraseña
      );
      
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Credenciales incorrectas");
      }

      // Verify authentication status
      const verifyResponse = await institucionQuery.verifyAuth();
      if (!verifyResponse.authenticated) {
        throw new Error(verifyResponse.error || "No autenticado");
      }

      // Navigate to institution menu on success
      navigate('/Colaborador/Menu');
    } catch (error) {
      // Handle specific error cases
      setAlertType("error");
      let errorMessage = error.message;

      if (error.message.includes("Token inválido")) {
        errorMessage = "Sesión expirada, por favor inicia sesión nuevamente";
      } else if (error.message.includes("Credenciales incorrectas")) {
        errorMessage = "Nombre o contraseña invalidos";
      }

      setAlertMessage(errorMessage);
      setShowAlert(true);
    }
  };

  return (
    <div className="login-form">
      <h2>Ingreso de institución</h2>
      
      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="institution-name">Nombre</label>
          <input
            id="institution-name"
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
            aria-required="true"
          />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="institution-password">Contraseña</label>
          <input
            id="institution-password"
            type="password"
            value={formData.contraseña}
            onChange={(e) =>
              setFormData({ ...formData, contraseña: e.target.value })
            }
            required
            aria-required="true"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="back-btn" 
            onClick={onBack}
            aria-label="Volver al menú anterior"
          >
            Volver
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            aria-label="Iniciar sesión"
          >
            Ingresar
          </button>
        </div>
      </form>

      {/* Alert Notification */}
      {showAlert && (
        <div
          role="alert"
          className={`custom-alert ${
            alertType === "success" ? "alert-success" : "alert-error"
          }`}
          aria-live="assertive"
        >
          <div className="alert-content">
            <h3>{alertType === "success" ? "Éxito" : "Error"}</h3>
            <p>{alertMessage}</p>
            <button 
              onClick={() => setShowAlert(false)}
              aria-label="Cerrar mensaje de alerta"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}