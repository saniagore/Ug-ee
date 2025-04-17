import ColombiaFlag from "../../resources/ColombiaFlag.png";
import UwayLogo from "../../resources/UwayLogo.png";
import "../../css/homePagePhone.css";
import { useState } from "react";
import { QueryUser } from "../../components/queryUser";
import { Validar_datos } from "../../components/dataValid";

function usePhoneInput() {
  const [phone, setPhone] = useState("");
  return { phone, setPhone };
}

function PhoneInput({ onRegister, onLogin }) {
  const userQuery = new QueryUser();
  const { phone, setPhone } = usePhoneInput();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handlePhoneChange = async (event) => {
    event.preventDefault();

    try {
      Validar_datos.celular(phone);
    } catch (err) {
      setAlertMessage(err);
      setShowAlert(true);
    }

    try {
      const exists = await userQuery.verificarExistencia(phone);
      if (exists.existe) {
        onLogin();
      } else {
        onRegister();
      }
    } catch (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      console.error("Error completo:", error);
    }
  };

  return (
    <>
      <img src={UwayLogo} alt="Logo" className="logo" />
      <h1 className="title">Empecemos</h1>
      <div className="subcontainer">
        <div className="country-code-container">
          <img
            src={ColombiaFlag}
            alt="Bandera Colombia"
            className="country-flag"
          />
          <span className="country-code">+57</span>
        </div>
        <div className="input-section">
          <input
            className="phone-input"
            placeholder="Ingresa tu celular"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <button className="continue-button-home" onClick={handlePhoneChange}>
        Continuar
      </button>

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

export { PhoneInput, usePhoneInput };
