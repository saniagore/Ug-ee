import ColombiaFlag from '../../resources/ColombiaFlag.png';
import UwayLogo from '../../resources/UwayLogo.png';
import '../../css/homePage.css';
import { useState } from 'react';

function usePhoneInput(){
    const [phone, setPhone] = useState('');

    const phoneNumber = (number) => {
        if (number.length < 10) return false;
        if (!/^[0-9]+$/.test(number)) return false;
        return true;
    };

    return { phone, setPhone, phoneNumber };
}

function PhoneInput({ onRegister }) {
    const {phone, setPhone, phoneNumber} = usePhoneInput();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handlePhoneChange = async (event) => { 
        event.preventDefault();
        if (!phoneNumber(phone)) {
            setAlertMessage('El número de celular no es válido. Debe tener al menos 10 dígitos y contener solo números.');
            setShowAlert(true);
            return;
        }

        try {
            // agregar validacion en la base de datos
            onRegister();
        } catch (error) {
            console.error("Error al verificar el número:", error);
            setAlertMessage('Ocurrió un error al verificar el número. Por favor intenta nuevamente.');
            setShowAlert(true);
        }
    };


    return (
        <>
            <img src={UwayLogo} alt="Logo" className="logo" />
            <h1 className="title">Empecemos</h1>
            <div className="subcontainer">
                <div className="country-code-container">
                    <img src={ColombiaFlag} alt="Bandera Colombia" className="country-flag" />
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
            <button className="continue-button" onClick={handlePhoneChange}>Continuar</button>

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

export { PhoneInput , usePhoneInput};