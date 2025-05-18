import { FaArrowLeft } from "react-icons/fa";
import "../../../css/homePageSingIn.css";
import { useNavigation } from "../../../components/navigations";
import { useState } from "react";
import { QueryUser } from "../../../components/queryUser";
import { useEffect } from "react";

export default function Login({ onBack, onLoginSuccess, celular }) {
  const userQuery = new QueryUser();
  const { goToMenu } = useNavigation();
  const [formData, setFormData] = useState({
    celular: "",
    contraseña: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const loginResponse = await userQuery.verificarContraseña(formData.celular, formData.contraseña);
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Credenciales incorrectas");
      }
      const verifyResponse = await userQuery.verifyAuth();
      if (!verifyResponse.authenticated) {
        throw new Error(verifyResponse.error || "No autenticado");
      }
      goToMenu();
      onLoginSuccess(verifyResponse.user); 
  
    } catch (error) {
      let errorMessage = error.message;
      
      if (error.message.includes("Token inválido")) {
        errorMessage = "Sesión expirada, por favor inicia sesión nuevamente";
        localStorage.removeItem("jwt_token");
      }
      
      if (error.message.includes("Credenciales incorrectas")) {
        errorMessage = "Celular o contraseña incorrectos";
      }
  
      setError(errorMessage);
      console.error("Error en login:", error);
    }
  };

  // Set initial celular if provided as prop
  // Only run once on mount

  useEffect(() => {
    if (celular) {
      setFormData((prev) => ({ ...prev, celular }));
    }
  }, [celular]);

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

        {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

        <button className="continue-button" type="submit">
          Iniciar
        </button>
      </form>
    </>
  );
}