import React, { useState } from "react";
import { QueryInstitucion } from "../../../../components/queryInstitucion";
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await institucionQuery.verificarColaborador(
        formData.nombre,
        formData.contraseña
      );
      
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Credenciales incorrectas");
      }
      const verifyResponse = await institucionQuery.verifyAuth();
      if (!verifyResponse.authenticated) {
        throw new Error(verifyResponse.error || "No autenticado");
      }

      navigate('/Colaborador/Menu');
    } catch (error) {

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