import { FaArrowLeft } from "react-icons/fa";
import "../../../css/homePageSingIn.css";
import { useNavigation } from "../../../components/navigations";
import { useState, useEffect } from "react";
//import { Validar_datos } from "../../../components/dataValid";
import { QueryUser } from "../../../components/queryUser";

export default function Login({ onBack, onLoginSuccess }) {
  const userQuery = new QueryUser();
  const { goToMenu } = useNavigation();
  const [user, setUser] = useState(null); // Add state for user
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    celular: "",
    contraseña: "",
  });
  const [error, setError] = useState(null);

  // Limpiar alertas cuando se cambian los campos
  useEffect(() => {
    if (showAlert) {
      setShowAlert(false);
    }
  }, [formData.celular, formData.contraseña, showAlert]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // 1. Realizar login
      const loginResponse = await userQuery.verificarContraseña(formData.celular, formData.contraseña);
      
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Credenciales incorrectas");
      }
  
      // 2. Verificar autenticación
      const verifyResponse = await userQuery.verifyAuth();
      
      if (!verifyResponse.authenticated) {
        throw new Error(verifyResponse.error || "No autenticado");
      }
  
      // 3. Guardar datos de usuario en estado/contexto
      setUser(verifyResponse.user);
      
      // 4. Redirigir
      goToMenu();
      onLoginSuccess(verifyResponse.user); // Llamar a la función de éxito de inicio de sesión
  
    } catch (error) {
      // Manejo específico de errores
      let errorMessage = error.message;
      
      if (error.message.includes("Token inválido")) {
        errorMessage = "Sesión expirada, por favor inicia sesión nuevamente";
        // Limpiar token inválido
        localStorage.removeItem("jwt_token");
      }
      
      if (error.message.includes("Credenciales incorrectas")) {
        errorMessage = "Celular o contraseña incorrectos";
      }
  
      setError(errorMessage);
      console.error("Error en login:", error);
    }
  };

  return (
    <>
      <button
        className="back-button"
        onClick={onBack}
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

      <h1 className="Title">Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <h1 className="indicador">Número de celular</h1>
        <div className="inputs-section">
          <input
            className="input"
            placeholder="Número de celular"
            onChange={handleChange("celular")}
            value={formData.celular}
            style={{ width: "300px" }}
            required
          />
        </div>

        <h1 className="indicador">Contraseña</h1>
        <div className="inputs-section">
          <input
            className="input"
            placeholder="Contraseña"
            type="password"
            onChange={handleChange("contraseña")}
            value={formData.contraseña}
            style={{ width: "300px" }}
            required
          />
        </div>

        <button 
          className="continue-button" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Iniciar"}
        </button>
      </form>

      {showAlert && (
        <div className="custom-alert">
          <div className="alert-content">
            <h3>Error</h3>
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}