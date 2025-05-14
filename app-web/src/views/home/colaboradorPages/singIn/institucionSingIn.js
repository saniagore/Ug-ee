import React, { useState } from "react";
import { QueryInstitucion } from "../../../../components/queryInstitucion";
import { useNavigate } from 'react-router-dom';

export default function ColaboratorLogin({ onBack }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // "success" or "error"
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
      setAlertMessage(errorMessage);

      if (error.message.includes("Token inválido")) {
        errorMessage = "Sesión expirada, por favor inicia sesión nuevamente";
        setAlertMessage(errorMessage);
      }

      if (error.message.includes("Credenciales incorrectas")) {
        setAlertMessage("Nombre o contraseña invalidos");
      }
      setShowAlert(true);
    }
  };

  return (
    <div className="login-form">
      <h2>Ingreso de institución</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="name"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={formData.contraseña}
            onChange={(e) =>
              setFormData({ ...formData, contraseña: e.target.value })
            }
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={onBack}>
            Volver
          </button>
          <button type="submit" className="submit-btn">
            Ingresar
          </button>
        </div>
      </form>
      {showAlert && (
        <div
          className={`custom-alert ${
            alertType === "success" ? "alert-success" : "alert-error"
          }`}
        >
          <div className="alert-content">
            <h3>{alertType === "success" ? "Éxito" : "Error"}</h3>
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}
