import React, { useState } from "react";
import { QueryConductor } from "../../../../components/queryConductor";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Driver Login Component
 * 
 * @component
 * @name DriverLogin
 * @description Provides a secure login interface for drivers with:
 * - Phone number and password authentication
 * - Two-step verification (credentials + token)
 * - Comprehensive error handling
 * - Alert notifications
 * - Navigation to driver menu upon success
 * 
 * @param {Function} onBack - Callback for returning to previous screen
 * @param {Function} onSuccess - Callback for successful authentication
 * 
 * @property {boolean} showAlert - Controls alert visibility
 * @property {string} alertMessage - Message to display in alert
 * @property {string} alertType - Alert type ('success' or 'error')
 * @property {Object} formData - Stores login form values {celular: string, contraseña: string}
 * @property {boolean} isLoading - Tracks loading state during authentication
 * 
 * @example
 * // Usage in parent component
 * <DriverLogin 
 *   onBack={() => navigate(-1)}
 *   onSuccess={() => handleLoginSuccess()} 
 * />
 */
export default function DriverLogin({ onBack, onSuccess }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const conductorQuery = new QueryConductor();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    celular: "",
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
    setIsLoading(true);

    try {
      // Step 1: Verify credentials
      const loginResponse = await conductorQuery.loginConductor(
        formData.celular,
        formData.contraseña
      );

      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Credenciales incorrectas");
      }

      // Step 2: Verify authentication status
      const verifyResponse = await conductorQuery.verificarAutenticacion();
      if (!verifyResponse.authenticated) {
        throw new Error(verifyResponse.error || "No autenticado");
      }

      // On success
      onSuccess?.();
      navigate('/Colaborador/Menu');
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles login errors and displays appropriate messages
   * @function handleLoginError
   * @param {Error} error - The error object
   */
  const handleLoginError = (error) => {
    setAlertType("error");
    let errorMessage = error.message;

    // Specific error cases
    if (error.message.includes("Token inválido")) {
      errorMessage = "Sesión expirada, por favor inicia sesión nuevamente";
    } else if (error.message.includes("Credenciales incorrectas")) {
      errorMessage = "Celular o contraseña inválidos";
    } else if (error.message.includes("Network Error")) {
      errorMessage = "Error de conexión. Intente nuevamente";
    }

    setAlertMessage(errorMessage);
    setShowAlert(true);
  };

  /**
   * Handles phone number input formatting
   * @function handlePhoneChange
   * @param {Event} e - Input change event
   */
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData({ ...formData, celular: value });
  };

  return (
    <div className="driver-login-form">
      <h2>Ingreso de Conductor</h2>
      
      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Phone Input */}
        <div className="form-group">
          <label htmlFor="driver-phone">Celular</label>
          <input
            id="driver-phone"
            type="tel"
            value={formData.celular}
            onChange={handlePhoneChange}
            pattern="[0-9]{10}"
            maxLength="10"
            required
            aria-required="true"
            placeholder="Ej: 3101234567"
          />
        </div>

        {/* Password Input with toggle */}
        <div className="form-group password-group">
          <label htmlFor="driver-password">Contraseña</label>
          <div className="password-input-container">
            <input
              id="driver-password"
              type={showPassword ? "text" : "password"}
              value={formData.contraseña}
              onChange={(e) =>
                setFormData({ ...formData, contraseña: e.target.value })
              }
              minLength="8"
              required
              aria-required="true"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="back-btn" 
            onClick={onBack}
            disabled={isLoading}
            aria-label="Volver al menú anterior"
          >
            Volver
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
            aria-label={isLoading ? "Procesando..." : "Iniciar sesión"}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Ingresar"
            )}
          </button>
        </div>
      </form>

      {/* Alert Notification */}
      {showAlert && (
        <div
          role="alert"
          className={`custom-alert ${alertType}`}
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

// Prop type validation
DriverLogin.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

// Default props
DriverLogin.defaultProps = {
  onSuccess: () => {}
};