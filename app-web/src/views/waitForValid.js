import '../css/WaitForValid.css';
import React from "react";
import UwayLogo from '../resources/UwayLogo.png';
import { useNavigation } from '../components/navigations';

export default function WaitForValid() {
  const { goToHomePage } = useNavigation();

  const handleLogout = async () => {
    try {
        await fetch('http://localhost:5000/api/usuario/logout', {
            method: 'POST',
            credentials: 'include'
        });
        goToHomePage();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

  return (
    <div className='wait-for-valid-container' style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8f8f8'
      }}>
        <div>
            <img src={UwayLogo} alt="Logo" className="logo"/>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Esperando validación</h1>
            <div className="spinner"></div>
            <p>Tu cuenta está siendo verificada. Por favor, espera.</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    </div>
  );
}