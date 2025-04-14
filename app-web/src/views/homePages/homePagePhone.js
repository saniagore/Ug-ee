import ColombiaFlag from '../../resources/ColombiaFlag.png';
import UwayLogo from '../../resources/UwayLogo.png';
import '../../css/homePagePhone.css';
import { useState } from 'react';
import { checkUserInDatabase } from '../../components/phoneValid';

function usePhoneInput(){
    const [phone, setPhone] = useState('');

    const phoneNumber = (number) => {
        if (number.length !== 10) return false;
        if (!/^[0-9]+$/.test(number)) return false;
        return true;
    };

    return { phone, setPhone, phoneNumber };
}

function PhoneInput({ onRegister, onLogin }) {
    const {phone, setPhone, phoneNumber} = usePhoneInput();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handlePhoneChange = async (event) => { 
        event.preventDefault();
        
        if (!phoneNumber(phone)) {
          setAlertMessage('Número inválido. Debe tener 10 dígitos numéricos.');
          setShowAlert(true);
          return;
        }
      
        try {
          const { exists, user } = await checkUserInDatabase(phone);
          console.log('Respuesta del backend:', { exists, user });
          if (!exists) {
            onRegister();
          } else {
            onLogin();
          }
          
        } catch (error) {
          setAlertMessage(error.message);
          setShowAlert(true);
          console.error('Error completo:', error);
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